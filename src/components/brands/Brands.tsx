import Image from "next/image";
import Link from "next/link";
import { brands, type Brand } from "./brands-data";
import styles from "./Brands.module.css";

function BrandMark({ brand, index }: { brand: Brand; index: number }) {
  const inner = brand.logo ? (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={brand.width ?? 160}
      height={brand.height ?? 48}
      className={styles.logo}
      style={{
        width: `calc(${brand.displayWidth ?? 144}px * var(--logo-scale, 1))`,
        height: "auto",
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
