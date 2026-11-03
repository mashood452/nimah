import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { IconArrow } from "../navbar/icons";
import { ProductPlaceholder } from "../products/ProductPlaceholder";
import type { FrameShape } from "../products/products-data";
import { gallery } from "./gallery-data";
import styles from "./Gallery.module.css";

// a different frame outline per tile, so the placeholders feel like a styled set
const shapes: FrameShape[] = ["aviator", "wayfarer", "round", "cat-eye", "square", "oversized", "wayfarer"];

export function Gallery() {
  const instagram = siteConfig.social.instagram;

  return (
    <section className={styles.section} aria-labelledby="gallery-title">
      <div className={styles.head} data-reveal suppressHydrationWarning>
        <div>
          <p className={styles.eyebrow}>Gallery</p>
          <h2 id="gallery-title" className={styles.title}>
            Style inspiration from the Nimah lookbook
          </h2>
        </div>
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.all}>
            Follow on Instagram <IconArrow />
          </a>
        )}
      </div>

      <ul className={styles.grid} data-reveal="stagger" suppressHydrationWarning>
        {gallery.map((g, i) => (
          <li key={g.caption} className={styles.tile} data-tone={g.tone}>
            <figure className={styles.fig}>
              {g.src ? (
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes={i === 0 || i === 5
                    ? "(max-width: 900px) 100vw, (max-width: 1680px) 50vw, 800px"
                    : "(max-width: 900px) 50vw, (max-width: 1680px) 25vw, 400px"}
                  className={styles.photo}
                />
              ) : (
                <span className={styles.placeholder} aria-hidden="true">
                  <ProductPlaceholder shape={shapes[i % shapes.length]} />
                  <span className={styles.phIndex}>{String(i + 1).padStart(2, "0")}</span>
                </span>
              )}
              <span className={styles.shade} aria-hidden="true" />
              <figcaption className={styles.caption}>
                <span>{g.caption}</span>
                <IconArrow />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className={styles.foot} data-reveal suppressHydrationWarning>
        <Link href="/lookbook" className={styles.btn}>
          View the full lookbook <IconArrow />
        </Link>
      </div>
    </section>
  );
}
