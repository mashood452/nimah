import assert from "node:assert/strict";
import { test } from "node:test";
import { products, posts, productInfo } from "../database/seed-data";
import { productFromRow, postFromRow, mediaKey } from "../src/lib/db/mappers";
import { productMetadata, postMetadata } from "../src/lib/content-metadata";
import { searchProducts } from "../src/lib/catalog-filters";
import { mediaUrl } from "../src/lib/media";
import { createDatabasePool } from "../src/lib/db/connection";

test("blog SEO columns stay distinct from article title, excerpt and thumbnail", () => {
  const post = postFromRow({
    slug: "article", title: "Visible article heading", excerpt: "Visible card excerpt", category: "Guide",
    published_at: "2026-11-01 06:30:00", updated_at: "2026-11-02 12:00:00", read_minutes: 4,
    thumbnail_key: "blogs/article.webp", thumbnail_alt: "Descriptive cover alt text",
    meta_title: "Search engine title", meta_description: "Search engine description", keywords: '["keyword one","keyword two"]',
    takeaways: '["Takeaway"]', sections: JSON.stringify(posts[0].sections), product_category: "Blue-Cut", product_tag: "computer",
  });
  const metadata = postMetadata(post);
  assert.equal(post.title, "Visible article heading");
  assert.equal(post.excerpt, "Visible card excerpt");
  assert.equal(metadata.title, "Search engine title");
  assert.equal(metadata.description, "Search engine description");
  assert.deepEqual(metadata.keywords, ["keyword one", "keyword two"]);
  assert.equal(post.date, "2026-11-01T06:30:00.000Z");
  assert.equal(post.updatedAt, "2026-11-02T12:00:00.000Z");
  assert.deepEqual(post.productTag, { category: "Blue-Cut", tag: "computer" });
  const graph = metadata.openGraph as { title: string; description: string; images: { url: string; alt: string }[]; modifiedTime: string };
  assert.equal(graph.title, metadata.title);
  assert.equal(graph.description, metadata.description);
  assert.ok(graph.images[0].url.endsWith("/blogs/article.webp"));
  assert.equal(graph.images[0].alt, "Descriptive cover alt text");
  assert.equal(graph.modifiedTime, post.updatedAt);
  assert.deepEqual((metadata.twitter as { images: unknown }).images, graph.images);
});

test("every seeded product survives the database column mapping and remains searchable", () => {
  const mapped = products.map((product) => {
    const info = productInfo[product.slug];
    return productFromRow({
      ...product, price: product.price.toFixed(2), swatches: JSON.stringify(product.swatches),
      description: info.description, tags: JSON.stringify(info.tags), features: JSON.stringify(info.features),
      thumbnail_key: mediaKey(product.image, "products"), thumbnail_alt: `${product.name} photograph`,
      meta_title: `SEO ${product.name}`, meta_description: `Description for ${product.name}`, keywords: [product.name],
      updated_at: "2026-11-03 00:00:00",
    });
  });
  for (const product of mapped) {
    assert.equal(typeof product.price, "number");
    assert.ok(product.image?.startsWith("products/"));
    assert.equal(productMetadata(product).title, `SEO ${product.name}`);
    assert.deepEqual(searchProducts(mapped, product.name).map((result) => result.slug), [product.slug]);
  }
  assert.deepEqual(searchProducts(mapped, "polarized sunglasses").map((product) => product.slug), ["aurelia-aviator", "marlowe-square"]);
  assert.deepEqual(searchProducts(mapped, "   "), []);
});

test("all seeded articles preserve body, thumbnail and publication mappings", () => {
  for (const post of posts) {
    const mapped = postFromRow({
      slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category,
      published_at: `${post.date} 00:00:00`, updated_at: `${post.date} 00:00:00`, read_minutes: post.readMinutes,
      thumbnail_key: mediaKey(post.image, "blogs"), thumbnail_alt: post.imageAlt, keywords: "[]",
      takeaways: JSON.stringify(post.takeaways), sections: JSON.stringify(post.sections),
    });
    assert.deepEqual(mapped.sections, post.sections);
    assert.deepEqual(mapped.takeaways, post.takeaways);
    assert.equal(mapped.imageAlt, post.imageAlt);
    const metadata = postMetadata(mapped);
    assert.equal(metadata.title, post.title);
    assert.equal(metadata.description, post.excerpt);
  }
});

test("R2 keys and legacy public paths resolve to the same media URL", () => {
  for (const folder of ["products", "blogs"] as const) {
    assert.equal(mediaUrl(`${folder}/photo.webp`), mediaUrl(`/images/${folder}/photo.webp`));
  }
  assert.equal(mediaUrl("/images/brands/logo.png"), "/images/brands/logo.png");
  assert.equal(mediaUrl(undefined), undefined);
  assert.throws(() => mediaKey("blogs/../../secret", "blogs"));
  assert.throws(() => mediaKey("products/other.webp", "blogs"));
  assert.throws(() => mediaKey("https://elsewhere.example/photo.webp", "products"));
});

test("connection setup rejects missing credentials without exposing the connection string", async () => {
  assert.throws(() => createDatabasePool({}), /Set DATABASE_URL/);
  assert.throws(() => createDatabasePool({ DATABASE_URL: "invalid-password-value" }), (error: Error) => !error.message.includes("invalid-password-value"));
  assert.throws(() => createDatabasePool({ DATABASE_URL: "mysql://test:raw%password@localhost:3306/nimah" }), /Percent-encode/);
  const pool = createDatabasePool({ DATABASE_URL: "mysql://test:encoded%40password@localhost:3306/nimah" });
  await pool.end();
});
