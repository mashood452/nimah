"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CaptchaSearchForm } from "../account/CaptchaSearchForm";
import { useCart, useCartDrawer, useWishlist } from "@/lib/shop-store";
import { announcement, navItems, trending } from "./nav-data";
import {
  IconArrow,
  IconBag,
  IconChevron,
  IconClose,
  IconHeart,
  IconMenu,
  IconSearch,
  IconUser,
} from "./icons";
import styles from "./Navbar.module.css";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className={styles.logo} aria-label="Nimah Opticals, home" onClick={onClick}>
      <Image
        src="/brand/nimah-logo.png"
        alt="Nimah"
        width={552}
        height={360}
        className={styles.logoImg}
        priority
      />
    </Link>
  );
}

export function Navbar({ accountName }: { accountName?: string }) {
  const { count: cartCount } = useCart();
  const { count: savedCount } = useWishlist();
  const { show: showBag } = useCartDrawer();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeAll = useCallback(() => {
    setOpen(null);
    setSearchOpen(false);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    // Two thresholds, so the bar does not chatter when the scroll position rests near a boundary.
    const onScroll = () => setScrolled((was) => (window.scrollY > 40 ? true : window.scrollY < 20 ? false : was));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [closeAll]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const hoverOpen = (id: string | null) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(leaveTimer.current);
    setSearchOpen(false);
    setOpen(id);
  };
  const hoverCancel = () => clearTimeout(leaveTimer.current);
  const hoverLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    leaveTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const scrimVisible = open !== null || searchOpen;

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        data-scrolled={scrolled}
        data-menu={scrimVisible}
        onPointerEnter={hoverCancel}
        onPointerLeave={hoverLeave}
      >
        <div className={styles.announce}>
          <span>{announcement.text}</span>
          <Link href={announcement.cta.href} className={styles.announceCta}>
            {announcement.cta.label} <IconArrow />
          </Link>
        </div>

        <div className={styles.bar}>
          <div className={styles.barInner}>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.burger}`}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
              onClick={() => setDrawerOpen(true)}
            >
              <IconMenu />
            </button>

            <Logo onClick={closeAll} />

            <nav className={styles.primary} aria-label="Primary">
              <ul>
                {navItems.map((item) => {
                  const hasMenu = !!item.columns;
                  const expanded = open === item.label;
                  return (
                    <li key={item.label} onPointerEnter={hoverOpen(hasMenu ? item.label : null)}>
                      {hasMenu ? (
                        <button
                          type="button"
                          className={styles.link}
                          aria-expanded={expanded}
                          aria-controls={`menu-${item.label}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setOpen(expanded ? null : item.label);
                          }}
                        >
                          {item.label}
                          {item.badge && <span className={styles.badge}>{item.badge}</span>}
                          <IconChevron className={styles.chev} />
                        </button>
                      ) : (
                        <Link href={item.href} className={styles.link} onClick={closeAll}>
                          {item.label}
                          {item.badge && <span className={styles.badge}>{item.badge}</span>}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Search"
                aria-expanded={searchOpen}
                aria-controls="search-panel"
                onClick={() => {
                  setOpen(null);
                  setSearchOpen((s) => !s);
                }}
              >
                <IconSearch />
              </button>
              <Link href={accountName ? "/account" : "/account/login"} className={`${styles.iconBtn} ${styles.deskOnly}`} aria-label={accountName ? `Your account, ${accountName}` : "Log in or create an account"} title={accountName ? `Signed in as ${accountName}` : "Log in or create an account"}>
                <IconUser />
              </Link>
              <Link
                href="/wishlist"
                className={`${styles.iconBtn} ${styles.deskOnly}`}
                aria-label={`Wishlist, ${savedCount} saved item${savedCount === 1 ? "" : "s"}`}
              >
                <IconHeart />
                {savedCount > 0 && <span className={styles.count}>{savedCount}</span>}
              </Link>
              <Link
                href="/cart"
                className={styles.iconBtn}
                aria-label={`Bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                aria-haspopup="dialog"
                onClick={(e) => {
                  // let ctrl/cmd/middle clicks open the full page, and skip the drawer on the bag page itself
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || pathname === "/cart") return;
                  e.preventDefault();
                  closeAll();
                  showBag(e.currentTarget);
                }}
              >
                <IconBag />
                {cartCount > 0 && <span className={styles.count}>{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>

        {navItems.map(
          (item) =>
            item.columns && (
              <div
                key={item.label}
                id={`menu-${item.label}`}
                className={styles.panel}
                data-open={open === item.label}
                inert={open !== item.label}
              >
                <div className={styles.panelInner}>
                  <div className={styles.cols}>
                    {item.columns.map((col) => (
                      <div key={col.title} className={styles.col}>
                        <p className={styles.colTitle}>{col.title}</p>
                        <ul className={styles.colList}>
                          {col.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} onClick={closeAll}>
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link href={item.href} className={styles.viewAll} onClick={closeAll}>
                      View all {item.label.toLowerCase()} <IconArrow />
                    </Link>
                  </div>
                  {item.feature && (
                    <Link href={item.feature.cta.href} className={styles.feature} onClick={closeAll}>
                      <Image
                        src={item.feature.image.src}
                        alt={item.feature.image.alt}
                        fill
                        sizes="244px"
                        className={styles.featureImage}
                      />
                      <span className={styles.featureEyebrow}>{item.feature.eyebrow}</span>
                      <span className={styles.featureTitle}>{item.feature.title}</span>
                      <span className={styles.featureCta}>
                        {item.feature.cta.label} <IconArrow />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            ),
        )}

        <div
          id="search-panel"
          className={`${styles.panel} ${styles.searchPanel}`}
          data-open={searchOpen}
          inert={!searchOpen}
        >
          <div className={styles.searchInner}>
            {searchOpen && <CaptchaSearchForm className={styles.searchForm} buttonClassName={styles.searchGo} placeholder="Search sunglasses, blue-cut, frames…" inputRef={searchRef} icon={<IconSearch />} />}
            <div className={styles.trending}>
              <span>Trending</span>
              {trending.map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} onClick={closeAll}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div
        className={styles.scrim}
        data-visible={scrimVisible}
        onClick={closeAll}
        aria-hidden="true"
      />

      <div
        className={`${styles.scrim} ${styles.scrimDrawer}`}
        data-visible={drawerOpen}
        onClick={closeAll}
        aria-hidden="true"
      />
      <aside
        id="mobile-menu"
        className={styles.drawer}
        data-open={drawerOpen}
        inert={!drawerOpen}
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <Logo onClick={closeAll} />
          <button type="button" className={styles.iconBtn} aria-label="Close menu" onClick={closeAll}>
            <IconClose />
          </button>
        </div>

        {drawerOpen && <CaptchaSearchForm formClassName={styles.drawerSearchForm} className={styles.drawerSearch} placeholder="Search eyewear" icon={<IconSearch />} />}

        <nav className={styles.drawerNav} aria-label="Mobile">
          {navItems.map((item) => {
            const expanded = mobileOpen === item.label;
            return item.columns ? (
              <div key={item.label} className={styles.acc} data-open={expanded}>
                <button
                  type="button"
                  className={styles.accHead}
                  aria-expanded={expanded}
                  onClick={() => setMobileOpen(expanded ? null : item.label)}
                >
                  <span>
                    {item.label}
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  </span>
                  <IconChevron />
                </button>
                <div className={styles.accBody}>
                  <div>
                    <Link href={item.href} className={styles.accAll} onClick={closeAll}>
                      Shop all {item.label.toLowerCase()} <IconArrow />
                    </Link>
                    {item.columns.map((col) => (
                      <div key={col.title} className={styles.accGroup}>
                        <p className={styles.colTitle}>{col.title}</p>
                        {col.links.map((l) => (
                          <Link key={l.href} href={l.href} onClick={closeAll}>
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={styles.accHead} onClick={closeAll}>
                <span>
                  {item.label}
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.drawerFoot}>
          <Link href={accountName ? "/account" : "/account/login"} onClick={closeAll}>
            <IconUser /> {accountName ? "Your account" : "Log in / Sign up"}
          </Link>
          <Link href="/wishlist" onClick={closeAll}>
            <IconHeart /> Wishlist
          </Link>
        </div>
      </aside>
    </>
  );
}
