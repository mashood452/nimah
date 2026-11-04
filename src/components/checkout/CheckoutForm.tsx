"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { AddressForm } from "../account/AddressForm";
import { ProductPlaceholder } from "../products/ProductPlaceholder";
import { useProducts } from "../shop/ProductCatalogProvider";
import { Price } from "../ui/Price";
import { postJson } from "@/lib/api-client";
import { addressLine, formatPhone, type AddressRecord } from "@/lib/account/validation";
import { mediaUrl } from "@/lib/media";
import { useCart } from "@/lib/shop-store";
import account from "../account/Account.module.css";
import area from "../account/AccountArea.module.css";
import styles from "./Checkout.module.css";

const noop = () => () => {};

export function CheckoutForm({
  addresses: initialAddresses,
  customer,
  deliveryFee,
}: {
  addresses: AddressRecord[];
  customer: { name: string; email: string; phone: string | null };
  deliveryFee: number;
}) {
  const router = useRouter();
  const products = useProducts();
  const { lines, clear } = useCart();
  // The bag lives in the browser, so wait for it to load before saying anything about it.
  const ready = useSyncExternalStore(noop, () => true, () => false);

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selected, setSelected] = useState(initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? "");
  const [adding, setAdding] = useState(initialAddresses.length === 0);
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  // The same id is sent every time this order is submitted, so a double tap or a retry can never place it twice.
  const [requestId] = useState(() => crypto.randomUUID());

  const rows = lines.flatMap((line) => {
    const product = products.find((p) => p.slug === line.slug);
    return product ? [{ line, product }] : [];
  });
  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.line.qty, 0);
  const total = subtotal + deliveryFee;
  const chosen = addresses.find((a) => a.id === selected);

  async function place(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    if (!chosen) { setError("Choose or add a delivery address first."); return; }
    setPending(true); setError("");
    const { ok, data } = await postJson<{ orderNumber?: string }>("/api/orders", {
      lines: rows.map(({ line }) => ({ slug: line.slug, color: line.color, qty: line.qty })),
      addressId: chosen.id,
      paymentMethod: "cash_on_delivery",
      notes,
      requestId,
    });
    if (ok && data.orderNumber) {
      clear();
      router.push(`/account/orders/${data.orderNumber}?placed=1`);
      return; // stay in the "pending" state while the confirmation page loads
    }
    setPending(false);
    setError(data.message ?? "We could not place your order. Please try again.");
  }

  if (!ready) return <div className={styles.loading} aria-busy="true">Loading your bag...</div>;

  if (rows.length === 0) {
    return (
      <div className={area.empty}>
        <strong>Your bag is empty</strong>
        <p>Add a pair you love, then come back to check out.</p>
        <Link href="/shop" className={account.primary}>Shop all eyewear</Link>
      </div>
    );
  }

  return (
    <form className={styles.layout} onSubmit={place} noValidate>
      <div className={area.stack}>
        {/* 1 delivery address */}
        <section className={area.panel} aria-labelledby="co-address">
          <h2 id="co-address" className={styles.stepTitle}><span>1</span> Delivery address</h2>
          {addresses.length > 0 && (
            <ul className={styles.choices} role="radiogroup" aria-label="Delivery address">
              {addresses.map((a) => (
                <li key={a.id}>
                  <label className={styles.choice} data-selected={selected === a.id}>
                    <input type="radio" name="address" value={a.id} checked={selected === a.id} onChange={() => { setSelected(a.id); setError(""); }} />
                    <span className={styles.choiceBody}>
                      <strong>{a.label || "Address"}{a.isDefault && <em className={area.badge}>Default</em>}</strong>
                      <span>{a.recipient}</span>
                      <span>{addressLine(a)}</span>
                      <span>{formatPhone(a.phone)}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {adding ? (
            <div className={styles.newAddress}>
              <h3>{addresses.length ? "Add a new address" : "Where should we deliver?"}</h3>
              <AddressForm
                defaultRecipient={customer.name}
                defaultPhone={customer.phone ?? ""}
                forceDefault={addresses.length === 0}
                submitLabel="Save and use this address"
                onSaved={(list, id) => { setAddresses(list); if (id) setSelected(id); setAdding(false); setError(""); }}
                onCancel={addresses.length ? () => setAdding(false) : undefined}
              />
            </div>
          ) : (
            <button type="button" className={area.addBtn} onClick={() => setAdding(true)}>+ Add a new address</button>
          )}
        </section>

        {/* 2 payment */}
        <section className={area.panel} aria-labelledby="co-pay">
          <h2 id="co-pay" className={styles.stepTitle}><span>2</span> Payment</h2>
          <label className={styles.choice} data-selected="true">
            <input type="radio" name="payment" value="cash_on_delivery" checked readOnly />
            <span className={styles.choiceBody}>
              <strong>Cash on delivery</strong>
              <span>Pay in cash when your order arrives. Please have the exact amount ready if you can.</span>
            </span>
          </label>
        </section>

        {/* 3 notes */}
        <section className={area.panel} aria-labelledby="co-notes">
          <h2 id="co-notes" className={styles.stepTitle}><span>3</span> Anything we should know?</h2>
          <div className={account.field}>
            <label htmlFor="co-notes-input">Delivery notes (optional)</label>
            <textarea id="co-notes-input" className={styles.textarea} rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="For example: call on arrival, leave with the concierge." />
            <span className={account.hint}>{500 - notes.length} characters left</span>
          </div>
        </section>
      </div>

      <aside className={styles.summary} aria-label="Order summary">
        <h2 className={styles.summaryTitle}>Your order</h2>
        <ul className={styles.lines}>
          {rows.map(({ line, product: p }) => (
            <li key={`${line.slug}-${line.color}`} className={styles.line}>
              <span className={styles.thumb}>
                {p.image ? <Image src={mediaUrl(p.image)} alt="" fill sizes="64px" /> : <ProductPlaceholder shape={p.shape} />}
                <i>{line.qty}</i>
              </span>
              <span className={styles.lineInfo}>
                <strong>{p.name}</strong>
                <span>{line.color}</span>
              </span>
              <span className={styles.linePrice}><Price amount={p.price * line.qty} /></span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div><dt>Subtotal</dt><dd><Price amount={subtotal} /></dd></div>
          <div><dt>Delivery</dt><dd>{deliveryFee > 0 ? <Price amount={deliveryFee} /> : "Free"}</dd></div>
          <div className={styles.grand}><dt>Total</dt><dd><Price amount={total} /></dd></div>
        </dl>
        {chosen && <p className={styles.deliverTo}>Delivering to <strong>{chosen.recipient}</strong>, {chosen.city}. We will confirm by email at {customer.email}.</p>}
        <div role={error ? "alert" : undefined} className={error ? account.error : account.emptyNotice}>{error}</div>
        <button type="submit" className={account.primary} disabled={pending || !chosen}>
          {pending ? "Placing your order..." : <>Place order <span aria-hidden="true">·</span> <Price amount={total} /></>}
        </button>
        <p className={styles.fine}>
          By placing your order you agree to our <Link href="/terms" target="_blank">terms</Link>, <Link href="/shipping" target="_blank">shipping policy</Link> and <Link href="/returns" target="_blank">returns policy</Link>.
        </p>
        <Link href="/cart" className={styles.back}>← Back to your bag</Link>
      </aside>
    </form>
  );
}
