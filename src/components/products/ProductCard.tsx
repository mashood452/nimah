"use client";

import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/media";
import { colorName } from "@/lib/product-info";
import { useCart, useCartDrawer, useWishlist } from "@/lib/shop-store";
import { IconArrow, IconHeart, IconShoppingBag } from "../navbar/icons";
import { Price } from "../ui/Price";
import { ProductPlaceholder } from "./ProductPlaceholder";
import type { Product } from "./products-data";
import styles from "./Products.module.css";

/** One product tile. Used on the homepage and on every category page. */
export function ProductCard({ product: p }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const saved = has(p.slug);
  const { add } = useCart();
  const { show: showBag } = useCartDrawer();

  /** Adds the first colour, as shown by the first swatch, and opens the bag drawer. */
  const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(p.slug, colorName(p.swatches[0]), 1);
    showBag(e.currentTarget);
  };

  return (
    <article className={styles.card}>
      <div className={styles.link}>
        <span className={styles.media}>
          {p.image ? (
            <Image
              src={mediaUrl(p.image)}
              alt={p.imageAlt ?? `${p.name}, ${p.subtitle.toLowerCase()}`}
              width={800}
              height={800}
              sizes="(max-width: 700px) 45vw, (max-width: 1200px) 30vw, 22vw"
              className={styles.photo}
            />
          ) : (
            <span className={styles.placeholder}>
              <ProductPlaceholder shape={p.shape} />
            </span>
          )}
          {p.badge && (
            <span className={styles.badge} data-kind={p.badge === "New" ? "new" : "best"}>
              {p.badge}
            </span>
          )}
          <span className={styles.quick} aria-hidden="true">
            View details <IconArrow />
          </span>
        </span>

        <span className={styles.info}>
          <span className={styles.cat}>{p.categoryLabel ?? p.category}</span>
          <span className={styles.nameRow}>
            {/* the name is the card's link, stretched over the whole card so a click anywhere opens the product */}
            <Link href={`/products/${p.slug}`} className={styles.name}>
              {p.name}
            </Link>
            <button type="button" className={styles.bag} aria-label={`Add ${p.name} to bag`} onClick={onAdd}>
              <IconShoppingBag />
            </button>
          </span>
          <span className={styles.sub}>{p.subtitle}</span>
          <span className={styles.row}>
            <span className={styles.price}><Price amount={p.price} /></span>
            <span className={styles.swatches} aria-hidden="true">
              {p.swatches.slice(0, 3).map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </span>
          </span>
        </span>
      </div>

      <button
        type="button"
        className={styles.save}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
        onClick={() => toggle(p.slug)}
      >
        <IconHeart />
      </button>
    </article>
  );
}
