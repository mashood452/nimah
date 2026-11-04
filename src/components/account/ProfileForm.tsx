"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { postJson } from "@/lib/api-client";
import { formatPhone, validateProfile } from "@/lib/account/validation";
import { OtpInput } from "./OtpInput";
import { Recaptcha, useRecaptcha } from "./Recaptcha";
import account from "./Account.module.css";
import area from "./AccountArea.module.css";

/** Name and phone. */
export function DetailsForm({ name, phone }: { name: string; phone: string | null }) {
  const router = useRouter();
  const [values, setValues] = useState({ name, phone: formatPhone(phone) });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setMessage(null);
    const check = validateProfile(values);
    setErrors(check.errors);
    if (!check.valid) return;
    setPending(true);
    const { ok, data } = await postJson<{ phone?: string | null }>("/api/account/profile", values);
    setPending(false);
    if (!ok) { setErrors((data.errors as typeof errors) ?? {}); setMessage({ ok: false, text: data.message ?? "We could not save your details." }); return; }
    setValues({ name: check.name, phone: formatPhone(data.phone ?? "") });
    setMessage({ ok: true, text: "Your details are saved." });
    router.refresh();
  }

  return (
    <form className={area.formGrid} onSubmit={submit} noValidate>
      <div className={area.row2}>
        <div className={account.field}>
          <label htmlFor="pf-name">Full name</label>
          <input id="pf-name" value={values.name} autoComplete="name" maxLength={160} aria-invalid={!!errors.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
          {errors.name && <span className={account.fieldError}>{errors.name}</span>}
        </div>
        <div className={account.field}>
          <label htmlFor="pf-phone">Mobile number</label>
          <input id="pf-phone" type="tel" inputMode="tel" value={values.phone} autoComplete="tel" placeholder="050 123 4567" maxLength={24} aria-invalid={!!errors.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
          {errors.phone ? <span className={account.fieldError}>{errors.phone}</span> : <span className={account.hint}>We use it for delivery updates. You can leave it empty.</span>}
        </div>
      </div>
      <div aria-live="polite">
        {message && <p className={message.ok ? account.success : account.error} role={message.ok ? "status" : "alert"}>{message.text}</p>}
      </div>
      <div className={area.formActions}>
        <button type="submit" className={account.primary} disabled={pending}>{pending ? "Saving..." : "Save details"}</button>
      </div>
    </form>
  );
}

type Step = "enter" | "code" | "confirm";

/** Changes the sign-in email: the new address gets a code, then the password confirms it is really the owner. */
function EmailChange({ current, onDone, onCancel }: { current: string; onDone: (email: string) => void; onCancel: () => void }) {
  const { ready, error: captchaError, executeCaptcha } = useRecaptcha();
  const [step, setStep] = useState<Step>("enter");
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [codeKey, setCodeKey] = useState(0);
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string }>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!cooldown) return;
    const t = window.setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    const captchaToken = await executeCaptcha("otp_request");
    const { ok, data } = await postJson<{ challengeId?: string; email?: string; resendAfter?: number }>("/api/auth/otp/request", { email, captchaToken });
    if (!ok) { setErrors((data.errors as typeof errors) ?? {}); setMessage(data.message ?? "We could not send the code."); return false; }
    setEmail(data.email ?? email); setChallenge(data.challengeId ?? ""); setCooldown(data.resendAfter ?? 60); setCodeKey((k) => k + 1); setStep("code");
    return true;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !ready) return;
    const data = new FormData(event.currentTarget);
    setPending(true); setMessage(""); setErrors({});
    try {
      if (step === "enter") {
        if (email.trim().toLowerCase() === current) { setErrors({ email: "That is already your email address." }); return; }
        await sendCode();
      } else if (step === "code") {
        const code = String(data.get("code") ?? "");
        if (!/^\d{6}$/.test(code)) { setErrors({ code: "Enter all six digits." }); return; }
        const captchaToken = await executeCaptcha("otp_verify");
        const res = await postJson("/api/auth/otp/verify", { challengeId: challenge, code, captchaToken });
        if (!res.ok) { setErrors((res.data.errors as typeof errors) ?? {}); setMessage(res.data.message ?? "That code did not work."); setCodeKey((k) => k + 1); return; }
        setStep("confirm");
      } else {
        const res = await postJson<{ email?: string }>("/api/account/email", { email, password: data.get("password") });
        if (!res.ok) {
          setErrors((res.data.errors as typeof errors) ?? {}); setMessage(res.data.message ?? "We could not update your email.");
          if ((res.data as { requiresVerification?: boolean }).requiresVerification) setStep("enter");
          return;
        }
        onDone(res.data.email ?? email);
      }
    } catch {
      setMessage("The security check could not complete. Please try again.");
    } finally { setPending(false); }
  }

  async function resend() {
    if (pending || cooldown > 0 || !ready) return;
    setPending(true); setMessage("");
    try { await sendCode(); } catch { setMessage("Your code could not be resent. Please try again."); } finally { setPending(false); }
  }

  const label = step === "enter" ? "Email me a code" : step === "code" ? "Verify new email" : "Update email";
  return (
    <form className={area.emailFlow} onSubmit={submit} aria-busy={pending}>
      <p className={account.step}>{step === "enter" ? "Step 1 of 3 / New email" : step === "code" ? "Step 2 of 3 / Verify it" : "Step 3 of 3 / Confirm"}</p>
      <div role={message ? "alert" : undefined} className={message ? account.error : account.emptyNotice}>{message}</div>

      {step === "enter" && (
        <div className={account.field}>
          <label htmlFor="ec-email">New email address</label>
          <input id="ec-email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required value={email} aria-invalid={!!errors.email} autoFocus onChange={(e) => setEmail(e.target.value)} />
          {errors.email ? <span className={account.fieldError}>{errors.email}</span> : <span className={account.hint}>We will send a six-digit code to this address to check it is yours.</span>}
        </div>
      )}

      {step === "code" && (
        <>
          <p className={account.verification}>Enter the six-digit code sent to <strong>{email}</strong>. It expires in ten minutes.</p>
          <OtpInput key={codeKey} error={errors.code} disabled={pending} />
        </>
      )}

      {step === "confirm" && (
        <>
          <p className={account.verified}>✓ {email} is verified.</p>
          <div className={account.field}>
            <label htmlFor="ec-password">Your password</label>
            <input id="ec-password" name="password" type="password" autoComplete="current-password" maxLength={128} required autoFocus aria-invalid={!!errors.password} />
            {errors.password ? <span className={account.fieldError}>{errors.password}</span> : <span className={account.hint}>For your security, confirm the change with your password. Other devices will be signed out.</span>}
          </div>
        </>
      )}

      <Recaptcha />
      <div className={area.formActions}>
        <button type="submit" className={account.primary} disabled={pending || !ready}>{pending ? "Please wait..." : label}</button>
        <button type="button" className={area.ghostBtn} onClick={onCancel} disabled={pending}>Cancel</button>
      </div>
      {step === "code" && (
        <button type="button" className={account.textButton} disabled={pending || cooldown > 0 || !ready} onClick={() => void resend()}>
          {cooldown > 0 ? `Resend available in ${cooldown}s` : "Send a new code"}
        </button>
      )}
      {captchaError && <p className={account.fieldError} role="alert">The security check could not load. Please refresh and try again.</p>}
    </form>
  );
}

/** The sign-in email, with the change flow tucked away until it is wanted. */
export function EmailSection({ email }: { email: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(email);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className={area.stack}>
      <div className={area.emailRow}>
        <div>
          <span className={area.emailValue}>{current}</span>
          <span className={account.verified}>✓ Verified</span>
        </div>
        {!open && <button type="button" className={area.ghostBtn} onClick={() => { setOpen(true); setDone(false); }}>Change email</button>}
      </div>
      {done && <p className={account.success} role="status">Your email address is updated. You will use it to log in from now on.</p>}
      {open && (
        <EmailChange
          current={current}
          onCancel={() => setOpen(false)}
          onDone={(next) => { setCurrent(next); setOpen(false); setDone(true); router.refresh(); }}
        />
      )}
    </div>
  );
}
