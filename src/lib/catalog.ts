import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import type { ProductCategory } from "@/components/products/products-data";
import { queryRows } from "./db";
import { productFromRow } from "./db/mappers";
import { tagsOf } from "./catalog-filters";
import type { ProductTaxonomy } from "./product-taxonomy";

async function cachedProducts() {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("products", "product-taxonomy");
  const rows = await queryRows(`SELECT p.slug, p.name, p.subtitle, c.code AS category,
    c.slug AS category_slug, c.name AS category_label, p.price, s.slug AS shape, s.name AS shape_label,
    p.swatches, p.badge, p.description, p.tags, p.features, p.thumbnail_key, p.thumbnail_alt,
    p.meta_title, p.meta_description, p.keywords, p.updated_at
    FROM products p JOIN product_categories c ON c.id = p.category_id
    JOIN product_shapes s ON s.id = p.shape_id
    WHERE p.is_active = 1 AND c.is_active = 1 AND s.is_active = 1 ORDER BY p.sort_order, p.id`);
  return rows.map(productFromRow);
}

async function cachedProductTaxonomy(): Promise<ProductTaxonomy> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("product-taxonomy");
  const [categories, shapes] = await Promise.all([
    queryRows("SELECT code, slug, name FROM product_categories WHERE is_active = 1 ORDER BY sort_order, id"),
    queryRows("SELECT slug, name FROM product_shapes WHERE is_active = 1 ORDER BY sort_order, id"),
  ]);
  return {
    categories: categories.map((row) => ({ code: String(row.code), slug: String(row.slug), name: String(row.name) })),
    shapes: shapes.map((row) => ({ slug: String(row.slug), name: String(row.name) })),
  };
}

// Wait for a request before entering a cached scope, so builds never open MySQL connections.
export async function getProducts() {
  await connection();
  return cachedProducts();
}

export async function getProductTaxonomy(): Promise<ProductTaxonomy> {
  await connection();
  return cachedProductTaxonomy();
}

export const getProduct = async (slug: string) => (await getProducts()).find((product) => product.slug === slug);
export const inCategory = async (category: ProductCategory) => (await getProducts()).filter((product) => product.category === category);
export const withTag = async (category: ProductCategory, tag: string) => (await inCategory(category)).filter((product) => tagsOf(product).includes(tag));
export const newArrivals = async () => (await getProducts()).filter((product) => product.badge === "New");
