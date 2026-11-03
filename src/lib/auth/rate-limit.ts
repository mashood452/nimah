import "server-only";
import { isIP } from "node:net";
import { randomInt } from "node:crypto";
import { executeWrite, queryRows } from "../db";
import { tokenHash } from "./crypto";

export function requestAddress(request: Request) {
  // Use the final proxy hop, rather than trusting a client-prepended address.
  const realAddress = request.headers.get("x-real-ip")?.trim() ?? "";
  if (isIP(realAddress)) return realAddress;
  const candidates = (request.headers.get("x-forwarded-for") ?? "").split(",").map((value) => value.trim());
  const address = candidates[candidates.length - 1] || "";
  return isIP(address) ? address : "unknown";
}

export async function consumeLimit(key: string, maximum: number, seconds: number): Promise<number> {
  const bucket = tokenHash(key);
  await executeWrite(`INSERT INTO auth_rate_limits (bucket_hash, attempts, expires_at)
    VALUES (?, 1, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))
    ON DUPLICATE KEY UPDATE
      attempts = IF(expires_at <= UTC_TIMESTAMP(), 1, LEAST(attempts + 1, 65535)),
      expires_at = IF(expires_at <= UTC_TIMESTAMP(), VALUES(expires_at), expires_at)`, [bucket, seconds]);
  const [row] = await queryRows("SELECT attempts, GREATEST(1, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), expires_at)) AS retry_after FROM auth_rate_limits WHERE bucket_hash = ?", [bucket]);
  if (randomInt(100) === 0) await executeWrite("DELETE FROM auth_rate_limits WHERE expires_at < UTC_TIMESTAMP() - INTERVAL 1 DAY LIMIT 1000");
  return Number(row.attempts) > maximum ? Number(row.retry_after) : 0;
}

export const clearLoginLimit = (email: string) => executeWrite("DELETE FROM auth_rate_limits WHERE bucket_hash = ?", [tokenHash(`login-email:${email}`)]);
