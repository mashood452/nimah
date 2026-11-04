import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderStatus } from "@/components/account/OrderStatus";
import { Price } from "@/components/ui/Price";
import { requireCustomer } from "@/lib/auth/session";
import { listOrders } from "@/lib/orders";
import account from "@/components/account/Account.module.css";
import area from "@/components/account/AccountArea.module.css";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Your order history at Nimah Opticals.",
  robots: { index: false, follow: true },
};

const fmtDate = (value: string) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default async function OrdersPage() {
  const customer = await requireCustomer();
  const orders = await listOrders(customer.id);
  return (
    <AccountShell current="orders" title="Your orders" intro="Every order you have placed with us, newest first.">
      <section className={area.panel} aria-label="Orders">
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
            <strong>No orders yet.</strong>
            <p>When you place an order, it will appear here so you can follow it.</p>
            <Link href="/shop" className={account.primary}>Explore eyewear</Link>
          </div>
        )}
      </section>
    </AccountShell>
  );
}
