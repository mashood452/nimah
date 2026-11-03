import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/page/PageKit";
import about from "@/components/page/About.module.css";
import styles from "@/components/page/Page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nimah Opticals brings together sunglasses, blue-cut glasses and optical frames chosen for shape, comfort and protection, with honest, plain-language advice.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Protection first",
    text: "Good eyewear should look beautiful and look after your eyes. UV400 protection is our baseline for sunglasses, and we explain every lens option honestly.",
  },
  {
    title: "Considered design",
    text: "We choose frames for their shape, finish and fit, so each pair feels as good to wear as it looks.",
  },
  {
    title: "Plain-language advice",
    text: "We explain lenses clearly, including what they do and what they do not do, so you can choose with confidence.",
  },
  {
    title: "Support you can reach",
    text: "Questions before you buy, help with fit, or a return afterwards: our team is here for all of it.",
  },
];

const steps = [
  { title: "Choose a shape", text: "Start with the frame shapes that suit your face and your style." },
  { title: "Choose your lenses", text: "Pick the lens that fits your day, from UV400 sunglasses to blue-cut or prescription lenses." },
  { title: "Check the fit", text: "A frame should sit comfortably and stay put. We help you get it right." },
  { title: "Wear and enjoy", text: "Look after them well, and come back to us whenever you need advice or an adjustment." },
];

const trio = [
  { src: "/images/menu/sunglasses.webp", alt: "Woman wearing tortoiseshell sunglasses on a sunny terrace", name: "Sun", tag: "Sunglasses", href: "/sunglasses" },
  { src: "/images/menu/blue-light.webp", alt: "Man wearing glasses while working on a laptop", name: "Screen", tag: "Blue-cut glasses", href: "/blue-light-glasses" },
  { src: "/images/menu/eyeglasses.webp", alt: "Woman wearing burgundy optical glasses", name: "Every day", tag: "Eyeglasses", href: "/eyeglasses" },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        eyebrow="About Nimah"
        title="Eyewear chosen with care"
        intro="Nimah Opticals brings together sunglasses, blue-cut glasses and optical frames, chosen for how they look, how they fit and how well they look after your eyes."
      />

      <section className={styles.section}>
        <p className={about.statement} data-reveal suppressHydrationWarning>
          We believe good eyewear should feel effortless: <em>right for your face</em>, right for your day and explained
          in words that make sense.
        </p>
      </section>

      <section className={`${styles.section} ${styles.sectionTint}`} aria-labelledby="about-trio">
        <SectionHead eyebrow="What we do" title="Eyewear for every part of your day" id="about-trio" />
        <ul className={about.trio} data-reveal="stagger" suppressHydrationWarning>
          {trio.map((t) => (
            <li key={t.name}>
              <Link href={t.href} className={about.fig}>
                <span className={about.figImg}>
                  <Image src={t.src} alt={t.alt} fill sizes="(max-width: 900px) 100vw, 30vw" />
                </span>
                <span className={about.figCaption}>
                  <strong>{t.name}</strong>
                  <span>{t.tag}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="about-values">
        <SectionHead eyebrow="What we stand for" title="Four things we care about" id="about-values" />
        <ul className={styles.cards} style={{ ["--cols" as string]: 2 }} data-reveal="stagger" suppressHydrationWarning>
          {values.map((v, i) => (
            <li key={v.title} className={styles.card}>
              <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardText}>{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.section} ${styles.sectionTint}`} aria-labelledby="about-steps">
        <SectionHead eyebrow="How we help" title="From first look to the perfect fit" id="about-steps" />
        <ol className={styles.steps} data-reveal="stagger" suppressHydrationWarning>
          {steps.map((s) => (
            <li key={s.title}>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardText} style={{ marginTop: 10 }}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        tone="dark"
        title="Find the frame that is yours"
        text="Explore the collection, or talk to our team and we will help you choose."
        primary={{ label: "Shop all eyewear", href: "/shop" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </main>
  );
}
