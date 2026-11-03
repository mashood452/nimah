import type { Metadata } from "next";
import Image from "next/image";
import { gallery } from "@/components/gallery/gallery-data";
import { CtaBand, PageHero } from "@/components/page/PageKit";
import { siteConfig } from "@/lib/site";
import lookbook from "@/components/gallery/Lookbook.module.css";
import styles from "@/components/page/Page.module.css";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Style inspiration from the Nimah lookbook: sunglasses and eyewear styled for sunlit days, city streets and the coast.",
  alternates: { canonical: "/lookbook" },
};

// varied heights give the masonry layout its rhythm
const ratios = ["4 / 5", "1 / 1", "4 / 5.6", "1 / 1.1", "4 / 5", "1 / 1", "4 / 5.4"];

export default function LookbookPage() {
  const photos = gallery.filter((g) => g.src);
  const instagram = siteConfig.social.instagram;

  return (
    <main>
      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Lookbook", href: "/lookbook" },
        ]}
        eyebrow="Lookbook"
        title="Style inspiration"
        intro="Sunlit rooftops, city streets and quiet coastlines: the Nimah collection, styled for the way you live."
      />

      <section className={styles.section}>
        <ul className={lookbook.masonry} data-reveal="stagger" suppressHydrationWarning>
          {photos.map((g, i) => (
            <li key={g.caption} className={lookbook.item}>
              <figure className={lookbook.fig}>
                <div className={lookbook.frame} style={{ aspectRatio: ratios[i % ratios.length] }}>
                  <Image src={g.src!} alt={g.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                </div>
                <figcaption className={lookbook.caption}>
                  {g.caption}
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        tone="dark"
        title="Love a look?"
        text="Explore the frames behind the photographs, or ask our team to help you find your own."
        primary={{ label: "Shop sunglasses", href: "/sunglasses" }}
        secondary={instagram ? { label: "Follow on Instagram", href: instagram } : { label: "Contact us", href: "/contact" }}
      />
    </main>
  );
}
