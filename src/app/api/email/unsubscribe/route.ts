import { unsubscribeAccount } from "@/lib/email/security";
import { executeWrite } from "@/lib/db";
import { authJson, readAuthBody } from "@/lib/auth/http";
import { verifyCaptcha } from "@/lib/auth/captcha";

export async function POST(request: Request) {
  try {
    const accountId = unsubscribeAccount(new URL(request.url).searchParams.get("token"));
    if (!accountId) return authJson({ message: "This preference link is invalid." }, 400);
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await readAuthBody(request);
      await verifyCaptcha(body.captchaToken, "unsubscribe");
    } else {
      // RFC 8058 mail-provider one-click unsubscribe is authenticated by its signed, opt-out-only token.
      if (Number(request.headers.get("content-length") ?? 0) > 256) return authJson({ message: "Invalid request." }, 400);
      const body = await request.text();
      if (body.length > 256 || new URLSearchParams(body).get("List-Unsubscribe") !== "One-Click") return authJson({ message: "Use the email preference form." }, 400);
    }
    await executeWrite("UPDATE accounts SET cart_reminders_enabled = 0 WHERE id = ?", [accountId]);
    return authJson({ unsubscribed: true });
  } catch { return authJson({ message: "Please try again shortly." }, 503); }
}
