"use client";

import { useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Recaptcha } from "./Recaptcha";
import styles from "./Account.module.css";

export function CaptchaSearchForm({ className, buttonClassName, placeholder = "Search eyewear", defaultValue = "", inputRef, icon }: {
  className?: string; buttonClassName?: string; placeholder?: string; defaultValue?: string; inputRef?: RefObject<HTMLInputElement | null>; icon?: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || pending) return;
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!query) return;
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/forms/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ captchaToken: token }) });
      if (!response.ok) throw new Error();
      window.location.assign(new URL(`/search?q=${encodeURIComponent(query)}`, window.location.origin).href);
    } catch { setMessage("Please complete the security check again."); setToken(null); setGeneration((value) => value + 1); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} role="search" style={{ display: "grid", gap: 14, marginBottom: 24 }}>
    <div className={className} style={{ marginBottom: 0 }}>{icon}<input ref={inputRef} type="search" name="q" defaultValue={defaultValue} placeholder={placeholder} aria-label="Search products" autoComplete="off" maxLength={200} required /><button type="submit" className={buttonClassName ?? styles.secondary} disabled={!token || pending}>{pending ? "Searching..." : "Search"}</button></div>
    <Recaptcha key={generation} onToken={setToken} />
    {message && <p className={styles.fieldError} role="alert">{message}</p>}
  </form>;
}
