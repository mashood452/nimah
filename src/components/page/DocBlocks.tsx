import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Block } from "@/lib/legal/types";
import styles from "./Page.module.css";

const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;

/** Turns "[text](/path)" into a link and "**text**" into bold. Everything else stays plain text. */
export function Inline({ text }: { text: string }): ReactNode {
  return text.split(TOKEN).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      return /^(https?:|mailto:|tel:)/.test(href) ? (
        <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link key={i} href={href}>
          {label}
        </Link>
      );
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Renders a list of content blocks as semantic HTML. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}><Inline text={b.p} /></p>;
        if ("h3" in b) return <h3 key={i}>{b.h3}</h3>;
        if ("ul" in b)
          return (
            <ul key={i}>
              {b.ul.map((li) => (
                <li key={li}><Inline text={li} /></li>
              ))}
            </ul>
          );
        if ("ol" in b)
          return (
            <ol key={i}>
              {b.ol.map((li) => (
                <li key={li}><Inline text={li} /></li>
              ))}
            </ol>
          );
        if ("table" in b)
          return (
            <div key={i} className={styles.tableWrap} tabIndex={0} role="region" aria-label="Table">
              <table className={styles.table}>
                <thead>
                  <tr>
                    {b.table.head.map((h) => (
                      <th key={h} scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.table.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell, c) => (
                        <td key={c}><Inline text={cell} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <div key={i} className={styles.notice}>
            <strong>{b.note.title}</strong>
            <Inline text={b.note.text} />
          </div>
        );
      })}
    </>
  );
}
