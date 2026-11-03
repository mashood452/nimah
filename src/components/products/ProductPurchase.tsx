"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { colorName } from "@/lib/product-info";
import { siteConfig } from "@/lib/site";
import { useCart, useCartDrawer, useWishlist } from "@/lib/shop-store";
import { IconArrow, IconBag, IconHeart } from "../navbar/icons";
import type { Product } from "./products-data";
import styles from "./Product.module.css";

/** Colour choice, quantity, add to bag and wishlist for one product. */
export function ProductPurchase({ product: p }: { product: Product }) {
  const { add, maxQty } = useCart();
  const { has, toggle } = useWishlist();
  const { show: showBag } = useCartDrawer();
  const [color, setColor] = useState(p.swatches[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const saved = has(p.slug);

  const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(p.slug, colorName(color), qty);
    setAdded(true);
    showBag(e.currentTarget);
  };

  return (
    <div className={styles.buy}>
      <div className={styles.priceRow}>
        <div className={styles.priceGroup}>
          <p className={styles.price}>{formatPrice(p.price)}</p>
          <p className={styles.priceNote}>Price in {siteConfig.currency}</p>
        </div>

        {/* quick add, sitting above the colour choice: adds the selected colour and quantity */}
        <button type="button" className={styles.quickAdd} aria-label={`Add ${p.name} to bag`} onClick={onAdd}>
          <IconBag />
          <span>Quick add</span>
        </button>
      </div>

      <fieldset className={styles.colors}>
        <legend>
          Colour <span>{colorName(color)}</span>
        </legend>
        <div className={styles.swatchRow}>
          {p.swatches.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.swatchBtn}
              aria-pressed={c === color}
              aria-label={colorName(c)}
              onClick={() => {
                setColor(c);
                setAdded(false);
              }}
            >
              <i style={{ background: c }} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <div className={styles.qty} role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>
            <span aria-hidden="true">&minus;</span>
          </button>
          <output aria-live="polite">{qty}</output>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={qty >= maxQty}
            onClick={() => setQty((q) => q + 1)}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <button type="button" className={styles.addBtn} onClick={onAdd}>
          Add to bag <IconArrow />
        </button>

        <button
          type="button"
          className={styles.saveBtn}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          onClick={() => toggle(p.slug)}
        >
          <IconHeart />
        </button>
      </div>

      <p className={styles.addedMsg} role="status" data-visible={added}>
        {added && (
          <>
            Added to your bag. <Link href="/cart">View bag</Link>
          </>
        )}
      </p>
    </div>
  );
}
