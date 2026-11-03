import type { Metadata } from "next";
import { Catalog } from "@/components/catalog/Catalog";
import { EmptyState } from "@/components/page/PageKit";
import { newArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest sunglasses, blue-cut glasses and eyeglasses to arrive at Nimah Opticals.",
  alternates: { canonical: "/new-arrivals" },
};

export default async function NewArrivalsPage() {
  return (
    <Catalog
      title="New arrivals"
      intro="The newest frames to join the collection, from fresh sunglasses shapes to everyday optical styles."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "New arrivals", href: "/new-arrivals" },
      ]}
      chipGroups={[
        {
          label: "Shop by category",
          chips: [
            { label: "New in", href: "/new-arrivals", active: true },
            { label: "Sunglasses", href: "/sunglasses" },
            { label: "Blue-Cut Glasses", href: "/blue-light-glasses" },
            { label: "Eyeglasses", href: "/eyeglasses" },
          ],
        },
      ]}
      products={await newArrivals()}
      emptyState={
        <EmptyState
          title="New styles are coming"
          text="Check back soon, or browse the full collection in the meantime."
          actions={[{ label: "Shop all eyewear", href: "/shop" }]}
        />
      }
      guideTitle="Always something new"
      guide={[
        "We add new frames regularly, so this page is the quickest way to see what has just arrived. Save your favourites with the heart and they will wait for you in your wishlist.",
      ]}
      guideLink={{ label: "View your wishlist", href: "/wishlist" }}
    />
  );
}
