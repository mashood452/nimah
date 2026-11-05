import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { IconArrow } from "../navbar/icons";
import { footerColumns, legalLinks } from "./footer-data";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconTiktok, IconWhatsapp } from "./social-icons";
import styles from "./Footer.module.css";

/** Cached so the current year is computed once, not on every request. */
async function Year() {
  "use cache";
  return String(new Date().getFullYear());
}

export function Footer() {
  const { contact, social } = siteConfig;
  // The icon row, in this order. An icon is shown only once its link is set in siteConfig, so nothing points nowhere.
  const activeSocials = [
    { key: "whatsapp", label: "Nimah on WhatsApp", href: social.whatsapp, Icon: IconWhatsapp, external: true },
    { key: "phone", label: `Call ${siteConfig.name}`, href: contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : "", Icon: IconPhone, external: false },
    { key: "email", label: `Email ${siteConfig.name}`, href: contact.email ? `mailto:${contact.email}` : "", Icon: IconMail, external: false },
    { key: "facebook", label: "Nimah on Facebook", href: social.facebook, Icon: IconFacebook, external: true },
    { key: "tiktok", label: "Nimah on TikTok", href: social.tiktok, Icon: IconTiktok, external: true },
    { key: "instagram", label: "Nimah on Instagram", href: social.instagram, Icon: IconInstagram, external: true },
  ].filter((s) => s.href);
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
              {activeSocials.map(({ key, label, href, Icon, external }) => (
                <li key={key}>
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label={label}>
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
        <div className={styles.barLeft}>
          <p className={styles.copy}>
            &copy; <Year /> {siteConfig.name}. All rights reserved.
          </p>
          <p className={styles.credit}>
            Built by{" "}
            {siteConfig.credit.url ? (
              <a href={siteConfig.credit.url} target="_blank" rel="noopener noreferrer" title={siteConfig.credit.legalName}>
                {siteConfig.credit.name}
              </a>
            ) : (
              <span title={siteConfig.credit.legalName}>{siteConfig.credit.name}</span>
            )}
          </p>
        </div>
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
