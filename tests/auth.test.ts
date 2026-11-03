import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, newSessionToken, tokenHash, validSessionToken, verifyPassword } from "../src/lib/auth/crypto";
import { AuthHttpError, readAuthBody, sameOriginRequest } from "../src/lib/auth/http";
import { normalizeEmail, validateAuthInput } from "../src/lib/auth/validation";

const signup = { name: "  Amira   Khan  ", email: "  AMIRA@EXAMPLE.COM ", password: "A memorable new phrase!", confirmPassword: "A memorable new phrase!", terms: true };

test("signup validates consent, password length and confirmation without trimming passwords", () => {
  const input = validateAuthInput(signup, "signup");
  assert.equal(input.valid, true);
  assert.equal(input.name, "Amira Khan");
  assert.equal(input.email, "amira@example.com");
  assert.ok(validateAuthInput({ ...signup, terms: false }, "signup").errors.terms);
  assert.ok(validateAuthInput({ ...signup, password: "short", confirmPassword: "short" }, "signup").errors.password);
  assert.ok(validateAuthInput({ ...signup, confirmPassword: "different" }, "signup").errors.confirmPassword);
  assert.ok(validateAuthInput({ ...signup, password: "x".repeat(129) }, "signup").errors.password);
  const spaces = " a phrase with spaces ";
  assert.equal(validateAuthInput({ ...signup, password: spaces, confirmPassword: spaces }, "signup").password, spaces);
  assert.equal(validateAuthInput({ ...signup, remember: "true" }, "signup").remember, false);
});

test("email normalization handles case and rejects malformed or injected addresses", () => {
  assert.equal(normalizeEmail(" A.User+shop@Example.COM "), "a.user+shop@example.com");
  for (const email of ["bad", "a..b@example.com", "a@", "x@bad_domain.com", "a@example.com\r\nBcc:x@example.com", "a@example.com' OR 1=1"]) assert.equal(normalizeEmail(email), "");
});

test("password hashes are salted, verify correctly and reject unsupported cost parameters", async () => {
  const password = "a long memorable passphrase";
  const [first, second] = await Promise.all([hashPassword(password), hashPassword(password)]);
  assert.notEqual(first, second);
  assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("a different memorable passphrase", first), false);
  assert.equal(await verifyPassword(password, first.replace("65536", "1073741824")), false);
  assert.equal(await verifyPassword(password, "plain text"), false);
});

test("session tokens are opaque, distinct and hashed separately for database storage", () => {
  const tokens = Array.from({ length: 100 }, newSessionToken);
  assert.equal(new Set(tokens).size, 100);
  for (const token of tokens) {
    assert.equal(validSessionToken(token), true);
    assert.match(tokenHash(token), /^[a-f0-9]{64}$/);
    assert.notEqual(tokenHash(token), token);
  }
  assert.equal(validSessionToken("forged"), false);
  assert.equal(validSessionToken("x".repeat(10000)), false);
});

function request(origin?: string, body = "{}", contentType = "application/json") {
  return new Request("http://127.0.0.1:3100/api/auth/signup", { method: "POST", headers: { ...(origin ? { origin } : {}), "Content-Type": contentType }, body });
}

test("auth writes require a valid same-origin request and a small JSON body", async () => {
  assert.equal(sameOriginRequest(request("http://127.0.0.1:3100")), true);
  assert.equal(sameOriginRequest(request("https://attacker.example")), false);
  assert.equal(sameOriginRequest(request()), false);
  assert.equal(sameOriginRequest(new Request("http://localhost:3100/api/auth/login", { method: "POST", headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" } })), true);
  await assert.rejects(readAuthBody(request("https://attacker.example")), (error: AuthHttpError) => error.status === 403);
  await assert.rejects(readAuthBody(request("http://127.0.0.1:3100", "x=y", "application/x-www-form-urlencoded")), (error: AuthHttpError) => error.status === 415);
  await assert.rejects(readAuthBody(request("http://127.0.0.1:3100", JSON.stringify({ value: "x".repeat(9000) }))), (error: AuthHttpError) => error.status === 413);
  await assert.rejects(readAuthBody(request("http://127.0.0.1:3100", "[]")), (error: AuthHttpError) => error.status === 400);
  assert.deepEqual(await readAuthBody(request("http://127.0.0.1:3100", '{"email":"test@example.com"}')), { email: "test@example.com" });
});
