"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useProducts } from "./ProductCatalogProvider";
import { mediaUrl } from "@/lib/media";
import { getDrawerTrigger, useCart, useCartDrawer } from "@/lib/shop-store";
import { IconArrow, IconClose } from "../navbar/icons";
import { ProductPlaceholder } from "../products/ProductPlaceholder";
import { Price } from "../ui/Price";
import styles from "./CartDrawer.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The slide-in bag. Opened from the bag icon in the header and after "Add to bag".
 * Keyboard friendly: Escape closes it, Tab stays inside it, and focus returns to where it came from.
 */
export function CartDrawer() {
  const products = useProducts();
  const { open, hide } = useCartDrawer();
  const { lines, count, setQty, remove, maxQty } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // close when the visitor navigates somewhere
  useEffect(() => {
    hide();
  }, [pathname, hide]);

  // focus management and page scroll lock
  useEffect(() => {
    if (!open) return;
    returnFocus.current = getDrawerTrigger();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = previousOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        hide();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [hide],
  );

  const rows = lines.flatMap((line) => {
    const product = products.find((product) => product.slug === line.slug);
    return product ? [{ line, product }] : [];
  });
  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.line.qty, 0);

  return (
    <>
      <div className={styles.scrim} data-visible={open} onClick={hide} aria-hidden="true" />

      <aside
        ref={panelRef}
        className={styles.drawer}
        data-open={open}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-drawer-title"
        onKeyDown={onKeyDown}
      >
        <header className={styles.head}>
          {/* not a heading: the drawer sits before the page's h1 in the markup, so it must not outrank it */}
          <p id="bag-drawer-title" className={styles.title}>
            Your bag
            <span>
              {count} {count === 1 ? "item" : "items"}
            </span>
          </p>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close bag" onClick={hide}>
            <IconClose />
          </button>
        </header>

        <div className={styles.body}>
          {rows.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 240 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M34 30 Q68 22 102 30 Q108 60 86 76 Q64 84 46 68 Q30 52 34 30 Z" fill="currentColor" fillOpacity="0.06" />
                <g transform="translate(240 0) scale(-1 1)">
                  <path d="M34 30 Q68 22 102 30 Q108 60 86 76 Q64 84 46 68 Q30 52 34 30 Z" fill="currentColor" fillOpacity="0.06" />
                </g>
                <path d="M104 36 Q120 28 136 36 M106 44 Q120 38 134 44" />
                <path d="M26 38 L6 34 M214 38 L234 34" />
              </svg>
              <p className={styles.emptyTitle}>Your bag is empty</p>
              <p>Add a pair you love and it will wait for you here.</p>
              <Link href="/sunglasses" className={styles.ghost} style={{ marginTop: 12 }}>
                Shop sunglasses
              </Link>
            </div>
          ) : (
            <ul className={styles.lines}>
              {rows.map(({ line, product: p }) => (
                <li key={`${line.slug}-${line.color}`} className={styles.line}>
                  <Link href={`/products/${p.slug}`} className={styles.thumb} aria-label={p.name}>
                    {p.image ? <Image src={mediaUrl(p.image)} alt="" fill sizes="88px" /> : <ProductPlaceholder shape={p.shape} />}
                  </Link>
                  <div className={styles.info}>
                    <div className={styles.nameRow}>
                      <Link href={`/products/${p.slug}`} className={styles.name}>
                        {p.name}
                      </Link>
                      <span className={styles.price}><Price amount={p.price * line.qty} /></span>
                    </div>
                    <p className={styles.meta}>{p.subtitle}</p>
                    <p className={styles.meta}>Colour: {line.color}</p>
                    <div className={styles.controls}>
                      <div className={styles.stepper} role="group" aria-label={`Quantity for ${p.name}`}>
                        <button type="button" aria-label="Decrease quantity" disabled={line.qty <= 1} onClick={() => setQty(line.slug, line.color, line.qty - 1)}>
                          <span aria-hidden="true">&minus;</span>
                        </button>
                        <output aria-live="polite">{line.qty}</output>
                        <button type="button" aria-label="Increase quantity" disabled={line.qty >= maxQty} onClick={() => setQty(line.slug, line.color, line.qty + 1)}>
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                      <button type="button" className={styles.remove} onClick={() => remove(line.slug, line.color)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {rows.length > 0 && (
          <footer className={styles.foot}>
            <p className={styles.subtotal}>
              Subtotal <strong><Price amount={subtotal} /></strong>
            </p>
            <p className={styles.note}>Free delivery across the UAE. Pay in cash when your order arrives.</p>
            <Link href="/checkout" className={styles.primary} onClick={hide}>
              Checkout <IconArrow />
            </Link>
            <Link href="/cart" className={styles.ghost}>
              View full bag
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
