import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "../navbar/icons";
import styles from "./Lifestyle.module.css";

const cards = [
  {
    eyebrow: "Bright days",
    title: "Sunglasses",
    text: "Polarized, UV400 and gradient lenses for sun-filled days.",
    cta: "Shop sunglasses",
    href: "/sunglasses",
    image: "/images/menu/sunglasses.webp",
    alt: "Woman wearing tortoiseshell sunglasses on a sunny terrace",
  },
  {
    eyebrow: "Screen time",
    title: "Blue-Cut Glasses",
    text: "Blue-cut lenses made for long hours at your laptop and phone.",
    cta: "Shop blue-cut glasses",
    href: "/blue-light-glasses",
    image: "/images/menu/blue-light.webp",
    alt: "Man wearing glasses while working on a laptop",
  },
  {
    eyebrow: "Every day",
    title: "Eyeglasses",
    text: "Refined optical frames for a look you can wear from morning to evening.",
    cta: "Shop eyeglasses",
    href: "/eyeglasses",
    image: "/images/menu/eyeglasses.webp",
    alt: "Woman wearing burgundy optical glasses",
  },
] as const;

export function Lifestyle() {
  return (
    <section className={styles.section} aria-labelledby="need-title">
      <div className={styles.head} data-reveal suppressHydrationWarning>
        <div>
          <p className={styles.eyebrow}>Shop by need</p>
          <h2 id="need-title" className={styles.title}>
            Eyewear for every part of your day
          </h2>
        </div>
        <Link href="/shop" className={styles.all}>
          View all eyewear <IconArrow />
        </Link>
      </div>

      <ul className={styles.grid} data-reveal="stagger" suppressHydrationWarning>
        {cards.map((c, i) => (
          <li key={c.title} className={styles.cell}>
            <Link href={c.href} className={styles.card}>
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                className={styles.image}
              />
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.tag} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.body}>
                <span className={styles.kicker}>{c.eyebrow}</span>
                <span className={styles.name}>{c.title}</span>
                <span className={styles.text}>{c.text}</span>
                <span className={styles.cta}>
                  {c.cta} <IconArrow />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
