import { siteConfig } from "@/lib/site";
import { IconWhatsapp } from "../footer/social-icons";
import styles from "./FloatingContact.module.css";

/** Round WhatsApp and call buttons fixed to the bottom corner of every page. Each hides when its number is not set. */
export function FloatingContact() {
  const { social, contact, name } = siteConfig;
  const whatsappHref = social.whatsapp
    ? `${social.whatsapp}${social.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(`Hello ${name}, I have a question.`)}`
    : "";
  const callHref = contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : "";
  if (!whatsappHref && !callHref) return null;

  return (
    <div className={styles.stack}>
      {callHref && (
        <a href={callHref} className={`${styles.fab} ${styles.call}`} aria-label={`Call us on ${contact.phone}`} title={`Call ${contact.phone}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
          </svg>
        </a>
      )}
      {whatsappHref && (
        <a href={whatsappHref} className={`${styles.fab} ${styles.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="WhatsApp us">
          <IconWhatsapp width={28} height={28} />
        </a>
      )}
    </div>
  );
}
