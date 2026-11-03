import type { Product } from "@/components/products/products-data";

/** Browser-safe filters over the public products fetched by the server. */
export const tagsOf = (product: Product) => product.tags ?? [];

export function filterProducts(products: Product[], { category = "", shape = "" }: { category?: string; shape?: string }) {
  return products.filter((product) => (!category || product.categorySlug === category) && (!shape || product.shape === shape));
}

export function searchProducts(products: Product[], query: string) {
  const words = query.toLowerCase().split(/\s+/).map((word) => word.replace(/[^a-z0-9-]/g, "")).filter(Boolean);
  if (!words.length) return [];
  return products.filter((product) => {
    const haystack = [product.name, product.subtitle, product.category, product.categoryLabel ?? "", product.shape, product.shapeLabel ?? "", ...tagsOf(product), product.description ?? ""].join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
