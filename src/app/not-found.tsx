import { CaptchaSearchForm } from "@/components/account/CaptchaSearchForm";
import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow } from "@/components/navbar/icons";
import styles from "@/components/page/Page.module.css";
import nf from "@/components/page/NotFound.module.css";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Sunglasses", href: "/sunglasses", text: "Polarized, UV400 and gradient lenses" },
  { label: "Blue-Cut Glasses", href: "/blue-light-glasses", text: "Comfort for long screen days" },
  { label: "Eyeglasses", href: "/eyeglasses", text: "Refined optical frames" },
  { label: "New arrivals", href: "/new-arrivals", text: "The newest frames" },
];

export default function NotFound() {
  return (
    <main className={nf.wrap}>
      <p className={nf.code} aria-hidden="true">
        404
      </p>
      <p className={styles.eyebrow}>Page not found</p>
      <h1 className={nf.title}>This page has wandered off</h1>
      <p className={nf.text}>
        The page you are looking for may have moved, or the link may be mistyped. Try a search, or head back to the
        collection.
      </p>

      <CaptchaSearchForm className={nf.search} placeholder="Search eyewear" />

      <div className={nf.actions}>
        <Link href="/" className={styles.btnPrimary}>
          Back to home <IconArrow />
        </Link>
        <Link href="/contact" className={styles.btnGhost}>
          Contact us
        </Link>
      </div>

      <ul className={nf.links}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>
              <strong>{l.label}</strong>
              <span>{l.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
