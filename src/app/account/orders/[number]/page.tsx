import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderStatus } from "@/components/account/OrderStatus";
import { ProductPlaceholder } from "@/components/products/ProductPlaceholder";
import { Price } from "@/components/ui/Price";
import { addressLine, formatPhone } from "@/lib/account/validation";
import { requireCustomer } from "@/lib/auth/session";
import { mediaUrl } from "@/lib/media";
import { getOrder, PAYMENT_METHODS, type PaymentMethod } from "@/lib/orders";
import { siteConfig } from "@/lib/site";
import account from "@/components/account/Account.module.css";
import area from "@/components/account/AccountArea.module.css";

export const metadata: Metadata = { title: "Your Order", robots: { index: false, follow: false } };

const STEPS = [
  { status: "pending", label: "Received" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Preparing" },
  { status: "shipped", label: "On its way" },
  { status: "delivered", label: "Delivered" },
];

const fmtDate = (value: string) => new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dubai" });

export default async function OrderPage({ params, searchParams }: PageProps<"/account/orders/[number]">) {
  const [{ number }, query] = await Promise.all([params, searchParams]);
  const customer = await requireCustomer();
  const order = await getOrder(customer.id, number.toUpperCase());
  if (!order) notFound();

  const step = STEPS.findIndex((s) => s.status === order.status);
  const closed = order.status === "cancelled" || order.status === "refunded";
  const method = PAYMENT_METHODS[order.paymentMethod as PaymentMethod] ?? order.paymentMethod;
  const whatsapp = siteConfig.social.whatsapp
    ? `${siteConfig.social.whatsapp}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I have a question about my order ${order.number}.`)}`
    : "";

  return (
    <AccountShell current="orders" title={`Order ${order.number}`} intro={`Placed ${fmtDate(order.placedAt)}`} trail={[{ label: "Orders", href: "/account/orders" }, { label: order.number }]}>
      {query.placed === "1" && (
        <section className={area.thanks} role="status" aria-labelledby="thanks-title">
          <h2 id="thanks-title">Thank you, {customer.name.split(" ")[0]}. Your order is placed.</h2>
          <p>We have sent a confirmation to <strong>{customer.email}</strong>. Our team will be in touch to confirm your delivery. You pay in cash when it arrives.</p>
        </section>
      )}

      <div className={area.orderLayout}>
        <div className={area.stack}>
          <section className={area.panel} aria-labelledby="progress-title">
            <div className={area.panelHead}>
              <h2 id="progress-title" className={area.panelTitle}>Status</h2>
              <OrderStatus status={order.status} />
            </div>
            {closed ? (
              <p className={area.panelText}>This order was {order.status}. If you have questions, our team is happy to help.</p>
            ) : (
              <ol className={area.timeline}>
                {STEPS.map((s, i) => (
                  <li key={s.status} data-state={i < step ? "done" : i === step ? "current" : "todo"}>
                    <span className={area.dot} aria-hidden="true" />
                    <span>{s.label}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className={area.panel} aria-labelledby="items-title">
            <h2 id="items-title" className={area.panelTitle}>Items</h2>
            <ul className={area.itemList}>
              {order.items.map((item, i) => (
                <li key={`${item.slug}-${item.color}-${i}`} className={area.item}>
                  <Link href={`/products/${item.slug}`} className={area.itemImage} aria-hidden="true" tabIndex={-1}>
                    {item.image ? <Image src={mediaUrl(`/images/${item.image}`)} alt="" fill sizes="80px" /> : <ProductPlaceholder shape="round" />}
                  </Link>
                  <div className={area.itemInfo}>
                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    <span>{item.color} · Qty {item.qty}</span>
                  </div>
                  <span className={area.itemPrice}><Price amount={item.lineTotal} decimals={2} /></span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={area.stack} aria-label="Order details">
          <section className={area.panel} aria-labelledby="summary-title">
            <h2 id="summary-title" className={area.panelTitle}>Summary</h2>
            <dl className={area.totals}>
              <div><dt>Subtotal</dt><dd><Price amount={order.subtotal} decimals={2} /></dd></div>
              <div><dt>Delivery</dt><dd>{order.shipping > 0 ? <Price amount={order.shipping} decimals={2} /> : "Free"}</dd></div>
              <div className={area.grand}><dt>Total</dt><dd><Price amount={order.total} decimals={2} /></dd></div>
            </dl>
            <p className={area.panelText}>Payment: {method}{order.paymentStatus === "paid" ? " (paid)" : ""}.</p>
          </section>
          <section className={area.panel} aria-labelledby="ship-title">
            <h2 id="ship-title" className={area.panelTitle}>Delivering to</h2>
            <p className={area.addressText}>{order.address.recipient}<br />{addressLine(order.address)}<br />{formatPhone(order.address.phone)}</p>
            {order.notes && <p className={area.panelText}><strong>Your notes:</strong> {order.notes}</p>}
          </section>
          <section className={area.panel}>
            <h2 className={area.panelTitle}>Need help?</h2>
            <p className={area.panelText}>Quote <strong>{order.number}</strong> when you contact us.</p>
            <div className={area.stack}>
              {whatsapp && <a href={whatsapp} className={account.primary} target="_blank" rel="noopener noreferrer">WhatsApp us</a>}
              <Link href="/contact" className={area.ghostBtn}>Contact our team</Link>
            </div>
          </section>
        </aside>
      </div>
    </AccountShell>
  );
}
