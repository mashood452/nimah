import type { Metadata } from "next";
import type { Post } from "./blog-types";
import type { Product } from "@/components/products/products-data";
import { absoluteMediaUrl } from "./media";
import { siteConfig } from "./site";

export function postMetadata(post: Post): Metadata {
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const images = [{ url: absoluteMediaUrl(post.image, siteConfig.url), alt: post.imageAlt }];
  return {
    title, description, keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title, description, url, publishedTime: post.date, modifiedTime: post.updatedAt, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function productMetadata(product: Product): Metadata {
  const title = product.metaTitle ?? `${product.name}: ${product.subtitle}`;
  const description = product.metaDescription ?? product.description;
  const images = product.image ? [{ url: absoluteMediaUrl(product.image, siteConfig.url), alt: product.imageAlt ?? product.name }] : undefined;
  return {
    title, description, keywords: product.keywords,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { type: "website", title, description, url: `${siteConfig.url}/products/${product.slug}`, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
