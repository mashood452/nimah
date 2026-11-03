import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const PARAMETERS = { N: 65_536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 };
// Limit native memory use during concurrent password checks in a single worker.
let active = 0;
const waiting: (() => void)[] = [];

async function derive(password: string, salt: Buffer): Promise<Buffer> {
  if (waiting.length >= 32) throw new Error("Password service is busy.");
  if (active >= 2) await new Promise<void>((resolve) => waiting.push(resolve));
  else active++;
  try {
    return await new Promise<Buffer>((resolve, reject) => {
      scrypt(password, salt, 64, PARAMETERS, (error, key) => error ? reject(error) : resolve(key));
    });
  } finally {
    const next = waiting.shift();
    if (next) next();
    else active--;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt:65536:8:2:${salt.toString("base64url")}:${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const match = stored.match(/^scrypt:65536:8:2:([A-Za-z0-9_-]{22}):([A-Za-z0-9_-]{86})$/);
  if (!match) return false;
  const salt = Buffer.from(match[1], "base64url");
  const expected = Buffer.from(match[2], "base64url");
  const actual = await derive(password, salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// A real scrypt calculation also runs for unknown users, keeping credential errors uniform.
export async function verifyMissingPassword(password: string): Promise<void> {
  await derive(password, Buffer.alloc(16));
}

export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export const newSessionToken = () => randomBytes(32).toString("base64url");
export const validSessionToken = (token: string) => /^[A-Za-z0-9_-]{43}$/.test(token);
