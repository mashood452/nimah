/**
 * Long-form documents (policies and guides) are written as data, then rendered by one component.
 * Inside any text string you can write [link text](/path) for a link and **bold** for emphasis.
 */
export type Block =
  | { p: string }
  | { h3: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { note: { title: string; text: string } };

export type DocSection = {
  /** anchor id, also used by the table of contents */
  id: string;
  title: string;
  body: Block[];
};

export type LegalDoc = {
  slug: string;
  /** short label for the policy switcher */
  label: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: DocSection[];
};
