import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { databaseJobLock, executeWrite, queryRows, transaction } from "../db";
import { absoluteMediaUrl } from "../media";
import { siteConfig } from "../site";
import { mediaKey } from "../db/mappers";
import { cartEmail } from "./templates";
import { emailSecret, unsubscribeToken } from "./security";
import { sendEmail, senderAddress, smtpOptions } from "./smtp";

export async function sendCartReminders() {
  if (process.env.CART_REMINDERS_ENABLED !== "true") return { sent: 0, skipped: 0, uncertain: 0, disabled: true };
  emailSecret(); senderAddress(); smtpOptions();
  const delay = Math.max(15, Math.min(1440, Number(process.env.CART_REMINDER_DELAY_MINUTES) || 60));
  const result = await databaseJobLock("nimah_cart_reminders", async () => {
    const stats = { sent: 0, skipped: 0, uncertain: 0 };
    const candidates = await queryRows(`SELECT CAST(c.account_id AS CHAR) AS account_id, c.revision
      FROM customer_carts c JOIN accounts a ON a.id = c.account_id
      WHERE a.status = 'active' AND a.email_verified_at IS NOT NULL AND a.cart_reminders_enabled = 1
        AND c.last_activity_at <= UTC_TIMESTAMP() - INTERVAL ? MINUTE AND c.updated_at >= UTC_TIMESTAMP() - INTERVAL 7 DAY
        AND (a.last_cart_reminder_at IS NULL OR a.last_cart_reminder_at <= UTC_TIMESTAMP() - INTERVAL 24 HOUR)
        AND EXISTS (SELECT 1 FROM customer_cart_items i WHERE i.account_id = c.account_id)
        AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.account_id = c.account_id AND o.placed_at >= c.updated_at AND o.status NOT IN ('cancelled', 'refunded'))
        AND NOT EXISTS (SELECT 1 FROM email_deliveries d WHERE d.event_key = CONCAT('cart:', c.account_id, ':', c.revision) AND d.status <> 'skipped')
      ORDER BY c.last_activity_at LIMIT 5`, [delay]);
    for (const candidate of candidates) {
      const eventKey = `cart:${candidate.account_id}:${candidate.revision}`;
      await executeWrite("DELETE FROM email_deliveries WHERE event_key = ? AND status = 'skipped'", [eventKey]);
      // This claim commits before SMTP. A worker crash or ambiguous SMTP result cannot cause an automatic duplicate.
      await executeWrite("INSERT INTO email_deliveries (account_id, event_key, status) VALUES (?, ?, 'sending')", [candidate.account_id, eventKey]);
      let smtpStarted = false;
      try {
        const sent = await transaction(async (connection) => {
          const [rows] = await connection.execute<RowDataPacket[]>(`SELECT a.email, a.display_name, a.status, a.email_verified_at, a.cart_reminders_enabled,
            a.last_cart_reminder_at, c.revision, c.updated_at,
            c.last_activity_at <= UTC_TIMESTAMP() - INTERVAL ? MINUTE AS inactive,
            (a.last_cart_reminder_at IS NULL OR a.last_cart_reminder_at <= UTC_TIMESTAMP() - INTERVAL 24 HOUR) AS cooldown
            FROM customer_carts c JOIN accounts a ON a.id = c.account_id WHERE c.account_id = ? FOR UPDATE`, [delay, candidate.account_id]);
          const account = rows[0];
          if (!account || account.status !== "active" || !account.email_verified_at || !account.cart_reminders_enabled || !account.inactive || !account.cooldown || String(account.revision) !== String(candidate.revision)) return false;
          const [orders] = await connection.execute<RowDataPacket[]>("SELECT id FROM orders WHERE account_id = ? AND placed_at >= ? AND status NOT IN ('cancelled', 'refunded') LIMIT 1", [candidate.account_id, account.updated_at]);
          if (orders.length) return false;
          const [items] = await connection.execute<RowDataPacket[]>(`SELECT p.slug, p.name, p.price, p.thumbnail_key, i.selected_color,
            IF(p.stock_quantity IS NULL, i.quantity, LEAST(i.quantity, p.stock_quantity)) AS quantity
            FROM customer_cart_items i JOIN products p ON p.id = i.product_id
            JOIN product_categories c ON c.id = p.category_id JOIN product_shapes s ON s.id = p.shape_id
            WHERE i.account_id = ? AND p.is_active = 1 AND c.is_active = 1 AND s.is_active = 1 AND (p.stock_quantity IS NULL OR p.stock_quantity > 0)
            ORDER BY p.sort_order, p.id`, [candidate.account_id]);
          if (!items.length) return false;
          const message = cartEmail(String(account.display_name).split(" ")[0], items.map((item) => ({ name: String(item.name), slug: String(item.slug), color: String(item.selected_color), qty: Number(item.quantity), price: Number(item.price), image: item.thumbnail_key ? absoluteMediaUrl(mediaKey(item.thumbnail_key, "products"), siteConfig.url) : undefined })), siteConfig.url, unsubscribeToken(String(candidate.account_id)));
          smtpStarted = true;
          await sendEmail({ to: String(account.email), ...message });
          await connection.execute("UPDATE email_deliveries SET status = 'sent', sent_at = UTC_TIMESTAMP() WHERE event_key = ?", [eventKey]);
          await connection.execute("UPDATE accounts SET last_cart_reminder_at = UTC_TIMESTAMP() WHERE id = ?", [candidate.account_id]);
          return true;
        });
        if (sent) stats.sent++;
        else { await executeWrite("UPDATE email_deliveries SET status = 'skipped' WHERE event_key = ?", [eventKey]); stats.skipped++; }
      } catch {
        await executeWrite("UPDATE email_deliveries SET status = ? WHERE event_key = ?", [smtpStarted ? "uncertain" : "skipped", eventKey]);
        if (smtpStarted) stats.uncertain++; else stats.skipped++;
      }
    }
    return stats;
  });
  return result ?? { sent: 0, skipped: 0, uncertain: 0, busy: true };
}
