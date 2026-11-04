import "server-only";
import { randomInt } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseError, queryRows, transaction } from "./db";
import { canEmail } from "./account/handlers";
import { tokenHash } from "./auth/crypto";
import { authFailure, authJson, readAuthBody } from "./auth/http";
import { consumeLimit } from "./auth/rate-limit";
import { getCustomer } from "./auth/session";
import { parseCartLines } from "./cart-data";
import { sendEmail } from "./email/smtp";
import { newOrderNoticeEmail, orderConfirmationEmail, type OrderEmailData } from "./email/templates";
import { colorName } from "./product-info";
import { siteConfig } from "./site";

export const PAYMENT_METHODS = { cash_on_delivery: "Cash on delivery" } as const;
export type PaymentMethod = keyof typeof PAYMENT_METHODS;

const cents = (value: unknown) => Math.round(Number(value) * 100);
const money = (c: number) => (c / 100).toFixed(2);
const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** For example NIM-241104-7K3F: easy to read out over the phone, with the date built in. */
function newOrderNumber() {
  const d = new Date();
  const day = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const tail = Array.from({ length: 4 }, () => ORDER_ALPHABET[randomInt(ORDER_ALPHABET.length)]).join("");
  return `NIM-${day}-${tail}`;
}

type Placed = { ok: true; number: string; fresh: boolean; email?: OrderEmailData } | { ok: false; status: number; message: string };
const refuse = (message: string, status = 422): Placed => ({ ok: false, status, message });

export async function placeOrder(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return authJson({ message: "Please log in to place your order." }, 401);
    if (await consumeLimit(`order:${customer.id}`, 10, 3600)) {
      return authJson({ message: "You have placed several orders in a short time. Please wait a little, or contact our team." }, 429);
    }

    const lines = parseCartLines(body.lines);
    if (!lines) return authJson({ message: "Your bag could not be read. Please refresh the page and try again." }, 422);
    if (lines.length === 0) return authJson({ message: "Your bag is empty." }, 422);
    const addressId = typeof body.addressId === "string" && /^\d{1,18}$/.test(body.addressId) ? body.addressId : null;
    if (!addressId) return authJson({ message: "Choose a delivery address.", errors: { address: "Choose a delivery address." } }, 422);
    const token = typeof body.requestId === "string" && /^[0-9a-f-]{36}$/i.test(body.requestId) ? body.requestId.toLowerCase() : null;
    if (!token) return authJson({ message: "Please refresh the page and try again." }, 422);
    const paymentMethod = typeof body.paymentMethod === "string" && Object.hasOwn(PAYMENT_METHODS, body.paymentMethod) ? (body.paymentMethod as PaymentMethod) : null;
    if (!paymentMethod) return authJson({ message: "Choose a payment method." }, 422);
    const notes = typeof body.notes === "string" ? body.notes.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, 500) : "";

    const attempt = (): Promise<Placed> => transaction(async (connection): Promise<Placed> => {
      const [existing] = await connection.execute<RowDataPacket[]>("SELECT order_number FROM orders WHERE account_id = ? AND client_token = ?", [customer.id, token]);
      if (existing.length) return { ok: true, number: String(existing[0].order_number), fresh: false };

      const [addresses] = await connection.execute<RowDataPacket[]>(
        "SELECT recipient, phone, line1, line2, city, region, country_code FROM account_addresses WHERE id = ? AND account_id = ?", [addressId, customer.id]);
      const address = addresses[0];
      if (!address) return refuse("That delivery address could not be found. Please choose another.");

      // Lock the products so two orders cannot both take the last pair.
      const slugs = [...new Set(lines.map((line) => line.slug))];
      const [products] = await connection.execute<RowDataPacket[]>(`SELECT p.id, p.slug, p.sku, p.name, p.price, p.swatches, p.thumbnail_key, p.stock_quantity
        FROM products p JOIN product_categories c ON c.id = p.category_id JOIN product_shapes s ON s.id = p.shape_id
        WHERE p.is_active = 1 AND c.is_active = 1 AND s.is_active = 1 AND p.slug IN (${slugs.map(() => "?").join(",")}) FOR UPDATE`, slugs);

      const priced: { product: RowDataPacket; color: string; qty: number; unit: number }[] = [];
      const wanted = new Map<string, number>();
      for (const line of lines) {
        const product = products.find((row) => row.slug === line.slug);
        if (!product) return refuse("One of the items in your bag is no longer available. Please review your bag.");
        const swatches: string[] = typeof product.swatches === "string" ? JSON.parse(product.swatches) : product.swatches;
        if (!swatches.map(colorName).includes(line.color)) return refuse(`${product.name} is no longer available in ${line.color}. Please review your bag.`);
        priced.push({ product, color: line.color, qty: line.qty, unit: cents(product.price) });
        wanted.set(String(product.id), (wanted.get(String(product.id)) ?? 0) + line.qty);
      }
      for (const product of products) {
        const stock = product.stock_quantity;
        const qty = wanted.get(String(product.id)) ?? 0;
        if (stock !== null && Number(stock) < qty) {
          return refuse(Number(stock) === 0 ? `${product.name} is out of stock. Please remove it from your bag.` : `Only ${stock} of ${product.name} left. Please lower the quantity.`);
        }
      }

      const subtotal = priced.reduce((sum, row) => sum + row.unit * row.qty, 0);
      const shipping = Math.round(siteConfig.checkout.deliveryFee * 100);
      const total = subtotal + shipping;
      const addressJson = JSON.stringify({
        recipient: address.recipient, phone: address.phone, line1: address.line1, line2: address.line2 ?? "",
        city: address.city, region: address.region ?? "", country: address.country_code,
      });
      const number = newOrderNumber();
      const [inserted] = await connection.execute<ResultSetHeader>(`INSERT INTO orders
        (order_number, account_id, customer_email, customer_name, customer_phone, status, currency, subtotal, discount_total, shipping_total, tax_total, grand_total,
         shipping_address, notes, client_token, payment_method)
        VALUES (?, ?, ?, ?, ?, 'pending', 'AED', ?, 0, ?, 0, ?, ?, ?, ?, ?)`,
        [number, customer.id, customer.email, customer.name, address.phone, money(subtotal), money(shipping), money(total), addressJson, notes || null, token, paymentMethod]);
      const orderId = inserted.insertId;
      for (const row of priced) {
        await connection.execute(`INSERT INTO order_items (order_id, product_id, product_slug, product_name, sku, selected_color, thumbnail_key, quantity, unit_price, line_total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, row.product.id, row.product.slug, row.product.name, row.product.sku ?? null, row.color, row.product.thumbnail_key ?? null, row.qty, money(row.unit), money(row.unit * row.qty)]);
      }
      await connection.execute("INSERT INTO payments (order_id, provider, status, amount, currency) VALUES (?, ?, 'pending', ?, 'AED')", [orderId, paymentMethod, money(total)]);
      for (const [productId, qty] of wanted) {
        await connection.execute("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity IS NOT NULL", [qty, productId]);
      }
      // The order is placed, so the saved bag is empty. Bumping the revision tells other devices to refresh.
      await connection.execute("DELETE FROM customer_cart_items WHERE account_id = ?", [customer.id]);
      await connection.execute("UPDATE customer_carts SET content_hash = ?, revision = revision + 1, last_activity_at = UTC_TIMESTAMP() WHERE account_id = ?", [tokenHash("[]"), customer.id]);

      return {
        ok: true, number, fresh: true,
        email: {
          number, customerName: customer.name, customerEmail: customer.email, customerPhone: String(address.phone),
          address: { recipient: String(address.recipient), phone: String(address.phone), line1: String(address.line1), line2: address.line2 ?? "", city: String(address.city), region: address.region ?? "" },
          items: priced.map((row) => ({ name: String(row.product.name), color: row.color, qty: row.qty, unitPrice: row.unit / 100, lineTotal: (row.unit * row.qty) / 100 })),
          subtotal: subtotal / 100, shipping: shipping / 100, total: total / 100, notes,
        },
      };
    });

    let result: Placed | undefined;
    for (let tries = 0; tries < 3 && !result; tries++) {
      try { result = await attempt(); }
      catch (error) {
        // A clash on the order number (very rare) or a double-click race: try again, which finds the first order if there is one.
        if (!(error instanceof DatabaseError && error.code === "ER_DUP_ENTRY") || tries === 2) throw error;
      }
    }
    if (!result || !result.ok) return authJson({ message: result?.message ?? "We could not place your order. Please try again." }, result?.status ?? 503);

    if (result.fresh && result.email && canEmail(customer.email)) {
      const order = result.email;
      const team = siteConfig.contact.email;
      // Emails are a courtesy on top of the saved order, so a mail problem never undoes the order.
      await Promise.allSettled([
        sendEmail({ to: customer.email, ...orderConfirmationEmail(order, siteConfig.url) }),
        ...(team ? [sendEmail({ to: team, ...newOrderNoticeEmail(order) })] : []),
      ]);
    }
    return authJson({ orderNumber: result.number, message: "Thank you. Your order is placed." }, result.fresh ? 201 : 200);
  } catch (error) { return authFailure(error); }
}

// ---------- reading orders ----------

export type OrderSummary = { number: string; status: string; placedAt: string; total: number; currency: string; itemCount: number };
export type OrderDetail = OrderSummary & {
  subtotal: number; shipping: number; paymentMethod: string; paymentStatus: string; notes: string;
  address: { recipient: string; phone: string; line1: string; line2: string; city: string; region: string };
  items: { name: string; slug: string; color: string; qty: number; unitPrice: number; lineTotal: number; image: string | null }[];
};
const iso = (value: unknown) => String(value).replace(" ", "T").replace(/Z?$/, "Z");

export async function listOrders(accountId: string, limit = 50): Promise<OrderSummary[]> {
  const rows = await queryRows(`SELECT o.order_number, o.status, o.currency, o.grand_total, o.placed_at,
    (SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id) AS item_count
    FROM orders o WHERE o.account_id = ? ORDER BY o.placed_at DESC, o.id DESC LIMIT ${Math.max(1, Math.min(200, Math.floor(limit)))}`, [accountId]);
  return rows.map((r) => ({ number: String(r.order_number), status: String(r.status), placedAt: iso(r.placed_at), total: Number(r.grand_total), currency: String(r.currency), itemCount: Number(r.item_count) }));
}

export async function getOrder(accountId: string, number: string): Promise<OrderDetail | null> {
  if (!/^[A-Z0-9-]{6,64}$/.test(number)) return null;
  const [o] = await queryRows(`SELECT o.id, o.order_number, o.status, o.currency, o.subtotal, o.shipping_total, o.grand_total, o.placed_at, o.notes, o.shipping_address, o.payment_method,
    (SELECT status FROM payments p WHERE p.order_id = o.id ORDER BY p.id DESC LIMIT 1) AS payment_status
    FROM orders o WHERE o.account_id = ? AND o.order_number = ? LIMIT 1`, [accountId, number]);
  if (!o) return null;
  const items = await queryRows("SELECT product_name, product_slug, selected_color, quantity, unit_price, line_total, thumbnail_key FROM order_items WHERE order_id = ? ORDER BY id", [String(o.id)]);
  const a = typeof o.shipping_address === "string" ? JSON.parse(o.shipping_address) : o.shipping_address;
  return {
    number: String(o.order_number), status: String(o.status), placedAt: iso(o.placed_at), total: Number(o.grand_total), currency: String(o.currency),
    itemCount: items.reduce((sum, i) => sum + Number(i.quantity), 0),
    subtotal: Number(o.subtotal), shipping: Number(o.shipping_total), paymentMethod: String(o.payment_method), paymentStatus: String(o.payment_status ?? "pending"), notes: o.notes ?? "",
    address: { recipient: a.recipient ?? "", phone: a.phone ?? "", line1: a.line1 ?? "", line2: a.line2 ?? "", city: a.city ?? "", region: a.region ?? "" },
    items: items.map((i) => ({ name: String(i.product_name), slug: String(i.product_slug), color: i.selected_color ?? "", qty: Number(i.quantity), unitPrice: Number(i.unit_price), lineTotal: Number(i.line_total), image: i.thumbnail_key ?? null })),
  };
}
