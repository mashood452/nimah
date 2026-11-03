import Link from "next/link";
import { faqPageSchema } from "@/lib/schema";
import { JsonLd } from "../seo/JsonLd";
import { IconArrow } from "../navbar/icons";
import { faqs } from "./faq-data";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <JsonLd data={faqPageSchema(faqs)} />

      <div className={styles.intro} data-reveal suppressHydrationWarning>
        <p className={styles.eyebrow}>Eyewear guide</p>
        <h2 id="faq-title" className={styles.title}>
          Eyewear questions, answered
        </h2>
        <p className={styles.lede}>
          Straight answers on lenses, UV protection and choosing the right frame, so you can shop with confidence.
        </p>
        <Link href="/contact" className={styles.cta}>
          Ask our team <IconArrow />
        </Link>
      </div>

      <div className={styles.list} data-reveal="stagger" suppressHydrationWarning>
        {faqs.map((item, i) => (
          <details key={item.q} className={styles.item} name="faq" open={i === 0}>
            <summary className={styles.summary}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.question}>{item.q}</span>
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
