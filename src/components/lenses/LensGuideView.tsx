import Link from "next/link";
import { getLensGuide, type LensGuide } from "@/lib/lenses";
import { Blocks } from "../page/DocBlocks";
import { FaqList } from "../page/FaqList";
import { CtaBand, PageHero, SectionHead } from "../page/PageKit";
import styles from "../page/Page.module.css";

/** One lens guide: facts card, contents, long-form sections, FAQs and related guides. */
export function LensGuideView({ guide }: { guide: LensGuide }) {
  const related = guide.related.flatMap((slug) => {
    const g = getLensGuide(slug);
    return g ? [g] : [];
  });

  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Lens guides", href: "/lenses" },
          { name: guide.label, href: `/lenses/${guide.slug}` },
        ]}
        eyebrow="Lens guide"
        title={guide.title}
        intro={guide.intro}
      />

      <section className={styles.section}>
        <div className={styles.split}>
          <aside className={styles.aside} aria-label="Summary">
            <div className={styles.glance}>
              <p className={styles.tocTitle}>At a glance</p>
              <dl>
                {guide.glance.map((g) => (
                  <div key={g.label}>
                    <dt>{g.label}</dt>
                    <dd>{g.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className={styles.tocTitle}>In this guide</p>
            <ol className={styles.toc}>
              {guide.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={styles.prose}>
            {guide.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <Blocks blocks={s.body} />
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionTint}`} aria-labelledby="lens-faq">
        <SectionHead eyebrow="Questions" title={`${guide.label} lenses, answered`} id="lens-faq" />
        <FaqList items={guide.faqs} group={`lens-${guide.slug}`} />
      </section>

      <section className={styles.section} aria-labelledby="lens-related">
        <SectionHead eyebrow="Keep reading" title="Related lens guides" id="lens-related" />
        <ul className={styles.linkCards} data-reveal="stagger" suppressHydrationWarning>
          {related.map((g) => (
            <li key={g.slug}>
              <Link href={`/lenses/${g.slug}`} className={styles.linkCard}>
                <h3>{g.title}</h3>
                <p>{g.intro}</p>
                <span>Read the guide</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        tone="dark"
        title="Not sure which lens is right for you?"
        text="Our team can talk you through the options and help you choose the lens and frame that suit how you live."
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Browse eyeglasses", href: "/eyeglasses" }}
      />
    </main>
  );
}
