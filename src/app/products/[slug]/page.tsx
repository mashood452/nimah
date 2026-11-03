import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand, ProductShelf } from "@/components/page/PageKit";
import { ProductPlaceholder } from "@/components/products/ProductPlaceholder";
import { ProductPurchase } from "@/components/products/ProductPurchase";
import { getProduct, getProducts } from "@/lib/catalog";
import { productMetadata } from "@/lib/content-metadata";
import { categoryHref } from "@/lib/product-taxonomy";
import { mediaUrl } from "@/lib/media";
import { siteConfig } from "@/lib/site";
import styles from "@/components/products/Product.module.css";

type Params = { slug: string };

// New database slugs resolve at runtime. Unknown slugs return a true 404.
export const instant = false;

export async function generateStaticParams(): Promise<Params[]> {
  const products = await getProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__empty-catalog__" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return productMetadata(p);
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const products = await getProducts();
  const info = { description: p.description, features: p.features ?? [] };
  const category = { label: p.categoryLabel ?? p.category, href: p.categorySlug ? categoryHref(p.categorySlug) : "/shop" };

  // "You may also like": the same category first, then anything else
  const related = [
    ...products.filter((x) => x.slug !== p.slug && x.category === p.category),
    ...products.filter((x) => x.slug !== p.slug && x.category !== p.category),
  ].slice(0, 4);

  return (
    <main>
      <div className={styles.page}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: category.label, href: category.href },
            { name: p.name, href: `/products/${p.slug}` },
          ]}
        />

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.stage}>
              {p.image ? (
                <Image
                  src={mediaUrl(p.image)}
                  alt={p.imageAlt ?? `${p.name}, ${p.subtitle.toLowerCase()}`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              ) : (
                <span className={styles.stagePlaceholder}>
                  <ProductPlaceholder shape={p.shape} />
                </span>
              )}
              {p.badge && (
                <span className={styles.badge} data-kind={p.badge === "New" ? "new" : "best"}>
                  {p.badge}
                </span>
              )}
            </div>

            {info && (
              <ul className={styles.highlights}>
                {info.features.map((f, i) => (
                  <li key={f}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.eyebrow}>{p.categoryLabel ?? p.category}</p>
            <h1 className={styles.name}>{p.name}</h1>
            <p className={styles.subtitle}>{p.subtitle}</p>
            {info && <p className={styles.desc}>{info.description}</p>}

            <ProductPurchase product={p} />

            <div className={styles.acc}>
              <details className={styles.accItem} open>
                <summary>Details</summary>
                <div className={styles.accBody}>
                  <ul>
                    <li>Category: {p.categoryLabel ?? p.category}</li>
                    <li>Frame shape: {p.shapeLabel ?? p.shape.replace("-", " ")}</li>
                    {info?.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              </details>
              <details className={styles.accItem}>
                <summary>Care</summary>
                <div className={styles.accBody}>
                  <p>
                    Rinse the lenses with lukewarm water, then clean them with a microfibre cloth and a lens-safe
                    cleaner. Avoid wiping dry lenses with clothing or paper towels, and keep your glasses in their case
                    when you are not wearing them.
                  </p>
                </div>
              </details>
              <details className={styles.accItem}>
                <summary>Delivery and returns</summary>
                <div className={styles.accBody}>
                  <p>
                    We deliver to {siteConfig.policies.deliversTo}. Unworn items can be returned within{" "}
                    {siteConfig.policies.returnWindowDays} days of delivery.
                  </p>
                  <p>
                    Read our <Link href="/shipping">shipping policy</Link> and{" "}
                    <Link href="/returns">returns policy</Link> for the full details.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <ProductShelf
        eyebrow="Keep exploring"
        title="You may also like"
        products={related}
        href="/shop"
        hrefLabel="Shop all"
      />

      <CtaBand
        title="Need help choosing?"
        text="Our team can help you find the right shape, lens and fit."
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Read the FAQs", href: "/#faq" }}
      />
    </main>
  );
}
