import type { Metadata } from "next";
import { ProductShelf } from "@/components/page/PageKit";
import { CartView } from "@/components/shop/CartView";
import { ShopFrame } from "@/components/shop/ShopFrame";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the items in your Nimah Opticals bag.",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const products = await getProducts();
  return (
    <>
      <ShopFrame
        title="Your bag"
        intro="Review your selection. Your bag is saved on this device until you place your order."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Bag", href: "/cart" },
        ]}
      >
        <CartView />
      </ShopFrame>
      <ProductShelf eyebrow="Keep exploring" title="You may also like" products={products.slice(0, 4)} href="/shop" hrefLabel="Shop all" />
    </>
  );
}
