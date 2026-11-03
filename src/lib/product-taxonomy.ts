/** Public product classifications. IDs stay in MySQL; slugs are used by catalog filters. */
export type ProductCategoryTerm = { code: string; slug: string; name: string };
export type ProductShapeTerm = { slug: string; name: string };
export type ProductTaxonomy = { categories: ProductCategoryTerm[]; shapes: ProductShapeTerm[] };

export function categoryHref(slug: string) {
  return ["sunglasses", "blue-light-glasses", "eyeglasses"].includes(slug)
    ? `/${slug}`
    : `/shop?category=${encodeURIComponent(slug)}`;
}
