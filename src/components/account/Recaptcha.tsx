"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "./Account.module.css";

declare global {
  interface Window {
    grecaptcha?: { ready: (callback: () => void) => void; render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => number };
  }
}

export function Recaptcha({ onToken }: { onToken: (token: string | null) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  useEffect(() => {
    if (!ready || !key || !element.current || widget.current !== null) return;
    let cancelled = false;
    window.grecaptcha?.ready(() => {
      if (cancelled || !element.current || widget.current !== null) return;
      widget.current = window.grecaptcha!.render(element.current, { sitekey: key, callback: (token) => { setError(false); onToken(token); }, "expired-callback": () => onToken(null), "error-callback": () => { onToken(null); setError(true); } });
    });
    return () => { cancelled = true; };
  }, [ready, key, onToken]);
  if (!key) return <p className={styles.fieldError}>The security check is temporarily unavailable. Please try again shortly.</p>;
  return <div className={styles.captchaWrap}>
    <Script id="nimah-recaptcha" src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setError(true)} />
    <div className={styles.captchaBox} ref={element} />
    {error && <p className={styles.fieldError} role="alert">The security check could not load. Please refresh and try again.</p>}
  </div>;
}
