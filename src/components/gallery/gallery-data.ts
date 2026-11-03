export type GalleryTone = "plum" | "cream" | "blush" | "champagne" | "rose" | "sand";

export type GalleryItem = {
  /** Photo under /public, for example "/images/gallery/look-01.webp". Leave empty for a placeholder. */
  src?: string;
  alt: string;
  caption: string;
  /** Placeholder colour only; ignored once a photo is set. */
  tone: GalleryTone;
};

// Seven coordinated editorial photos fill the lookbook layout.
export const gallery: GalleryItem[] = [
  { src: "/images/gallery/golden-hour-v2.webp", alt: "Woman in an ivory suit wearing tortoiseshell sunglasses on a sunlit rooftop", caption: "Golden hour", tone: "plum" },
  { src: "/images/gallery/tortoise-detail-v2.webp", alt: "Man wearing tortoiseshell wayfarer sunglasses at an outdoor cafe", caption: "Tortoise detail", tone: "cream" },
  { src: "/images/gallery/work-day-v2.webp", alt: "Man in a cream knit polo wearing clear-lens gold glasses at a studio desk", caption: "Work day", tone: "blush" },
  { src: "/images/gallery/cat-eye-edit-v2.webp", alt: "Woman wearing burgundy cat-eye sunglasses and a cream jacket", caption: "Cat-eye edit", tone: "champagne" },
  { src: "/images/gallery/round-and-gold-v2.webp", alt: "Man wearing round gold sunglasses with dark espresso tailoring", caption: "Round and gold", tone: "rose" },
  { src: "/images/gallery/city-essentials-v2.webp", alt: "Woman in optical frames and man in black sunglasses walking through the city", caption: "City essentials", tone: "sand" },
  { src: "/images/gallery/coastal-light-v2.webp", alt: "Woman wearing oversized amber sunglasses and ivory linen by the sea", caption: "Coastal light", tone: "cream" },
];
