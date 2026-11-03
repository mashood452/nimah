import type { Metadata } from "next";
import Link from "next/link";
import { legalDocs, legalLastUpdated, type LegalDoc } from "@/lib/legal";
import { Blocks } from "./DocBlocks";
import { CtaBand, PageHero } from "./PageKit";
import styles from "./Page.module.css";

export const legalMetadata = (doc: LegalDoc): Metadata => ({
  title: doc.title,
  description: doc.metaDescription,
  alternates: { canonical: `/${doc.slug}` },
});

/** A policy page: heading, policy switcher, table of contents and numbered sections. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: doc.title, href: `/${doc.slug}` },
        ]}
        eyebrow="Legal"
        title={doc.title}
        intro={doc.intro}
        meta={<span>Last updated {legalLastUpdated}</span>}
      >
        <nav aria-label="Policies" className={styles.policyNav}>
          {legalDocs.map((d) => (
            <Link key={d.slug} href={`/${d.slug}`} aria-current={d.slug === doc.slug ? "page" : undefined}>
              {d.label}
            </Link>
          ))}
        </nav>
      </PageHero>

      <section className={styles.section}>
        <div className={styles.split}>
          <aside className={styles.aside} aria-label="On this page">
            <p className={styles.tocTitle}>On this page</p>
            <ol className={styles.toc}>
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={styles.prose}>
            {doc.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>
                  {i + 1}. {s.title}
                </h2>
                <Blocks blocks={s.body} />
              </section>
            ))}
          </article>
        </div>
      </section>

      <CtaBand
        title="Questions about this policy?"
        text="Our team is happy to explain anything in plain language."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Eyewear FAQs", href: "/#faq" }}
      />
    </main>
  );
}
