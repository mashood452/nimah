import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { groups } from "@/lib/collections";
import { legalDocs } from "@/lib/legal";
import { lensGuides } from "@/lib/lenses";
import { siteConfig } from "@/lib/site";
import { frameStyles } from "@/lib/styles";
import { getProducts } from "@/lib/catalog";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Every public page. Pages that should not be indexed (bag, wishlist, search, account) are left out on purpose.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("products", "blog-posts");
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const paths = [
    "",
    "/shop",
    "/new-arrivals",
    "/sunglasses",
    ...frameStyles.map((s) => `/sunglasses/${s.shape}`),
    ...groups.sunglasses.collections.map((c) => `/sunglasses/${c.slug}`),
    "/blue-light-glasses",
    ...groups["blue-light-glasses"].collections.map((c) => `/blue-light-glasses/${c.slug}`),
    "/eyeglasses",
    ...groups.eyeglasses.collections.map((c) => `/eyeglasses/${c.slug}`),
    "/contact-lenses",
    "/lenses",
    ...lensGuides.map((g) => `/lenses/${g.slug}`),
    "/blog",
    "/lookbook",
    "/about",
    "/contact",
    ...legalDocs.map((d) => `/${d.slug}`),
  ];
  return [
    ...paths.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...products.map((p) => ({ url: `${siteConfig.url}/products/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: `${siteConfig.url}/blog/${p.slug}`, lastModified: p.updatedAt ?? p.date })),
  ];
}
