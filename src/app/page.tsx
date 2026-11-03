import type { Metadata } from "next";
import { Brands } from "@/components/brands/Brands";
import { Faq } from "@/components/faq/Faq";
import { Gallery } from "@/components/gallery/Gallery";
import { Hero } from "@/components/hero/Hero";
import { Products } from "@/components/products/Products";
import { Lifestyle } from "@/components/sections/Lifestyle";
import { ShopByStyle } from "@/components/sections/ShopByStyle";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Nimah Opticals | Luxury Sunglasses, Blue-Cut Glasses & Eyewear" },
  description: siteConfig.description,
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ShopByStyle />
      <Products />
      <Brands />
      <Lifestyle />
      <Gallery />
      <Faq />
    </main>
  );
}
