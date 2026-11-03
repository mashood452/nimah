import Image from "next/image";
import Link from "next/link";
import { frameStyles as items } from "@/lib/styles";
import { IconArrow } from "../navbar/icons";
import styles from "./ShopByStyle.module.css";

export function ShopByStyle() {
  return (
    <section className={styles.section} aria-labelledby="style-title">
      <div className={styles.head} data-reveal suppressHydrationWarning>
        <div>
          <p className={styles.eyebrow}>Shop by style</p>
          <h2 id="style-title" className={styles.title}>
            Find the shape that suits your face
          </h2>
        </div>
        <Link href="/sunglasses" className={styles.all}>
          View all sunglasses <IconArrow />
        </Link>
      </div>

      <ul className={styles.grid} data-reveal="stagger" suppressHydrationWarning>
        {items.map((it) => (
          <li key={it.shape}>
            <Link href={`/sunglasses/${it.shape}`} className={styles.item}>
              <span className={styles.disc}>
                <span className={styles.ring} aria-hidden="true" />
                <span className={styles.photo}>
                  <Image
                    src={`/images/styles/${it.shape}.webp`}
                    alt={`${it.label} sunglasses, ${it.note.toLowerCase()} frame shape`}
                    width={800}
                    height={800}
                    sizes="(max-width: 600px) 45vw, (max-width: 1200px) 30vw, 240px"
                    className={styles.image}
                  />
                  <span className={styles.shade} aria-hidden="true" />
                </span>
                <span className={styles.cta} aria-hidden="true">
                  Shop now <IconArrow />
                </span>
              </span>
              <span className={styles.name}>{it.label}</span>
              <span className={styles.best}>Best for {it.best.toLowerCase()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
