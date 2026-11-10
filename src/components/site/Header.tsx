"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site, whatsappHref } from "@/data/site";
import { lockScroll } from "@/lib/lenis";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

export const EXPLORER_HREF = "/lands/titled-lands-green-valley/explorer";

const nav = [
  { href: "/projects", label: "Estates", match: (p: string) => p.startsWith("/projects") },
  { href: "/lands", label: "Land & plots", match: (p: string) => p === "/lands" },
  { href: "/payment-plans", label: "Payment plans", match: (p: string) => p.startsWith("/payment") },
  { href: "/plotline", label: "Plotline", match: (p: string) => p.startsWith("/plotline") },
  { href: "/company", label: "About", match: (p: string) => p.startsWith("/company") },
  { href: "/faq", label: "FAQ", match: (p: string) => p.startsWith("/faq") },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const open = menuFor === pathname;
  const setOpen = (v: boolean) => setMenuFor(v ? pathname : null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Tuck the bar away while reading down; bring it back on any scroll up.
      if (y < 320) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const panel = menuRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuFor(null);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const lastEl = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  if (pathname.includes("/explorer")) return null;

  // Utility pages without a dark hero keep a solid bar from the top.
  const lightTop = pathname.startsWith("/admin");
  const overHero = !scrolled && !open && !lightTop;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out-soft)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          overHero
            ? "border-b border-transparent bg-transparent text-white"
            : "border-b border-border/70 bg-header-bg text-foreground shadow-[0_10px_30px_-24px_rgba(15,28,22,0.5)] backdrop-blur-xl",
          open && "border-transparent bg-transparent shadow-none",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
          <BrandLogo priority surface={overHero || open ? "dark" : "auto"} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.84rem] font-semibold transition-colors",
                    overHero ? "text-white/85 hover:text-white" : "text-foreground/75 hover:text-foreground",
                    active && (overHero ? "text-white" : "text-foreground"),
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gold-light"
                      transition={{ duration: 0.4, ease }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={EXPLORER_HREF}
              className={cn(
                "hidden h-10 items-center gap-2 rounded-full border px-4 text-[0.82rem] font-semibold transition md:inline-flex",
                overHero
                  ? "border-white/35 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:border-gold",
              )}
            >
              <Icon name="cube" size={16} /> Explore in 3D
            </Link>
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link href="/contact" className="btn-primary hidden h-10 min-h-0 px-5 text-[0.82rem] sm:inline-flex">
              Enquire
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border transition xl:hidden",
                overHero || open ? "border-white/35 text-white" : "border-border bg-surface text-foreground",
              )}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
            className="on-dark fixed inset-0 z-[65] overflow-y-auto bg-forest-950 text-white xl:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="shell flex min-h-full flex-col pb-10 pt-28">
              <nav aria-label="Mobile" className="flex-1">
                <ol className="space-y-1">
                  {[{ href: "/", label: "Home", match: (p: string) => p === "/" }, ...nav, { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") }].map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={item.match(pathname) ? "page" : undefined}
                        className="group flex items-baseline gap-4 py-2"
                      >
                        <span className="font-figure w-6 text-sm text-[#e3c88c]">{String(i + 1).padStart(2, "0")}</span>
                        <span className={cn("font-display text-[2.1rem] font-light leading-tight transition group-hover:text-[#e3c88c] sm:text-5xl", item.match(pathname) && "text-[#e3c88c]")}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ol>
              </nav>

              <div className="mt-10 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-2">
                <Link href={EXPLORER_HREF} className="btn-gold btn-lg">
                  <Icon name="cube" size={18} /> Explore plots in 3D
                </Link>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <a href={whatsappHref("Hello Afro Arab sales, I'd like to arrange a viewing.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <Icon name="whatsapp" size={18} /> WhatsApp
                  </a>
                  <a href={`tel:${site.phoneTel[0]}`} className="btn-ghost">
                    <Icon name="phone" size={18} /> Call
                  </a>
                  <ThemeToggle />
                </div>
              </div>
              <p className="mt-6 text-sm text-white/55">
                {site.address.line1}, {site.address.line2} · {site.email}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
