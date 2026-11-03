"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { IconArrow } from "../navbar/icons";
import { Recaptcha } from "./Recaptcha";
import styles from "./Account.module.css";

type Errors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "terms" | "code", string>>;
type Phase = "login" | "email" | "code" | "details";

function PasswordField({ id, label, error, signup }: { id: string; label: string; error?: string; signup: boolean }) {
  const [visible, setVisible] = useState(false);
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.password}>
      <input id={id} name={id} type={visible ? "text" : "password"} required minLength={signup ? 15 : undefined} maxLength={128}
        autoComplete={signup ? "new-password" : "current-password"} aria-invalid={!!error} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`} />
      <button type="button" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
    </div>
    <span id={`${id}-help`} className={styles.hint}>{signup && id === "password" ? "At least 15 characters. A memorable phrase works well." : ""}</span>
    {error && <span id={`${id}-error`} className={styles.fieldError}>{error}</span>}
  </div>;
}

export function AuthForm({ mode, destination = "/account" }: { mode: "login" | "signup"; destination?: "/account" | "/cart" }) {
  const signup = mode === "signup";
  const [phase, setPhase] = useState<Phase>(signup ? "email" : "login");
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cooldown) return;
    const timeout = window.setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [cooldown]);

  function resetCaptcha() { setCaptchaToken(null); setCaptchaKey((value) => value + 1); }
  async function api(path: string, body: object) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) {
      setErrors(result.errors ?? {}); setMessage(result.message ?? "Please try again shortly.");
      if (result.requiresVerification) setPhase("email");
      requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    return result;
  }

  async function sendCode() {
    const result = await api("/api/auth/otp/request", { email, captchaToken });
    resetCaptcha();
    if (result) { setEmail(result.email); setChallenge(result.challengeId); setCooldown(result.resendAfter); setPhase("code"); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true); setMessage(""); setSuccess(""); setErrors({});
    try {
      if (phase === "email") { await sendCode(); return; }
      if (phase === "code") {
        const result = await api("/api/auth/otp/verify", { challengeId: challenge, code: data.get("code"), captchaToken });
        resetCaptcha();
        if (result) { setPhase(signup ? "details" : "login"); setSuccess(signup ? "Email verified. Complete your account below." : "Email verified. Enter your password to log in."); }
        return;
      }
      const result = await api(`/api/auth/${signup ? "signup" : "login"}`, {
        name: data.get("name"), email, password: data.get("password"), confirmPassword: data.get("confirmPassword"),
        terms: data.get("terms") === "on", remember: data.get("remember") === "on", cartReminders: data.get("cartReminders") === "on", captchaToken,
      });
      if (!result) { resetCaptcha(); return; }
      window.location.assign(new URL(destination, window.location.origin).href);
    } catch {
      setMessage("We could not connect. Please check your connection and try again."); resetCaptcha();
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally { setPending(false); }
  }

  async function resendCode() {
    setPending(true); setMessage("");
    try { await sendCode(); } catch { setMessage("Your code could not be resent. Please try again."); resetCaptcha(); }
    finally { setPending(false); }
  }

  const label = phase === "email" ? "Email me a code" : phase === "code" ? "Verify email" : signup ? "Create account" : "Log in";
  return <form onSubmit={submit} className={styles.form} aria-busy={pending}>
    {signup && <p className={styles.step}>{phase === "details" ? "02 / Create your account" : "01 / Verify your email"}</p>}
    <div ref={errorRef} tabIndex={-1} role={message ? "alert" : undefined} className={message ? styles.error : styles.emptyNotice}>{message}</div>
    {success && <p className={styles.success} role="status">{success}</p>}
    {phase === "code" ? <>
      <p className={styles.verification}>Enter the six-digit code sent to <strong>{email}</strong>. It expires in ten minutes.</p>
      <div className={styles.field}><label htmlFor="code">Verification code</label><input className={styles.codeInput} id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} minLength={6} required aria-invalid={!!errors.code} aria-describedby={errors.code ? "code-error" : undefined} />{errors.code && <span id="code-error" className={styles.fieldError}>{errors.code}</span>}</div>
    </> : <>
      {phase === "details" && <div className={styles.field}><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={160} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span id="name-error" className={styles.fieldError}>{errors.name}</span>}</div>}
      <div className={styles.field}><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} inputMode="email" required maxLength={254} value={email} readOnly={phase === "details"} onChange={(event) => setEmail(event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{phase === "details" && <span className={styles.verified}>✓ Email verified</span>}{errors.email && <span id="email-error" className={styles.fieldError}>{errors.email}</span>}</div>
      {(phase === "login" || phase === "details") && <PasswordField id="password" label="Password" error={errors.password} signup={phase === "details"} />}
      {phase === "details" && <PasswordField id="confirmPassword" label="Confirm password" error={errors.confirmPassword} signup />}
      {phase === "details" && <>
        <label className={styles.check}><input name="terms" type="checkbox" required /><span>I agree to the <Link href="/terms" target="_blank" rel="noreferrer">terms and conditions</Link> and <Link href="/privacy" target="_blank" rel="noreferrer">privacy policy</Link>.</span></label>
        {errors.terms && <p className={styles.fieldError}>{errors.terms}</p>}
        <label className={styles.check}><input name="cartReminders" type="checkbox" /><span>Email me a reminder if I leave items in my bag. I can unsubscribe at any time.</span></label>
      </>}
      {phase === "login" && <label className={styles.check}><input name="remember" type="checkbox" /><span>Keep me signed in for 30 days</span></label>}
    </>}
    <Recaptcha key={captchaKey} onToken={setCaptchaToken} />
    <button type="submit" className={styles.primary} disabled={pending || !captchaToken}>{pending ? "Please wait..." : label} {!pending && <IconArrow />}</button>
    {phase === "code" && <>
      <button className={styles.textButton} type="button" disabled={pending || cooldown > 0 || !captchaToken} onClick={() => void resendCode()}>{cooldown > 0 ? `Resend available in ${cooldown}s` : "Send a new code"}</button>
      <button className={styles.textButton} type="button" disabled={pending} onClick={() => { setPhase("email"); setMessage(""); resetCaptcha(); }}>Use a different email</button>
    </>}
    <p className={styles.switch}>{signup ? "Already have an account?" : "New to Nimah?"} <Link href={signup ? "/account/login" : "/account/signup"}>{signup ? "Log in" : "Create an account"}</Link></p>
    {!signup && <p className={styles.help}>Need a hand? <Link href="/contact">Contact our team</Link>.</p>}
    <noscript><p>Please enable JavaScript to use the secure account form.</p></noscript>
  </form>;
}
