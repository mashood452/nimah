"use client";

import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CaptchaAction } from "@/lib/captcha-actions";
import styles from "./Account.module.css";

declare global {
  interface Window {
    grecaptcha?: { ready: (callback: () => void) => void; execute: (sitekey: string, options: { action: CaptchaAction }) => Promise<string> };
  }
}

const CaptchaContext = createContext<{ ready: boolean; error: boolean; executeCaptcha: (action: CaptchaAction) => Promise<string>; request: () => void } | null>(null);

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  // The Google script is heavy, so it only loads once a form that needs it is on the page (see useRecaptcha).
  // Pages without a form, such as the home page, never download it.
  const [wanted, setWanted] = useState(false);
  const request = useCallback(() => setWanted(true), []);
  useEffect(() => {
    if (ready || !key || !wanted) return;
    const timeout = window.setTimeout(() => setError(true), 15_000);
    return () => window.clearTimeout(timeout);
  }, [ready, key, wanted]);

  const executeCaptcha = useCallback(async (action: CaptchaAction) => {
    if (!key || !ready || !window.grecaptcha?.execute) throw new Error("The security check is unavailable. Please refresh and try again.");
    // Generate a fresh token at submission time; never reuse tokens between actions.
    return new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("The security check timed out. Please try again.")), 15_000);
      Promise.resolve().then(() => window.grecaptcha!.execute(key, { action })).then((token) => {
        if (typeof token !== "string" || token.length < 10 || token.length > 4096) throw new Error("Invalid security response.");
        resolve(token);
      }).catch(() => reject(new Error("The security check could not complete. Please try again."))).finally(() => window.clearTimeout(timeout));
    });
  }, [key, ready]);

  return <CaptchaContext.Provider value={{ ready, error: error || !key, executeCaptcha, request }}>
    {children}
    {key && wanted && <Script id="nimah-recaptcha-v3" src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`} strategy="afterInteractive"
      onReady={() => window.grecaptcha?.ready(() => { setError(false); setReady(true); })} onError={() => { setError(true); setReady(false); }} />}
  </CaptchaContext.Provider>;
}

export function useRecaptcha() {
  const context = useContext(CaptchaContext);
  const request = context?.request;
  // Using the hook means a form is on the page, so this is the moment to load the Google script.
  useEffect(() => request?.(), [request]);
  if (!context) throw new Error("RecaptchaProvider is required.");
  return context;
}

export function Recaptcha() {
  const { ready, error } = useRecaptcha();
  return <div className={styles.captchaWrap}>
    {error ? <p className={styles.fieldError} role="alert">The security check could not load. Please refresh and try again.</p>
      : !ready ? <p className={styles.hint} role="status">Loading security check…</p> : null}
    <p className={styles.hint}>Protected by reCAPTCHA. Google’s <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.</p>
  </div>;
}
