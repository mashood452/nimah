import type { ReactNode } from "react";
import { PageHero } from "../page/PageKit";
import styles from "./Shop.module.css";

/** Header plus a padded content area, shared by the bag, wishlist, search and account pages. */
export function ShopFrame({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: string;
  crumbs: { name: string; href: string }[];
  children: ReactNode;
}) {
  return (
    <main>
      <PageHero crumbs={crumbs} title={title} intro={intro} />
      <div className={styles.page}>{children}</div>
    </main>
  );
}
