"use client";

import { useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Recaptcha, useRecaptcha } from "./Recaptcha";
import styles from "./Account.module.css";

export function CaptchaSearchForm({ className, formClassName, buttonClassName, placeholder = "Search eyewear", defaultValue = "", inputRef, icon }: {
  className?: string; formClassName?: string; buttonClassName?: string; placeholder?: string; defaultValue?: string; inputRef?: RefObject<HTMLInputElement | null>; icon?: ReactNode;
}) {
  const { ready, executeCaptcha } = useRecaptcha();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || pending) return;
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!query) return;
    setPending(true); setMessage("");
    try {
      const captchaToken = await executeCaptcha("search");
      const response = await fetch("/api/forms/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ captchaToken, purpose: "search" }) });
      if (!response.ok) throw new Error();
      window.location.assign(new URL(`/search?q=${encodeURIComponent(query)}`, window.location.origin).href);
    } catch { setMessage("The security check could not complete. Please try again."); }
    finally { setPending(false); }
  }
  // minmax(0, 1fr) keeps the single column no wider than the form, so the long reCAPTCHA notice wraps instead of
  // stretching the column (and whatever contains the form) beyond its container.
  return <form onSubmit={submit} role="search" className={formClassName} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14, marginBottom: 24 }}>
    <div className={className} style={{ marginBottom: 0 }}>{icon}<input ref={inputRef} type="search" name="q" defaultValue={defaultValue} placeholder={placeholder} aria-label="Search products" autoComplete="off" maxLength={200} required /><button type="submit" className={buttonClassName ?? styles.secondary} disabled={!ready || pending}>{pending ? "Searching..." : "Search"}</button></div>
    <Recaptcha />
    {message && <p className={styles.fieldError} role="alert">{message}</p>}
  </form>;
}
