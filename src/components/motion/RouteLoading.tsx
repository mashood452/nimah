"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BlogSkeleton, ListingSkeleton } from "../ui/Skeleton";
import styles from "./RouteLoading.module.css";

type Kind = "listing" | "blog";

const LISTING = [/^\/(shop|new-arrivals|search)$/, /^\/(sunglasses|blue-light-glasses|eyeglasses)(\/[^/]+)?$/];

function kindOf(pathname: string): Kind | null {
  if (pathname === "/blog") return "blog";
  return LISTING.some((pattern) => pattern.test(pathname)) ? "listing" : null;
}

const SHOW_AFTER_MS = 120; // a fast page never flashes a skeleton
const GIVE_UP_AFTER_MS = 15_000; // never leave a skeleton up if a navigation is cancelled

/**
 * Shows a matching skeleton the moment a visitor clicks a link to a listing page, until the new page arrives.
 *
 * The browser keeps showing the old page while the next one is fetched, which on a slow connection looks like the
 * click did nothing. This gives instant feedback without depending on how the page is prefetched. The skeleton is
 * dropped as soon as the address changes, so it can never outlive the navigation.
 */
export function RouteLoading() {
  const pathname = usePathname();
  const [pending, setPending] = useState<{ id: number; kind: Kind; from: string; show: boolean } | null>(null);
  const clicks = useRef(0);

  useEffect(() => {
    const timers: number[] = [];
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      const kind = kindOf(url.pathname);
      if (!kind) return;
      // each click gets a number, so a timer left over from an earlier click can never touch a newer one
      const id = ++clicks.current;
      setPending({ id, kind, from: window.location.pathname, show: false });
      timers.push(window.setTimeout(() => setPending((p) => (p && p.id === id ? { ...p, show: true } : p)), SHOW_AFTER_MS));
      timers.push(window.setTimeout(() => setPending((p) => (p && p.id === id ? null : p)), GIVE_UP_AFTER_MS));
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Once the address changes the new page has arrived, so the skeleton is no longer shown.
  if (!pending || !pending.show || pending.from !== pathname) return null;
  return (
    <div className={styles.overlay}>
      {pending.kind === "blog" ? <BlogSkeleton as="div" /> : <ListingSkeleton as="div" />}
    </div>
  );
}
