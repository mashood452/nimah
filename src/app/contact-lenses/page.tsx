import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { Blocks } from "@/components/page/DocBlocks";
import { FaqList } from "@/components/page/FaqList";
import { Breadcrumbs, CtaBand, SectionHead } from "@/components/page/PageKit";
import pageStyles from "@/components/page/Page.module.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { IconWhatsapp } from "@/components/footer/social-icons";
import { ContactLensEnquiry } from "@/components/lenses/ContactLensEnquiry";
import styles from "@/components/lenses/ContactLenses.module.css";
import { comparisons, faqs, fittingSteps, IMAGE_FOLDER, lensTypes, safetyTips } from "@/lib/contact-lenses";
import { pageImage } from "@/lib/page-images";
import { webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const TITLE = "Contact Lenses UAE: Daily, Monthly & Toric | Nimah Opticals";
const DESCRIPTION =
  "Explore daily, monthly, toric, multifocal and coloured contact lenses in the UAE. Learn about fittings and safe wear, then ask the Nimah Opticals team.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/contact-lenses" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact lenses", href: "/contact-lenses" },
];

const jumpLinks = [
  { label: "See the difference", href: "#difference" },
  { label: "Lens types", href: "#types" },
  { label: "Your first fitting", href: "#fitting" },
  { label: "Safe wear", href: "#safety" },
  { label: "Questions", href: "#faq" },
];

const related = [
  { title: "Sunglasses", text: "UV400 and polarized sunglasses to wear over your lenses on bright days.", href: "/sunglasses" },
  { title: "Blue-cut glasses", text: "A comfortable second pair for long hours at your screen.", href: "/blue-light-glasses" },
  { title: "Eyeglasses", text: "Refined frames for the days your eyes need a rest from lenses.", href: "/eyeglasses" },
  { title: "Lens guides", text: "Plain-language guides to lens types, coatings and options.", href: "/lenses" },
];

export default function ContactLensesPage() {
  const { social, contact } = siteConfig;
  const whatsappHref = social.whatsapp
    ? `${social.whatsapp}${social.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(
        `Hello ${siteConfig.name}, I would like to ask about contact lenses.`,
      )}`
    : "";

  return (
    <main>
      <JsonLd
        data={webPageSchema({
          url: `${siteConfig.url}/contact-lenses`,
          siteUrl: siteConfig.url,
          name: TITLE,
          description: DESCRIPTION,
          about: "Contact lenses",
          listName: "Types of contact lenses",
          items: lensTypes.map((t) => ({ name: t.title, description: t.text })),
        })}
      />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        <Breadcrumbs crumbs={crumbs} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={pageStyles.eyebrow}>Contact lenses</p>
            <h1 className={styles.heroTitle}>Contact lenses in the UAE, fitted with care</h1>
            <p className={styles.heroIntro}>
              Daily, monthly, toric, multifocal and coloured contact lenses explained clearly. Learn what to expect from
              a fitting, how to wear lenses safely, and ask our team about the next steps.
            </p>
            <div className={styles.heroActions}>
              <ContactLensEnquiry whatsappHref={whatsappHref || undefined} />
              {whatsappHref && (
                <a href={whatsappHref} className={pageStyles.btnGhost} target="_blank" rel="noopener noreferrer">
                  <IconWhatsapp /> WhatsApp us
                </a>
              )}
            </div>
            <ul className={styles.points}>
              <li>
                <strong>Every lens type</strong>
                Daily, monthly and specialist options
              </li>
              <li>
                <strong>Clear or coloured</strong>
                Prescription and cosmetic lenses
              </li>
              <li>
                <strong>Friendly guidance</strong>
                From our team, before and after
              </li>
            </ul>
          </div>
          <div className={styles.heroPhoto}>
            <PhotoSlot
              folder={IMAGE_FOLDER}
              name="hero"
              alt="Woman holding a clear contact lens on a clean fingertip beside her face in warm window light"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 40vw"
              preload
            />
          </div>
        </div>
      </header>

      <nav className={styles.jump} aria-label="On this page">
        {jumpLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      {/* ---------- before and after ---------- */}
      <section id="difference" className={pageStyles.section} aria-labelledby="cl-difference">
        <SectionHead
          eyebrow="See the difference"
          title="Clear vision, with nothing in the way"
          text="Drag the handle across each picture to compare the view without correction and with contact lenses."
          id="cl-difference"
        />
        <ul className={styles.compare} data-reveal="stagger" suppressHydrationWarning>
          {comparisons.map((c) => (
            <li key={c.key}>
              <figure>
                <BeforeAfter
                  before={{ src: pageImage(IMAGE_FOLDER, c.before.image), alt: c.before.alt, label: c.before.label }}
                  after={{ src: pageImage(IMAGE_FOLDER, c.after.image), alt: c.after.alt, label: c.after.label }}
                  art={c.art}
                  blur={c.blur}
                  ratio="4 / 3"
                />
                <figcaption>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Pictures are for illustration only. Results vary from person to person, and the right lens for you depends on
          an eye examination and a fitting.
        </p>
      </section>

      {/* ---------- lens types ---------- */}
      <section id="types" className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="cl-types">
        <SectionHead
          eyebrow="The basics"
          title="Types of contact lenses"
          text="The right choice depends on your prescription, your eyes and how you like to live. A fitting will confirm what suits you."
          id="cl-types"
        />
        <ul className={styles.types} data-reveal="stagger" suppressHydrationWarning>
          {lensTypes.map((t, i) => (
            <li key={t.slug} className={styles.type}>
              <PhotoSlot folder={IMAGE_FOLDER} name={t.image} alt={t.imageAlt} ratio="4 / 3" sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className={styles.typeBody}>
                <span className={styles.typeNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.typeTitle}>{t.title}</h3>
                <p className={styles.typeText}>{t.text}</p>
                <p className={styles.typeBest}>
                  <strong>Best for</strong>
                  {t.bestFor}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.tableBlock}>
          <h3 className={styles.tableTitle}>Contact lens types at a glance</h3>
          <div className={pageStyles.tableWrap} style={{ margin: 0 }}>
            <table className={pageStyles.table}>
              <caption className={styles.srOnly}>Comparison of contact lens types, how often they are replaced and how they are cared for</caption>
              <thead>
                <tr>
                  <th scope="col">Lens type</th>
                  <th scope="col">Replaced</th>
                  <th scope="col">Daily care</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                {lensTypes.map((t) => (
                  <tr key={t.slug}>
                    <th scope="row" style={{ background: "#ffffff", letterSpacing: 0, textTransform: "none", fontSize: 15, color: "inherit" }}>
                      {t.title}
                    </th>
                    <td>{t.replaced}</td>
                    <td>{t.care}</td>
                    <td>{t.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- fitting ---------- */}
      <section id="fitting" className={pageStyles.section} aria-labelledby="cl-steps">
        <div className={styles.fitting}>
          <div className={styles.fittingPhoto}>
            <PhotoSlot
              folder={IMAGE_FOLDER}
              name="fitting"
              alt="Eye care professional carrying out a contact lens fitting"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 38vw"
            />
          </div>
          <div>
            <SectionHead
              eyebrow="Getting started"
              title="What to expect at your first fitting"
              text="Contact lenses are fitted to your eyes, so the first steps matter. Here is how it usually goes."
              id="cl-steps"
            />
            <ol className={pageStyles.steps} style={{ ["--cols" as string]: 2, gap: 40 }} data-reveal="stagger" suppressHydrationWarning>
              {fittingSteps.map((s) => (
                <li key={s.title}>
                  <h3 className={pageStyles.cardTitle}>{s.title}</h3>
                  <p className={pageStyles.cardText} style={{ marginTop: 10 }}>
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- safety ---------- */}
      <section id="safety" className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="cl-safe">
        <div className={styles.care}>
          <div>
            <p className={pageStyles.eyebrow}>Wear them safely</p>
            <h2 id="cl-safe" className={pageStyles.h2} style={{ marginBottom: 8 }}>
              Good habits keep your eyes healthy
            </h2>
            <div className={pageStyles.prose}>
              <Blocks
                blocks={[
                  { ul: safetyTips },
                  {
                    note: {
                      title: "Always follow professional advice",
                      text: "This page is general information. Follow the advice of your eye care professional for your own eyes and lenses.",
                    },
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.carePhoto}>
            <PhotoSlot
              folder={IMAGE_FOLDER}
              name="care"
              alt="Clean hands holding a contact lens case with fresh solution"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 38vw"
            />
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className={pageStyles.section} aria-labelledby="cl-related">
        <SectionHead
          eyebrow="Complete your eyewear"
          title="A great pair to go with your lenses"
          text="Many people wear contact lenses and glasses together. Explore frames for sun, screens and every day."
          id="cl-related"
        />
        <ul className={pageStyles.linkCards} style={{ ["--cols" as string]: 4 }} data-reveal="stagger" suppressHydrationWarning>
          {related.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className={pageStyles.linkCard}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <span>Explore</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- questions ---------- */}
      <section id="faq" className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="cl-faq">
        <SectionHead eyebrow="Questions" title="Contact lens questions, answered" id="cl-faq" />
        <FaqList items={faqs} group="contact-lenses" />
      </section>

      <CtaBand
        title="Ready to talk about contact lenses?"
        text={`Get in touch and our team will explain the next steps, including fittings, availability and ordering.${contact.phone ? ` You can also call ${contact.phone}.` : ""}`}
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Lens guides", href: "/lenses" }}
      />
    </main>
  );
}
