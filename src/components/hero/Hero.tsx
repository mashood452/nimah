import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "../navbar/icons";
import styles from "./Hero.module.css";

const quickLinks = [
  { label: "Sunglasses", note: "UV400 & polarized", href: "/sunglasses" },
  { label: "Blue-Cut Glasses", note: "For every screen", href: "/blue-light-glasses" },
  { label: "Eyeglasses", note: "Frames & lenses", href: "/eyeglasses" },
  { label: "Contact Lenses", note: "Daily to monthly", href: "/contact-lenses" },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Image
          src="/images/hero-nimah.webp"
          alt="A woman in cat-eye sunglasses and a man in optical frames, photographed in warm natural light"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.reveal}`} style={{ "--d": "0.1s" } as React.CSSProperties}>
            New season eyewear
          </p>
          <h1 id="hero-title" className={`${styles.title} ${styles.reveal}`} style={{ "--d": "0.25s" } as React.CSSProperties}>
            Luxury sunglasses <em>&amp; blue-cut eyewear</em>
          </h1>
          <p className={`${styles.lede} ${styles.reveal}`} style={{ "--d": "0.4s" } as React.CSSProperties}>
            Polarized UV400 sunglasses, blue-light glasses and refined optical frames, chosen to
            protect your eyes and finish your look. Delivered across the UAE.
          </p>
          <div className={`${styles.actions} ${styles.reveal}`} style={{ "--d": "0.55s" } as React.CSSProperties}>
            <Link href="/sunglasses" className={`${styles.btn} ${styles.btnPrimary}`}>
              Shop sunglasses <IconArrow />
            </Link>
            <Link href="/blue-light-glasses" className={`${styles.btn} ${styles.btnGhost}`}>
              Blue-cut glasses
            </Link>
          </div>
        </div>
      </div>

      <nav className={`${styles.quick} ${styles.reveal}`} style={{ "--d": "0.75s" } as React.CSSProperties} aria-label="Shop by category">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href} className={styles.quickItem}>
            <span>
              <span className={styles.quickNote}>{q.note}</span>
              <span className={styles.quickLabel}>{q.label}</span>
            </span>
            <IconArrow />
          </Link>
        ))}
      </nav>
    </section>
  );
}
