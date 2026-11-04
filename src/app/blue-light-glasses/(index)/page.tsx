import type { Metadata } from "next";
import { GroupView } from "@/components/catalog/CollectionView";
import { groups } from "@/lib/collections";

const group = groups["blue-light-glasses"];

export const metadata: Metadata = {
  title: group.title,
  description: group.metaDescription,
  alternates: { canonical: "/blue-light-glasses" },
};

export default function BlueLightPage() {
  return <GroupView group={group} />;
}
