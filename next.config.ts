import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * Product and blog photos can be served from a public storage bucket (Cloudflare R2). When
 * NEXT_PUBLIC_MEDIA_BASE_URL is set, Next.js is allowed to fetch and optimise images from that address.
 * See src/lib/media.ts.
 */
function mediaImagePatterns() {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
  if (!base) return [];
  try {
    const url = new URL(base);
    return [
      {
        protocol: url.protocol === "http:" ? ("http" as const) : ("https" as const),
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
      },
    ];
  } catch {
    console.warn(`NEXT_PUBLIC_MEDIA_BASE_URL is not a valid URL: ${base}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["nodemailer"],
  // Resolve database-backed metadata before headers are sent, including missing-slug 404s.
  htmlLimitedBots: /.*/,
  // The framework name is not useful to visitors, so it is not announced in every response.
  poweredByHeader: false,
  images: {
    remotePatterns: mediaImagePatterns(),
    // Optimised photos are named by content (for example "-v2"), so browsers and the CDN may keep them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    const day = 60 * 60 * 24;
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS only for a year, subdomains included (the media subdomain is HTTPS too).
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      {
        // Static brand and site images in /public are never changed in place, so they cache for 30 days.
        source: "/:folder(images|brand)/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${day * 30}, stale-while-revalidate=${day}` }],
      },
    ];
  },
};

/**
 * Shared hosting limits how many threads one account may start. By default `next build` starts one worker per CPU
 * core of the build machine, and each worker starts a thread pool of the same size, which on a many-core host can
 * exceed the limit ("OS can't spawn worker thread"). Only the production build is limited, so `next dev` stays fast.
 * Raise these numbers if your build host allows more.
 */
const BUILD_WORKERS = 2;

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_PRODUCTION_BUILD) return nextConfig;
  process.env.TOKIO_WORKER_THREADS ??= String(BUILD_WORKERS);
  return { ...nextConfig, experimental: { ...nextConfig.experimental, cpus: BUILD_WORKERS } };
}
