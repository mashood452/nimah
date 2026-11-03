import assert from "node:assert/strict";
import { test } from "node:test";
import { products, posts, productInfo } from "../database/seed-data";
import { productFromRow, postFromRow, mediaKey } from "../src/lib/db/mappers";
import { productMetadata, postMetadata } from "../src/lib/content-metadata";
import { filterProducts, searchProducts } from "../src/lib/catalog-filters";
import { categoryHref } from "../src/lib/product-taxonomy";
import { mediaUrl } from "../src/lib/media";
import { createDatabasePool, databaseConnectionOptions } from "../src/lib/db/connection";
import { databaseErrorMessage } from "../src/lib/db/errors";

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
      category_slug: product.category === "Blue-Cut" ? "blue-light-glasses" : product.category.toLowerCase(),
      category_label: product.category === "Blue-Cut" ? "Blue-Cut Glasses" : product.category,
      shape_label: product.shape === "rectangle" ? "Rectangle" : product.shape,
      description: info.description, tags: JSON.stringify(info.tags), features: JSON.stringify(info.features),
      thumbnail_key: mediaKey(product.image, "products"), thumbnail_alt: `${product.name} photograph`,
      meta_title: `SEO ${product.name}`, meta_description: `Description for ${product.name}`, keywords: [product.name],
      updated_at: "2026-11-03 00:00:00",
    });
  });
  for (const product of mapped) {
    assert.equal(typeof product.price, "number");
    assert.ok(product.categorySlug);
    assert.ok(product.categoryLabel);
    assert.ok(product.shapeLabel);
    assert.ok(product.image?.startsWith("products/"));
    assert.equal(productMetadata(product).title, `SEO ${product.name}`);
    assert.deepEqual(searchProducts(mapped, product.name).map((result) => result.slug), [product.slug]);
  }
  assert.deepEqual(searchProducts(mapped, "polarized sunglasses").map((product) => product.slug), ["aurelia-aviator", "marlowe-square"]);
  assert.deepEqual(searchProducts(mapped, "   "), []);
});

test("category and shape filters combine independently, including optical frame shapes", () => {
  const catalog = products.map((product) => ({ ...product,
    categorySlug: product.category === "Blue-Cut" ? "blue-light-glasses" : product.category.toLowerCase(),
  }));
  const slugs = (category: string, shape: string) => filterProducts(catalog, { category, shape }).map((product) => product.slug);
  assert.equal(filterProducts(catalog, {}).length, 12);
  assert.equal(slugs("sunglasses", "").length, 6);
  assert.equal(slugs("blue-light-glasses", "").length, 3);
  assert.deepEqual(slugs("sunglasses", "round"), ["luna-round"]);
  assert.deepEqual(slugs("eyeglasses", "browline"), ["ellis-optical"]);
  assert.deepEqual(slugs("eyeglasses", "rectangle"), ["orion-optical"]);
  assert.deepEqual(slugs("blue-light-glasses", "aviator"), []);
  assert.deepEqual(slugs("unavailable", ""), []);
});

test("new categories work through shop filters without needing another route", () => {
  assert.equal(categoryHref("sunglasses"), "/sunglasses");
  assert.equal(categoryHref("blue-light-glasses"), "/blue-light-glasses");
  assert.equal(categoryHref("sports-eyewear"), "/shop?category=sports-eyewear");
  const custom = { ...products[0], category: "Sports", categorySlug: "sports-eyewear", categoryLabel: "Sports Eyewear", shape: "wraparound", shapeLabel: "Wraparound" };
  assert.deepEqual(filterProducts([custom], { category: "sports-eyewear", shape: "wraparound" }), [custom]);
  assert.deepEqual(searchProducts([custom], "sports eyewear wraparound"), [custom]);
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

test("deployment host overrides preserve URL credentials and avoid localhost IPv6 resolution", () => {
  const env = { DATABASE_URL: "mysql://test:encoded%25%40%24password@srv2060.hstgr.io:3306/nimah" };
  const local = databaseConnectionOptions(env);
  const production = databaseConnectionOptions({ ...env, DB_HOST: "127.0.0.1" });
  assert.equal(local.host, "srv2060.hstgr.io");
  assert.equal(production.host, "127.0.0.1");
  assert.equal(production.password, "encoded%@$password");
  assert.equal(production.user, local.user);
  assert.equal(production.database, local.database);
  assert.equal(databaseConnectionOptions({ ...env, DB_HOST: "localhost" }).host, "127.0.0.1");
  assert.equal(databaseConnectionOptions({ DATABASE_URL: "mysql://test:password@localhost:3306/nimah" }).host, "127.0.0.1");
  assert.throws(() => databaseConnectionOptions({ ...env, DB_HOST: "https://wrong.example" }), /DB_HOST must be/);
});

test("database diagnostics identify rejected source hosts without disclosing driver secrets", () => {
  const error = Object.assign(new Error("Access denied for user 'private-user'@'203.0.113.20' (using password: YES). mysql://private-user:private-password@example.test/private-db SELECT secret"), { code: "ER_ACCESS_DENIED_ERROR" });
  const diagnostic = databaseErrorMessage(error);
  assert.ok(diagnostic.includes("203.0.113.20"));
  assert.ok(diagnostic.includes("DB_HOST=127.0.0.1"));
  for (const secret of ["private-user", "private-password", "private-db", "SELECT secret", "mysql://"]) {
    assert.ok(!diagnostic.includes(secret));
  }
  assert.ok(!diagnostic.includes("db:migrate"));
  assert.ok(databaseErrorMessage({ code: "ER_NO_SUCH_TABLE" }).includes("db:migrate"));
});
