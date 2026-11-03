import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog/Catalog";
import { sunglassesChips } from "@/components/catalog/chips";
import { CollectionView, collectionMetadata } from "@/components/catalog/CollectionView";
import { getCollection, groups } from "@/lib/collections";
import { inCategory } from "@/lib/catalog";
import { frameStyles, getFrameStyle } from "@/lib/styles";

type Params = { style: string };

// All six frame shapes and ten collections are known at build time, so every page is prerendered.
// Only unknown slugs reach the page at request time, and they must block so that notFound() can return a true
// 404 status (inside Suspense it would stream as a 200 "soft 404").
export const instant = false;

export function generateStaticParams(): Params[] {
  return [
    ...frameStyles.map((s) => ({ style: s.shape })),
    ...groups.sunglasses.collections.map((c) => ({ style: c.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { style } = await params;

  const shape = getFrameStyle(style);
  if (shape) {
    return {
      title: `${shape.label} Sunglasses`,
      description: `Shop ${shape.label.toLowerCase()} sunglasses at Nimah Opticals. ${shape.note}, best for ${shape.best.toLowerCase()}.`,
      alternates: { canonical: `/sunglasses/${shape.shape}` },
    };
  }

  const collection = getCollection("sunglasses", style);
  return collection ? collectionMetadata(groups.sunglasses, collection) : {};
}

export default async function SunglassesSubPage({ params }: { params: Promise<Params> }) {
  const { style } = await params;

  const collection = getCollection("sunglasses", style);
  if (collection) return <CollectionView group={groups.sunglasses} collection={collection} />;

  const s = getFrameStyle(style);
  // Cache Components has no dynamicParams, so unknown slugs end up here and become a 404.
  if (!s) notFound();

  const sunglasses = await inCategory("Sunglasses");

  return (
    <Catalog
      title={`${s.label} Sunglasses`}
      intro={s.intro}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Sunglasses", href: "/sunglasses" },
        { name: s.label, href: `/sunglasses/${s.shape}` },
      ]}
      chipGroups={sunglassesChips({ shape: s.shape })}
      spotlight={{
        kicker: "Style notes",
        title: s.label,
        note: s.note,
        bestLabel: "Best for",
        best: s.best,
        image: `/images/styles/${s.shape}.webp`,
        imageAlt: `${s.label} sunglasses`,
        ctaLabel: "Compare all styles",
        ctaHref: "/sunglasses",
      }}
      products={sunglasses.filter((p) => p.shape === s.shape)}
      more={sunglasses.filter((p) => p.shape !== s.shape)}
      moreTitle="More sunglasses to explore"
      guideTitle={`How to choose ${s.label.toLowerCase()} sunglasses`}
      guide={[
        s.guide,
        "Not sure it is the right shape? Compare it with our other styles above, and look for UV400 protection on every pair.",
      ]}
    />
  );
}
