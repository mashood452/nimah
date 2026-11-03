# MySQL setup

The app reads products and published journal articles from MySQL using a server-only connection pool. There is no hardcoded-content fallback. Run setup before starting or building the site.

1. Set `DATABASE_URL` in `.env.local`, using the real password from Hostinger. Encode password characters such as `@` as `%40`. Keep the URL out of Git and chat. Local/CI connections use `srv2060.hstgr.io:3306`; an app on the same Hostinger hosting account uses `localhost:3306`. Allowlist the connecting IP under hPanel → Databases → Remote MySQL.
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

## Tables

| Table | Purpose |
|---|---|
| `accounts` | Customer/admin identity, unique email and optional password hash |
| `account_addresses` | Saved addresses belonging to an account |
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

Only active products and published articles whose UTC publication timestamp has arrived appear publicly, including in the sitemap and generated routes. Content is cached with 60-second background revalidation and a 300-second expiration; database changes do not require a code edit or rebuild. A newly published article may appear after this cache window. Private account and order data is never queried by the public catalog.

The local upload script `node scripts/upload-media.mjs` uploads product and blog images to R2. It is a maintenance tool, not a public upload endpoint. Keep its API keys server-side. Product media already uploaded does not need reuploading during database setup.
