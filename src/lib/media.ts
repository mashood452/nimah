/**
 * Serves product and blog photos from a public storage bucket (for example Cloudflare R2) instead of from /public.
 *
 * Set NEXT_PUBLIC_MEDIA_BASE_URL to the bucket's public address, for example
 *   https://media.nimahopticals.com        (a custom domain connected to the bucket, recommended)
 *   https://pub-xxxxxxxx.r2.dev            (the bucket's r2.dev address, fine for testing)
 * Leave it empty and every image keeps loading from /public, exactly as before.
 *
 * The bucket mirrors the folder structure under public/images, so
 *   /images/products/aurelia-aviator.webp   ->   <base>/products/aurelia-aviator.webp
 *   /images/blogs/what-is-blue-light.webp   ->   <base>/blogs/what-is-blue-light.webp
 *
 * This only needs the public address. The storage API keys are never used by the website. They belong to the
 * upload script only and must never be given a NEXT_PUBLIC_ name.
 */
const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").trim().replace(/\/+$/, "");

/** Folders under public/images that live in the bucket. Everything else keeps loading from /public. */
const HOSTED = ["/images/products/", "/images/blogs/"];

export function mediaUrl(path: string): string;
export function mediaUrl(path: string | undefined): string | undefined;
export function mediaUrl(path: string | undefined): string | undefined {
  if (!path) return path;
  // The database stores portable R2 keys. Older /images/... references remain supported.
  const key = /^(products|blogs)\//.test(path)
    ? path
    : HOSTED.some((prefix) => path.startsWith(prefix)) ? path.slice("/images/".length) : undefined;
  if (!key) return path;
  return base ? `${base}/${key}` : `/images/${key}`;
}

/** Makes a path absolute for places that need a full URL, such as structured data and social previews. */
export function absoluteMediaUrl(path: string, siteUrl: string): string {
  const url = mediaUrl(path);
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`;
}
