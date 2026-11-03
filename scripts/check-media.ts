import { loadEnvConfig } from "@next/env";
import { products, posts } from "../database/seed-data";
import { mediaKey } from "../src/lib/db/mappers";

loadEnvConfig(process.cwd());

async function main() {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("Set NEXT_PUBLIC_MEDIA_BASE_URL to the public R2 address first.");
  const keys = [
    ...products.filter((product) => product.image).map((product) => mediaKey(product.image, "products")),
    ...posts.map((post) => mediaKey(post.image, "blogs")),
  ];
  let failed = 0;
  for (const key of keys) {
    try {
      const response = await fetch(`${base}/${key}`, { method: "HEAD", signal: AbortSignal.timeout(10_000) });
      const ok = response.ok && response.headers.get("content-type")?.startsWith("image/");
      if (!ok) failed++;
      console.log(`${ok ? "OK" : "FAIL"} ${key}: ${response.status} ${response.headers.get("content-type") ?? "no content type"}`);
    } catch {
      failed++;
      console.log(`FAIL ${key}: unable to reach public media URL`);
    }
  }
  console.log(`${keys.length - failed}/${keys.length} R2 thumbnails reachable.`);
  if (failed) process.exitCode = 1;
}

void main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
