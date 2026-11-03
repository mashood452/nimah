import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

try {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) throw new Error();
  const url = new URL("/api/internal/cart-reminders", process.env.NEXT_PUBLIC_SITE_URL || "https://nimahopticals.com");
  if (url.protocol !== "https:") throw new Error();
  const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${secret}` }, redirect: "error", signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error();
  const result = await response.json();
  console.log(`Cart reminders: sent=${Number(result.sent || 0)}, skipped=${Number(result.skipped || 0)}, uncertain=${Number(result.uncertain || 0)}`);
} catch { console.error("Cart reminder job failed. Check the app URL, cron secret and server logs."); process.exitCode = 1; }
