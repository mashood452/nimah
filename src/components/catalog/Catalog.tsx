import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { ProductTaxonomy } from "@/lib/product-taxonomy";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { Brands } from "../brands/Brands";
import { IconArrow } from "../navbar/icons";
import type { Product } from "../products/products-data";
import { JsonLd } from "../seo/JsonLd";
import { CatalogGrid, FilterableCatalogGrid } from "./CatalogGrid";
import styles from "./Catalog.module.css";

export type Crumb = { name: string; href: string };

export type Chip = {
  label: string;
  href: string;
  /** round photo shown on the chip; chips without one render as plain text */
  image?: string;
  active?: boolean;
};
export type ChipGroup = { label: string; chips: Chip[] };

export type Spotlight = {
  kicker: string;
  title: string;
  note: string;
  bestLabel: string;
  best: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

type Props = {
  title: string;
  intro: string;
  crumbs: Crumb[];
  chipGroups?: ChipGroup[];
  products: Product[];
  filterTaxonomy?: ProductTaxonomy;
  /** extra products shown below the main grid */
  more?: Product[];
  moreTitle?: string;
  guideTitle: string;
  guide: string[];
  guideLink?: { label: string; href: string };
  /** fills the empty space beside a short product list */
  spotlight?: Spotlight;
  /** shown instead of the grid when there are no products */
  emptyState?: ReactNode;
};

export function Catalog({
  title,
  intro,
  crumbs,
  chipGroups = [],
  products,
  filterTaxonomy,
  more = [],
  moreTitle,
  guideTitle,
  guide,
  guideLink = { label: "Read our eyewear FAQs", href: "/#faq" },
  spotlight,
  emptyState,
}: Props) {
  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs, siteConfig.url)} />

      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <ol>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.href}>
                  {last ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}
                </li>
              );
            })}
          </ol>
        </nav>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>

        {chipGroups.length > 0 && (
          <div className={styles.chipRows}>
            {chipGroups.map((group) => (
              <div key={group.label} className={styles.chipRow}>
                <p className={styles.chipsLabel}>{group.label}</p>
                <nav aria-label={group.label} className={styles.chips}>
                  {group.chips.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={`${styles.chip} ${c.image ? "" : styles.chipPlain}`}
                      aria-current={c.active ? "page" : undefined}
                    >
                      {c.image && (
                        <span className={styles.chipThumb}>
                          <Image src={c.image} alt="" width={96} height={96} />
                        </span>
                      )}
                      <span className={styles.chipLabel}>{c.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        )}
      </header>

      <section className={styles.results} aria-label={`${title} products`}>
        {filterTaxonomy ? (
          <Suspense fallback={<p aria-busy="true">Loading eyewear...</p>}>
            <FilterableCatalogGrid products={products} taxonomy={filterTaxonomy} />
          </Suspense>
        ) : products.length === 0 ? (
          emptyState
        ) : (
          <CatalogGrid
            products={products}
            aside={
              spotlight && products.length <= 2 ? (
                <div className={styles.spot}>
                  <div className={styles.spotText}>
                    <div>
                      <p className={styles.spotKicker}>{spotlight.kicker}</p>
                      <h2 className={styles.spotTitle}>{spotlight.title}</h2>
                      <p className={styles.spotNote}>{spotlight.note}</p>
                    </div>
                    <div>
                      <p className={styles.spotLabel}>{spotlight.bestLabel}</p>
                      <p className={styles.spotBest}>{spotlight.best}</p>
                      <Link href={spotlight.ctaHref} className={styles.spotCta}>
                        {spotlight.ctaLabel} <IconArrow />
                      </Link>
                    </div>
                  </div>
                  <div className={styles.spotImg}>
                    <Image
                      src={spotlight.image}
                      alt={spotlight.imageAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  </div>
                </div>
              ) : undefined
            }
          />
        )}
      </section>

      {more.length > 0 && (
        <section className={`${styles.results} ${styles.more}`} aria-labelledby="more-title">
          <div className={styles.moreHead} data-reveal suppressHydrationWarning>
            <p className={styles.eyebrow}>Keep exploring</p>
            <h2 id="more-title" className={styles.h2}>
              {moreTitle}
            </h2>
          </div>
          <CatalogGrid products={more} showSort={false} />
        </section>
      )}

      <section className={styles.guide} aria-labelledby="guide-title">
        <div data-reveal suppressHydrationWarning>
          <p className={styles.eyebrow}>Buying guide</p>
          <h2 id="guide-title" className={styles.h2}>
            {guideTitle}
          </h2>
        </div>
        <div className={styles.guideText} data-reveal suppressHydrationWarning>
          {guide.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link href={guideLink.href} className={styles.guideLink}>
            {guideLink.label} <IconArrow />
          </Link>
        </div>
      </section>

      <Brands />
    </main>
  );
}
