import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { createDatabasePool } from "../src/lib/db/connection";
import { mediaKey, postFromRow, productFromRow } from "../src/lib/db/mappers";
import { posts, products, productInfo } from "../database/seed-data";

loadEnvConfig(process.cwd());

async function migrate(db: Pool) {
  const connection = await db.getConnection();
  try {
    const [lock] = await connection.query<RowDataPacket[]>("SELECT GET_LOCK('nimah_schema_migrations', 15) AS acquired");
    if (lock[0].acquired !== 1) throw new Error("Another database migration is running.");
    await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(191) NOT NULL PRIMARY KEY, checksum CHAR(64) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    const folder = path.join(process.cwd(), "database/migrations");
    const files = (await readdir(folder)).filter((file) => file.endsWith(".sql")).sort();
    for (const file of files) {
      const sql = await readFile(path.join(folder, file), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const [existing] = await connection.execute<RowDataPacket[]>("SELECT checksum FROM schema_migrations WHERE version = ?", [file]);
      if (existing.length) {
        if (existing[0].checksum !== checksum) throw new Error(`Applied migration ${file} has changed; add a new migration instead.`);
        console.log(`Already applied: ${file}`);
        continue;
      }
      // Each checked-in statement is executed separately; multi-statement connections stay disabled.
      const statements = sql.replace(/^\s*--.*$/gm, "").split(";").map((statement) => statement.trim()).filter(Boolean);
      for (const statement of statements) await connection.query(statement);
      await connection.execute("INSERT INTO schema_migrations (version, checksum) VALUES (?, ?)", [file, checksum]);
      console.log(`Applied: ${file}`);
    }
  } finally {
    await connection.query("SELECT RELEASE_LOCK('nimah_schema_migrations')").catch(() => {});
    connection.release();
  }
}

const articleKeywords: Record<string, string[]> = {
  "what-is-blue-light": ["blue light", "blue-cut glasses", "digital eye strain", "screen eye comfort"],
  "choosing-screen-glasses": ["computer glasses", "screen glasses", "anti-glare lenses", "blue-cut lenses"],
  "choose-sunglasses": ["sunglasses", "face shape", "UV400", "polarized sunglasses"],
};

async function seed(db: Pool) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [categories] = await connection.query<RowDataPacket[]>("SELECT id, code FROM product_categories");
    const [shapes] = await connection.query<RowDataPacket[]>("SELECT id, slug FROM product_shapes");
    const categoryIds = new Map(categories.map((category) => [String(category.code), category.id]));
    const shapeIds = new Map(shapes.map((shape) => [String(shape.slug), shape.id]));
    for (const [index, product] of products.entries()) {
      const info = productInfo[product.slug];
      const categoryId = categoryIds.get(product.category);
      const shapeId = shapeIds.get(product.shape);
      if (!categoryId || !shapeId) throw new Error(`Missing category or shape for seed product ${product.slug}. Run db:migrate first.`);
      await connection.execute(`INSERT INTO products
        (slug, name, subtitle, category_id, price, shape_id, swatches, badge, description, tags, features,
         thumbnail_key, thumbnail_alt, meta_title, meta_description, keywords, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE slug = slug`, [
        product.slug, product.name, product.subtitle, categoryId, product.price, shapeId,
        JSON.stringify(product.swatches), product.badge ?? null, info.description, JSON.stringify(info.tags), JSON.stringify(info.features),
        product.image ? mediaKey(product.image, "products") : null, `${product.name}, ${product.subtitle.toLowerCase()}`,
        `${product.name}: ${product.subtitle}`, info.description, JSON.stringify([product.name, product.category, ...info.tags]), index,
      ]);
    }
    for (const post of posts) {
      await connection.execute(`INSERT INTO blog_posts
        (slug, title, excerpt, category, published_at, status, read_minutes, thumbnail_key, thumbnail_alt,
         meta_title, meta_description, keywords, takeaways, sections, product_category_id, product_tag)
        VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE slug = slug`, [
        post.slug, post.title, post.excerpt, post.category, `${post.date} 00:00:00`, post.readMinutes,
        mediaKey(post.image, "blogs"), post.imageAlt, post.title, post.excerpt,
        JSON.stringify(articleKeywords[post.slug] ?? []), JSON.stringify(post.takeaways), JSON.stringify(post.sections),
        post.productTag ? categoryIds.get(post.productTag.category) ?? null : null, post.productTag?.tag ?? null,
      ]);
    }
    await connection.commit();
    console.log(`Seed complete: ${products.length} product and ${posts.length} article slugs ensured; existing content preserved.`);
    console.log("Accounts, orders and payments are left empty. No default passwords are created.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

async function check(db: Pool) {
  await db.query("SELECT 1");
  const tables = ["accounts", "account_addresses", "product_categories", "product_shapes", "products", "product_images", "blog_posts", "orders", "order_items", "payments"];
  for (const table of tables) {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${table}`);
    console.log(`${table}: ${rows[0].total} rows`);
  }
  const [productRows] = await db.query<RowDataPacket[]>(`SELECT p.*, c.code AS category, c.slug AS category_slug,
    c.name AS category_label, s.slug AS shape, s.name AS shape_label FROM products p
    JOIN product_categories c ON c.id = p.category_id JOIN product_shapes s ON s.id = p.shape_id`);
  const [blogRows] = await db.query<RowDataPacket[]>(`SELECT b.*, c.code AS product_category FROM blog_posts b
    LEFT JOIN product_categories c ON c.id = b.product_category_id WHERE b.published_at IS NOT NULL`);
  productRows.forEach(productFromRow);
  blogRows.forEach(postFromRow);
  console.log("Product and blog column mappings validated, including category and shape relationships.");
}

async function main() {
  let db: Pool | undefined;
  try {
    const command = process.argv[2];
    if (!["migrate", "seed", "check"].includes(command)) throw new Error("Usage: tsx scripts/db.ts migrate|seed|check");
    db = createDatabasePool();
    if (command === "migrate") await migrate(db);
    if (command === "seed") await seed(db);
    if (command === "check") await check(db);
  } catch (error) {
    // Do not print driver messages, SQL, connection URLs or passwords.
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
    console.error(code ? `Database command failed (${code}). Check credentials, Remote MySQL allowlisting and schema.` : error instanceof Error ? error.message : "Database command failed.");
    if (code === "ER_ACCESS_DENIED_ERROR" && error instanceof Error) {
      const sourceHost = error.message.match(/Access denied for user '[^']+'@'([^']+)'/)?.[1];
      if (sourceHost) console.error(`Hostinger rejected source host ${sourceHost}. Verify the password, database-user assignment and Remote MySQL allowlist.`);
    }
    process.exitCode = 1;
  } finally { await db?.end(); }
}

void main();
