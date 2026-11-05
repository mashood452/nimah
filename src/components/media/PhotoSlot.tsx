import Image from "next/image";
import { pageImage } from "@/lib/page-images";
import { PlaceholderArt, type ArtKind, type IrisTone } from "./PlaceholderArt";
import styles from "./Media.module.css";

/**
 * A photo that appears on its own once its file exists in public/images/<folder>/<name>.webp (or .avif, .jpg, .png).
 * Until then a calm placeholder holds the space, so the layout never jumps when the photo is added.
 */
export function PhotoSlot({
  folder,
  name,
  alt,
  ratio = "4 / 3",
  sizes = "(max-width: 900px) 100vw, 50vw",
  preload = false,
  className = "",
  art = "scene",
  tone,
}: {
  folder: string;
  name: string;
  /** Describe the real photo for search engines and screen readers. Used only once the photo exists. */
  alt: string;
  ratio?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  /** The artwork drawn while the photo is missing. */
  art?: ArtKind;
  /** Colours for the "iris" artwork, for example to show a shade of eye colour. */
  tone?: IrisTone;
}) {
  const src = pageImage(folder, name);
  return (
    <div className={`${styles.slot} ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={styles.photo} />
      ) : (
        <>
          <PlaceholderArt kind={art} tone={tone} />
          {process.env.NODE_ENV !== "production" && (
            <span className={styles.hint}>Add /images/{folder}/{name}.webp</span>
          )}
        </>
      )}
    </div>
  );
}
