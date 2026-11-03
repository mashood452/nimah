"use client";

import { useEffect, useRef, useState } from "react";
import { mergeSavedCarts } from "@/lib/cart-data";
import { bindCartAccount, consumeGuestCart, currentCartLines, hasLocalCart, replaceCartLines, useCart } from "@/lib/shop-store";

export function CartSync({ accountId }: { accountId: string | null }) {
  const { lines } = useCart();
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const revision = useRef(0);
  const saved = useRef("");
  const inFlight = useRef(false);
  const alive = useRef(true);
  const delay = useRef(700);

  useEffect(() => {
    alive.current = true;
    bindCartAccount(accountId);
    if (!accountId) return;
    let cancelled = false;
    let hydrationRetry: number | undefined;
    const hydrate = async () => {
      if (cancelled) return;
      try {
        const response = await fetch(`/api/account/cart?owner=${encodeURIComponent(accountId)}`, { cache: "no-store" });
        if (response.status === 401) { if (!cancelled) window.location.reload(); return; }
        if (!response.ok) throw new Error();
        const state = await response.json();
        if (cancelled) return;
        revision.current = state.revision;
        saved.current = JSON.stringify(state.lines);
        const base = state.revision === 0 && hasLocalCart() ? currentCartLines() : state.lines;
        replaceCartLines(mergeSavedCarts(base, consumeGuestCart()));
        setReady(true);
      } catch { if (!cancelled) hydrationRetry = window.setTimeout(hydrate, 5000); }
    };
    void hydrate();
    const heartbeat = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !currentCartLines().length) return;
      void fetch("/api/account/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activity: true, accountId }) })
        .then((response) => { if (!cancelled && response.status === 401) window.location.reload(); }).catch(() => {});
    }, 60_000);
    return () => { cancelled = true; alive.current = false; window.clearInterval(heartbeat); window.clearTimeout(hydrationRetry); };
  }, [accountId]);

  useEffect(() => {
    if (!ready || !accountId || JSON.stringify(lines) === saved.current) return;
    const timeout = window.setTimeout(async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      const sent = JSON.stringify(currentCartLines());
      try {
        const response = await fetch("/api/account/cart", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: JSON.parse(sent), revision: revision.current, accountId }) });
        if (response.status === 401) { window.location.reload(); return; }
        if (!response.ok && response.status !== 409) throw new Error();
        const state = await response.json();
        revision.current = state.revision;
        saved.current = JSON.stringify(state.lines);
        delay.current = 700;
        if (response.status === 409 || JSON.stringify(currentCartLines()) === sent) replaceCartLines(state.lines);
      } catch { delay.current = Math.min(30_000, delay.current * 2 + 1000); }
      finally { inFlight.current = false; if (alive.current) setRetry((value) => value + 1); }
    }, delay.current);
    return () => window.clearTimeout(timeout);
  }, [lines, ready, accountId, retry]);
  return null;
}
