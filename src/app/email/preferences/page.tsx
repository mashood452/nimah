import type { Metadata } from "next";
import Link from "next/link";
import { unsubscribeAccount } from "@/lib/email/security";
import { ShopFrame } from "@/components/shop/ShopFrame";
import { UnsubscribeForm } from "@/components/account/UnsubscribeForm";

export const metadata: Metadata = { title: "Email Preferences", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function PreferencesPage({ searchParams }: PageProps<"/email/preferences">) {
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  let valid = false;
  try { valid = !!unsubscribeAccount(token); } catch { /* Missing configuration does not authorize a preference change. */ }
  return <ShopFrame title="Your inbox, your choice" crumbs={[{ name: "Home", href: "/" }, { name: "Email preferences", href: "/email/preferences" }]}>
    <section style={{ maxWidth: 560 }}>
      {query.updated === "1" ? <p role="status">Bag reminder emails are now turned off. Account verification emails will still be sent when you request them.</p>
        : valid ? <><p>Would you like to stop receiving reminders about items left in your bag?</p><UnsubscribeForm token={token} /></>
          : <p>This email preference link is invalid. You can also manage reminders in your account.</p>}
      <p><Link href="/account">Go to your account →</Link></p>
    </section>
  </ShopFrame>;
}
