"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/catalog-filters";
import { useProducts } from "./ProductCatalogProvider";
import { EmptyState } from "../page/PageKit";
import { ProductCard } from "../products/ProductCard";
import styles from "./Shop.module.css";
import { CaptchaSearchForm } from "../account/CaptchaSearchForm";

const popular = ["Aviator", "Polarized", "Blue-cut", "Cat-eye", "Round", "Optical"];

/** Search box and results. The query lives in the URL (?q=), so results can be shared and bookmarked. */
export function SearchView() {
  const products = useProducts();
  const query = (useSearchParams().get("q") ?? "").trim();
  const results = query ? searchProducts(products, query) : [];

  return (
    <>
      <CaptchaSearchForm key={query} className={styles.searchForm} defaultValue={query} placeholder="Search sunglasses, blue-cut, frames" />

      {!query && (
        <div className={styles.suggest}>
          <span>Popular</span>
          {popular.map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}>
              {t}
            </Link>
          ))}
        </div>
      )}

      {query && results.length > 0 && (
        <>
          <p className={styles.resultCount}>
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
          <ul className={styles.grid}>
            {results.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      )}

      {query && results.length === 0 && (
        <>
          <EmptyState
            title={`No results for "${query}"`}
            text="Check the spelling, or try a broader word such as sunglasses, polarized or optical."
            actions={[
              { label: "Shop all eyewear", href: "/shop" },
              { label: "Contact our team", href: "/contact", ghost: true },
            ]}
          />
          <div className={styles.suggest} style={{ justifyContent: "center" }}>
            <span>Try</span>
            {popular.map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}>
                {t}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
