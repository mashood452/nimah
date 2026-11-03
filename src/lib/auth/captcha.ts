import { AuthHttpError } from "./http";
import { siteConfig } from "../site";
import type { CaptchaAction } from "../captcha-actions";

export async function verifyCaptcha(token: unknown, expectedAction: CaptchaAction, fetcher: typeof fetch = fetch) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) throw new AuthHttpError(503, "The security check is being configured. Please try again shortly.");
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) throw new AuthHttpError(422, "Please complete the reCAPTCHA security check.");
  let result: { success?: boolean; hostname?: string; challenge_ts?: string; score?: number; action?: string };
  try {
    const response = await fetcher("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error();
    result = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error();
  } catch { throw new AuthHttpError(503, "The security check could not connect. Please try again."); }
  const siteHost = new URL(siteConfig.url).hostname;
  const allowed = new Set([siteHost, siteHost.startsWith("www.") ? siteHost.slice(4) : `www.${siteHost}`]);
  if (process.env.NODE_ENV === "development") { allowed.add("localhost"); allowed.add("127.0.0.1"); }
  const age = Date.now() - Date.parse(result.challenge_ts ?? "");
  if (result.success !== true || !allowed.has(result.hostname ?? "") || !Number.isFinite(age) || age < -30_000 || age > 120_000
    || result.action !== expectedAction || typeof result.score !== "number" || !Number.isFinite(result.score) || result.score < 0.5 || result.score > 1) {
    throw new AuthHttpError(422, "The security check expired or was not accepted. Please complete it again.");
  }
}
