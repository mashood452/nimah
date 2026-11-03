import assert from "node:assert/strict";
import { test } from "node:test";
import { createOtp, emailSecret, otpDigest, secureEqual, unsubscribeAccount, unsubscribeToken } from "../src/lib/email/security";
import { smtpOptions, senderAddress } from "../src/lib/email/smtp";
import { cartEmail, otpEmail } from "../src/lib/email/templates";
import { parseCartLines, mergeSavedCarts } from "../src/lib/cart-data";
import { verifyCaptcha } from "../src/lib/auth/captcha";

test("OTP codes, keyed digests, and scoped unsubscribe signatures", () => {
  const secret = "test-only-secret-with-at-least-32-characters";
  for (let i = 0; i < 100; i++) assert.match(createOtp(), /^\d{6}$/);
  assert.throws(() => emailSecret({}));
  const digest = otpDigest("a@example.invalid", "challenge", "000001", secret);
  assert.match(digest, /^[a-f0-9]{64}$/);
  assert.notEqual(digest, otpDigest("b@example.invalid", "challenge", "000001", secret));
  assert.notEqual(digest, otpDigest("a@example.invalid", "other", "000001", secret));
  assert.equal(secureEqual(digest, digest), true);
  assert.equal(secureEqual(digest, "short"), false);
  const token = unsubscribeToken("123", secret);
  assert.equal(unsubscribeAccount(token, secret), "123");
  assert.equal(unsubscribeAccount(token.replace("123.", "124."), secret), null);
  assert.equal(unsubscribeAccount(token, secret + "changed"), null);
});

test("SMTP requires authenticated TLS and rejects unsafe senders", () => {
  const options = smtpOptions({ SMTP_URL: "smtp://user:pa%25ss@smtp.example.invalid:587" });
  assert.equal(options.requireTLS, true);
  assert.equal(options.auth.pass, "pa%ss");
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.disableFileAccess, true);
  assert.equal(options.disableUrlAccess, true);
  assert.throws(() => smtpOptions({ SMTP_URL: "http://user:pass@example.invalid" }));
  assert.throws(() => smtpOptions({ SMTP_URL: "smtp://user:pass@example.invalid:25" }));
  assert.throws(() => senderAddress({ EMAIL_FROM: "mail@example.invalid\r\nBcc: other@example.invalid" }));
  assert.equal(senderAddress({ EMAIL_FROM: "Nimah <no-reply@nimahopticals.com>" }), "Nimah <no-reply@nimahopticals.com>");
});

test("Emails use the real embedded logo, escaped copy and current totals", () => {
  assert.ok(otpEmail("000001").html.includes('src="cid:nimah-logo"'));
  assert.throws(() => otpEmail("123"));
  const message = cartEmail("<script>", [{ name: "<Frame>", slug: "frame", color: "Gold", qty: 2, price: 125.5, image: "https://media.nimahopticals.com/products/frame.webp" }], "https://nimahopticals.com", "signed-token");
  assert.ok(message.html.includes("&lt;script&gt;"));
  assert.ok(!message.html.includes("<Frame>"));
  assert.match(message.text, /251\.00/);
  assert.ok(message.headers["List-Unsubscribe-Post"].includes("One-Click"));
});

test("Cart input ignores prices, bounds quantities and merges without doubling", () => {
  assert.deepEqual(parseCartLines([{ slug: "aurelia", color: "Gold", qty: 2, price: 0 }]), [{ slug: "aurelia", color: "Gold", qty: 2 }]);
  assert.equal(parseCartLines([{ slug: "aurelia", color: "Gold", qty: 11 }]), null);
  assert.equal(parseCartLines([{ slug: "../escape", color: "Gold", qty: 1 }]), null);
  const line = { slug: "aurelia", color: "Gold", qty: 2 };
  assert.deepEqual(mergeSavedCarts([line], [line]), [line]);
});

test("CAPTCHA fails closed for missing, expired and foreign-host responses", async () => {
  const oldSecret = process.env.RECAPTCHA_SECRET_KEY, oldSite = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  process.env.RECAPTCHA_SECRET_KEY = "test-only"; process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "test-only";
  const fake = (result: object) => (async () => Response.json(result)) as typeof fetch;
  try {
    await assert.rejects(verifyCaptcha(undefined));
    await assert.rejects(verifyCaptcha("test-response-token", fake({ success: false })));
    await assert.rejects(verifyCaptcha("test-response-token", fake({ success: true, hostname: "attacker.example", challenge_ts: new Date().toISOString() })));
    await assert.rejects(verifyCaptcha("test-response-token", fake({ success: true, hostname: "nimahopticals.com", challenge_ts: new Date(Date.now() - 180000).toISOString() })));
    await verifyCaptcha("test-response-token", fake({ success: true, hostname: "nimahopticals.com", challenge_ts: new Date().toISOString() }));
  } finally {
    if (oldSecret === undefined) delete process.env.RECAPTCHA_SECRET_KEY; else process.env.RECAPTCHA_SECRET_KEY = oldSecret;
    if (oldSite === undefined) delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY; else process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = oldSite;
  }
});
