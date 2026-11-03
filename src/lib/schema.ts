// JSON-LD builders. Render the result with <JsonLd data={...} />.
// TODO: Organization, LocalBusiness/Optician, WebSite, Product, BreadcrumbList

/** FAQPage markup. The questions and answers must match the text that is visible on the page. */
export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** BreadcrumbList markup. `href` is a site-relative path such as "/sunglasses". */
export function breadcrumbSchema(crumbs: { name: string; href: string }[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${baseUrl}${c.href === "/" ? "" : c.href}`,
    })),
  };
}

/** Article markup for a blog post. `image` should be an absolute URL. */
export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  keywords?: string[];
  url: string;
  image: string;
  publisher: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    keywords: post.keywords?.join(", "),
    mainEntityOfPage: post.url,
    image: [post.image],
    author: { "@type": "Organization", name: post.publisher },
    publisher: { "@type": "Organization", name: post.publisher },
  };
}

