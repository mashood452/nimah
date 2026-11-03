import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseError, executeWrite, queryRows, transaction } from "../db";
import { hashPassword, verifyMissingPassword, verifyPassword } from "./crypto";
import { authFailure, authJson, readAuthBody } from "./http";
import { clearLoginLimit, consumeLimit, requestAddress } from "./rate-limit";
import { clearSessionCookie, prepareSession, revokeCurrentSession, setSessionCookie } from "./session";
import { TERMS_VERSION, validateAuthInput } from "./validation";
import { verifyCaptcha } from "./captcha";
import { clearEmailProof, emailProof, hasEmailProof } from "./email-verification";

function limited(retryAfter: number) {
  return authJson({ message: "Too many attempts. Please wait a few minutes before trying again." }, 429, { "Retry-After": String(retryAfter) });
}

export async function signup(request: Request) {
  try {
    const body = await readAuthBody(request);
    const input = validateAuthInput(body, "signup");
    if (!input.valid) return authJson({ message: "Please check the highlighted fields.", errors: input.errors }, 422);
    const proof = await emailProof();
    if (!proof || !await hasEmailProof(input.email, proof)) return authJson({ message: "Verify your email address before creating an account.", requiresVerification: true }, 403);
    await verifyCaptcha(body.captchaToken, "signup");
    const retries = await Promise.all([
      consumeLimit(`signup-address:${requestAddress(request)}`, 10, 3600),
      consumeLimit(`signup-email:${input.email}`, 5, 3600),
    ]);
    if (Math.max(...retries)) return limited(Math.max(...retries));
    const passwordHash = await hashPassword(input.password);
    const session = prepareSession(input.remember);
    try {
      const created = await transaction(async (connection) => {
        const [verified] = await connection.execute<RowDataPacket[]>("SELECT email FROM email_verifications WHERE email = ? AND verification_hash = ? AND verified_at IS NOT NULL AND expires_at > UTC_TIMESTAMP() FOR UPDATE", [input.email, proof]);
        if (!verified.length) return false;
        const [account] = await connection.execute<ResultSetHeader>(`INSERT INTO accounts
          (email, password_hash, display_name, role, status, email_verified_at, terms_accepted_at, terms_version, last_login_at, cart_reminders_enabled)
          VALUES (?, ?, ?, 'customer', 'active', UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, UTC_TIMESTAMP(), ?)`, [input.email, passwordHash, input.name, TERMS_VERSION, body.cartReminders === true ? 1 : 0]);
        await connection.execute(`INSERT INTO account_sessions (token_hash, account_id, expires_at)
          VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))`, [session.hash, account.insertId, session.seconds]);
        await connection.execute("DELETE FROM email_verifications WHERE email = ? AND verification_hash = ?", [input.email, proof]);
        return true;
      });
      if (!created) return authJson({ message: "Your email check expired. Please verify your email again.", requiresVerification: true }, 403);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "ER_DUP_ENTRY") {
        return authJson({ message: "We could not create an account with these details. If you already have an account, please log in." }, 409);
      }
      throw error;
    }
    const response = authJson({ redirect: "/account", message: "Your account is ready." }, 201);
    setSessionCookie(response, session);
    clearEmailProof(response);
    return response;
  } catch (error) { return authFailure(error); }
}

export async function login(request: Request) {
  try {
    const body = await readAuthBody(request);
    const input = validateAuthInput(body, "login");
    if (!input.valid) return authJson({ message: "Please check the highlighted fields.", errors: input.errors }, 422);
    await verifyCaptcha(body.captchaToken, "login");
    const retries = await Promise.all([
      consumeLimit(`login-email:${input.email}`, 5, 900),
      consumeLimit(`login-address:${requestAddress(request)}`, 30, 900),
    ]);
    if (Math.max(...retries)) return limited(Math.max(...retries));
    const [account] = await queryRows("SELECT CAST(id AS CHAR) AS id, password_hash, status, email_verified_at FROM accounts WHERE email = ? LIMIT 1", [input.email]);
    let correct = false;
    if (account?.password_hash) correct = await verifyPassword(input.password, String(account.password_hash));
    else await verifyMissingPassword(input.password);
    if (!correct || account?.status !== "active") return authJson({ message: "The email or password is incorrect. Please try again." }, 401);
    if (!account.email_verified_at) return authJson({ message: "Please verify your email before logging in.", requiresVerification: true }, 403);
    const session = prepareSession(input.remember);
    const signedIn = await transaction(async (connection) => {
      const [updated] = await connection.execute<ResultSetHeader>("UPDATE accounts SET last_login_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'active'", [account.id]);
      if (!updated.affectedRows) return false;
      await connection.execute(`INSERT INTO account_sessions (token_hash, account_id, expires_at)
        VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))`, [session.hash, account.id, session.seconds]);
      return true;
    });
    if (!signedIn) return authJson({ message: "The email or password is incorrect. Please try again." }, 401);
    await clearLoginLimit(input.email);
    await executeWrite("DELETE FROM account_sessions WHERE expires_at < UTC_TIMESTAMP() LIMIT 1000");
    const response = authJson({ redirect: "/account" });
    setSessionCookie(response, session);
    return response;
  } catch (error) { return authFailure(error); }
}

export async function logout(request: Request) {
  try {
    await readAuthBody(request);
    await revokeCurrentSession();
    const response = authJson({ redirect: "/account/login?signedOut=1" });
    clearSessionCookie(response);
    return response;
  } catch (error) { return authFailure(error); }
}
