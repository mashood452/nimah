import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { EmailPreferences } from "@/components/account/EmailPreferences";
import { OrderStatus } from "@/components/account/OrderStatus";
import { Price } from "@/components/ui/Price";
import { addressLine, formatPhone } from "@/lib/account/validation";
import { listAddresses } from "@/lib/account/handlers";
import { requireCustomer } from "@/lib/auth/session";
import { listOrders } from "@/lib/orders";
import account from "@/components/account/Account.module.css";
import area from "@/components/account/AccountArea.module.css";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Your personal details, delivery addresses and order history at Nimah Opticals.",
  robots: { index: false, follow: true },
};

const fmtDate = (value: string) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default async function AccountPage() {
  const customer = await requireCustomer();
  const [addresses, orders] = await Promise.all([listAddresses(customer.id), listOrders(customer.id, 5)]);
  const home = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <AccountShell current="overview" title={`Hello, ${customer.name.split(" ")[0]}.`} intro="Good to see you. Your details, addresses and orders are all here.">
      <div className={area.overview}>
        <section className={area.panel} aria-labelledby="details-title">
          <div className={area.panelHead}>
            <h2 id="details-title" className={area.panelTitle}>Personal details</h2>
            <Link href="/account/profile" className={area.editLink}>Edit</Link>
          </div>
          <dl className={account.details}>
            <div><dt>Name</dt><dd>{customer.name}</dd></div>
            <div><dt>Email</dt><dd>{customer.email}</dd></div>
            <div><dt>Mobile</dt><dd>{customer.phone ? formatPhone(customer.phone) : <Link href="/account/profile" className={area.inlineLink}>Add your mobile number</Link>}</dd></div>
            <div><dt>Member since</dt><dd>{fmtDate(customer.joinedAt)}</dd></div>
          </dl>
          <EmailPreferences enabled={customer.cartReminders} />
        </section>

        <section className={area.panel} aria-labelledby="address-title">
          <div className={area.panelHead}>
            <h2 id="address-title" className={area.panelTitle}>Delivery address</h2>
            <Link href="/account/addresses" className={area.editLink}>{home ? "Manage" : "Add"}</Link>
          </div>
          {home ? (
            <p className={area.addressText}>
              <strong>{home.label || "Default"}</strong><br />{home.recipient}<br />{addressLine(home)}<br />{formatPhone(home.phone)}
            </p>
          ) : (
            <div className={area.empty}>
              <strong>Add a delivery address</strong>
              <p>Save an address once and checkout takes seconds.</p>
              <Link href="/account/addresses" className={account.primary}>Add an address</Link>
            </div>
          )}
        </section>
      </div>

      <section className={area.panel} aria-labelledby="orders-title" style={{ marginTop: 24 }}>
        <div className={area.panelHead}>
          <h2 id="orders-title" className={area.panelTitle}>Recent orders</h2>
          {orders.length > 0 && <Link href="/account/orders" className={area.editLink}>View all</Link>}
        </div>
        {orders.length ? (
          <ul className={area.orderList}>
            {orders.map((o) => (
              <li key={o.number}>
                <Link href={`/account/orders/${o.number}`} className={area.orderRow}>
                  <span className={area.orderNum}>{o.number}</span>
                  <span className={area.orderMeta}>{fmtDate(o.placedAt)} · {o.itemCount} {o.itemCount === 1 ? "item" : "items"}</span>
                  <OrderStatus status={o.status} />
                  <span className={area.orderTotal}>{o.currency === "AED" ? <Price amount={o.total} decimals={2} /> : `${o.currency} ${o.total.toFixed(2)}`}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={area.empty}>
            <strong>Your next favourite pair is waiting.</strong>
            <p>You have no orders yet. Explore the collection and place your first order online.</p>
            <Link href="/shop" className={account.primary}>Explore eyewear</Link>
          </div>
        )}
      </section>

      <nav className={account.quickLinks} aria-label="Account shortcuts">
        <Link href="/wishlist"><strong>Your wishlist ↗</strong><span>Your favourite frames, saved on this device.</span></Link>
        <Link href="/cart"><strong>Your bag ↗</strong><span>Review the pairs you have picked out.</span></Link>
        <Link href="/contact"><strong>Here to help ↗</strong><span>Talk to our team about orders, fittings or returns.</span></Link>
      </nav>
    </AccountShell>
  );
}
