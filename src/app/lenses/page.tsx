import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/page/PageKit";
import { lensGuides } from "@/lib/lenses";
import styles from "@/components/page/Page.module.css";

export const metadata: Metadata = {
  title: "Lens Guides",
  description:
    "Plain-language guides to lenses: blue-cut, anti-glare, single vision, progressive, photochromic and prescription blue-cut.",
  alternates: { canonical: "/lenses" },
};

export default function LensesPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Lens guides", href: "/lenses" },
        ]}
        eyebrow="Lens guides"
        title="Lenses, explained"
        intro="Choosing lenses should not feel like a puzzle. Our guides explain each option in plain language, including what it does and what it does not do."
      />

      <section className={styles.section}>
        <ul className={styles.linkCards} data-reveal="stagger" suppressHydrationWarning>
          {lensGuides.map((g) => (
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
        title="Prefer to talk it through?"
        text="Our team can help you choose lenses to suit your prescription, your screen time and your style."
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Shop eyeglasses", href: "/eyeglasses" }}
      />
    </main>
  );
}
