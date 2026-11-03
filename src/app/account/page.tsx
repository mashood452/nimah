import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/account/LogoutButton";
import { EmailPreferences } from "@/components/account/EmailPreferences";
import { requireCustomer } from "@/lib/auth/session";
import { queryRows } from "@/lib/db";
import styles from "@/components/account/Account.module.css";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Your personal details and order history at Nimah Opticals.",
  robots: { index: false, follow: true },
};

export default async function AccountPage() {
  const customer = await requireCustomer();
  const orders = await queryRows(`SELECT order_number, status, currency, grand_total, placed_at
    FROM orders WHERE account_id = ? ORDER BY placed_at DESC, id DESC LIMIT 10`, [customer.id]);
  const date = (value: string) => new Date(value.replace(" ", "T").replace(/Z?$/, "Z")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return <main className={styles.dashboard}><div className={styles.dashboardInner}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Your account</span></nav>
    <header className={styles.accountHeader}>
      <div><span className={styles.eyebrow}>Your Nimah account</span><h1>Hello, {customer.name.split(" ")[0]}.</h1><p>Good to see you. Your details and latest orders are right here.</p></div>
      <LogoutButton />
    </header>
    <div className={styles.summary}>
      <section className={styles.panel} aria-labelledby="details-title"><h2 id="details-title">Personal details</h2>
        <dl className={styles.details}><div><dt>Name</dt><dd>{customer.name}</dd></div><div><dt>Email</dt><dd>{customer.email}</dd></div>
          {customer.phone && <div><dt>Phone</dt><dd>{customer.phone}</dd></div>}
          <div><dt>Member since</dt><dd>{date(customer.joinedAt)}</dd></div>
        </dl>
        <EmailPreferences enabled={customer.cartReminders} />
      </section>
      <section className={styles.panel} aria-labelledby="orders-title"><h2 id="orders-title">Recent orders</h2>
        {orders.length ? <table className={styles.orders}><caption className={styles.emptyNotice}>Your ten most recent orders</caption><thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Total</th></tr></thead><tbody>
          {orders.map((order) => <tr key={order.order_number}><td>{order.order_number}</td><td>{date(String(order.placed_at))}</td><td>{String(order.status).replace(/^./, (letter) => letter.toUpperCase())}</td><td>{new Intl.NumberFormat("en-AE", { style: "currency", currency: String(order.currency) }).format(Number(order.grand_total))}</td></tr>)}
        </tbody></table> : <div className={styles.emptyOrders}><strong>Your next favourite pair is waiting.</strong><p>You have no orders linked to this account yet. Explore our collection, or contact our team for help with an existing order.</p><Link className={styles.primary} href="/shop">Explore eyewear <span aria-hidden="true">↗</span></Link></div>}
      </section>
    </div>
    <nav className={styles.quickLinks} aria-label="Account shortcuts">
      <Link href="/wishlist"><strong>Your wishlist ↗</strong><span>Your favourite frames, saved on this device.</span></Link>
      <Link href="/cart"><strong>Your bag ↗</strong><span>Review the pairs you have picked out.</span></Link>
      <Link href="/contact"><strong>Here to help ↗</strong><span>Talk to our team about orders, fittings or returns.</span></Link>
    </nav>
  </div></main>;
}
