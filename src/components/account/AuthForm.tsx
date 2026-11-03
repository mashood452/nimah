"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { IconArrow } from "../navbar/icons";
import styles from "./Account.module.css";

type Errors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>>;

function PasswordField({ id, label, error, signup }: { id: string; label: string; error?: string; signup: boolean }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.password}>
        <input id={id} name={id} type={visible ? "text" : "password"} required
          minLength={signup ? 15 : undefined} maxLength={128} autoComplete={signup ? "new-password" : "current-password"}
          aria-invalid={!!error} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
          onKeyDown={(event) => setCapsLock(event.getModifierState("CapsLock"))} onBlur={() => setCapsLock(false)} />
        <button type="button" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
      </div>
      <span id={`${id}-help`} className={styles.hint}>
        {capsLock ? "Caps Lock is on." : signup && id === "password" ? "At least 15 characters. A memorable phrase works well." : ""}
      </span>
      {error && <span id={`${id}-error`} className={styles.fieldError}>{error}</span>}
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true); setMessage(""); setErrors({});
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), password: data.get("password"),
          confirmPassword: data.get("confirmPassword"), terms: data.get("terms") === "on", remember: data.get("remember") === "on" }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.message ?? "Please try again shortly.");
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      // Start a fresh document after the cookie changes; do not reuse anonymous router data.
      window.location.assign(new URL("/account", window.location.origin).href);
    } catch {
      setMessage("We could not connect. Please check your connection and try again.");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally { setPending(false); }
  }

  return (
    <form onSubmit={submit} className={styles.form} aria-busy={pending}>
      <div ref={errorRef} tabIndex={-1} role={message ? "alert" : undefined} className={message ? styles.error : styles.emptyNotice}>{message}</div>
      {signup && <div className={styles.field}>
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" autoComplete="name" required minLength={2} maxLength={160} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {errors.name && <span id="name-error" className={styles.fieldError}>{errors.name}</span>}
      </div>}
      <div className={styles.field}>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} inputMode="email" required maxLength={254}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {errors.email && <span id="email-error" className={styles.fieldError}>{errors.email}</span>}
      </div>
      <PasswordField id="password" label="Password" error={errors.password} signup={signup} />
      {signup && <PasswordField id="confirmPassword" label="Confirm password" error={errors.confirmPassword} signup />}
      {signup ? <div>
        <label className={styles.check}><input name="terms" type="checkbox" required aria-invalid={!!errors.terms} aria-describedby={errors.terms ? "terms-error" : undefined} />
          <span>I agree to the <Link href="/terms" target="_blank" rel="noreferrer">terms and conditions</Link> and <Link href="/privacy" target="_blank" rel="noreferrer">privacy policy</Link>.</span>
        </label>
        {errors.terms && <p id="terms-error" className={styles.fieldError}>{errors.terms}</p>}
      </div> : <label className={styles.check}><input name="remember" type="checkbox" /><span>Keep me signed in for 30 days</span></label>}
      <button type="submit" className={styles.primary} disabled={pending}>
        {pending ? signup ? "Creating your account..." : "Logging in..." : signup ? "Create account" : "Log in"} {!pending && <IconArrow />}
      </button>
      <p className={styles.switch}>{signup ? "Already have an account?" : "New to Nimah?"} <Link href={signup ? "/account/login" : "/account/signup"}>{signup ? "Log in" : "Create an account"}</Link></p>
      {!signup && <p className={styles.help}>Need a hand? <Link href="/contact">Contact our team</Link>.</p>}
      <noscript><p>Please enable JavaScript to use the secure account form.</p></noscript>
    </form>
  );
}
