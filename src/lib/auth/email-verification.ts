import "server-only";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { executeWrite, queryRows, transaction } from "../db";
import { createOtp, emailSecret, otpDigest, secureEqual } from "../email/security";
import { sendEmail, senderAddress, smtpOptions } from "../email/smtp";
import { otpEmail } from "../email/templates";
import { newSessionToken, tokenHash, validSessionToken } from "./crypto";
import { verifyCaptcha } from "./captcha";
import { authFailure, authJson, readAuthBody } from "./http";
import { consumeLimit, requestAddress } from "./rate-limit";
import { normalizeEmail } from "./validation";

const PROOF_COOKIE = process.env.NODE_ENV === "production" ? "__Host-nimah-email-proof" : "nimah-email-proof";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };
const limited = (seconds: number) => authJson({ message: "Please wait before requesting another code." }, 429, { "Retry-After": String(seconds) });

export async function emailProof() {
  const token = (await cookies()).get(PROOF_COOKIE)?.value;
  return token && validSessionToken(token) ? tokenHash(token) : null;
}

export function clearEmailProof(response: NextResponse) { response.cookies.set(PROOF_COOKIE, "", { ...cookieOptions, maxAge: 0 }); }

export async function requestEmailCode(request: Request) {
  try {
    const body = await readAuthBody(request);
    const email = normalizeEmail(body.email);
    if (!email) return authJson({ message: "Enter a valid email address.", errors: { email: "Enter a valid email address." } }, 422);
    // Validate configuration before issuing a challenge; missing services never bypass verification.
    emailSecret(); senderAddress(); smtpOptions();
    const addressLimit = await consumeLimit(`otp-request-address:${requestAddress(request)}`, 20, 3600);
    if (addressLimit) return limited(addressLimit);
    await verifyCaptcha(body.captchaToken);
    const emailLimit = await consumeLimit(`otp-request-email:${email}`, 5, 3600);
    if (emailLimit) return limited(emailLimit);
    const challengeId = newSessionToken();
    const code = createOtp();
    const cooldown = await transaction(async (connection) => {
      await connection.execute(`INSERT IGNORE INTO email_verifications
        (email, challenge_id, code_digest, sent_at, expires_at) VALUES (?, ?, ?, UTC_TIMESTAMP() - INTERVAL 1 HOUR, UTC_TIMESTAMP())`, [email, challengeId, otpDigest(email, challengeId, code)]);
      const [rows] = await connection.execute<RowDataPacket[]>("SELECT GREATEST(0, 60 - TIMESTAMPDIFF(SECOND, sent_at, UTC_TIMESTAMP())) AS cooldown FROM email_verifications WHERE email = ? FOR UPDATE", [email]);
      if (Number(rows[0].cooldown) > 0) return Number(rows[0].cooldown);
      await connection.execute(`UPDATE email_verifications SET challenge_id = ?, code_digest = ?, verification_hash = NULL,
        attempts_remaining = 5, sent_at = UTC_TIMESTAMP(), expires_at = UTC_TIMESTAMP() + INTERVAL 10 MINUTE, verified_at = NULL WHERE email = ?`, [challengeId, otpDigest(email, challengeId, code), email]);
      return 0;
    });
    if (cooldown) return limited(cooldown);
    try { await sendEmail({ to: email, ...otpEmail(code) }); }
    catch {
      await executeWrite("DELETE FROM email_verifications WHERE email = ? AND challenge_id = ?", [email, challengeId]);
      return authJson({ message: "We could not send your code. Please try again shortly." }, 503);
    }
    await executeWrite("DELETE FROM email_verifications WHERE expires_at < UTC_TIMESTAMP() - INTERVAL 1 DAY LIMIT 1000");
    return authJson({ challengeId, email, expiresIn: 600, resendAfter: 60, message: "Check your inbox for your six-digit code." });
  } catch (error) { return authFailure(error); }
}

export async function verifyEmailCode(request: Request) {
  try {
    const body = await readAuthBody(request);
    if (typeof body.challengeId !== "string" || !validSessionToken(body.challengeId) || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) {
      return authJson({ message: "Enter the six-digit code from your email.", errors: { code: "Enter all six digits." } }, 422);
    }
    const retry = await consumeLimit(`otp-check-address:${requestAddress(request)}`, 30, 900);
    if (retry) return limited(retry);
    await verifyCaptcha(body.captchaToken);
    const proof = newSessionToken();
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute<RowDataPacket[]>(`SELECT *, expires_at <= UTC_TIMESTAMP() AS expired
        FROM email_verifications WHERE challenge_id = ? FOR UPDATE`, [String(body.challengeId)]);
      const row = rows[0];
      if (!row || row.expired || row.verified_at || Number(row.attempts_remaining) === 0) return false;
      if (!secureEqual(String(row.code_digest), otpDigest(String(row.email), String(body.challengeId), String(body.code)))) {
        await connection.execute("UPDATE email_verifications SET attempts_remaining = attempts_remaining - 1 WHERE email = ?", [row.email]);
        return false;
      }
      await connection.execute(`UPDATE email_verifications SET verification_hash = ?, verified_at = UTC_TIMESTAMP(),
        expires_at = UTC_TIMESTAMP() + INTERVAL 10 MINUTE, attempts_remaining = 0 WHERE email = ?`, [tokenHash(proof), row.email]);
      // Existing customers still need their password to log in; this only verifies mailbox ownership.
      await connection.execute("UPDATE accounts SET email_verified_at = COALESCE(email_verified_at, UTC_TIMESTAMP()) WHERE email = ?", [row.email]);
      return true;
    });
    if (!result) return authJson({ message: "That code is invalid, expired, or already used. Request a new code if needed.", errors: { code: "Check the latest code in your inbox." } }, 422);
    const response = authJson({ verified: true, message: "Your email is verified." });
    response.cookies.set(PROOF_COOKIE, proof, { ...cookieOptions, maxAge: 600 });
    return response;
  } catch (error) { return authFailure(error); }
}

export async function hasEmailProof(email: string, hash: string) {
  const [row] = await queryRows("SELECT email FROM email_verifications WHERE email = ? AND verification_hash = ? AND verified_at IS NOT NULL AND expires_at > UTC_TIMESTAMP()", [email, hash]);
  return !!row;
}
