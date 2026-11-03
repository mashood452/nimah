import nodemailer from "nodemailer";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeEmail } from "../auth/validation";

export function smtpOptions(env: Record<string, string | undefined> = process.env) {
  const url = env.SMTP_URL ? new URL(env.SMTP_URL) : null;
  if (url && !["smtp:", "smtps:"].includes(url.protocol)) throw new Error("SMTP_URL must use smtp:// or smtps://.");
  const host = url?.hostname ?? env.SMTP_HOST;
  const port = Number(url?.port || env.SMTP_PORT || 587);
  const user = url ? decodeURIComponent(url.username) : env.SMTP_USER;
  const pass = url ? decodeURIComponent(url.password) : env.SMTP_PASSWORD;
  if (!host || !user || !pass || ![465, 587, 2525].includes(port)) throw new Error("Configure the SMTP host, port, username and password.");
  const secure = url?.protocol === "smtps:" || port === 465;
  return { host, port, secure, requireTLS: !secure, auth: { user, pass }, tls: { rejectUnauthorized: true },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000, disableFileAccess: true, disableUrlAccess: true };
}

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
let logo: Promise<Buffer> | undefined;

export function senderAddress(env: Record<string, string | undefined> = process.env) {
  const from = env.EMAIL_FROM?.trim() ?? "";
  const address = from.match(/<([^>]+)>$/)?.[1] ?? from;
  if (/[\r\n]/.test(from) || !normalizeEmail(address)) throw new Error("EMAIL_FROM must be a verified sender email address.");
  return from;
}

export async function sendEmail(message: { to: string; subject: string; html: string; text: string; headers?: Record<string, string> }) {
  if (!normalizeEmail(message.to) || /[\r\n]/.test(message.subject)) throw new Error("Invalid email envelope.");
  const from = senderAddress();
  transporter ??= nodemailer.createTransport(smtpOptions());
  logo ??= readFile(path.join(process.cwd(), "public", "brand", "nimah-logo.png"));
  const result = await transporter.sendMail({ ...message, from, attachments: [{ filename: "nimah-logo.png", content: await logo, cid: "nimah-logo", contentType: "image/png" }] });
  if (!result.accepted?.length) throw new Error("SMTP did not accept the recipient.");
}
