"use client";

import Image from "next/image";
import Link from "next/link";
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
          Free delivery across the UAE. Pay in cash when your order arrives.
        </p>
        <div className={styles.summaryActions}>
          <Link href="/checkout" className={pageStyles.btnPrimary}>
            Checkout <IconArrow />
          </Link>
          <Link href="/shop" className={pageStyles.btnGhost}>
            Continue shopping
          </Link>
          <button type="button" className={styles.linkBtn} style={{ justifySelf: "center", marginTop: 8 }} onClick={clear}>
            Empty bag
          </button>
        </div>
      </aside>
    </div>
  );
}
