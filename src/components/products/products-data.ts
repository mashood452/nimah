export type FrameShape = string;
export type ProductCategory = string;

export type Product = {
  slug: string;
  name: string;
  /** short descriptor shown under the name */
  subtitle: string;
  category: ProductCategory;
  categorySlug?: string;
  categoryLabel?: string;
  price: number;
  shape: FrameShape;
  shapeLabel?: string;
  swatches: string[];
  badge?: "New" | "Best seller";
  /**
   * R2 object key, for example "products/aurelia.webp".
   * Leave empty to show the placeholder.
   */
  image?: string;
  imageAlt?: string;
  description?: string;
  tags?: string[];
  features?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  updatedAt?: string;
};


