/** Starts no server. Run against a local `next start --port 3100` using the same .env.local. */
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { readFileSync } from "node:fs";
import type { RowDataPacket } from "mysql2/promise";
import { createDatabasePool } from "../src/lib/db/connection";
import { tokenHash, verifyPassword } from "../src/lib/auth/crypto";

loadEnvConfig(process.cwd());
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3100");
if (!["127.0.0.1", "localhost"].includes(base.hostname)) throw new Error("Authentication smoke tests must target a local server.");
const identifier = randomUUID().slice(0, 12);
const email = `nimah-auth-qa-${identifier}@example.invalid`;
const peerEmail = `nimah-auth-peer-${identifier}@example.invalid`;
const password = `QA ${randomBytes(24).toString("base64url")} passphrase`;
const address = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
const db = createDatabasePool();
const createdEmails: string[] = [];
const orderNumbers: string[] = [];
const capture = process.env.NIMAH_EMAIL_CAPTURE;
if (!capture) throw new Error("Use the local email sandbox and set NIMAH_EMAIL_CAPTURE.");
function capturedMail(recipient: string) {
  return readFileSync(capture!, "utf8").trim().split("\n").map((line) => JSON.parse(line)).filter((mail) => mail.to === recipient);
}

function report(message: string) { console.log(`OK ${message}`); }
const cookieValue = (response: Response) => response.headers.get("set-cookie")?.split(";")[0] ?? "";

async function post(path: string, body: object, cookie = "", origin = base.origin) {
  return fetch(new URL(path, base), { method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/json", Origin: origin, "X-Real-IP": address, ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify({ captchaToken: `qa-captcha-${randomUUID()}`, ...body }) });
}

async function verifyAddress(owner: string) {
  const requested = await post("/api/auth/otp/request", { email: owner });
  assert.equal(requested.status, 200);
  const { challengeId } = await requested.json();
  const mail = capturedMail(owner).at(-1);
  assert.ok(mail.from.includes("no-reply@nimahopticals.com"));
  assert.ok(mail.attachments.some((attachment: { cid: string; size: number }) => attachment.cid === "nimah-logo" && attachment.size > 0));
  const code = mail.text.match(/code is (\d{6})/)[1];
  const wrong = code === "000000" ? "000001" : "000000";
  assert.equal((await post("/api/auth/otp/verify", { challengeId, code: wrong })).status, 422);
  const verified = await post("/api/auth/otp/verify", { challengeId, code });
  assert.equal(verified.status, 200);
  assert.equal((await post("/api/auth/otp/verify", { challengeId, code })).status, 422);
  return cookieValue(verified);
}

async function page(path: string, cookie = "") {
  return fetch(new URL(path, base), { redirect: "manual", headers: cookie ? { Cookie: cookie } : {} });
}

async function run() {
  let response = await page("/account");
  assert.equal(response.status, 307);
  assert.ok(response.headers.get("location")?.endsWith("/account/login"));
  for (const path of ["/account/login", "/account/signup"]) {
    response = await page(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('name="email"'));
    if (path.endsWith("login")) assert.ok(html.includes('name="password"'));
    else assert.ok(!html.includes('name="password"'));
    assert.ok(html.includes('name="robots" content="noindex'));
  }
  report("anonymous account protection and login/signup pages");

  const payload = { name: "Nimah QA Customer", email, password, confirmPassword: password, terms: true, role: "admin" };
  assert.equal((await post("/api/auth/signup", { ...payload, terms: false })).status, 422);
  assert.equal((await post("/api/auth/signup", payload, "", "https://attacker.example")).status, 403);
  report("server validation and cross-site signup rejection");

  assert.equal((await post("/api/auth/login", { email, password, captchaToken: null })).status, 422);
  assert.equal((await post("/api/auth/signup", payload)).status, 403);
  const proof = await verifyAddress(email);
  response = await post("/api/auth/signup", { ...payload, cartReminders: true }, proof);
  assert.equal(response.status, 201);
  createdEmails.push(email);
  let cookie = cookieValue(response);
  assert.ok(cookie.startsWith("__Host-nimah-session="));
  const cookieHeader = response.headers.get("set-cookie") ?? "";
  for (const flag of ["HttpOnly", "Secure", "SameSite=lax", "Path=/"]) assert.ok(cookieHeader.includes(flag));
  assert.ok(!cookieHeader.split(", __Host-nimah-email-proof")[0].includes("Max-Age="));
  assert.ok(response.headers.get("cache-control")?.includes("no-store"));
  const [accounts] = await db.execute<RowDataPacket[]>("SELECT id, password_hash, role, terms_accepted_at, email_verified_at FROM accounts WHERE email = ?", [email]);
  const accountId = accounts[0].id;
  assert.equal(accounts[0].role, "customer");
  assert.ok(accounts[0].terms_accepted_at);
  assert.ok(accounts[0].email_verified_at);
  assert.equal((await post("/api/auth/signup", payload, proof)).status, 403);
  assert.equal(await verifyPassword(password, accounts[0].password_hash), true);
  assert.notEqual(accounts[0].password_hash, password);
  const rawToken = cookie.split("=")[1];
  const [sessions] = await db.execute<RowDataPacket[]>("SELECT token_hash FROM account_sessions WHERE account_id = ?", [accountId]);
  assert.equal(sessions[0].token_hash, tokenHash(rawToken));
  report("signup, automatic login, secure cookies, password hashing and customer-only role");

  response = await page("/account", cookie);
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("cache-control")?.includes("no-store"));
  assert.ok((await response.text()).includes(email));
  response = await page("/account/login", cookie);
  assert.equal(response.status, 307);
  assert.ok(response.headers.get("location")?.endsWith("/account"));
  assert.equal((await post("/api/auth/signup", payload, await verifyAddress(email))).status, 409);
  report("authenticated account access and duplicate signup handling");

  const [products] = await db.execute<RowDataPacket[]>("SELECT id, slug, name, price, thumbnail_key, swatches FROM products WHERE is_active = 1 ORDER BY id LIMIT 1");
  const product = products[0];
  const { colorName } = await import("../src/lib/product-info");
  const swatches = typeof product.swatches === "string" ? JSON.parse(product.swatches) : product.swatches;
  const cart = { accountId: String(accountId), revision: 0, lines: [{ slug: product.slug, color: colorName(swatches[0]), qty: 2, price: 0 }] };
  assert.equal((await post("/api/account/cart", { ...cart, accountId: "0" }, cookie)).status, 401);
  response = await post("/api/account/cart", cart, cookie);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).revision, 1);
  assert.equal((await post("/api/account/cart", cart, cookie)).status, 409);
  assert.equal((await post("/api/forms/verify", { captchaToken: null })).status, 422);
  const captcha = `qa-captcha-${randomUUID()}`;
  assert.equal((await post("/api/forms/verify", { captchaToken: captcha })).status, 200);
  assert.equal((await post("/api/forms/verify", { captchaToken: captcha })).status, 422);
  const runReminders = async (secret = process.env.CRON_SECRET) => {
    const result = await fetch(new URL("/api/internal/cart-reminders", base), { method: "POST", headers: { Authorization: `Bearer ${secret}` } });
    return { status: result.status, data: await result.json() };
  };
  assert.equal((await runReminders("invalid")).status, 401);
  assert.equal((await runReminders()).data.sent, 0);
  await db.execute("UPDATE customer_carts SET last_activity_at = UTC_TIMESTAMP() - INTERVAL 61 MINUTE WHERE account_id = ?", [accountId]);
  assert.equal((await post("/api/account/email-preferences", { enabled: false }, cookie)).status, 200);
  assert.equal((await runReminders()).data.sent, 0);
  await post("/api/account/email-preferences", { enabled: true }, cookie);
  const delivery = await runReminders();
  assert.equal(delivery.status, 200);
  assert.equal(delivery.data.sent, 1);
  const reminder = capturedMail(email).at(-1);
  assert.ok(reminder.subject.includes("bag"));
  assert.ok(reminder.text.includes(product.name));
  assert.ok(reminder.text.replaceAll(",", "").includes((Number(product.price) * 2).toFixed(2)));
  assert.ok(reminder.html.includes("media.nimahopticals.com/products/"));
  assert.equal((await runReminders()).data.sent, 0);
  const unsubscribe = reminder.headers["List-Unsubscribe"].slice(1, -1);
  const unsubscribeUrl = new URL(unsubscribe); unsubscribeUrl.host = base.host; unsubscribeUrl.protocol = base.protocol;
  assert.equal((await fetch(unsubscribeUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click" })).status, 200);
  const [preferences] = await db.execute<RowDataPacket[]>("SELECT cart_reminders_enabled FROM accounts WHERE id = ?", [accountId]);
  assert.equal(preferences[0].cart_reminders_enabled, 0);
  report("CAPTCHA enforcement/replay, scoped cart persistence, current-price reminders, deduplication and unsubscribe");

  response = await post("/api/auth/signup", { ...payload, name: "Nimah QA Peer", email: peerEmail }, await verifyAddress(peerEmail));
  assert.equal(response.status, 201);
  createdEmails.push(peerEmail);
  const [peers] = await db.execute<RowDataPacket[]>("SELECT id FROM accounts WHERE email = ?", [peerEmail]);
  for (const [id, ownerEmail, suffix] of [[accountId, email, "own"], [peers[0].id, peerEmail, "peer"]] as const) {
    const number = `QA-${identifier}-${suffix}`;
    await db.execute(`INSERT INTO orders (order_number, account_id, customer_email, customer_name, subtotal, grand_total, shipping_address)
      VALUES (?, ?, ?, 'Temporary QA order', 10, 10, '{}')`, [number, id, ownerEmail]);
    orderNumbers.push(number);
  }
  response = await page("/account", cookie);
  const dashboard = await response.text();
  assert.ok(dashboard.includes(`QA-${identifier}-own`));
  assert.ok(!dashboard.includes(`QA-${identifier}-peer`));
  assert.ok(!dashboard.includes(peerEmail));
  report("order history is isolated to the authenticated account");

  const incorrect = await post("/api/auth/login", { email, password: "an incorrect long passphrase" });
  const unknown = await post("/api/auth/login", { email: `unknown-${identifier}@example.invalid`, password });
  assert.equal(incorrect.status, 401);
  assert.equal(unknown.status, 401);
  assert.equal((await incorrect.json()).message, (await unknown.json()).message);
  report("uniform incorrect/unknown credential responses");

  await db.execute("UPDATE account_sessions SET expires_at = UTC_TIMESTAMP() - INTERVAL 1 SECOND WHERE account_id = ?", [accountId]);
  assert.equal((await page("/account", cookie)).status, 307);
  response = await post("/api/auth/login", { email: email.toUpperCase(), password, remember: true });
  assert.equal(response.status, 200);
  cookie = cookieValue(response);
  assert.ok(response.headers.get("set-cookie")?.includes("Max-Age=2592000"));
  report("expired sessions are rejected and persistent login is available");

  assert.equal((await post("/api/auth/logout", {}, cookie, "https://attacker.example")).status, 403);
  assert.equal((await page("/account", cookie)).status, 200);
  response = await post("/api/auth/logout", {}, cookie);
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("set-cookie")?.includes("Max-Age=0"));
  assert.equal((await page("/account", cookie)).status, 307);
  report("logout revokes the session and replaying the old cookie cannot regain access");

  for (let attempt = 0; attempt < 6; attempt++) response = await post("/api/auth/login", { email, password: "another incorrect passphrase" });
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
  report("database-backed login throttling");
}

void run().catch((error: unknown) => {
  console.error("Authentication integration check failed. No passwords or tokens are printed.");
  if (error instanceof Error) console.error(error.stack?.split("\n").find((line) => line.trim().startsWith("at ") && line.includes("auth-integration.ts")) ?? error.name);
  process.exitCode = 1;
}).finally(async () => {
  try {
    for (const number of new Set([...orderNumbers, `QA-${identifier}-own`, `QA-${identifier}-peer`])) await db.execute("DELETE FROM orders WHERE order_number = ? AND customer_name = 'Temporary QA order'", [number]);
    const [qaAccounts] = await db.execute<RowDataPacket[]>("SELECT id FROM accounts WHERE email IN (?, ?)", [email, peerEmail]);
    for (const owner of new Set([...createdEmails, email, peerEmail])) {
      await db.execute("DELETE FROM email_verifications WHERE email = ?", [owner]);
      await db.execute("DELETE FROM accounts WHERE email = ? AND display_name IN ('Nimah QA Customer', 'Nimah QA Peer')", [owner]);
    }
    const buckets = [`signup-address:${address}`, `login-address:${address}`, `signup-email:${email}`, `signup-email:${peerEmail}`, `login-email:${email}`, `login-email:unknown-${identifier}@example.invalid`, `otp-request-address:${address}`, `otp-check-address:${address}`, `otp-request-email:${email}`, `otp-request-email:${peerEmail}`, `public-form:${address}`, ...qaAccounts.map((row) => `cart-write:${row.id}`)];
    for (const key of buckets) await db.execute("DELETE FROM auth_rate_limits WHERE bucket_hash = ?", [tokenHash(key)]);
    console.log("Temporary QA accounts, orders and rate-limit records cleaned up.");
  } finally { await db.end(); }
});
