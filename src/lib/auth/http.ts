import { NextResponse } from "next/server";
import { siteConfig } from "../site";

export class AuthHttpError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

export function authJson(body: object, status = 200, extraHeaders?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie, Origin", ...extraHeaders } });
}

export function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") return false;
  try {
    const parsed = new URL(origin);
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
    const protocol = forwardedProtocol === "https" || forwardedProtocol === "http" ? `${forwardedProtocol}:` : url.protocol;
    // Next's internal request URL can use localhost even when the browser uses the real Host.
    const hostOrigin = host ? new URL(`${protocol}//${host}`).origin : url.origin;
    return parsed.origin === origin && [url.origin, hostOrigin, new URL(siteConfig.url).origin].includes(origin);
  } catch { return false; }
}

export async function readAuthBody(request: Request): Promise<Record<string, unknown>> {
  if (!sameOriginRequest(request)) throw new AuthHttpError(403, "Please refresh this page and try again.");
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new AuthHttpError(415, "Use the account form to continue.");
  const reader = request.body?.getReader();
  if (!reader) throw new AuthHttpError(400, "Please complete the form and try again.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) { await reader.cancel(); throw new AuthHttpError(413, "The form is too large. Please shorten your details."); }
    chunks.push(value);
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed as Record<string, unknown>;
  } catch { throw new AuthHttpError(400, "Please complete the form and try again."); }
}

export function authFailure(error: unknown) {
  if (error instanceof AuthHttpError) return authJson({ message: error.message }, error.status);
  // Do not log request bodies, passwords, session tokens or SQL.
  console.error("Account request failed. Check database access and the authentication migration.");
  return authJson({ message: "We could not complete that request. Please try again shortly." }, 503);
}
