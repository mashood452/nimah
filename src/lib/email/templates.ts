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
