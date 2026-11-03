import Link from "next/link";
import { IconArrow } from "../navbar/icons";
import { ProductGrid } from "./ProductGrid";
import { getProducts, getProductTaxonomy } from "@/lib/catalog";
import styles from "./Products.module.css";

export async function Products() {
  const [products, taxonomy] = await Promise.all([getProducts(), getProductTaxonomy()]);
  return (
    <section className={styles.section} aria-labelledby="products-title">
      <div className={styles.head} data-reveal suppressHydrationWarning>
        <div>
          <p className={styles.eyebrow}>Featured eyewear</p>
          <h2 id="products-title" className={styles.title}>
            Our most loved sunglasses and frames
          </h2>
        </div>
      </div>

      <ProductGrid products={products} categories={taxonomy.categories} />

      <div className={styles.more} data-reveal suppressHydrationWarning>
        <Link href="/shop" className={styles.moreBtn}>
          View all products <IconArrow />
        </Link>
      </div>
    </section>
  );
}
