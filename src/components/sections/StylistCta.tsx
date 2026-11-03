import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { IconWhatsapp } from "../footer/social-icons";
import { IconArrow, IconPhone } from "../navbar/icons";
import styles from "./StylistCta.module.css";

const { contact, social, policies } = siteConfig;

const facts = [
  { value: "UV400", label: "protection on our sunglasses" },
  { value: `${policies.returnWindowDays} days`, label: "to return unworn pieces" },
  { value: "UAE", label: "delivery to your door" },
];

/** Personal-advice call to action for the home page. Buttons that need a phone or WhatsApp number hide when none is set. */
export function StylistCta() {
  const whatsappHref = social.whatsapp
    ? `${social.whatsapp}${social.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(
        `Hello ${siteConfig.name}, I would like some help choosing a frame.`,
      )}`
    : "";
  const callHref = contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : "";

  return (
    <section className={styles.section} aria-labelledby="stylist-title">
      <div className={styles.card} data-reveal suppressHydrationWarning>
        <div className={styles.media}>
          <Image
            src="/images/gallery/golden-hour.webp"
            alt="Woman in a cream blazer holding tortoiseshell cat-eye sunglasses at golden hour"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            className={styles.photo}
          />
          <span className={styles.shade} aria-hidden="true" />
        </div>

        <div className={styles.panel}>
          <p className={styles.eyebrow}>Personal advice</p>
          <h2 id="stylist-title" className={styles.title}>
            Not sure which frame is yours?
          </h2>
          <p className={styles.text}>
            Tell us about your face shape, your days and your style. Our team will help you choose sunglasses, blue-cut
            glasses or eyeglasses that feel like you.
          </p>

          <div className={styles.actions}>
            {whatsappHref && (
              <a href={whatsappHref} className={styles.primary} target="_blank" rel="noopener noreferrer">
                <IconWhatsapp /> WhatsApp us
              </a>
            )}
            {callHref && (
              <a href={callHref} className={styles.secondary}>
                <IconPhone /> Call {contact.phone}
              </a>
            )}
            {!whatsappHref && !callHref && (
              <Link href="/contact" className={styles.primary}>
                Contact us <IconArrow />
              </Link>
            )}
          </div>

          <Link href="/shop" className={styles.browse}>
            Or browse the full collection <IconArrow />
          </Link>

          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.value} className={styles.fact}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
