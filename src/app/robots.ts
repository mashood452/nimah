import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Private pages (cart, wishlist, search, account) stay crawlable on purpose so their noindex tag can be read.
    // Only the API routes, which are not pages, are kept out.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
