import type { Metadata } from "next";
import Link from "next/link";
import { ShopFrame } from "@/components/shop/ShopFrame";
import styles from "@/components/shop/Shop.module.css";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Manage your Nimah Opticals bag, wishlist and enquiries.",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <ShopFrame
      title="Your account"
      intro="Customer accounts are on their way, with order tracking and saved details. Until then, everything you save is kept on this device."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Account", href: "/account" },
      ]}
    >
      <ul className={styles.accountGrid}>
        <li className={styles.accountCard}>
          <h2>Wishlist</h2>
          <p>Frames you have saved with the heart. They are stored in this browser and stay until you remove them.</p>
          <Link href="/wishlist">View wishlist</Link>
        </li>
        <li className={styles.accountCard}>
          <h2>Bag</h2>
          <p>Review the pairs in your bag, change quantities or copy an order summary to send to our team.</p>
          <Link href="/cart">View bag</Link>
        </li>
        <li className={styles.accountCard}>
          <h2>Help with an order</h2>
          <p>Questions about an order, a fitting or a return? Our team is happy to help.</p>
          <Link href="/contact">Contact us</Link>
        </li>
      </ul>
    </ShopFrame>
  );
}
