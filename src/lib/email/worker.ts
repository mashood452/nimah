import "server-only";
import { sendCartReminders } from "./cart-reminders";

const runtime = globalThis as typeof globalThis & { nimahReminderTimer?: ReturnType<typeof setInterval> };

// Start only after a real request, never while Next.js is collecting build data.
// MySQL's job lock and delivery claims coordinate multiple Node processes.
export function startCartReminderWorker() {
  if (process.env.CART_REMINDERS_ENABLED !== "true" || process.env.CART_REMINDER_WORKER === "false" || runtime.nimahReminderTimer) return;
  let running = false;
  runtime.nimahReminderTimer = setInterval(async () => {
    if (running) return;
    running = true;
    try { await sendCartReminders(); }
    catch { console.error("Cart reminder check failed. Check database and email configuration."); }
    finally { running = false; }
  }, 60_000);
  runtime.nimahReminderTimer.unref();
}
