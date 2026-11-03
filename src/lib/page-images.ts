import { existsSync } from "node:fs";
import { join } from "node:path";

const EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"];

/**
 * Finds a page photo by name, so a photo is shown as soon as its file exists and a placeholder is shown until then.
 * Drop the file into public/images/<folder>/ with the name the page expects (for example
 * public/images/contact-lenses/hero.webp). No code change is needed. Returns null while the file is missing.
 */
export function pageImage(folder: string, name: string): string | null {
  for (const ext of EXTENSIONS) {
    if (existsSync(join(process.cwd(), "public", "images", folder, `${name}.${ext}`))) {
      return `/images/${folder}/${name}.${ext}`;
    }
  }
  return null;
}
