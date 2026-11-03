"use client";

import { useState, type FormEvent } from "react";
import { Recaptcha, useRecaptcha } from "./Recaptcha";
import styles from "./Account.module.css";

export function UnsubscribeForm({ token }: { token: string }) {
  const { ready, executeCaptcha } = useRecaptcha();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || pending) return;
    setPending(true);
    try {
      const captchaToken = await executeCaptcha("unsubscribe");
      const response = await fetch(`/api/email/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ captchaToken }) });
      if (!response.ok) throw new Error();
      window.location.replace("/email/preferences?updated=1");
    } catch { setMessage("The security check could not complete. Please try again."); setPending(false); }
  }
  return <form onSubmit={submit} className={styles.form}><Recaptcha /><button className={styles.secondary} type="submit" disabled={!ready || pending}>{pending ? "Saving..." : "Stop bag reminder emails"}</button>{message && <p className={styles.fieldError} role="alert">{message}</p>}</form>;
}
