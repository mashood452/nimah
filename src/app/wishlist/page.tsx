import type { Metadata } from "next";
import { ShopFrame } from "@/components/shop/ShopFrame";
import { WishlistView } from "@/components/shop/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The frames you have saved at Nimah Opticals.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <ShopFrame
      title="Wishlist"
      intro="The pairs you have saved, all in one place. Your wishlist is kept on this device."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Wishlist", href: "/wishlist" },
      ]}
    >
      <WishlistView />
    </ShopFrame>
  );
}
