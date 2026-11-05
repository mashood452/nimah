import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { groups } from "@/lib/collections";
import { legalDocs } from "@/lib/legal";
import { lensGuides } from "@/lib/lenses";
import { siteConfig } from "@/lib/site";
import { frameStyles } from "@/lib/styles";
import { getProducts } from "@/lib/catalog";
import { connection } from "next/server";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * How often each kind of page really changes, so search engines know how often to come back:
 * the shop and new arrivals are updated every day, category and product pages within a week at most,
 * blog posts and guides about once a month, and the policies rarely.
 */
const DAILY: Frequency = "daily";
const WEEKLY: Frequency = "weekly";
const MONTHLY: Frequency = "monthly";
const YEARLY: Frequency = "yearly";

const page = (path: string, changeFrequency: Frequency) => ({ url: `${siteConfig.url}${path}`, changeFrequency });

/**
 * Every public page. Pages that should not be indexed (bag, wishlist, search, account) are left out on purpose.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);

  const daily = ["/shop", "/new-arrivals"];
  const weekly = [
    "",
    "/sunglasses",
    ...frameStyles.map((s) => `/sunglasses/${s.shape}`),
    ...groups.sunglasses.collections.map((c) => `/sunglasses/${c.slug}`),
    "/blue-light-glasses",
    ...groups["blue-light-glasses"].collections.map((c) => `/blue-light-glasses/${c.slug}`),
    "/eyeglasses",
    ...groups.eyeglasses.collections.map((c) => `/eyeglasses/${c.slug}`),
  ];
  const monthly = [
    "/contact-lenses",
    "/coloured-lenses",
    "/lenses",
    ...lensGuides.map((g) => `/lenses/${g.slug}`),
    "/blog",
    "/lookbook",
    "/about",
    "/contact",
  ];
  const yearly = legalDocs.map((d) => `/${d.slug}`);

  return [
    ...daily.map((path) => page(path, DAILY)),
    ...weekly.map((path) => page(path, WEEKLY)),
    ...monthly.map((path) => page(path, MONTHLY)),
    ...yearly.map((path) => page(path, YEARLY)),
    ...products.map((p) => ({ ...page(`/products/${p.slug}`, WEEKLY), lastModified: p.updatedAt })),
    ...posts.map((p) => ({ ...page(`/blog/${p.slug}`, MONTHLY), lastModified: p.updatedAt ?? p.date })),
  ];
}
