"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { PlaceholderArt, type ArtKind } from "./PlaceholderArt";
import styles from "./BeforeAfter.module.css";

type Side = { src: string | null; alt: string; label: string };

/**
 * Before and after comparison slider. Drag the handle (or use the arrow keys) to blend from the blurred "before"
 * view on the left to the sharp "after" view on the right.
 *
 * `before.src` and `after.src` come from pageImage(). While a src is null a placeholder is drawn, and the placeholder
 * is blurred on the "before" side too, so the effect works before any photo is added.
 * `blur` is the blur strength in px applied to the "before" photo. Use 0 when the before photo is already blurry.
 */
export function BeforeAfter({
  before,
  after,
  ratio = "4 / 3",
  blur = 12,
  art = "chart",
  sizes = "(max-width: 900px) 100vw, 50vw",
}: {
  before: Side;
  after: Side;
  ratio?: string;
  blur?: number;
  art?: ArtKind;
  sizes?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const interacted = useRef(false);
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);

  const moveTo = useCallback((clientX: number) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const touch = () => {
    interacted.current = true;
    setTouched(true);
  };

  // A short, gentle nudge the first time the slider scrolls into view, to show that it can be dragged.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        if (interacted.current) return;
        const t = Math.min(1, (now - start) / 1600);
        setPos(50 + Math.sin(t * Math.PI * 2) * 16 * (1 - t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    touch();
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5;
    const keys: Record<string, number> = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, Home: 0, End: 100 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    touch();
    setPos(Math.min(100, Math.max(0, keys[e.key])));
  };

  const vars = { "--pos": `${pos}%`, "--blur": `${blur}px`, aspectRatio: ratio } as CSSProperties;

  const layer = (side: Side) =>
    side.src ? <Image src={side.src} alt={side.alt} fill sizes={sizes} className={styles.photo} draggable={false} /> : <PlaceholderArt kind={art} />;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={vars}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className={styles.after}>{layer(after)}</div>
      <div className={styles.before}>
        <div className={styles.beforeInner}>{layer(before)}</div>
      </div>

      <span className={`${styles.tag} ${styles.tagBefore}`}>{before.label}</span>
      <span className={`${styles.tag} ${styles.tagAfter}`}>{after.label}</span>

      <div
        className={styles.handle}
        role="slider"
        tabIndex={0}
        aria-label={`Compare: ${before.label} on the left, ${after.label} on the right`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)} percent ${before.label}`}
        onKeyDown={onKeyDown}
      >
        <span className={styles.grip} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>

      <span className={styles.hint} data-hidden={touched} aria-hidden="true">
        Drag to compare
      </span>
    </div>
  );
}
