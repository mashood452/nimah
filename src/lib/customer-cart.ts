import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { executeWrite, queryRows, transaction } from "./db";
import { tokenHash } from "./auth/crypto";
import { authFailure, authJson, readAuthBody } from "./auth/http";
import { consumeLimit } from "./auth/rate-limit";
import { getCustomer } from "./auth/session";
import { parseCartLines } from "./cart-data";
import { colorName } from "./product-info";

const linesSql = `SELECT p.slug, i.selected_color AS color, i.quantity AS qty FROM customer_cart_items i
  JOIN products p ON p.id = i.product_id JOIN product_categories c ON c.id = p.category_id
  JOIN product_shapes s ON s.id = p.shape_id WHERE i.account_id = ? AND p.is_active = 1 AND c.is_active = 1 AND s.is_active = 1 ORDER BY p.slug, i.selected_color`;

export async function readCustomerCart(request: Request) {
  void request;
  try {
    const customer = await getCustomer();
    if (!customer) return authJson({ message: "Please log in to save your bag." }, 401);
    const owner = new URL(request.url).searchParams.get("owner");
    if (owner && owner !== customer.id) return authJson({ message: "Your account changed. Please refresh." }, 401);
    await executeWrite("UPDATE customer_carts SET last_activity_at = UTC_TIMESTAMP() WHERE account_id = ?", [customer.id]);
    const [rows, carts] = await Promise.all([queryRows(linesSql, [customer.id]), queryRows("SELECT revision FROM customer_carts WHERE account_id = ?", [customer.id])]);
    return authJson({ lines: rows.map((row) => ({ slug: String(row.slug), color: String(row.color), qty: Number(row.qty) })), revision: Number(carts[0]?.revision ?? 0) });
  } catch (error) { return authFailure(error); }
}

export async function saveCustomerCart(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return authJson({ message: "Please log in to save your bag." }, 401);
    if (body.accountId !== customer.id) return authJson({ message: "Your account changed. Please refresh." }, 401);
    if (body.activity === true) {
      await executeWrite("UPDATE customer_carts SET last_activity_at = UTC_TIMESTAMP() WHERE account_id = ?", [customer.id]);
      return authJson({ saved: true });
    }
    const lines = parseCartLines(body.lines);
    if (!lines || !Number.isSafeInteger(body.revision) || Number(body.revision) < 0) return authJson({ message: "Your bag could not be saved. Please refresh the page." }, 422);
    const retry = await consumeLimit(`cart-write:${customer.id}`, 120, 60);
    if (retry) return authJson({ message: "Please wait a moment before updating your bag." }, 429);
    const products = lines.length ? await queryRows(`SELECT p.id, p.slug, p.swatches FROM products p
      JOIN product_categories c ON c.id = p.category_id JOIN product_shapes s ON s.id = p.shape_id
      WHERE p.is_active = 1 AND c.is_active = 1 AND s.is_active = 1 AND p.slug IN (${lines.map(() => "?").join(",")})`, lines.map((line) => line.slug)) : [];
    const valid = lines.flatMap((line) => {
      const product = products.find((row) => row.slug === line.slug);
      if (!product) return [];
      const swatches: string[] = typeof product.swatches === "string" ? JSON.parse(product.swatches) : product.swatches;
      return swatches.map(colorName).includes(line.color) ? [{ ...line, productId: Number(product.id) }] : [];
    });
    const fingerprint = tokenHash(JSON.stringify(valid.map(({ slug, color, qty }) => ({ slug, color, qty }))));
    const result = await transaction(async (connection) => {
      await connection.execute("INSERT IGNORE INTO customer_carts (account_id, content_hash) VALUES (?, ?)", [customer.id, tokenHash("[]")]);
      const [carts] = await connection.execute<RowDataPacket[]>("SELECT revision, content_hash FROM customer_carts WHERE account_id = ? FOR UPDATE", [customer.id]);
      const cart = carts[0];
      if (Number(cart.revision) !== Number(body.revision)) {
        const [current] = await connection.execute<RowDataPacket[]>(linesSql, [customer.id]);
        return { conflict: true, revision: Number(cart.revision), lines: current.map((line) => ({ slug: String(line.slug), color: String(line.color), qty: Number(line.qty) })) };
      }
      const changed = cart.content_hash !== fingerprint;
      if (changed) {
        await connection.execute("DELETE FROM customer_cart_items WHERE account_id = ?", [customer.id]);
        for (const line of valid) await connection.execute("INSERT INTO customer_cart_items (account_id, product_id, selected_color, quantity) VALUES (?, ?, ?, ?)", [customer.id, line.productId, line.color, line.qty]);
      }
      await connection.execute(`UPDATE customer_carts SET content_hash = ?, revision = revision + ?, last_activity_at = UTC_TIMESTAMP(),
        updated_at = IF(? = 1, UTC_TIMESTAMP(), updated_at) WHERE account_id = ?`, [fingerprint, changed ? 1 : 0, changed ? 1 : 0, customer.id]);
      return { conflict: false, revision: Number(cart.revision) + (changed ? 1 : 0), lines: valid.map(({ slug, color, qty }) => ({ slug, color, qty })) };
    });
    return authJson(result, result.conflict ? 409 : 200);
  } catch (error) { return authFailure(error); }
}

export async function saveEmailPreferences(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return authJson({ message: "Please log in to update email preferences." }, 401);
    if (typeof body.enabled !== "boolean") return authJson({ message: "Choose an email preference." }, 422);
    await executeWrite("UPDATE accounts SET cart_reminders_enabled = ? WHERE id = ?", [body.enabled ? 1 : 0, customer.id]);
    return authJson({ enabled: body.enabled });
  } catch (error) { return authFailure(error); }
}
