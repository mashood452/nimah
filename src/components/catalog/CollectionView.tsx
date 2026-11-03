import type { Metadata } from "next";
import { inCategory, withTag } from "@/lib/catalog";
import { groups, type Collection, type Group } from "@/lib/collections";
import { EmptyState } from "../page/PageKit";
import { Catalog } from "./Catalog";
import { groupChips, sunglassesChips } from "./chips";

const trim = (text: string, max = 158) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

export function collectionMetadata(group: Group, collection: Collection): Metadata {
  return {
    title: collection.title,
    description: trim(`${collection.intro} Shop at Nimah Opticals.`),
    alternates: { canonical: `/${group.slug}/${collection.slug}` },
  };
}

/** One filtered collection page, such as /sunglasses/polarized or /eyeglasses/round. */
export async function CollectionView({ group, collection }: { group: Group; collection: Collection }) {
  const matches = await withTag(group.category, collection.tag);
  const matchSlugs = new Set(matches.map((p) => p.slug));
  const rest = (await inCategory(group.category)).filter((p) => !matchSlugs.has(p.slug));

  const empty = matches.length === 0;
  const chipGroups =
    group.slug === "sunglasses" ? sunglassesChips({ slug: collection.slug }) : groupChips(group, collection.slug);

  return (
    <Catalog
      title={collection.title}
      intro={collection.intro}
      crumbs={[
        { name: "Home", href: "/" },
        { name: group.label, href: `/${group.slug}` },
        { name: collection.label, href: `/${group.slug}/${collection.slug}` },
      ]}
      chipGroups={chipGroups}
      products={matches}
      more={rest}
      moreTitle={empty ? `Browse all ${group.label.toLowerCase()}` : `More ${group.label.toLowerCase()} to explore`}
      guideTitle={collection.guideTitle}
      guide={collection.guide}
      emptyState={
        <EmptyState
          title="This collection is on its way"
          text={
            collection.emptyNote ??
            `We are adding new pieces to ${collection.label.toLowerCase()} soon. Browse the full range in the meantime.`
          }
          actions={[
            { label: `Shop all ${group.label.toLowerCase()}`, href: `/${group.slug}` },
            ...(collection.related ? [{ label: collection.related.label, href: collection.related.href, ghost: true }] : []),
          ]}
        />
      }
    />
  );
}

/** A category landing page: /blue-light-glasses or /eyeglasses. */
export async function GroupView({ group }: { group: Group }) {
  return (
    <Catalog
      title={group.title}
      intro={group.intro}
      crumbs={[
        { name: "Home", href: "/" },
        { name: group.label, href: `/${group.slug}` },
      ]}
      chipGroups={groupChips(group)}
      products={await inCategory(group.category)}
      guideTitle={group.guideTitle}
      guide={group.guide}
      guideLink={
        group.slug === "blue-light-glasses"
          ? { label: "Read our guide to blue light", href: "/blog/what-is-blue-light" }
          : { label: "Explore our lens guides", href: "/lenses/single-vision" }
      }
    />
  );
}

export { groups };
