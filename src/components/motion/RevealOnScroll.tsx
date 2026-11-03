"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades elements in as they scroll into view.
 * Opt in with `data-reveal` (the element fades up) or `data-reveal="stagger"` (its children fade up one by one).
 *
 * Safe by design:
 * - Content is only hidden after this runs, so the page is complete without JavaScript.
 * - Anything on screen, already scrolled past, or at the very end of the page is shown, so nothing can stay hidden.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])"));
    if (pending.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // An element counts as "in view" once a slice of it (up to 120px, or 15% of short elements) is on screen.
    // Elements above the screen count too, so jumping past a section never leaves it hidden.
    const inView = (el: HTMLElement, viewport: number) => {
      const r = el.getBoundingClientRect();
      const slice = Math.min(120, r.height * 0.15);
      return r.top < viewport - slice || r.bottom < 0;
    };

    const check = () => {
      const viewport = window.innerHeight;
      pending = pending.filter((el) => {
        if (reduceMotion || inView(el, viewport)) {
          el.setAttribute("data-visible", "");
          return false;
        }
        return true;
      });
      if (pending.length === 0) stop();
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    // Show what is already on screen first, then hide the rest. Nothing flashes.
    check();
    document.documentElement.classList.add("reveal-ready");

    if (pending.length > 0) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      stop();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
