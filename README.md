# Nimah Opticals (nimahopticals.com)

Next.js 16 (App Router, Cache Components) with TypeScript and CSS Modules. No UI framework.

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build
npm run lint     # eslint, should print nothing
node scripts/check-links.mjs   # crawls the running site and reports any internal link that is not a 200
```

## What to edit

| I want to change | Edit |
|---|---|
| Phone, email, address, hours, social links, currency, policy values (return window, delivery area) | `src/lib/site.ts` |
| Products, descriptions, features, filter tags, thumbnails and SEO | MySQL `products` table; see `database/README.md` |
| Collection pages (polarized, men, round, kids...) and category intros | `src/lib/collections.ts` |
| The six frame styles and their copy | `src/lib/styles.ts` |
| Lens guides | `src/lib/lenses.ts` |
| Journal articles, thumbnails and SEO | MySQL `blog_posts` table; see `database/README.md` |
| Privacy, terms, cookies, shipping and returns text | `src/lib/legal/*.ts` |
| Homepage FAQ | `src/components/faq/faq-data.ts` |
| Brand logos in the "Brands we carry" bar | `src/components/brands/brands-data.ts` (see below) |
| Lookbook and homepage gallery photos | `src/components/gallery/gallery-data.ts` |
| Navigation menus | `src/components/navbar/nav-data.ts` |
| Footer links | `src/components/footer/footer-data.ts` |
| Colours, page width, side padding | `src/app/globals.css` (`--nm-*`, `--container`, `--pad`) |

Legal pages are drafts. Have a lawyer review them, and confirm every value in `siteConfig.legal` and `siteConfig.policies`, before launch.

## Structure

Run the [database setup](database/README.md) before starting or building the site. The initial migration also prepares accounts, addresses, orders, order items and payments. Initial content lives in `database/seed-data.ts` and is imported only by the seed command.

```
src/app/                 routes (one folder per URL)
src/components/          navbar, hero, sections, catalog, products, shop (bag, wishlist, search),
                         page (shared page kit), lenses, brands, gallery, faq, footer, seo, motion
src/lib/                 content and helpers (site settings, catalog, collections, legal, schema.org builders)
scripts/                 maintenance scripts
public/                  images and brand assets
```

Useful building blocks: `Catalog` (any product listing page), `PageHero` / `CtaBand` / `ProductShelf` in
`components/page/PageKit.tsx`, `LegalDocument` (policy layout), `RevealOnScroll` (scroll fade-ins, opt in with
`data-reveal`).

## Brand logos

Original logos live in `docs/brand-logos-original/`. Run `node scripts/process-brand-logos.mjs` to produce the trimmed,
transparent versions in `public/images/brands/`, then list the brand in `brands-data.ts` with the width and height the
script prints. Logos are sized automatically so they all carry the same visual weight.

## SEO

Each page sets its own title, description and canonical URL. Breadcrumbs, FAQs and articles carry schema.org markup.
`/sitemap.xml` lists every public page (bag, wishlist, search and account are left out on purpose).
Product structured data is deliberately not added yet, because prices are placeholders.

## Good to know

- The bag and wishlist are saved in the browser (localStorage). There is no checkout yet: the bag page sends customers to
  the contact page.
- The contact form opens the visitor's email app (or WhatsApp) using the details in `siteConfig`. Until one is set, it
  tells visitors the form is being set up.
- Routes with dynamic segments set `export const instant = false` so that unknown URLs return a real 404.
- Google Analytics loads on every page. Consider a consent banner before launch.
