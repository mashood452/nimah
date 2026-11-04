"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./Account.module.css";

/**
 * One box per digit of a verification code. Typing moves to the next box, Backspace moves back, arrow keys move around,
 * and pasting (or a phone's code autofill) spreads the digits across the boxes. The full code is submitted with the
 * form as a hidden field called `name`. Change the `key` to clear the boxes, for example after a wrong code.
 */
export function OtpInput({
  name = "code",
  length = 6,
  label = "Verification code",
  error,
  disabled = false,
  autoFocus = true,
}: {
  name?: string;
  length?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const focusBox = (i: number) => {
    const box = boxes.current[Math.max(0, Math.min(length - 1, i))];
    box?.focus();
    box?.select();
  };

  // Puts digits into the boxes starting at `from`, and returns the index of the next empty box.
  const fill = (from: number, text: string) => {
    const typed = text.replace(/\D/g, "").slice(0, length - from);
    if (!typed) return;
    setDigits((current) => {
      const next = [...current];
      [...typed].forEach((d, k) => (next[from + k] = d));
      return next;
    });
    focusBox(from + typed.length);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) setDigits((d) => d.map((v, k) => (k === i ? "" : v)));
      else if (i > 0) {
        setDigits((d) => d.map((v, k) => (k === i - 1 ? "" : v)));
        focusBox(i - 1);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      setDigits((d) => d.map((v, k) => (k === i ? "" : v)));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusBox(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusBox(length - 1);
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(i, e.clipboardData.getData("text"));
  };

  const groupId = `${name}-otp`;
  return (
    <div className={styles.field} role="group" aria-labelledby={`${groupId}-label`} aria-describedby={error ? `${groupId}-error` : undefined}>
      <span id={`${groupId}-label`} className={styles.otpLabel}>{label}</span>
      <div className={styles.otp}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { boxes.current[i] = el; }}
            className={styles.otpBox}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            // the first box accepts the autofilled code from the email app, which then spreads across all boxes
            autoComplete={i === 0 ? "one-time-code" : "off"}
            autoFocus={autoFocus && i === 0}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={!!error}
            disabled={disabled}
            value={digit}
            onChange={(e) => fill(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
            onFocus={(e) => e.target.select()}
            data-filled={digit ? "true" : undefined}
          />
        ))}
      </div>
      <input type="hidden" name={name} value={digits.join("")} />
      {error && <span id={`${groupId}-error`} className={styles.fieldError} role="alert">{error}</span>}
    </div>
  );
}
