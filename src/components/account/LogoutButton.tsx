"use client";

import { useState } from "react";
import styles from "./Account.module.css";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok) throw new Error();
      // Replace the protected entry and discard the signed-in client router state.
      window.location.replace("/account/login?signedOut=1");
    } catch { setError("We could not log you out. Please try again."); setPending(false); }
  }
  return <div><button type="button" className={styles.secondary} onClick={logout} disabled={pending}>{pending ? "Logging out..." : "Log out"}</button>{error && <p className={styles.fieldError} role="alert">{error}</p>}</div>;
}
