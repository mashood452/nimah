"use client";

import { useState } from "react";
import styles from "./Account.module.css";

export function EmailPreferences({ enabled }: { enabled: boolean }) {
  const [value, setValue] = useState(enabled);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function update(next: boolean) {
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/account/email-preferences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: next }) });
      if (!response.ok) throw new Error();
      setValue(next); setMessage(next ? "Bag reminders are enabled." : "Bag reminders are turned off.");
    } catch { setMessage("Your preference could not be saved. Please try again."); }
    finally { setPending(false); }
  }
  return <div style={{ marginTop: 28 }}><label className={styles.check}><input type="checkbox" checked={value} disabled={pending} onChange={(event) => void update(event.target.checked)} /><span>Email me a reminder if I leave items in my bag. You can turn this off at any time.</span></label><p className={styles.hint} role="status">{message}</p></div>;
}
