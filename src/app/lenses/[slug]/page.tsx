import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LensGuideView } from "@/components/lenses/LensGuideView";
import { getLensGuide, lensGuides } from "@/lib/lenses";

type Params = { slug: string };

// Every guide is known at build time and prerendered. Unknown slugs must block so notFound() returns a true 404.
export const instant = false;

export function generateStaticParams(): Params[] {
  return lensGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getLensGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `/lenses/${guide.slug}` },
  };
}

export default async function LensGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getLensGuide(slug);
  if (!guide) notFound();
  return <LensGuideView guide={guide} />;
}
