import { authFailure, authJson, readAuthBody } from "@/lib/auth/http";
import { verifyCaptcha } from "@/lib/auth/captcha";
import { consumeLimit, requestAddress } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await readAuthBody(request);
    const retry = await consumeLimit(`public-form:${requestAddress(request)}`, 60, 900);
    if (retry) return authJson({ message: "Please wait a moment before trying again." }, 429);
    await verifyCaptcha(body.captchaToken);
    return authJson({ verified: true });
  } catch (error) { return authFailure(error); }
}
