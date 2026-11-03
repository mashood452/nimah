"use client";

import { useProducts } from "./ProductCatalogProvider";
import { useWishlist } from "@/lib/shop-store";
import { EmptyState } from "../page/PageKit";
import { ProductCard } from "../products/ProductCard";
import styles from "./Shop.module.css";

/** Saved products, stored in the browser. */
export function WishlistView() {
  const products = useProducts();
  const { slugs } = useWishlist();
  const saved = slugs.flatMap((s) => {
    const p = products.find((product) => product.slug === s);
    return p ? [p] : [];
  });

  if (saved.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        text="Tap the heart on any pair to keep it here. Your wishlist is saved on this device."
        actions={[
          { label: "Explore sunglasses", href: "/sunglasses" },
          { label: "Shop all eyewear", href: "/shop", ghost: true },
        ]}
      />
    );
  }

  return (
    <>
      <p className={styles.resultCount}>
        {saved.length} saved {saved.length === 1 ? "item" : "items"}
      </p>
      <ul className={styles.grid}>
        {saved.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
