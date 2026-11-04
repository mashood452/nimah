import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { DatabaseError, executeWrite, queryRows, transaction } from "../db";
import { verifyPassword } from "../auth/crypto";
import { clearEmailProof, emailProof, hasEmailProof } from "../auth/email-verification";
import { authFailure, authJson, readAuthBody } from "../auth/http";
import { consumeLimit } from "../auth/rate-limit";
import { currentSessionHash, getCustomer } from "../auth/session";
import { normalizeEmail } from "../auth/validation";
import { sendEmail } from "../email/smtp";
import { emailChangedEmail } from "../email/templates";
import { MAX_ADDRESSES, validateAddress, validateProfile, type AddressRecord } from "./validation";

const needLogin = () => authJson({ message: "Please log in to continue." }, 401);
const tooMany = () => authJson({ message: "Too many changes in a short time. Please wait a little and try again." }, 429);

/** Reserved test domains can never receive mail, so nothing is sent to them. */
export const canEmail = (address: string) => !address.toLowerCase().endsWith(".invalid");

// ---------- profile: name and phone ----------

export async function updateProfile(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return needLogin();
    if (await consumeLimit(`profile:${customer.id}`, 30, 3600)) return tooMany();
    const input = validateProfile(body);
    if (!input.valid) return authJson({ message: "Please check the highlighted fields.", errors: input.errors }, 422);
    await executeWrite("UPDATE accounts SET display_name = ?, phone = ? WHERE id = ?", [input.name, input.phone || null, customer.id]);
    return authJson({ name: input.name, phone: input.phone || null, message: "Your details are saved." });
  } catch (error) { return authFailure(error); }
}

// ---------- email: the new address is verified with a code first, then confirmed with the password ----------

export async function changeEmail(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return needLogin();
    if (await consumeLimit(`email-change:${customer.id}`, 5, 900)) return tooMany();
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";
    if (!email) return authJson({ message: "Enter a valid email address.", errors: { email: "Enter a valid email address." } }, 422);
    if (!password || password.length > 128) return authJson({ message: "Enter your password to confirm.", errors: { password: "Enter your password." } }, 422);
    if (email === customer.email) return authJson({ message: "That is already your email address.", errors: { email: "That is already your email address." } }, 422);

    const proof = await emailProof();
    if (!proof || !await hasEmailProof(email, proof)) return authJson({ message: "Verify the new email address with the code we send first.", requiresVerification: true }, 403);

    const [account] = await queryRows("SELECT password_hash FROM accounts WHERE id = ? AND status = 'active' LIMIT 1", [customer.id]);
    if (!account?.password_hash || !await verifyPassword(password, String(account.password_hash))) {
      return authJson({ message: "That password is not correct.", errors: { password: "That password is not correct." } }, 401);
    }

    const keep = await currentSessionHash();
    try {
      const changed = await transaction(async (connection) => {
        const [verified] = await connection.execute<RowDataPacket[]>(
          "SELECT email FROM email_verifications WHERE email = ? AND verification_hash = ? AND verified_at IS NOT NULL AND expires_at > UTC_TIMESTAMP() FOR UPDATE", [email, proof]);
        if (!verified.length) return false;
        await connection.execute("UPDATE accounts SET email = ?, email_verified_at = UTC_TIMESTAMP() WHERE id = ?", [email, customer.id]);
        // Other devices must sign in again with the new address.
        await connection.execute("DELETE FROM account_sessions WHERE account_id = ? AND token_hash <> ?", [customer.id, keep ?? ""]);
        await connection.execute("DELETE FROM email_verifications WHERE email = ? AND verification_hash = ?", [email, proof]);
        return true;
      });
      if (!changed) return authJson({ message: "Your email check expired. Please verify the address again.", requiresVerification: true }, 403);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "ER_DUP_ENTRY") {
        return authJson({ message: "We could not use that email address. Please try a different one." }, 409);
      }
      throw error;
    }
    // Tell the old address about the change, so a hijacked account does not go unnoticed. Failure to send never blocks it.
    if (canEmail(customer.email)) await sendEmail({ to: customer.email, ...emailChangedEmail(customer.name, email) }).catch(() => {});
    const response = authJson({ email, message: "Your email address is updated." });
    clearEmailProof(response);
    return response;
  } catch (error) { return authFailure(error); }
}

// ---------- delivery addresses ----------

const addressSql = `SELECT CAST(id AS CHAR) AS id, label, recipient, phone, line1, line2, city, region, is_default
  FROM account_addresses WHERE account_id = ? ORDER BY is_default DESC, id DESC`;

export const rowToAddress = (row: RowDataPacket): AddressRecord => ({
  id: String(row.id), label: row.label ?? "", recipient: String(row.recipient), phone: String(row.phone), line1: String(row.line1),
  line2: row.line2 ?? "", city: String(row.city), region: row.region ?? "", isDefault: !!row.is_default,
});

export async function listAddresses(accountId: string): Promise<AddressRecord[]> {
  return (await queryRows(addressSql, [accountId])).map(rowToAddress);
}

const addressId = (value: unknown) => (typeof value === "string" && /^\d{1,18}$/.test(value) ? value : null);

export async function manageAddresses(request: Request) {
  try {
    const body = await readAuthBody(request);
    const customer = await getCustomer();
    if (!customer) return needLogin();
    if (await consumeLimit(`address:${customer.id}`, 60, 3600)) return tooMany();
    const action = body.action;

    if (action === "create" || action === "update") {
      const input = validateAddress(body);
      if (!input.valid) return authJson({ message: "Please check the highlighted fields.", errors: input.errors }, 422);
      const a = input.value;
      const id = action === "update" ? addressId(body.id) : null;
      if (action === "update" && !id) return authJson({ message: "That address could not be found." }, 404);
      const outcome = await transaction(async (connection) => {
        // Lock this customer's addresses so two tabs cannot both claim to be the default.
        const [existing] = await connection.execute<RowDataPacket[]>("SELECT id FROM account_addresses WHERE account_id = ? FOR UPDATE", [customer.id]);
        if (action === "create" && existing.length >= MAX_ADDRESSES) return { error: `You can save up to ${MAX_ADDRESSES} addresses. Please remove one first.` };
        if (action === "update" && !existing.some((row) => String(row.id) === id)) return { notFound: true };
        const makeDefault = a.isDefault || existing.length === 0;
        if (makeDefault) await connection.execute("UPDATE account_addresses SET is_default = 0 WHERE account_id = ?", [customer.id]);
        const values = [a.label || null, a.recipient, a.phone, a.line1, a.line2 || null, a.city, a.region];
        if (action === "create") {
          await connection.execute(`INSERT INTO account_addresses (account_id, label, recipient, phone, line1, line2, city, region, country_code, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AE', ?)`, [customer.id, ...values, makeDefault ? 1 : 0]);
        } else {
          await connection.execute(`UPDATE account_addresses SET label = ?, recipient = ?, phone = ?, line1 = ?, line2 = ?, city = ?, region = ?,
            is_default = IF(? = 1, 1, is_default) WHERE id = ? AND account_id = ?`, [...values, makeDefault ? 1 : 0, id!, customer.id]);
        }
        return {};
      });
      if ("notFound" in outcome) return authJson({ message: "That address could not be found." }, 404);
      if ("error" in outcome) return authJson({ message: outcome.error }, 422);
      return authJson({ addresses: await listAddresses(customer.id), message: action === "create" ? "Address saved." : "Address updated." });
    }

    if (action === "default" || action === "delete") {
      const id = addressId(body.id);
      if (!id) return authJson({ message: "That address could not be found." }, 404);
      const outcome = await transaction(async (connection) => {
        const [rows] = await connection.execute<RowDataPacket[]>("SELECT id, is_default FROM account_addresses WHERE account_id = ? FOR UPDATE", [customer.id]);
        const target = rows.find((row) => String(row.id) === id);
        if (!target) return { notFound: true };
        if (action === "default") {
          await connection.execute("UPDATE account_addresses SET is_default = (id = ?) WHERE account_id = ?", [id, customer.id]);
        } else {
          await connection.execute("DELETE FROM account_addresses WHERE id = ? AND account_id = ?", [id, customer.id]);
          // Deleting the default hands the role to the newest remaining address.
          if (target.is_default) await connection.execute("UPDATE account_addresses SET is_default = 1 WHERE account_id = ? ORDER BY id DESC LIMIT 1", [customer.id]);
        }
        return {};
      });
      if ("notFound" in outcome) return authJson({ message: "That address could not be found." }, 404);
      return authJson({ addresses: await listAddresses(customer.id), message: action === "delete" ? "Address removed." : "Default address updated." });
    }
    return authJson({ message: "Choose what to do with the address." }, 422);
  } catch (error) { return authFailure(error); }
}

