import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "./LogoutButton";
import account from "./Account.module.css";
import area from "./AccountArea.module.css";

export type AccountTab = "overview" | "orders" | "addresses" | "profile";

const tabs: { key: AccountTab; href: string; label: string }[] = [
  { key: "overview", href: "/account", label: "Overview" },
  { key: "orders", href: "/account/orders", label: "Orders" },
  { key: "addresses", href: "/account/addresses", label: "Addresses" },
  { key: "profile", href: "/account/profile", label: "Profile" },
];

/** The frame shared by every page of the customer area: heading, log out button and the section tabs. */
export function AccountShell({
  current,
  title,
  intro,
  eyebrow = "Your Nimah account",
  trail,
  children,
}: {
  current: AccountTab;
  title: string;
  intro?: string;
  eyebrow?: string;
  /** extra breadcrumb steps after "Your account", for example the order number */
  trail?: { label: string; href?: string }[];
  children: ReactNode;
}) {
  return (
    <main className={account.dashboard}>
      <div className={account.dashboardInner}>
        <nav className={account.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          {trail?.length ? <Link href="/account">Your account</Link> : <span>Your account</span>}
          {trail?.map((step, i) => (
            <span key={step.label} style={{ display: "contents" }}>
              <span aria-hidden="true">/</span>
              {step.href && i < trail.length - 1 ? <Link href={step.href}>{step.label}</Link> : <span>{step.label}</span>}
            </span>
          ))}
        </nav>
        <header className={account.accountHeader}>
          <div>
            <span className={account.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
          </div>
          <LogoutButton />
        </header>
        <nav className={area.tabs} aria-label="Account sections">
          {tabs.map((t) => (
            <Link key={t.key} href={t.href} className={area.tab} aria-current={t.key === current ? "page" : undefined}>{t.label}</Link>
          ))}
        </nav>
        {children}
      </div>
    </main>
  );
}
