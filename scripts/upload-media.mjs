/**
 * Uploads the product and blog photos in public/images to the Cloudflare R2 bucket, then checks each one
 * through the bucket's public address.
 *
 *   node scripts/upload-media.mjs            upload every file in products/ and blogs/
 *   node scripts/upload-media.mjs --dry-run  only list what would be uploaded
 *
 * The bucket mirrors the folders under public/images:
 *   public/images/products/a.webp  ->  products/a.webp
 *   public/images/blogs/b.webp     ->  blogs/b.webp
 *
 * Reads R2_ACCOUNT_ID, S3_BUCKET and CLOUDFLARE_API_TOKEN from .env.local. Nothing secret is printed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FOLDERS = ["products", "blogs"];
const TYPES = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".avif": "image/avif", ".svg": "image/svg+xml" };
const dryRun = process.argv.includes("--dry-run");

const env = {};
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const eq = line.indexOf("=");
  if (eq > 0 && !line.startsWith("#")) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}
const { R2_ACCOUNT_ID: account, S3_BUCKET: bucket, CLOUDFLARE_API_TOKEN: token } = env;
if (!account || !bucket || !token) {
  console.error("Missing R2_ACCOUNT_ID, S3_BUCKET or CLOUDFLARE_API_TOKEN in .env.local");
  process.exit(1);
}

// public address used for the check: the custom domain once set, otherwise the commented r2.dev address
const publicBase =
  env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  (fs.readFileSync(path.join(root, ".env.local"), "utf8").match(/^#\s*NEXT_PUBLIC_MEDIA_BASE_URL=(https:\/\/\S+)/m) ?? [])[1];

const files = FOLDERS.flatMap((folder) => {
  const dir = path.join(root, "public", "images", folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((n) => TYPES[path.extname(n).toLowerCase()]).map((n) => ({ key: `${folder}/${n}`, file: path.join(dir, n) }));
});

console.log(`${dryRun ? "Would upload" : "Uploading"} ${files.length} files to bucket "${bucket}"\n`);
let failed = 0;
for (const { key, file } of files) {
  const body = fs.readFileSync(file);
  if (dryRun) {
    console.log(`  ${key.padEnd(46)} ${Math.round(body.length / 1024)} KB`);
    continue;
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${bucket}/objects/${key.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": TYPES[path.extname(key).toLowerCase()],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body,
  });
  let ok = res.ok;
  let note = "";
  if (ok && publicBase) {
    const head = await fetch(`${publicBase}/${key}`, { method: "HEAD" });
    const size = Number(head.headers.get("content-length"));
    ok = head.status === 200 && size === body.length;
    note = `public ${head.status}, ${size} of ${body.length} bytes, ${head.headers.get("content-type")}`;
  }
  if (!ok) failed++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${key.padEnd(46)} ${note || `upload ${res.status}`}`);
}
if (!dryRun) console.log(failed === 0 ? `\nAll ${files.length} files uploaded and verified.` : `\n${failed} file(s) failed.`);
process.exit(failed ? 1 : 0);
