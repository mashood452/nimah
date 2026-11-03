import { groups, type Group } from "@/lib/collections";
import { frameStyles } from "@/lib/styles";
import type { Chip, ChipGroup } from "./Catalog";

const rowsFor = (group: Group, activeSlug?: string): ChipGroup[] =>
  group.rows.map((row) => ({
    label: row.label,
    chips: row.slugs.flatMap((slug) => {
      const c = group.collections.find((x) => x.slug === slug);
      return c ? [{ label: c.label, href: `/${group.slug}/${c.slug}`, active: activeSlug === c.slug } satisfies Chip] : [];
    }),
  }));

/** Chip rows for the sunglasses pages: shop by style (with photos), then lens and audience filters. */
export function sunglassesChips(active?: { shape?: string; slug?: string }): ChipGroup[] {
  const noneActive = !active?.shape && !active?.slug;
  const styles: ChipGroup = {
    label: "Shop by style",
    chips: [
      { label: "All styles", href: "/sunglasses", active: noneActive },
      ...frameStyles.map((s) => ({
        label: s.label,
        href: `/sunglasses/${s.shape}`,
        image: `/images/styles/${s.shape}.webp`,
        active: active?.shape === s.shape,
      })),
    ],
  };
  return [styles, ...rowsFor(groups.sunglasses, active?.slug)];
}

/** Chip rows for the blue-light and eyeglasses pages. */
export function groupChips(group: Group, activeSlug?: string): ChipGroup[] {
  const rows = rowsFor(group, activeSlug);
  if (rows.length > 0) {
    rows[0] = {
      ...rows[0],
      chips: [{ label: `All ${group.label.toLowerCase()}`, href: `/${group.slug}`, active: !activeSlug }, ...rows[0].chips],
    };
  }
  return rows;
}
