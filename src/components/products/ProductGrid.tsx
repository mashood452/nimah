"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "./products-data";
import type { ProductCategoryTerm } from "@/lib/product-taxonomy";
import styles from "./Products.module.css";

export function ProductGrid({ products, categories }: { products: Product[]; categories: ProductCategoryTerm[] }) {
  const [filter, setFilter] = useState("");

  const visible = filter === "" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div className={styles.tabsWrap} data-reveal suppressHydrationWarning>
        <div className={styles.tabs} role="group" aria-label="Filter products by category">
          {[{ code: "", name: "All" }, ...categories].map((c) => (
            <button
              key={c.code}
              type="button"
              className={styles.tab}
              aria-pressed={filter === c.code}
              onClick={() => setFilter(c.code)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div data-reveal suppressHydrationWarning>
        <ul className={styles.grid} key={filter}>
          {visible.map((p, i) => (
            <li key={p.slug} className={styles.cell} style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
