import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { IconArrow } from "../navbar/icons";
import { footerColumns, legalLinks } from "./footer-data";
import { IconFacebook, IconInstagram, IconTiktok, IconWhatsapp } from "./social-icons";
import styles from "./Footer.module.css";

/** Cached so the current year is computed once, not on every request. */
async function Year() {
  "use cache";
  return String(new Date().getFullYear());
}

const socials = [
  { key: "instagram", label: "Instagram", Icon: IconInstagram },
  { key: "facebook", label: "Facebook", Icon: IconFacebook },
  { key: "tiktok", label: "TikTok", Icon: IconTiktok },
  { key: "whatsapp", label: "WhatsApp", Icon: IconWhatsapp },
] as const;

export function Footer() {
  const { contact, social } = siteConfig;
  const activeSocials = socials.filter((s) => social[s.key]);
  const hasContact = Object.values(contact).some(Boolean);

  return (
    <footer className={styles.footer}>
      <div className={styles.cta} data-reveal suppressHydrationWarning>
        <div>
          <p className={styles.ctaKicker}>Nimah Opticals</p>
          <p className={styles.ctaTitle}>Find the frame that is yours.</p>
        </div>
        <Link href="/shop" className={styles.ctaBtn}>
          Shop all eyewear <IconArrow />
        </Link>
      </div>

      <div className={styles.main} data-reveal suppressHydrationWarning>
        <div className={styles.brand}>
          <Link href="/" aria-label="Nimah Opticals, home" className={styles.logo}>
            <Image src="/brand/nimah-logo-light.png" alt="Nimah" width={552} height={360} />
          </Link>
          <p className={styles.blurb}>
            Luxury sunglasses, blue-cut glasses and refined optical frames, chosen to protect your eyes and finish
            your look.
          </p>
          {activeSocials.length > 0 && (
            <ul className={styles.socials}>
              {activeSocials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a href={social[key]} target="_blank" rel="noopener noreferrer" aria-label={`Nimah on ${label}`}>
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.cols}>
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className={styles.col}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {hasContact && (
            <div className={styles.col}>
              <p className={styles.colTitle}>Visit and contact</p>
              <ul className={styles.contact}>
                {contact.address && <li>{contact.address}</li>}
                {contact.hours && <li>{contact.hours}</li>}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
                  </li>
                )}
                {social.whatsapp && (
                  <li>
                    <a href={social.whatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp us
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bar} data-reveal suppressHydrationWarning>
        <p className={styles.copy}>
          &copy; <Year /> {siteConfig.name}. All rights reserved.
        </p>
        <ul className={styles.legal}>
          {legalLinks.map((l) => (
            <li key={l.label}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
          <li>
            <a href="#" className={styles.top}>
              Back to top <IconArrow />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
