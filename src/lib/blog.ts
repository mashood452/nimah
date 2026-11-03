import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { queryRows } from "./db";
import { postFromRow } from "./db/mappers";

export type { Post } from "./blog-types";

export async function getPosts() {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("blog-posts", "product-taxonomy");
  const rows = await queryRows(`SELECT b.slug, b.title, b.excerpt, b.category, b.published_at, b.updated_at, b.read_minutes,
    b.thumbnail_key, b.thumbnail_alt, b.meta_title, b.meta_description, b.keywords, b.takeaways, b.sections,
    c.code AS product_category, b.product_tag FROM blog_posts b
    LEFT JOIN product_categories c ON c.id = b.product_category_id AND c.is_active = 1
    WHERE b.status = 'published' AND b.published_at <= UTC_TIMESTAMP() ORDER BY b.published_at DESC, b.id DESC`);
  return rows.map(postFromRow);
}

export const getPost = async (slug: string) => (await getPosts()).find((post) => post.slug === slug);
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});
