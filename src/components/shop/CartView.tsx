"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Price } from "../ui/Price";
import { mediaUrl } from "@/lib/media";
import { useProducts } from "./ProductCatalogProvider";
import { useCart } from "@/lib/shop-store";
import { EmptyState } from "../page/PageKit";
import { IconArrow } from "../navbar/icons";
import { ProductPlaceholder } from "../products/ProductPlaceholder";
import pageStyles from "../page/Page.module.css";
import styles from "./Shop.module.css";

/** The shopping bag. Lines are stored in the browser, so this works without an account. */
export function CartView() {
  const products = useProducts();
  const { lines, count, setQty, remove, clear, maxQty } = useCart();
  const [copied, setCopied] = useState(false);

  const rows = lines.flatMap((line) => {
    const product = products.find((product) => product.slug === line.slug);
    return product ? [{ line, product }] : [];
  });
  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.line.qty, 0);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        text="Add a pair you love and it will wait for you here. Your bag is saved on this device."
        actions={[
          { label: "Shop sunglasses", href: "/sunglasses" },
          { label: "Shop all eyewear", href: "/shop", ghost: true },
        ]}
      />
    );
  }

  const summaryText = [
    "Nimah Opticals order request",
    ...rows.map(
      (r) => `${r.line.qty} x ${r.product.name} (${r.product.subtitle}), ${r.line.color}: ${formatPrice(r.product.price * r.line.qty)}`,
    ),
    `Subtotal: ${formatPrice(subtotal)}`,
  ].join("\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked: the summary is still visible on the page */
    }
  };

  return (
    <div className={styles.cart}>
      <ul className={styles.lines}>
        {rows.map(({ line, product: p }) => (
          <li key={`${line.slug}-${line.color}`} className={styles.line}>
            <Link href={`/products/${p.slug}`} className={styles.thumb} aria-label={p.name}>
              {p.image ? (
                <Image src={mediaUrl(p.image)} alt="" fill sizes="132px" />
              ) : (
                <ProductPlaceholder shape={p.shape} />
              )}
            </Link>

            <div className={styles.lineBody}>
              <Link href={`/products/${p.slug}`} className={styles.lineName}>
                {p.name}
              </Link>
              <p className={styles.lineMeta} style={{ margin: 0 }}>
                {p.subtitle}
              </p>
              <p className={styles.lineMeta} style={{ margin: 0 }}>
                Colour: {line.color}
              </p>

              <div className={styles.lineControls}>
                <div className={styles.stepper} role="group" aria-label={`Quantity for ${p.name}`}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={line.qty <= 1}
                    onClick={() => setQty(line.slug, line.color, line.qty - 1)}
                  >
                    <span aria-hidden="true">&minus;</span>
                  </button>
                  <output aria-live="polite">{line.qty}</output>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={line.qty >= maxQty}
                    onClick={() => setQty(line.slug, line.color, line.qty + 1)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <button type="button" className={styles.linkBtn} onClick={() => remove(line.slug, line.color)}>
                  Remove
                </button>
              </div>
            </div>

            <p className={styles.linePrice}><Price amount={p.price * line.qty} /></p>
          </li>
        ))}
      </ul>

      <aside className={styles.summary} aria-label="Order summary">
        <h2 className={styles.summaryTitle}>Order summary</h2>
        <div className={styles.summaryRow}>
          <span>
            Items <small>({count})</small>
          </span>
          <strong><Price amount={subtotal} /></strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Delivery</span>
          <strong>Confirmed with your order</strong>
        </div>
        <p className={styles.summaryTotal}>
          Subtotal <strong><Price amount={subtotal} /></strong>
        </p>
        <p className={styles.summaryNote}>
          Online checkout is coming soon. Send us your bag and our team will complete your order with you, including
          delivery and payment.
        </p>
        <div className={styles.summaryActions}>
          <Link href="/contact" className={pageStyles.btnPrimary}>
            Contact us to order <IconArrow />
          </Link>
          <button type="button" className={pageStyles.btnGhost} onClick={copySummary}>
            {copied ? "Order summary copied" : "Copy order summary"}
          </button>
          <button type="button" className={styles.linkBtn} style={{ justifySelf: "center", marginTop: 8 }} onClick={clear}>
            Empty bag
          </button>
        </div>
      </aside>
    </div>
  );
}
