import nodemailer from "nodemailer";
import { readdirSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

if (process.env.NIMAH_LOCAL_EMAIL_TEST !== "1" || !process.env.NIMAH_EMAIL_CAPTURE) throw new Error("Local email test environment required.");
const originalFetch = globalThis.fetch;
const used = new Set();
globalThis.fetch = async (input, init) => {
  if (String(input) !== "https://www.google.com/recaptcha/api/siteverify") return originalFetch(input, init);
  const token = new URLSearchParams(init.body).get("response");
  const match = /^qa-captcha-([a-z_]+)-[a-f0-9-]{36}$/.exec(token || "");
  const success = !!match && !used.has(token);
  used.add(token);
  return Response.json({ success, action: match?.[1], score: 0.9, hostname: "nimahopticals.com", challenge_ts: new Date().toISOString() });
};
const createTransport = () => ({
  async sendMail(message) {
    if (!/^[^@]+@example\.invalid$/.test(message.to)) throw new Error("Real recipients are blocked by the local test transport.");
    const { attachments, ...safe } = message;
    appendFileSync(process.env.NIMAH_EMAIL_CAPTURE, JSON.stringify({ ...safe, attachments: attachments?.map(({ cid, filename, content }) => ({ cid, filename, size: content.length })) }) + "\n");
    return { accepted: [message.to] };
  },
});
nodemailer.createTransport = createTransport;
for (const name of readdirSync(".next/node_modules").filter((name) => name.startsWith("nodemailer-"))) {
  const mailModule = await import(pathToFileURL(resolve(".next/node_modules", name, "dist/esm/nodemailer.js")).href);
  mailModule.default.createTransport = createTransport;
}
