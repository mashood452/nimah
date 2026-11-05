"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode, RefObject } from "react";
import styles from "./Account.module.css";

/**
 * Product search box. It goes straight to the results page.
 *
 * Search used to run a reCAPTCHA v3 check first, but that protected nothing (the results page is public and opens
 * directly at /search?q=...) and Google scores some real visitors below the pass mark, for example in private
 * browsing or on a VPN, who then saw "The security check could not complete" and could not search at all.
 * Forms that create or send something (log in, sign up, contact, prescriptions) keep their checks.
 */
export function CaptchaSearchForm({ className, formClassName, buttonClassName, placeholder = "Search eyewear", defaultValue = "", inputRef, icon }: {
  className?: string; formClassName?: string; buttonClassName?: string; placeholder?: string; defaultValue?: string; inputRef?: RefObject<HTMLInputElement | null>; icon?: ReactNode;
}) {
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }
  return <form onSubmit={submit} role="search" action="/search" className={formClassName} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14, marginBottom: 24 }}>
    <div className={className} style={{ marginBottom: 0 }}>{icon}<input ref={inputRef} type="search" name="q" defaultValue={defaultValue} placeholder={placeholder} aria-label="Search products" autoComplete="off" maxLength={200} required /><button type="submit" className={buttonClassName ?? styles.secondary}>Search</button></div>
  </form>;
}
