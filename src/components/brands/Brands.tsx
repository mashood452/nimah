import Image from "next/image";
import Link from "next/link";
import { brands, type Brand } from "./brands-data";
import styles from "./Brands.module.css";

// Optical sizing: every logo gets about the same visual weight (area), whatever its shape.
// A very wide wordmark ends up wide and short, a stacked emblem narrow and tall, and both look equally prominent.
const AREA = 6500; // css px squared
const MAX_W = 180;
const MAX_H = 52;

function opticalSize(naturalW: number, naturalH: number) {
  const aspect = naturalW / naturalH;
  let h = Math.sqrt(AREA / aspect);
  let w = aspect * h;
  if (w > MAX_W) {
    w = MAX_W;
    h = w / aspect;
  }
  if (h > MAX_H) {
    h = MAX_H;
    w = h * aspect;
  }
  return { w: Math.round(w), h: Math.round(h) };
}

function BrandMark({ brand, index }: { brand: Brand; index: number }) {
  const size = brand.logo ? opticalSize(brand.width ?? 160, brand.height ?? 48) : null;
  const inner = brand.logo && size ? (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={brand.width ?? 160}
      height={brand.height ?? 48}
      className={styles.logo}
      style={{
        width: `calc(${size.w}px * var(--logo-scale, 1))`,
        height: `calc(${size.h}px * var(--logo-scale, 1))`,
      }}
    />
  ) : (
    <span className={styles.slot}>
      <span className={styles.slotIndex}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.slotName}>{brand.name}</span>
    </span>
  );

  return brand.href ? (
    <Link href={brand.href} className={styles.item} aria-label={brand.name}>
      {inner}
    </Link>
  ) : (
    <span className={styles.item}>{inner}</span>
  );
}

export function Brands() {
  return (
    <section className={styles.section} aria-labelledby="brands-title" data-reveal suppressHydrationWarning>
      <p id="brands-title" className={styles.label}>
        Brands we carry
      </p>

      <div className={styles.viewport}>
        <ul className={styles.track}>
          {brands.map((b, i) => (
            <li key={b.name}>
              <BrandMark brand={b} index={i} />
            </li>
          ))}
          {/* second copy makes the loop seamless; hidden from assistive tech and crawlers of the list */}
          {brands.map((b, i) => (
            <li key={`${b.name}-copy`} aria-hidden="true" className={styles.copy}>
              <BrandMark brand={{ ...b, href: undefined }} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
