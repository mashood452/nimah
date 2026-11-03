"use client";

import { useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductTaxonomy } from "@/lib/product-taxonomy";
import { filterProducts } from "@/lib/catalog-filters";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../products/products-data";
import styles from "./Catalog.module.css";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const sorters: Record<Sort, ((a: Product, b: Product) => number) | null> = {
  featured: null,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

/** Category and frame-shape filters share the URL, so a selection can be bookmarked. */
export function FilterableCatalogGrid({ products, taxonomy }: { products: Product[]; taxonomy: ProductTaxonomy }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const category = params.get("category") ?? "";
  const shape = params.get("shape") ?? "";
  const visible = filterProducts(products, { category, shape });

  function changeFilter(key: "category" | "shape" | "clear", value = "") {
    const next = new URLSearchParams(params.toString());
    if (key === "clear") { next.delete("category"); next.delete("shape"); }
    else if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  return (
    <div aria-busy={pending}>
      <div className={styles.filters} role="group" aria-label="Filter eyewear">
        <label className={styles.sort}>
          <span>Category</span>
          <select value={category} onChange={(event) => changeFilter("category", event.target.value)} disabled={pending}>
            <option value="">All categories</option>
            {category && !taxonomy.categories.some((term) => term.slug === category) && <option value={category}>Unavailable category</option>}
            {taxonomy.categories.map((term) => <option key={term.slug} value={term.slug}>{term.name}</option>)}
          </select>
        </label>
        <label className={styles.sort}>
          <span>Frame shape</span>
          <select value={shape} onChange={(event) => changeFilter("shape", event.target.value)} disabled={pending}>
            <option value="">All shapes</option>
            {shape && !taxonomy.shapes.some((term) => term.slug === shape) && <option value={shape}>Unavailable shape</option>}
            {taxonomy.shapes.map((term) => <option key={term.slug} value={term.slug}>{term.name}</option>)}
          </select>
        </label>
        {(category || shape) && <button type="button" onClick={() => changeFilter("clear")} disabled={pending}>Clear filters</button>}
      </div>
      <CatalogGrid products={visible} />
    </div>
  );
}

export function CatalogGrid({
  products,
  showSort = true,
  aside,
}: {
  products: Product[];
  showSort?: boolean;
  /** optional extra cell that fills the remaining columns of the last row */
  aside?: ReactNode;
}) {
  const [sort, setSort] = useState<Sort>("featured");

  const sorter = sorters[sort];
  const list = sorter ? [...products].sort(sorter) : products;

  return (
    <>
      <div className={styles.toolbar} data-reveal suppressHydrationWarning>
        <p className={styles.count} aria-live="polite">
          {list.length} {list.length === 1 ? "product" : "products"}
        </p>
        {showSort && products.length > 1 && (
          <label className={styles.sort}>
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        )}
      </div>

      {list.length === 0 && <p role="status">No products match this selection. Try another category or shape.</p>}
      <ul className={styles.grid} data-reveal="stagger" suppressHydrationWarning>
        {list.map((p) => (
          <li key={p.slug} className={styles.cell}>
            <ProductCard product={p} />
          </li>
        ))}
        {aside && (
          <li className={styles.aside} style={{ "--span": Math.max(1, 4 - (list.length % 4)) } as React.CSSProperties}>
            {aside}
          </li>
        )}
      </ul>
    </>
  );
}
