import type { NextConfig } from "next";

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
  images: {
    remotePatterns: mediaImagePatterns(),
  },
};

export default nextConfig;
