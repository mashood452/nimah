import { authJson } from "@/lib/auth/http";
import { secureEqual } from "@/lib/email/security";
import { sendCartReminders } from "@/lib/email/cart-reminders";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return authJson({ message: "Job authentication is not configured." }, 503);
  const authorization = request.headers.get("authorization") ?? "";
  if (authorization.length > 256 || !secureEqual(authorization, `Bearer ${secret}`)) return authJson({ message: "Unauthorized." }, 401);
  try { return authJson(await sendCartReminders()); }
  catch { return authJson({ message: "Cart reminder job could not complete." }, 503); }
}
