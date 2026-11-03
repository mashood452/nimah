import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/page/PageKit";
import { siteConfig } from "@/lib/site";
import styles from "@/components/page/Page.module.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Nimah Opticals team for frame advice, lens questions, orders and returns.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact, social } = siteConfig;
  const details = [
    contact.phone && { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    social.whatsapp && { label: "WhatsApp", value: "Message us", href: social.whatsapp },
    contact.address && { label: "Visit us", value: contact.address },
    contact.hours && { label: "Opening hours", value: contact.hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
        eyebrow="Contact"
        title="We would love to help"
        intro="Frame advice, lens questions, an order or a return: send us a message and our team will get back to you."
      />

      <section className={styles.section}>
        <div className={styles.split}>
          <aside className={styles.aside} aria-label="Contact details">
            {details.length > 0 && (
              <div className={styles.glance}>
                <p className={styles.tocTitle}>Reach us</p>
                <dl>
                  {details.map((d) => (
                    <div key={d.label}>
                      <dt>{d.label}</dt>
                      <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <p className={styles.tocTitle}>Quick answers</p>
            <ul className={styles.toc}>
              <li><Link href="/#faq">Eyewear FAQs</Link></li>
              <li><Link href="/lenses">Lens guides</Link></li>
              <li><Link href="/shipping">Shipping policy</Link></li>
              <li><Link href="/returns">Returns and exchanges</Link></li>
            </ul>
          </aside>

          <div>
            <h2 className={styles.h2} style={{ marginBottom: 32 }}>
              Send us a message
            </h2>
            <ContactForm email={contact.email || undefined} whatsapp={social.whatsapp || undefined} />
          </div>
        </div>
      </section>
    </main>
  );
}
