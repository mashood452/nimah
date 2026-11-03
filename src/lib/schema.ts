// JSON-LD builders. Render the result with <JsonLd data={...} />.
// TODO: LocalBusiness/Optician (needs a street address in siteConfig.contact), Product (needs real prices and stock)

type SiteFacts = {
  name: string;
  url: string;
  description: string;
  contact: { email: string; phone: string };
  social: Record<string, string>;
};

/** Organization and WebSite markup for the home page, linked together in one graph. */
export function homeSchema(site: SiteFacts) {
  const orgId = `${site.url}/#organization`;
  const profiles = (["instagram", "facebook", "tiktok"] as const).map((k) => site.social[k]).filter(Boolean);
  const contactPoint =
    site.contact.phone || site.contact.email
      ? [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(site.contact.phone && { telephone: site.contact.phone.replace(/\s+/g, "") }),
            ...(site.contact.email && { email: site.contact.email }),
            areaServed: "AE",
            availableLanguage: ["English"],
          },
        ]
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        url: site.url,
        description: site.description,
        logo: { "@type": "ImageObject", url: `${site.url}/brand/nimah-logo.png` },
        image: `${site.url}/og-image.jpg`,
        areaServed: "AE",
        ...(site.contact.email && { email: site.contact.email }),
        ...(site.contact.phone && { telephone: site.contact.phone.replace(/\s+/g, "") }),
        ...(contactPoint && { contactPoint }),
        ...(profiles.length > 0 && { sameAs: profiles }),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en",
        publisher: { "@id": orgId },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/** WebPage markup with an ItemList of what the page covers, for guide and category style pages. */
export function webPageSchema(page: {
  url: string;
  siteUrl: string;
  name: string;
  description: string;
  about: string;
  listName: string;
  items: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.name,
        description: page.description,
        inLanguage: "en",
        isPartOf: { "@id": `${page.siteUrl}/#website` },
        about: { "@type": "Thing", name: page.about },
        mainEntity: { "@id": `${page.url}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${page.url}#list`,
        name: page.listName,
        itemListElement: page.items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          description: it.description,
        })),
      },
    ],
  };
}

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

