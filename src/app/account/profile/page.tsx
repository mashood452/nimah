import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { EmailPreferences } from "@/components/account/EmailPreferences";
import { DetailsForm, EmailSection } from "@/components/account/ProfileForm";
import { requireCustomer } from "@/lib/auth/session";
import area from "@/components/account/AccountArea.module.css";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "Update your name, mobile number and email address at Nimah Opticals.",
  robots: { index: false, follow: true },
};

export default async function ProfilePage() {
  const customer = await requireCustomer();
  return (
    <AccountShell current="profile" title="Your profile" intro="Keep your details up to date so your orders reach you without a hitch.">
      <div className={area.stack}>
        <section className={area.panel} aria-labelledby="details-title">
          <h2 id="details-title" className={area.panelTitle}>Personal details</h2>
          <DetailsForm name={customer.name} phone={customer.phone} />
        </section>
        <section className={area.panel} aria-labelledby="email-title">
          <h2 id="email-title" className={area.panelTitle}>Email address</h2>
          <p className={area.panelText}>This is the address you log in with and where we send your order updates.</p>
          <EmailSection email={customer.email} />
        </section>
        <section className={area.panel} aria-labelledby="prefs-title">
          <h2 id="prefs-title" className={area.panelTitle}>Email preferences</h2>
          <EmailPreferences enabled={customer.cartReminders} />
        </section>
      </div>
    </AccountShell>
  );
}
