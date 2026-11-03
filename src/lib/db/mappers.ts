import type { Product, ProductCategory } from "@/components/products/products-data";
import type { Post } from "../blog-types";
import type { DocSection } from "../legal/types";

type Row = Record<string, unknown>;

function jsonArray<T>(value: unknown, column: string): T[] {
  const parsed: unknown = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) throw new Error(`Invalid JSON array in ${column}.`);
  return parsed as T[];
}

export function mediaKey(value: unknown, folder: "products" | "blogs"): string {
  const key = String(value ?? "").replace(/^\/images\//, "");
  if (!key.startsWith(`${folder}/`) || key.includes("..") || /[\\?#\s]/.test(key)) {
    throw new Error(`Expected an R2 object key under ${folder}/.`);
  }
  return key;
}

const optional = (value: unknown): string | undefined => value == null || value === "" ? undefined : String(value);
const isoDateTime = (value: unknown): string => new Date(String(value).replace(" ", "T").replace(/Z?$/, "Z")).toISOString();

export function productFromRow(row: Row): Product {
  return {
    slug: String(row.slug), name: String(row.name), subtitle: String(row.subtitle),
    category: row.category as ProductCategory, categorySlug: optional(row.category_slug), categoryLabel: optional(row.category_label),
    price: Number(row.price), shape: row.shape as Product["shape"], shapeLabel: optional(row.shape_label),
    swatches: jsonArray<string>(row.swatches, "swatches"), badge: (row.badge ?? undefined) as Product["badge"],
    description: String(row.description), tags: jsonArray<string>(row.tags, "tags"), features: jsonArray<string>(row.features, "features"),
    image: row.thumbnail_key ? mediaKey(row.thumbnail_key, "products") : undefined, imageAlt: optional(row.thumbnail_alt),
    metaTitle: optional(row.meta_title), metaDescription: optional(row.meta_description), keywords: jsonArray<string>(row.keywords, "keywords"),
    updatedAt: isoDateTime(row.updated_at),
  };
}

export function postFromRow(row: Row): Post {
  return {
    slug: String(row.slug), title: String(row.title), excerpt: String(row.excerpt), category: String(row.category),
    date: isoDateTime(row.published_at), updatedAt: isoDateTime(row.updated_at), readMinutes: Number(row.read_minutes),
    image: mediaKey(row.thumbnail_key, "blogs"), imageAlt: String(row.thumbnail_alt),
    metaTitle: optional(row.meta_title), metaDescription: optional(row.meta_description), keywords: jsonArray<string>(row.keywords, "keywords"),
    takeaways: jsonArray<string>(row.takeaways, "takeaways"), sections: jsonArray<DocSection>(row.sections, "sections"),
    productTag: row.product_category ? { category: row.product_category as ProductCategory, tag: optional(row.product_tag) } : undefined,
  };
}
