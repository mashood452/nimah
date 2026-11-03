export type Brand = {
  name: string;
  /**
   * Logo file under /public, for example "/images/brands/acme.svg" or ".png".
   * Leave empty to show a placeholder slot. Use a dark or single-colour logo on a transparent background.
   */
  logo?: string;
  /** Intrinsic size of the logo file, used to avoid layout shift. */
  width?: number;
  height?: number;
  href?: string;
};

// Official logo assets; sources are recorded in docs/brand-logo-sources.md.
export const brands: Brand[] = [
  { name: "Ray-Ban", logo: "/images/brands/ray-ban.png", width: 215, height: 112 },
  { name: "Oakley", logo: "/images/brands/oakley.png", width: 309, height: 112 },
  { name: "Gucci", logo: "/images/brands/gucci.png", width: 125, height: 24 },
  { name: "Prada", logo: "/images/brands/prada.png", width: 360, height: 83 },
  { name: "Versace", logo: "/images/brands/versace.png", width: 218, height: 112 },
  { name: "Burberry", logo: "/images/brands/burberry.png", width: 360, height: 58 },
  { name: "Dolce & Gabbana", logo: "/images/brands/dolce-gabbana.png", width: 360, height: 37 },
  { name: "Vogue Eyewear", logo: "/images/brands/vogue-eyewear.png", width: 263, height: 112 },
];
