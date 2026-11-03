import { domainToASCII } from "node:url";

export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_LENGTH = 128;
export const TERMS_VERSION = "2026-11-03";
export type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>>;
export type AuthInput = { name?: unknown; email?: unknown; password?: unknown; confirmPassword?: unknown; terms?: unknown; remember?: unknown };

export function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return "";
  const local = email.slice(0, at);
  const domain = domainToASCII(email.slice(at + 1));
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return "";
  if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(domain)) return "";
  const normalized = `${local}@${domain}`;
  return normalized.length <= 254 ? normalized : "";
}

export function validateAuthInput(input: AuthInput, mode: "signup" | "login") {
  const errors: FieldErrors = {};
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const email = normalizeEmail(input.email);
  const password = typeof input.password === "string" ? input.password : "";
  const length = Array.from(password).length;
  if (!email) errors.email = "Enter a valid email address.";
  if (mode === "signup") {
    if (name.length < 2 || name.length > 160 || /[\u0000-\u001f\u007f]/.test(name)) errors.name = "Enter your name using 2 to 160 characters.";
    if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) errors.password = "Use 15 to 128 characters. A memorable phrase works well.";
    if (password !== input.confirmPassword) errors.confirmPassword = "Your passwords do not match.";
    if (input.terms !== true) errors.terms = "Please accept the terms and privacy policy to continue.";
  } else if (!password || length > MAX_PASSWORD_LENGTH) errors.password = "Enter your password.";
  return { name, email, password, remember: input.remember === true, errors, valid: Object.keys(errors).length === 0 };
}
