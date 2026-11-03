import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { NextResponse } from "next/server";
import { executeWrite, queryRows } from "../db";
import { newSessionToken, tokenHash, validSessionToken } from "./crypto";

export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-nimah-session" : "nimah-session";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
export const REMEMBER_SECONDS = 30 * 24 * 60 * 60;
export type Customer = { id: string; name: string; email: string; phone: string | null; joinedAt: string; cartReminders: boolean };

export function prepareSession(remember = false) {
  const token = newSessionToken();
  const seconds = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  return { token, hash: tokenHash(token), seconds, remember };
}

export function setSessionCookie(response: NextResponse, session: ReturnType<typeof prepareSession>) {
  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
    ...(session.remember ? { maxAge: session.seconds } : {}),
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

// React cache deduplicates only within the current request. Never use a shared `use cache` for identity.
export const getCustomer = cache(async (): Promise<Customer | null> => {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !validSessionToken(token)) return null;
  const [row] = await queryRows(`SELECT CAST(a.id AS CHAR) AS id, a.display_name, a.email, a.phone, a.created_at, a.cart_reminders_enabled
    FROM account_sessions s JOIN accounts a ON a.id = s.account_id
    WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() AND a.status = 'active' AND a.email_verified_at IS NOT NULL LIMIT 1`, [tokenHash(token)]);
  return row ? { id: String(row.id), name: String(row.display_name), email: String(row.email), phone: row.phone == null ? null : String(row.phone), joinedAt: String(row.created_at).replace(" ", "T") + "Z", cartReminders: !!row.cart_reminders_enabled } : null;
});

export async function requireCustomer() {
  const customer = await getCustomer();
  if (!customer) redirect("/account/login");
  return customer;
}

export async function revokeCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token && validSessionToken(token)) await executeWrite("DELETE FROM account_sessions WHERE token_hash = ?", [tokenHash(token)]);
}
