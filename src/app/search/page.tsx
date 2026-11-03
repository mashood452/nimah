import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/shop/SearchView";
import { ShopFrame } from "@/components/shop/ShopFrame";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Nimah Opticals collection.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <ShopFrame
      title="Search"
      intro="Find sunglasses, blue-cut glasses and frames by name, shape or lens."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Search", href: "/search" },
      ]}
    >
      {/* the query is read in the browser, so it sits behind a Suspense boundary */}
      <Suspense fallback={<p aria-busy="true">Loading search</p>}>
        <SearchView />
      </Suspense>
    </ShopFrame>
  );
}
