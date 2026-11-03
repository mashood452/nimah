/**
 * Crawls the running site and reports every internal link that does not return 200.
 *
 *   node scripts/check-links.mjs                 (defaults to http://localhost:3000)
 *   node scripts/check-links.mjs http://localhost:3100
 *
 * Starts at "/" and the sitemap, follows every internal href it finds, and checks each unique URL once.
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const seen = new Map(); // path -> status
const referrers = new Map(); // path -> Set of pages that link to it
const queue = ["/"];

const clean = (href, from) => {
  if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, base + from);
  } catch {
    return null;
  }
  if (url.origin !== base) return null; // external
  if (/\.(png|jpe?g|webp|avif|svg|ico|css|js|woff2?|txt|xml|json|webmanifest)$/i.test(url.pathname)) return null;
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api")) return null;
  return url.pathname.replace(/\/$/, "") || "/";
};

// seed from the sitemap so nothing is missed
try {
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = clean(new URL(m[1]).pathname, "/");
    if (p) queue.push(p);
  }
} catch {
  /* sitemap is optional */
}

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  let status = 0;
  let html = "";
  try {
    const res = await fetch(base + path, { redirect: "manual" });
    status = res.status;
    if (status === 200) html = await res.text();
  } catch {
    status = -1;
  }
  seen.set(path, status);
  if (status !== 200) continue;
  for (const m of html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    const p = clean(href, path);
    if (!p) continue;
    if (!referrers.has(p)) referrers.set(p, new Set());
    referrers.get(p).add(path);
    if (!seen.has(p)) queue.push(p);
  }
}

const bad = [...seen].filter(([, s]) => s !== 200).sort(([a], [b]) => a.localeCompare(b));
const ok = seen.size - bad.length;
console.log(`Checked ${seen.size} unique internal URLs: ${ok} OK, ${bad.length} not OK\n`);
for (const [p, s] of bad) {
  const from = [...(referrers.get(p) ?? [])].slice(0, 2).join(", ");
  console.log(`${String(s).padStart(4)}  ${p.padEnd(48)} linked from: ${from}`);
}
process.exit(bad.length ? 1 : 0);
