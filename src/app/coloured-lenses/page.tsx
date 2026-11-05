import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
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
import lensStyles from "@/components/lenses/ContactLenses.module.css";
import styles from "@/components/lenses/ColouredLenses.module.css";
import heroStyles from "@/components/lenses/ContactLensHero.module.css";
import { faqs, IMAGE_FOLDER, lensKinds, safetyTips, shades, steps } from "@/lib/coloured-lenses";
import { pageImage } from "@/lib/page-images";
import { webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const TITLE = "Coloured Contact Lenses UAE: Hazel, Green, Blue & More | Nimah Opticals";
const DESCRIPTION =
  "Explore soft coloured contact lenses in the UAE, from hazel and honey to green, blue and grey. See the shades, learn what a fitting involves, and ask the Nimah Opticals team.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/coloured-lenses" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact lenses", href: "/contact-lenses" },
  { name: "Coloured lenses", href: "/coloured-lenses" },
];

const jumpLinks = [
  { label: "Shades", href: "#shades" },
  { label: "See the colour", href: "#difference" },
  { label: "Kinds of lens", href: "#kinds" },
  { label: "Your fitting", href: "#fitting" },
  { label: "Safe wear", href: "#safety" },
  { label: "Questions", href: "#faq" },
];

const related = [
  { title: "Contact lenses", text: "Clear lenses for vision correction, explained in plain language.", href: "/contact-lenses" },
  { title: "Sunglasses", text: "UV400 and polarized sunglasses to wear over your lenses on bright days.", href: "/sunglasses" },
  { title: "Eyeglasses", text: "Refined frames for the days your eyes need a rest from lenses.", href: "/eyeglasses" },
  { title: "Lens guides", text: "Plain-language guides to lens types, coatings and options.", href: "/lenses" },
];

const naturalTone = { outer: "#5a3a26", inner: "#8b6244" };

export default function ColouredLensesPage() {
  const { social, contact } = siteConfig;
  const whatsappHref = social.whatsapp
    ? `${social.whatsapp}${social.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(
        `Hello ${siteConfig.name}, I would like to ask about coloured contact lenses.`,
      )}`
    : "";
  /** WhatsApp link for one shade, with the message already typed so the customer only has to press send. */
  const shadeHref = (shade: string) =>
    social.whatsapp
      ? `${social.whatsapp}${social.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(
          `Hello ${siteConfig.name}, I am interested in the ${shade} coloured contact lenses. Could you tell me more?`,
        )}`
      : "";
  const shown = shades.find((s) => s.slug === "green") ?? shades[0];

  return (
    <main>
      <JsonLd
        data={webPageSchema({
          url: `${siteConfig.url}/coloured-lenses`,
          siteUrl: siteConfig.url,
          name: TITLE,
          description: DESCRIPTION,
          about: "Coloured contact lenses",
          listName: "Coloured contact lens shades",
          items: shades.map((s) => ({ name: s.title, description: s.text })),
        })}
      />

      {/* ---------- hero ---------- */}
      <header className={lensStyles.hero}>
        <Breadcrumbs crumbs={crumbs} />
        <div className={lensStyles.heroGrid}>
          <div className={lensStyles.heroCopy}>
            <p className={pageStyles.eyebrow}>Coloured contact lenses</p>
            <h1 className={lensStyles.heroTitle}>Coloured contact lenses in the UAE, fitted with care</h1>
            <p className={lensStyles.heroIntro}>
              From a soft hazel to a bright blue, our soft coloured lenses change or enhance the colour of your eyes for
              fashion. See the shades, and ask our team how a fitting works.
            </p>
            <div className={lensStyles.heroActions}>
              <ContactLensEnquiry topic="coloured" whatsappHref={whatsappHref || undefined} />
              {whatsappHref && (
                <a href={whatsappHref} className={pageStyles.btnGhost} target="_blank" rel="noopener noreferrer">
                  <IconWhatsapp /> WhatsApp us
                </a>
              )}
            </div>
            <ul className={lensStyles.points}>
              <li>
                <strong>Natural to bold</strong>
                Soft enhancement or a full change
              </li>
              <li>
                <strong>Soft and comfortable</strong>
                Fashion lenses for every day or an occasion
              </li>
              <li>
                <strong>Fitted with care</strong>
                Every lens, every time
              </li>
            </ul>
          </div>
          <figure className={heroStyles.visual}>
            <div className={heroStyles.stage}>
              <PhotoSlot
                folder={IMAGE_FOLDER}
                name="hero"
                alt="Macro close-up of a sage-green coloured contact lens on a fingertip, with a fine iris pattern and transparent centre"
                ratio="1 / 1.08"
                sizes="(max-width: 520px) calc(100vw - 56px), (max-width: 900px) 464px, (max-width: 1200px) calc((100vw - 144px) * 5 / 12 - 16px), (max-width: 1320px) calc((100vw - 168px) * 5 / 12 - 16px), 464px"
                className={heroStyles.photo}
                art="iris"
                tone={shown.tone}
                preload
              />
            </div>
            <figcaption className={heroStyles.caption}>
              <div>
                <span className={heroStyles.eyebrow}>The finer details</span>
                <p className={heroStyles.captionTitle}>Colour, up close.</p>
              </div>
              <p className={heroStyles.captionNote}>Coloured lenses,<br />individually fitted.</p>
            </figcaption>
          </figure>
        </div>
      </header>

      <nav className={lensStyles.jump} aria-label="On this page">
        {jumpLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      {/* ---------- shades ---------- */}
      <section id="shades" className={pageStyles.section} aria-labelledby="col-shades">
        <SectionHead
          eyebrow="The shades"
          title="Find the shade that suits you"
          text="Every eye is different, so the same lens can look different from person to person. Our team can help you choose a look you will love."
          id="col-shades"
        />
        <ul className={styles.shades} data-reveal="stagger" suppressHydrationWarning>
          {shades.map((s) => (
            <li key={s.slug} className={styles.shade}>
              <PhotoSlot
                folder={IMAGE_FOLDER}
                name={s.image}
                alt={s.imageAlt}
                ratio="4 / 3"
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"
                art="iris"
                tone={s.tone}
              />
              <div className={styles.shadeBody}>
                <div className={styles.shadeHead}>
                  <span
                    className={styles.dot}
                    style={{ ["--outer" as string]: s.tone.outer, ["--inner" as string]: s.tone.inner } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3 className={styles.shadeTitle}>{s.title}</h3>
                </div>
                <p className={styles.shadeText}>{s.text}</p>
                <p className={styles.suits}>
                  <strong>Suits</strong>
                  {s.suits}
                </p>
                {social.whatsapp && (
                  <a
                    href={shadeHref(s.title)}
                    className={styles.shadeWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ask about ${s.title} coloured lenses on WhatsApp`}
                  >
                    <IconWhatsapp /> Ask on WhatsApp
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className={lensStyles.note}>
          Shades are shown for illustration. The final look depends on your natural eye colour, the kind of lens and the
          light, so we recommend talking to our team before you choose.
        </p>
      </section>

      {/* ---------- see the colour ---------- */}
      <section id="difference" className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="col-difference">
        <div className={styles.compareOne}>
          <figure style={{ margin: 0 }}>
            <BeforeAfter
              before={{
                src: pageImage(IMAGE_FOLDER, "shade-before"),
                alt: "Close-up of an eye in its natural brown colour",
                label: "Natural colour",
                tone: naturalTone,
              }}
              after={{
                src: pageImage(IMAGE_FOLDER, "shade-after"),
                alt: "The same eye wearing a green coloured contact lens",
                label: "With coloured lens",
                tone: shown.tone,
              }}
              art="iris"
              blur={0}
              ratio="4 / 3"
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </figure>
          <div>
            <p className={pageStyles.eyebrow}>See the colour</p>
            <h2 id="col-difference" className={pageStyles.h2} style={{ marginBottom: 0 }}>
              Your eyes, with a new shade
            </h2>
            <p>
              Drag the handle across the picture to compare a natural eye colour with the same eye wearing a coloured
              lens. Pictures are for illustration only, and results vary from person to person.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- kinds of lens ---------- */}
      <section id="kinds" className={pageStyles.section} aria-labelledby="col-kinds">
        <SectionHead
          eyebrow="Choosing a lens"
          title="Kinds of coloured lens"
          text="Coloured lenses differ in how strongly they change your eye colour, and in how natural the finish looks."
          id="col-kinds"
        />
        <div className={pageStyles.tableWrap} style={{ margin: 0 }}>
          {/* wide enough to keep the four columns readable; on a phone the table scrolls sideways inside its frame */}
          <table className={pageStyles.table} style={{ minWidth: 720 }}>
            <caption className={lensStyles.srOnly}>
              Comparison of kinds of coloured contact lens, what each one does and who it suits
            </caption>
            <thead>
              <tr>
                <th scope="col">Kind of lens</th>
                <th scope="col">What it does</th>
                <th scope="col">Best for</th>
                <th scope="col">The look</th>
              </tr>
            </thead>
            <tbody>
              {lensKinds.map((k) => (
                <tr key={k.title}>
                  <th scope="row" style={{ background: "#ffffff", letterSpacing: 0, textTransform: "none", fontSize: 15, color: "inherit" }}>
                    {k.title}
                  </th>
                  <td>{k.effect}</td>
                  <td>{k.bestFor}</td>
                  <td>{k.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- fitting ---------- */}
      <section id="fitting" className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="col-steps">
        <div className={lensStyles.fitting}>
          <div className={lensStyles.fittingPhoto}>
            <div className={styles.fittingImage}>
              <PhotoSlot
                folder={IMAGE_FOLDER}
                name="fitting"
                alt="Optometrist examining a customer at a slit lamp during a coloured contact lens fitting"
                ratio="4 / 5"
                sizes="(max-width: 900px) 100vw, 38vw"
                art="iris"
                tone={shown.tone}
              />
              <span className={styles.photoBrand} role="img" aria-label="Nimah Opticals">
                <Image src="/brand/nimah-mark.png" alt="" width={207} height={240} className={styles.photoBrandMark} />
                <span className={styles.photoBrandDivider} aria-hidden="true" />
                <Image src="/brand/nimah-word.png" alt="" width={640} height={104} className={styles.photoBrandWord} />
              </span>
            </div>
          </div>
          <div>
            <SectionHead
              eyebrow="Getting started"
              title="From choosing a shade to wearing it"
              text="Coloured lenses are fitted to your eyes, even though they are worn for fashion. Here is how it usually goes."
              id="col-steps"
            />
            <ol className={pageStyles.steps} style={{ ["--cols" as string]: 2, gap: 40 }} data-reveal="stagger" suppressHydrationWarning>
              {steps.map((s) => (
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
      <section id="safety" className={pageStyles.section} aria-labelledby="col-safe">
        <div className={lensStyles.care}>
          <div>
            <p className={pageStyles.eyebrow}>Wear them safely</p>
            <h2 id="col-safe" className={pageStyles.h2} style={{ marginBottom: 8 }}>
              Coloured lenses are medical devices, not accessories
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
          <div className={lensStyles.carePhoto}>
            <PhotoSlot
              folder={IMAGE_FOLDER}
              name="care"
              alt="Clean hands holding a coloured contact lens above a lens case with fresh solution"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 38vw"
              art="iris"
              tone={shown.tone}
            />
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className={`${pageStyles.section} ${pageStyles.sectionTint}`} aria-labelledby="col-related">
        <SectionHead
          eyebrow="Complete your look"
          title="More from Nimah Opticals"
          text="Explore every type of lens, and frames to wear with them."
          id="col-related"
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
      <section id="faq" className={pageStyles.section} aria-labelledby="col-faq">
        <div className={lensStyles.faq}>
          <div>
            <SectionHead eyebrow="Questions" title="Coloured lens questions, answered" id="col-faq" />
            <FaqList items={faqs} group="coloured-lenses" />
          </div>
          <div className={lensStyles.faqPhoto}>
            <PhotoSlot
              folder={IMAGE_FOLDER}
              name="faq"
              alt="Optical adviser helping a customer choose a coloured contact lens shade at a shop counter"
              ratio="4 / 5"
              sizes="(max-width: 900px) 320px, 420px"
              art="iris"
              tone={shown.tone}
            />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to try a new colour?"
        text={`Get in touch and our team will explain the shades, the fitting and the next steps.${contact.phone ? ` You can also call ${contact.phone}.` : ""}`}
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Contact lenses", href: "/contact-lenses" }}
      />
    </main>
  );
}
