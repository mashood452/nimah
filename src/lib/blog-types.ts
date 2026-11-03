import type { DocSection } from "./legal/types";
import type { ProductCategory } from "@/components/products/products-data";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  updatedAt?: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  takeaways: string[];
  sections: DocSection[];
  productTag?: { category: ProductCategory; tag?: string };
};
