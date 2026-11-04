import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { listAddresses } from "@/lib/account/handlers";
import { requireCustomer } from "@/lib/auth/session";
import { siteConfig } from "@/lib/site";
import account from "@/components/account/Account.module.css";
import styles from "@/components/checkout/Checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose your delivery address and place your Nimah Opticals order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const customer = await requireCustomer("/checkout");
  const addresses = await listAddresses(customer.id);
  return (
    <main className={account.dashboard}>
      <div className={styles.wrap}>
        <nav className={account.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/cart">Your bag</Link><span aria-hidden="true">/</span><span>Checkout</span>
        </nav>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.intro}>Almost there. Check your details and place your order. Delivery is across the UAE.</p>
        <CheckoutForm addresses={addresses} customer={{ name: customer.name, email: customer.email, phone: customer.phone }} deliveryFee={siteConfig.checkout.deliveryFee} />
      </div>
    </main>
  );
}
