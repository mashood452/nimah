"use client";

import { useState, type FormEvent } from "react";
import styles from "../page/Page.module.css";
import { Recaptcha } from "../account/Recaptcha";

const topics = ["Frame advice", "Lenses and prescriptions", "An order", "Returns and exchanges", "Something else"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Contact form with no server. When the form is valid it opens the visitor's email app (or WhatsApp)
 * with the message filled in, using whichever channel is set in the site settings.
 */
export function ContactForm({ email, whatsapp }: { email?: string; whatsapp?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [pending, setPending] = useState(false);

  const connected = Boolean(email || whatsapp);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Please tell us a little more, at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("");
      return;
    }
    if (!token || pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/forms/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ captchaToken: token }) });
      if (!response.ok) { setStatus("Please complete the security check again."); return; }
    } catch { setStatus("The security check could not connect. Please try again."); return; }
    finally { setPending(false); setToken(null); setGeneration((value) => value + 1); }

    if (!connected) {
      setStatus("Our online contact form is being set up. Please check back soon.");
      return;
    }

    const body = `${message}\n\nName: ${name}\nEmail: ${from}`;
    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${topic}: message from ${name}`)}&body=${encodeURIComponent(body)}`;
      setStatus("Thank you. Your email app should open with your message ready to send. If it does not, please email us directly.");
    } else if (whatsapp) {
      const sep = whatsapp.includes("?") ? "&" : "?";
      window.open(`${whatsapp}${sep}text=${encodeURIComponent(`${topic}\n\n${body}`)}`, "_blank", "noopener,noreferrer");
      setStatus("Thank you. WhatsApp should open with your message ready to send.");
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "cf-name-err" : undefined} />
          {errors.name && <span id="cf-name-err" className={styles.fieldError}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-email">Email address</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "cf-email-err" : undefined} />
          {errors.email && <span id="cf-email-err" className={styles.fieldError}>{errors.email}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-topic">What is it about?</label>
        <select id="cf-topic" name="topic" defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-message">Your message</label>
        <textarea id="cf-message" name="message" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "cf-message-err" : undefined} />
        {errors.message && <span id="cf-message-err" className={styles.fieldError}>{errors.message}</span>}
      </div>

      <p className={styles.formNote}>
        We only use your details to reply to your message. See our <a href="/privacy">Privacy policy</a>.
      </p>

      <div>
        <Recaptcha key={generation} onToken={setToken} />
        <button type="submit" className={styles.btnPrimary} disabled={!token || pending}>
          Send message
        </button>
      </div>

      <p className={styles.formStatus} role="status" hidden={!status}>
        {status}
      </p>
    </form>
  );
}
