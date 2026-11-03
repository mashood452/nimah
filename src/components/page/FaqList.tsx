import { faqPageSchema } from "@/lib/schema";
import { JsonLd } from "../seo/JsonLd";
import styles from "./Page.module.css";

/** Accordion of questions, with matching FAQPage structured data. Uses native details, so it works without JavaScript. */
export function FaqList({ items, group = "faq" }: { items: { q: string; a: string }[]; group?: string }) {
  return (
    <>
      <JsonLd data={faqPageSchema(items)} />
      <div className={styles.faq} data-reveal="stagger" suppressHydrationWarning>
        {items.map((it, i) => (
          <details key={it.q} className={styles.faqItem} name={group} open={i === 0}>
            <summary>{it.q}</summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
