"use client";

/**
 * A tiny browser-side store for the shopping bag and the wishlist.
 * Both are kept in localStorage, so they survive page loads and are shared between tabs.
 * There is no server, so nothing here leaves the visitor's device.
 */
import { useCallback, useSyncExternalStore } from "react";

export type CartLine = { slug: string; color: string; qty: number };

const CART_KEY = "nimah.cart.v1";
const WISHLIST_KEY = "nimah.wishlist.v1";
const MAX_QTY = 10;

const EMPTY_CART: CartLine[] = [];
const EMPTY_WISHLIST: string[] = [];

const listeners = new Set<() => void>();
const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) value = JSON.parse(raw) as T;
  } catch {
    /* private mode or corrupt data: start empty */
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the value still lives in memory for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY || e.key === WISHLIST_KEY) {
      cache.delete(e.key);
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------- bag ---------- */

export function useCart() {
  const lines = useSyncExternalStore(
    subscribe,
    () => read<CartLine[]>(CART_KEY, EMPTY_CART),
    () => EMPTY_CART,
  );

  const add = useCallback((slug: string, color: string, qty = 1) => {
    const current = read<CartLine[]>(CART_KEY, EMPTY_CART);
    const existing = current.find((l) => l.slug === slug && l.color === color);
    const next = existing
      ? current.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...current, { slug, color, qty: Math.min(MAX_QTY, qty) }];
    write(CART_KEY, next);
  }, []);

  const setQty = useCallback((slug: string, color: string, qty: number) => {
    const current = read<CartLine[]>(CART_KEY, EMPTY_CART);
    const next = current
      .map((l) => (l.slug === slug && l.color === color ? { ...l, qty: Math.max(0, Math.min(MAX_QTY, qty)) } : l))
      .filter((l) => l.qty > 0);
    write(CART_KEY, next);
  }, []);

  const remove = useCallback((slug: string, color: string) => {
    write(
      CART_KEY,
      read<CartLine[]>(CART_KEY, EMPTY_CART).filter((l) => !(l.slug === slug && l.color === color)),
    );
  }, []);

  const clear = useCallback(() => write(CART_KEY, EMPTY_CART), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, count, add, setQty, remove, clear, maxQty: MAX_QTY };
}

/* ---------- wishlist ---------- */

export function useWishlist() {
  const slugs = useSyncExternalStore(
    subscribe,
    () => read<string[]>(WISHLIST_KEY, EMPTY_WISHLIST),
    () => EMPTY_WISHLIST,
  );

  const toggle = useCallback((slug: string) => {
    const current = read<string[]>(WISHLIST_KEY, EMPTY_WISHLIST);
    write(WISHLIST_KEY, current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);
  return { slugs, count: slugs.length, has, toggle };
}

/* ---------- bag drawer (open / closed) ---------- */

let drawerOpen = false;
const drawerListeners = new Set<() => void>();

const setDrawer = (value: boolean) => {
  if (drawerOpen === value) return;
  drawerOpen = value;
  drawerListeners.forEach((l) => l());
};

const subscribeDrawer = (listener: () => void) => {
  drawerListeners.add(listener);
  return () => {
    drawerListeners.delete(listener);
  };
};

let drawerTrigger: HTMLElement | null = null;

/** Opens the bag. Pass the button that was used so focus can return to it when the bag closes. */
const showDrawer = (trigger?: HTMLElement | null) => {
  drawerTrigger = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  setDrawer(true);
};

/** The element that opened the bag, if any. */
export const getDrawerTrigger = () => drawerTrigger;
const hideDrawer = () => setDrawer(false);

/** Open state of the slide-in bag. Kept in memory only, so it always starts closed. */
export function useCartDrawer() {
  const open = useSyncExternalStore(
    subscribeDrawer,
    () => drawerOpen,
    () => false,
  );
  return { open, show: showDrawer, hide: hideDrawer };
}
