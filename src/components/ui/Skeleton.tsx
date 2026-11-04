import catalog from "../catalog/Catalog.module.css";
import blog from "../blog/Blog.module.css";
import page from "../page/Page.module.css";
import styles from "./Skeleton.module.css";

const bar = (extra = "") => `${styles.bar} ${extra}`.trim();

type Wrapper = "main" | "div";

/** A short announcement for screen readers; the shimmering shapes themselves are hidden from them. */
function Announce({ children }: { children: string }) {
  return <span className={styles.sr}>{children}</span>;
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <span className={bar(styles.cardMedia)} />
      <div className={styles.cardInfo}>
        <span className={bar()} style={{ width: "34%", height: 10 }} />
        <span className={bar()} style={{ width: "62%", height: 20 }} />
        <span className={bar()} style={{ width: "80%", height: 13 }} />
        <div className={styles.cardRow}>
          <span className={bar()} style={{ width: 84, height: 18 }} />
          <span className={styles.swatches}>
            {[0, 1, 2].map((i) => <span key={i} className={bar(styles.round)} style={{ width: 13, height: 13 }} />)}
          </span>
        </div>
      </div>
    </div>
  );
}

/** The toolbar and the grid of product cards, in the same columns as the real grid. */
export function ProductGridSkeleton({ count = 8, toolbar = true }: { count?: number; toolbar?: boolean }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <Announce>Loading eyewear</Announce>
      <div aria-hidden="true">
        {toolbar && (
          <div className={catalog.toolbar}>
            <span className={bar(styles.count)} />
            <span className={bar(styles.sortBox)} />
          </div>
        )}
        <ul className={catalog.grid}>
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className={catalog.cell}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A whole shop-style page: header band with title and chips, then the product grid. */
export function ListingSkeleton({ chips = true, count = 8, as: Tag = "main" }: { chips?: boolean; count?: number; as?: Wrapper }) {
  return (
    <Tag role="status" aria-busy="true" aria-live="polite">
      <Announce>Loading page</Announce>
      <header className={catalog.header} aria-hidden="true">
        <div className={styles.headerInner}>
          <span className={bar(styles.crumb)} />
          <span className={bar(styles.title)} />
          <span className={bar(styles.introLine)} />
          <span className={bar(styles.introLine)} />
          {chips && (
            <div className={styles.chipRow}>
              {[0, 1, 2, 3].map((i) => <span key={i} className={bar(styles.chip)} />)}
            </div>
          )}
        </div>
      </header>
      <section className={catalog.results} aria-hidden="true">
        <div className={catalog.toolbar}>
          <span className={bar(styles.count)} />
          <span className={bar(styles.sortBox)} />
        </div>
        <ul className={catalog.grid}>
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className={catalog.cell}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </section>
    </Tag>
  );
}

/** The journal index: header band, one big featured article, then a grid of article cards. */
export function BlogSkeleton({ as: Tag = "main" }: { as?: Wrapper }) {
  return (
    <Tag role="status" aria-busy="true" aria-live="polite">
      <Announce>Loading articles</Announce>
      <header className={page.hero} aria-hidden="true">
        <div className={styles.headerInner}>
          <span className={bar(styles.crumb)} />
          <span className={bar()} style={{ width: 130, height: 12 }} />
          <span className={bar(styles.title)} />
          <span className={bar(styles.introLine)} />
          <span className={bar(styles.introLine)} />
        </div>
      </header>
      <section className={blog.index} aria-hidden="true">
        <div className={styles.featured}>
          <span className={bar(styles.featuredImg)} />
          <div className={styles.featuredText}>
            <span className={bar()} style={{ width: 150, height: 11 }} />
            <span className={bar()} style={{ width: "90%", height: 30 }} />
            <span className={bar()} style={{ width: "60%", height: 30 }} />
            <span className={bar()} style={{ width: "85%", height: 14 }} />
            <span className={bar()} style={{ width: "70%", height: 14 }} />
          </div>
        </div>
        <ul className={styles.articleGrid}>
          {[0, 1].map((i) => (
            <li key={i} className={styles.article}>
              <span className={bar(styles.articleImg)} />
              <div className={styles.articleText}>
                <span className={bar()} style={{ width: 120, height: 10 }} />
                <span className={bar()} style={{ width: "85%", height: 22 }} />
                <span className={bar()} style={{ width: "95%", height: 13 }} />
                <span className={bar()} style={{ width: "55%", height: 13 }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Tag>
  );
}
