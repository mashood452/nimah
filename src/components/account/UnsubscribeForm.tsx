"use client";

import { useState, type FormEvent } from "react";
import { Recaptcha } from "./Recaptcha";
import styles from "./Account.module.css";

export function UnsubscribeForm({ token }: { token: string }) {
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha || pending) return;
    setPending(true);
    try {
      const response = await fetch(`/api/email/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ captchaToken: captcha }) });
      if (!response.ok) throw new Error();
      window.location.replace("/email/preferences?updated=1");
    } catch { setMessage("Please complete the security check and try again."); setCaptcha(null); setGeneration((value) => value + 1); setPending(false); }
  }
  return <form onSubmit={submit} className={styles.form}><Recaptcha key={generation} onToken={setCaptcha} /><button className={styles.secondary} type="submit" disabled={!captcha || pending}>{pending ? "Saving..." : "Stop bag reminder emails"}</button>{message && <p className={styles.fieldError} role="alert">{message}</p>}</form>;
}
