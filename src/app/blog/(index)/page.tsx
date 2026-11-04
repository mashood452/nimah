import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/navbar/icons";
import { CtaBand, PageHero } from "@/components/page/PageKit";
import { formatDate, getPosts } from "@/lib/blog";
import { mediaUrl } from "@/lib/media";
import styles from "@/components/blog/Blog.module.css";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Guides and advice from Nimah Opticals: blue light, screen glasses, sunglasses, lenses and choosing frames that suit you.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [featured, ...rest] = await getPosts();

  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/blog" },
        ]}
        eyebrow="The Journal"
        title="Eyewear, explained"
        intro="Plain-language guides to lenses, screens, sunglasses and style, written to help you choose with confidence."
      />

      <section className={styles.index}>
        {featured ? <Link href={`/blog/${featured.slug}`} className={styles.featured} data-reveal suppressHydrationWarning>
          <span className={styles.featuredImg}>
            <Image src={mediaUrl(featured.image)} alt={featured.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
          </span>
          <span className={styles.featuredText}>
            <span className={styles.eyebrow}>
              {featured.category}, {featured.readMinutes} min read
            </span>
            <span className={styles.featuredTitle}>{featured.title}</span>
            <span className={styles.featuredExcerpt}>{featured.excerpt}</span>
            <span className={styles.readLink}>
              Read the article <IconArrow />
            </span>
          </span>
        </Link> : <p>New articles are on their way. Check back soon.</p>}

        <ul className={styles.grid} data-reveal="stagger" suppressHydrationWarning>
          {rest.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className={styles.card}>
                <span className={styles.cardImg}>
                  <Image src={mediaUrl(p.image)} alt={p.imageAlt} fill sizes="(max-width: 600px) 100vw, 20vw" />
                </span>
                <span className={styles.cardBody}>
                  <span className={styles.eyebrow}>{p.category}</span>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardExcerpt}>{p.excerpt}</span>
                  <span className={styles.cardMeta}>
                    {formatDate(p.date)}, {p.readMinutes} min read
                  </span>
                  <span className={styles.readLink}>
                    Read the article <IconArrow />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Looking for something specific?"
        text="Browse our lens guides, or ask our team and we will point you in the right direction."
        primary={{ label: "Explore lens guides", href: "/lenses" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </main>
  );
}
