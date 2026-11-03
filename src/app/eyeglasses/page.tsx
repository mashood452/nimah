import type { Metadata } from "next";
import { GroupView } from "@/components/catalog/CollectionView";
import { groups } from "@/lib/collections";

const group = groups.eyeglasses;

export const metadata: Metadata = {
  title: group.title,
  description: group.metaDescription,
  alternates: { canonical: "/eyeglasses" },
};

export default function EyeglassesPage() {
  return <GroupView group={group} />;
}
