export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));

function shell(title: string, body: string, footer = "Eyewear, thoughtfully chosen.") {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;background:#f7f2f3;font-family:Arial,sans-serif;color:#1f1a1b"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(title)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#fff;border:1px solid #eadfe1"><tr><td align="center" style="padding:20px 32px;background:#fff;border-bottom:1px solid #eadfe1"><img src="cid:nimah-logo" alt="Nimah Opticals" width="138" height="90" style="display:block;width:138px;height:90px;border:0"></td></tr><tr><td style="padding:36px 32px">${body}</td></tr><tr><td style="padding:24px 32px;border-top:1px solid #eadfe1;color:#6e6466;font-size:12px;line-height:1.7">${footer}</td></tr></table></td></tr></table></body></html>`;
}

export function otpEmail(code: string, test = false) {
  if (!/^\d{6}$/.test(code)) throw new Error("Invalid verification code.");
  const subject = `${test ? "Test: " : ""}Your Nimah verification code`;
  return { subject, text: `Your Nimah Opticals verification code is ${code}. It expires in 10 minutes and can be used once. If you did not request this code, ignore this email.`,
    html: shell(subject, `<h1 style="margin:0 0 20px;font-size:30px;font-weight:500">A quick check. Then, you're in.</h1><p style="color:#6e6466;line-height:1.8">Use this code to verify your email address before creating your Nimah account.</p><div style="padding:24px;margin:28px 0;background:#f7f2f3;text-align:center;font-size:36px;letter-spacing:9px;color:#3c252a;font-weight:bold">${code}</div><p style="color:#6e6466;font-size:14px;line-height:1.8">This code expires in <strong>10 minutes</strong> and works once. Never share it with anyone.</p><p style="color:#6e6466;font-size:12px;line-height:1.7">If you didn't request this email, you can safely ignore it.</p>`) };
}

export type CartEmailItem = { name: string; slug: string; color: string; qty: number; price: number; image?: string };

export function cartEmail(name: string, items: CartEmailItem[], siteUrl: string, unsubscribe: string) {
  const base = new URL(siteUrl);
  const cartUrl = new URL("/account/login?next=/cart", base).href;
  const unsubscribeUrl = new URL(`/email/preferences?token=${encodeURIComponent(unsubscribe)}`, base).href;
  const money = (amount: number) => new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(amount);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subject = "Your Nimah bag is waiting for you";
  const rows = items.map((item) => `<tr><td style="padding:16px 0;border-bottom:1px solid #eadfe1">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="72" height="72" style="display:block;object-fit:cover">` : ""}</td><td style="padding:16px 12px;border-bottom:1px solid #eadfe1"><strong>${escapeHtml(item.name)}</strong><br><span style="font-size:12px;color:#6e6466">${escapeHtml(item.color)} · Qty ${item.qty}</span></td><td align="right" style="padding:16px 0;border-bottom:1px solid #eadfe1;white-space:nowrap">${money(item.price * item.qty)}</td></tr>`).join("");
  return { subject,
    text: `Hi ${name},\n\nYour Nimah bag is waiting.\n\n${items.map((item) => `${item.qty} × ${item.name} (${item.color}): ${money(item.price * item.qty)}`).join("\n")}\nSubtotal: ${money(total)}\n\nReturn to your bag: ${cartUrl}\nPrices and availability may change. Items are not reserved.\nStop cart reminders: ${unsubscribeUrl}`,
    html: shell(subject, `<h1 style="margin:0 0 20px;font-size:30px;font-weight:500">A little something you liked.</h1><p style="color:#6e6466;line-height:1.8">Hi ${escapeHtml(name)}, your selected frames are still in your bag. Come back whenever you're ready.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table><p style="text-align:right;margin:24px 0"><strong>Subtotal ${money(total)}</strong></p><a href="${escapeHtml(cartUrl)}" style="display:block;padding:18px 24px;background:#3c252a;color:#fff;text-align:center;text-decoration:none;font-size:14px">Return to your bag →</a><p style="color:#6e6466;font-size:12px;line-height:1.7;margin-top:24px">Prices and availability were checked when this email was sent. Items are not reserved.</p>`, `You're receiving this because you enabled bag reminders. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#3c252a">Stop bag reminder emails</a>.`),
    headers: { "List-Unsubscribe": `<${new URL(`/api/email/unsubscribe?token=${encodeURIComponent(unsubscribe)}`, base).href}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

export type OrderEmailData = {
  number: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: { recipient: string; phone: string; line1: string; line2: string; city: string; region: string };
  items: { name: string; color: string; qty: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  notes: string;
};

const aed = (amount: number) => new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(amount);
const addressText = (a: OrderEmailData["address"]) => [a.recipient, a.line1, a.line2, `${a.city}, ${a.region}`, a.phone].filter(Boolean).join("\n");

function orderTable(order: OrderEmailData) {
  const rows = order.items.map((item) => `<tr><td style="padding:14px 0;border-bottom:1px solid #eadfe1"><strong>${escapeHtml(item.name)}</strong><br><span style="font-size:12px;color:#6e6466">${escapeHtml(item.color)} · Qty ${item.qty}</span></td><td align="right" style="padding:14px 0;border-bottom:1px solid #eadfe1;white-space:nowrap">${aed(item.lineTotal)}</td></tr>`).join("");
  const line = (label: string, value: string, bold = false) => `<tr><td style="padding:6px 0;color:#6e6466">${label}</td><td align="right" style="padding:6px 0;${bold ? "font-weight:bold;color:#3c252a" : ""}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}${line("Subtotal", aed(order.subtotal))}${line("Delivery", order.shipping > 0 ? aed(order.shipping) : "Free")}${line("Total to pay on delivery", aed(order.total), true)}</table>`;
}

/** Confirmation sent to the customer when an order is placed. */
export function orderConfirmationEmail(order: OrderEmailData, siteUrl: string) {
  const link = new URL(`/account/orders/${encodeURIComponent(order.number)}`, siteUrl).href;
  const subject = `Your Nimah order ${order.number}`;
  const itemsText = order.items.map((item) => `${item.qty} x ${item.name} (${item.color}): ${aed(item.lineTotal)}`).join("\n");
  return {
    subject,
    text: `Hi ${order.customerName},\n\nThank you for your order ${order.number}.\n\n${itemsText}\nSubtotal: ${aed(order.subtotal)}\nDelivery: ${order.shipping > 0 ? aed(order.shipping) : "Free"}\nTotal to pay on delivery: ${aed(order.total)}\n\nDelivering to:\n${addressText(order.address)}\n\nPayment: cash on delivery. Our team will be in touch to confirm your delivery.\nView your order: ${link}`,
    html: shell(subject, `<h1 style="margin:0 0 12px;font-size:30px;font-weight:500">Thank you, ${escapeHtml(order.customerName.split(" ")[0])}.</h1><p style="color:#6e6466;line-height:1.8">We have your order <strong style="color:#3c252a">${escapeHtml(order.number)}</strong>. Our team will be in touch to confirm your delivery.</p>${orderTable(order)}<div style="margin:28px 0;padding:20px;background:#f7f2f3;font-size:14px;line-height:1.8"><strong>Delivering to</strong><br>${escapeHtml(addressText(order.address)).replace(/\n/g, "<br>")}</div><p style="color:#6e6466;font-size:14px;line-height:1.8">Payment is <strong>cash on delivery</strong>. Please have the exact amount ready if you can.</p><a href="${escapeHtml(link)}" style="display:block;padding:18px 24px;background:#3c252a;color:#fff;text-align:center;text-decoration:none;font-size:14px">View your order →</a>`),
  };
}

/** Heads-up for the Nimah team, so a new order never waits unseen in the database. */
export function newOrderNoticeEmail(order: OrderEmailData) {
  const subject = `New order ${order.number} (${aed(order.total)})`;
  const itemsText = order.items.map((item) => `${item.qty} x ${item.name} (${item.color}): ${aed(item.lineTotal)}`).join("\n");
  const text = `New online order ${order.number}\n\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\nPhone: ${order.customerPhone}\n\n${itemsText}\nDelivery: ${order.shipping > 0 ? aed(order.shipping) : "Free"}\nTotal (cash on delivery): ${aed(order.total)}\n\nDeliver to:\n${addressText(order.address)}${order.notes ? `\n\nCustomer notes: ${order.notes}` : ""}`;
  return {
    subject, text,
    html: shell(subject, `<h1 style="margin:0 0 16px;font-size:26px;font-weight:500">New order ${escapeHtml(order.number)}</h1><p style="line-height:1.8;color:#6e6466"><strong style="color:#1f1a1b">${escapeHtml(order.customerName)}</strong><br>${escapeHtml(order.customerEmail)}<br>${escapeHtml(order.customerPhone)}</p>${orderTable(order)}<div style="margin:24px 0;padding:20px;background:#f7f2f3;font-size:14px;line-height:1.8"><strong>Deliver to</strong><br>${escapeHtml(addressText(order.address)).replace(/\n/g, "<br>")}</div>${order.notes ? `<p style="font-size:14px;line-height:1.8"><strong>Customer notes:</strong> ${escapeHtml(order.notes)}</p>` : ""}`, "Sent automatically when an order is placed on the website."),
  };
}

/** Sent to the old address after the account email changes. */
export function emailChangedEmail(name: string, newEmail: string) {
  const subject = "Your Nimah email address was changed";
  return {
    subject,
    text: `Hi ${name},\n\nThe email address on your Nimah Opticals account was changed to ${newEmail}. If this was you, no action is needed.\n\nIf it was not you, contact us straight away so we can secure your account.`,
    html: shell(subject, `<h1 style="margin:0 0 20px;font-size:28px;font-weight:500">Your email address was changed.</h1><p style="color:#6e6466;line-height:1.8">Hi ${escapeHtml(name)}, the email address on your Nimah account was changed to <strong style="color:#3c252a">${escapeHtml(newEmail)}</strong>.</p><p style="color:#6e6466;line-height:1.8">If this was you, there is nothing more to do. If it was not you, please contact us straight away so we can secure your account.</p>`),
  };
}
