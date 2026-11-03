# MySQL setup

The app reads products and published journal articles from MySQL using a server-only connection pool. There is no hardcoded-content fallback. Run setup before serving the site. Production builds do not connect to MySQL: product/blog pages, the shared catalog provider and sitemap wait for a real request, then use cached database reads.

1. Set `DATABASE_URL` in `.env.local`, using the real password from Hostinger. Encode password characters such as `@` as `%40`, `%` as `%25` and `$` as `%24`. Keep the URL out of Git and chat. Local connections use `srv2060.hstgr.io:3306`; allowlist the connecting IP under hPanel → Databases → Remote MySQL. In Hostinger's deployment environment, set `DB_HOST=127.0.0.1` to override the remote hostname in the URL while preserving its credentials and database name. Hostinger's [Node.js/MySQL guide](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/) specifies IPv4 loopback for the hosted app. `localhost` is normalized to `127.0.0.1` by the connection helper to avoid resolving to `::1`.
2. Keep the existing `NEXT_PUBLIC_MEDIA_BASE_URL` and private R2 upload credentials. The database stores object keys such as `products/aurelia-aviator.webp` and `blogs/choose-sunglasses.webp`. The files stay in R2.
3. Run:

```sh
npm run db:migrate
npm run db:seed
npm run db:check
npm run test:db
npm run media:check
npm run build
```

Migrations use a database lock and record a checksum in `schema_migrations`. Add a new SQL migration for later schema changes; do not edit an applied migration. MySQL DDL commits immediately: if an initial migration is interrupted, inspect and resolve its partially created tables before retrying. Seed writes are transactional and skip existing slugs, preserving content edits on later runs. The seed imports the existing 12 sample products and 3 articles; review their placeholder product prices and copy before launch.

`DATABASE_SSL=true` enables certificate-verified TLS when supported by the database endpoint. Leave it false for a local connection or an endpoint without TLS support.

If a command reports `ER_ACCESS_DENIED_ERROR`, Hostinger is reachable but rejected authentication. Check the database user's password and database assignment, and add the source IP printed by the command to Remote MySQL. A `%` in the actual password must be encoded as `%25` in the URL; a `$` must be encoded as `%24` to avoid environment-variable expansion.

## Hostinger deployment

Keep the existing encoded `DATABASE_URL` in the deployment environment and add:

```dotenv
DB_HOST=127.0.0.1
```

Save the deployment environment and redeploy. Configure these variables in Hostinger, since the Git-ignored `.env.local` on your PC is not sent through GitHub. Keep `DB_HOST` empty or unset on your PC so it still uses the remote server. If you prefer changing `DATABASE_URL` instead, replace only its hostname with `127.0.0.1`, preserving the already-encoded password.

Database access is required at runtime even though builds succeed without it. The `npm run db:check` command verifies the deployment credentials and reports a rejected source host without printing passwords. Authentication errors do not mean migrations should be rerun. Only schema errors require `npm run db:migrate`.

With Cache Components enabled, product and blog routes omit `generateStaticParams` rather than returning an unsupported empty array. Database reads stay behind `connection()` before entering their `use cache` scopes. The root layout allows blocking runtime rendering because its shared catalog provider needs database data. Products, categories and articles retain their shared 60-second query revalidation.

Database-backed metadata resolves before response headers are sent. This keeps social/SEO metadata in the HTML head and lets missing product/article slugs return a real 404. The first request waits for the database, while subsequent requests reuse the shared query cache.

## Tables

| Table | Purpose |
|---|---|
| `accounts` | Customer/admin identity, unique email and optional password hash |
| `account_addresses` | Saved addresses belonging to an account |
| `product_categories` | Product types, public names, stable codes/slugs and display order |
| `product_shapes` | Frame shapes, public names and display order |
| `products` | Catalog, price, collection tags, stock, thumbnail and SEO fields |
| `product_images` | Additional R2 gallery keys and ordering, reserved for a future gallery UI |
| `blog_posts` | Article content, publication status/date, thumbnail and SEO fields |
| `orders` | Customer/contact and address snapshots, currency, totals and fulfillment state |
| `order_items` | Product/name/price snapshots, selected color and quantity |
| `payments` | Payment provider references, amounts and state; no card data |
| `schema_migrations` | Applied SQL filenames and checksums |

Account, order and payment tables are prepared for the future account/checkout flows. The current site still saves its bag and wishlist in the browser and sends order enquiries to the team. This change does not add registration, sign-in, checkout, payment processing, or an admin dashboard. No default administrator or password is seeded.

## Content columns

| Database column | Website use |
|---|---|
| `blog_posts.title` | Visible article heading and card title |
| `blog_posts.excerpt` | Visible article introduction and cards |
| `meta_title` | SEO, Open Graph and Twitter title; falls back to visible title |
| `meta_description` | SEO, Open Graph and Twitter description; falls back to excerpt/product description |
| `keywords` | JSON array of strings, emitted as metadata keywords (and Article keywords for blogs) |
| `thumbnail_key` | R2 object key used by cards, detail cover and social preview |
| `thumbnail_alt` | Cover/card image alt text and social preview alt text |
| `blog_posts.sections` | JSON array of `{id,title,body}` sections rendered by `DocBlocks` |
| `blog_posts.takeaways` | JSON array of summary strings |
| `published_at` | UTC publication timestamp; future articles stay hidden until this time |
| `updated_at` | Sitemap last modification and Article/Open Graph modification date |
| `products.tags` | JSON array driving collections and search |
| `products.features` | JSON array shown on product detail pages |
| `products.category_id` | Required foreign key to `product_categories` |
| `products.shape_id` | Required foreign key to `product_shapes` |
| `blog_posts.product_category_id` | Optional category for Shop the Story products |

Only active products and published articles whose UTC publication timestamp has arrived appear publicly, including in the sitemap and generated routes. Content is cached with 60-second background revalidation and a 300-second expiration; database changes do not require a code edit or rebuild. A newly published article may appear after this cache window. Private account and order data is never queried by the public catalog.

The local upload script `node scripts/upload-media.mjs` uploads product and blog images to R2. It is a maintenance tool, not a public upload endpoint. Keep its API keys server-side. Product media already uploaded does not need reuploading during database setup.

## Product categories and frame shapes

Migration `002_product_taxonomy.sql` converts the original category/shape enum columns into foreign keys and preserves the existing assignments. It also corrects the Ellis sample to Browline and Orion to Rectangle to match their descriptions. Product types and shapes remain separate, so a Round frame can be Sunglasses, Blue-Cut Glasses, or Eyeglasses.

The initial product categories are Sunglasses, Blue-Cut Glasses and Eyeglasses. Frame shapes are Aviator, Wayfarer, Round, Cat-Eye, Square, Oversized, Browline and Rectangle.

Choose `category_id` and `shape_id` when adding a product in MySQL/phpMyAdmin. Additional categories and shapes can be added to their tables without changing enums or TypeScript. Keep category `code` stable because existing collection pages and blog recommendations use it; edit `name` for the public label. Keep `slug` stable for saved filter URLs. Referenced categories and shapes cannot be deleted; set `is_active = 0` to hide a term and its products from the public catalog.

Shop All has category and shape dropdowns backed by these tables. Filter URLs such as `/shop?category=eyeglasses&shape=rectangle` can be bookmarked. New categories use `/shop?category=<slug>`; the original three also retain their dedicated landing pages. New shapes can always be filtered in Shop All; the six editorial sunglasses style pages retain their existing guides and photos.
