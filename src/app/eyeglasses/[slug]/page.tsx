import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView, collectionMetadata } from "@/components/catalog/CollectionView";
import { getCollection, groups } from "@/lib/collections";

type Params = { slug: string };
const group = groups.eyeglasses;

// Known slugs are prerendered; unknown ones must block so notFound() returns a true 404 (see the sunglasses page).
export const instant = false;

export function generateStaticParams(): Params[] {
  return group.collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(group.slug, slug);
  return collection ? collectionMetadata(group, collection) : {};
}

export default async function EyeglassesCollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const collection = getCollection(group.slug, slug);
  if (!collection) notFound();
  return <CollectionView group={group} collection={collection} />;
}
