import type { Metadata } from "next";
import { Catalog } from "@/components/catalog/Catalog";
import { sunglassesChips } from "@/components/catalog/chips";
import { inCategory } from "@/lib/catalog";
import { groups } from "@/lib/collections";

const group = groups.sunglasses;

export const metadata: Metadata = {
  title: group.title,
  description: group.metaDescription,
  alternates: { canonical: "/sunglasses" },
};

export default async function SunglassesPage() {
  return (
    <Catalog
      title={group.title}
      intro={group.intro}
      crumbs={[
        { name: "Home", href: "/" },
        { name: group.label, href: "/sunglasses" },
      ]}
      chipGroups={sunglassesChips()}
      products={await inCategory(group.category)}
      guideTitle={group.guideTitle}
      guide={group.guide}
    />
  );
}
