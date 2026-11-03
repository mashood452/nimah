import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export function emailSecret(env: Record<string, string | undefined> = process.env) {
  const secret = env.EMAIL_SECURITY_SECRET;
  if (!secret || secret.length < 32) throw new Error("Configure EMAIL_SECURITY_SECRET with at least 32 random characters.");
  return secret;
}

export function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const createOtp = () => String(randomInt(1_000_000)).padStart(6, "0");
export const otpDigest = (email: string, challenge: string, code: string, secret = emailSecret()) =>
  createHmac("sha256", secret).update(`email-otp:${email}:${challenge}:${code}`).digest("hex");

export function unsubscribeToken(accountId: string, secret = emailSecret()) {
  return `${accountId}.${createHmac("sha256", secret).update(`cart-unsubscribe:${accountId}`).digest("base64url")}`;
}

export function unsubscribeAccount(token: unknown, secret = emailSecret()): string | null {
  if (typeof token !== "string" || !/^\d{1,20}\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const accountId = token.split(".")[0];
  return secureEqual(token, unsubscribeToken(accountId, secret)) ? accountId : null;
}
