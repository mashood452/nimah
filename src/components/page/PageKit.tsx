import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { IconArrow } from "../navbar/icons";
import { JsonLd } from "../seo/JsonLd";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../products/products-data";
import styles from "./Page.module.css";

export type Crumb = { name: string; href: string };

/** Breadcrumb trail, plus matching structured data for search engines. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, siteConfig.url)} />
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
    </>
  );
}

/** The header band that opens every content page. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  meta,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className={styles.hero}>
      <Breadcrumbs crumbs={crumbs} />
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {intro && <p className={styles.intro}>{intro}</p>}
      {meta && <div className={styles.meta}>{meta}</div>}
      {children}
    </header>
  );
}

/** Section heading used inside content pages. */
export function SectionHead({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  id?: string;
}) {
  return (
    <div className={styles.sectionHead} data-reveal suppressHydrationWarning>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={id} className={styles.h2}>
        {title}
      </h2>
      {text && <p className={styles.lead}>{text}</p>}
    </div>
  );
}

/** A band with a heading and one or two buttons, used to close a page. */
export function CtaBand({
  title,
  text,
  primary,
  secondary,
  tone = "light",
}: {
  title: string;
  text?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "light" | "dark";
}) {
  return (
    <section className={`${styles.cta} ${tone === "dark" ? styles.ctaDark : ""}`} data-reveal suppressHydrationWarning>
      <div>
        <h2 className={styles.ctaTitle}>{title}</h2>
        {text && <p className={styles.ctaText}>{text}</p>}
      </div>
      <div className={styles.ctaActions}>
        <Link href={primary.href} className={styles.btnPrimary}>
          {primary.label} <IconArrow />
        </Link>
        {secondary && (
          <Link href={secondary.href} className={styles.btnGhost}>
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}

/** A friendly message for pages with nothing to show yet. */
export function EmptyState({
  title,
  text,
  actions,
}: {
  title: string;
  text: string;
  actions?: { label: string; href: string; ghost?: boolean }[];
}) {
  return (
    <div className={styles.empty}>
      <svg className={styles.emptyArt} viewBox="0 0 240 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M34 30 Q68 22 102 30 Q108 60 86 76 Q64 84 46 68 Q30 52 34 30 Z" fill="currentColor" fillOpacity="0.06" />
        <g transform="translate(240 0) scale(-1 1)">
          <path d="M34 30 Q68 22 102 30 Q108 60 86 76 Q64 84 46 68 Q30 52 34 30 Z" fill="currentColor" fillOpacity="0.06" />
        </g>
        <path d="M104 36 Q120 28 136 36 M106 44 Q120 38 134 44" />
        <path d="M26 38 L6 34 M214 38 L234 34" />
      </svg>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyText}>{text}</p>
      {actions && (
        <div className={styles.emptyActions}>
          {actions.map((a) => (
            <Link key={a.href + a.label} href={a.href} className={a.ghost ? styles.btnGhost : styles.btnPrimary}>
              {a.label}
              {!a.ghost && <IconArrow />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** A row of product cards with a heading, for "you may also like" areas. */
export function ProductShelf({
  eyebrow,
  title,
  products,
  href,
  hrefLabel,
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
  hrefLabel?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className={styles.shelf} aria-label={title}>
      <div className={styles.shelfHead} data-reveal suppressHydrationWarning>
        <div>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.h2}>{title}</h2>
        </div>
        {href && (
          <Link href={href} className={styles.textLink}>
            {hrefLabel ?? "View all"} <IconArrow />
          </Link>
        )}
      </div>
      <ul className={styles.shelfGrid} data-reveal="stagger" suppressHydrationWarning>
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
