import type { Metadata } from "next";
import { Blocks } from "@/components/page/DocBlocks";
import { FaqList } from "@/components/page/FaqList";
import { CtaBand, PageHero, SectionHead } from "@/components/page/PageKit";
import styles from "@/components/page/Page.module.css";

export const metadata: Metadata = {
  title: "Contact Lenses",
  description:
    "An introduction to contact lenses: the main types, what you need to get started and how to wear them safely, with fitting support from the Nimah team.",
  alternates: { canonical: "/contact-lenses" },
};

const types = [
  { title: "Daily disposables", text: "A fresh pair every day, with no cleaning or storage. Convenient, and popular for occasional wear and travel." },
  { title: "Two-weekly and monthly", text: "Worn for a set period, then replaced. They need cleaning and storing each night and suit regular wearers." },
  { title: "Toric lenses", text: "Designed to correct astigmatism. They are shaped to stay in the right position on the eye." },
  { title: "Multifocal lenses", text: "Give clear vision at several distances, for people who need help both near and far." },
  { title: "Coloured lenses", text: "Change or enhance eye colour. Some are made with a prescription, and all need a proper fitting." },
  { title: "Specialist lenses", text: "For complex prescriptions and some eye conditions. These need a specialist assessment and fitting." },
];

const faqs = [
  {
    q: "Is a contact lens prescription the same as a glasses prescription?",
    a: "No. A contact lens prescription includes extra measurements, such as the curve and diameter of the lens, because the lens sits on the eye. You need a contact lens fitting, not just a glasses prescription.",
  },
  {
    q: "Can I sleep in my contact lenses?",
    a: "Only if your eye care professional has told you that your lenses are designed for it. Sleeping in lenses that are not made for overnight wear raises the risk of eye infections.",
  },
  {
    q: "How often should I replace my lenses?",
    a: "Follow the schedule for your lens type and the advice of your eye care professional. Wearing lenses beyond their replacement date can cause discomfort and infections.",
  },
  {
    q: "What should I do if my eye is red, painful or blurry?",
    a: "Take the lens out and see an eye care professional promptly. Do not put the lens back in until you have been checked.",
  },
];

export default function ContactLensesPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact lenses", href: "/contact-lenses" },
        ]}
        eyebrow="Contact lenses"
        title="Contact lenses, fitted with care"
        intro="A guide to the main types of contact lenses, what you need to get started and how to wear them safely."
      />

      <section className={styles.section} aria-labelledby="cl-types">
        <SectionHead
          eyebrow="The basics"
          title="Types of contact lenses"
          text="The right choice depends on your prescription, your eyes and how you like to live. A fitting will confirm what suits you."
          id="cl-types"
        />
        <ul className={styles.cards} data-reveal="stagger" suppressHydrationWarning>
          {types.map((t, i) => (
            <li key={t.title} className={styles.card}>
              <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{t.title}</h3>
              <p className={styles.cardText}>{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.section} ${styles.sectionTint}`} aria-labelledby="cl-steps">
        <SectionHead eyebrow="Getting started" title="What you need" id="cl-steps" />
        <ol className={styles.steps} data-reveal="stagger" suppressHydrationWarning>
          <li>
            <h3 className={styles.cardTitle}>An eye examination</h3>
            <p className={styles.cardText} style={{ marginTop: 10 }}>Your eye care professional checks your eye health and your vision.</p>
          </li>
          <li>
            <h3 className={styles.cardTitle}>A contact lens fitting</h3>
            <p className={styles.cardText} style={{ marginTop: 10 }}>The lens size and shape are matched to your eyes, which is different from a glasses prescription.</p>
          </li>
          <li>
            <h3 className={styles.cardTitle}>Learn to handle them</h3>
            <p className={styles.cardText} style={{ marginTop: 10 }}>Practise putting lenses in and taking them out, and learn how to care for them.</p>
          </li>
          <li>
            <h3 className={styles.cardTitle}>Regular check-ups</h3>
            <p className={styles.cardText} style={{ marginTop: 10 }}>Keep your appointments so your eyes stay healthy and your prescription stays current.</p>
          </li>
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="cl-safe">
        <div className={styles.split}>
          <div className={styles.aside}>
            <p className={styles.eyebrow}>Wear them safely</p>
            <h2 id="cl-safe" className={styles.h2}>
              Good habits keep your eyes healthy
            </h2>
          </div>
          <div className={styles.prose}>
            <Blocks
              blocks={[
                {
                  ul: [
                    "Wash and dry your hands before touching your lenses.",
                    "Never use tap water on lenses or a lens case, and never put saliva on them.",
                    "Use fresh solution every time, and replace your lens case regularly.",
                    "Follow your replacement schedule and take lenses out before swimming or showering.",
                    "Take lenses out and call your eye care professional if your eyes are red, sore or blurry.",
                  ],
                },
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
      </section>

      <section className={`${styles.section} ${styles.sectionTint}`} aria-labelledby="cl-faq">
        <SectionHead eyebrow="Questions" title="Contact lens questions, answered" id="cl-faq" />
        <FaqList items={faqs} group="contact-lenses" />
      </section>

      <CtaBand
        tone="dark"
        title="Ready to talk about contact lenses?"
        text="Get in touch and our team will explain the next steps, including fittings and ordering."
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Lens guides", href: "/lenses" }}
      />
    </main>
  );
}
