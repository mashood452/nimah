import type { Metadata } from "next";
import { Brands } from "@/components/brands/Brands";
import { Faq } from "@/components/faq/Faq";
import { Gallery } from "@/components/gallery/Gallery";
import { Hero } from "@/components/hero/Hero";
import { Products } from "@/components/products/Products";
import { Lifestyle } from "@/components/sections/Lifestyle";
import { ShopByStyle } from "@/components/sections/ShopByStyle";
import { StylistCta } from "@/components/sections/StylistCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

// Search results show about 60 characters of the title and 155 to 160 of the description.
export const metadata: Metadata = {
  title: { absolute: "Luxury Sunglasses & Blue-Cut Glasses UAE | Nimah Opticals" },
  description:
    "Shop luxury sunglasses, blue-cut glasses, eyeglasses and contact lenses at Nimah Opticals. UV400 protection and premium frames, delivered across the UAE.",
};

export default function Home() {
  return (
    <main>
      <JsonLd data={homeSchema(siteConfig)} />
      <Hero />
      <ShopByStyle />
      <Products />
      <Brands />
      <Lifestyle />
      <Gallery />
      <StylistCta />
      <Faq />
    </main>
  );
}
