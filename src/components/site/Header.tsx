"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/lands", label: "Lands" },
  { href: "/payment-plans", label: "Payment Plans" },
  { href: "/company", label: "Company" },
  { href: "/insights", label: "Insights" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const isHome = pathname === "/";
  const isExplorer = pathname.includes("/explorer");
  const onDark = isHome || isExplorer || !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isExplorer) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300",
        scrolled || !isHome
          ? "border-b border-forest-900/8 bg-sand-50/90 shadow-[0_10px_40px_-28px_rgba(12,22,18,0.45)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "font-display text-xl font-semibold tracking-tight transition sm:text-2xl",
            scrolled || !isHome ? "text-forest-950" : "text-white",
          )}
        >
          Afro Arab
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-1 px-1.5 py-1 md:flex",
            scrolled || !isHome
              ? "rounded-full border border-forest-900/8 bg-white/70"
              : "rounded-full bg-black/25 backdrop-blur-md",
          )}
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition",
                scrolled || !isHome
                  ? "text-forest-800 hover:bg-forest-900/5 hover:text-forest-950"
                  : "text-sand-50/90 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className={cn(
              "hidden h-11 items-center rounded-lg px-4 text-sm font-semibold transition sm:inline-flex",
              scrolled || !isHome
                ? "bg-brand-red text-white hover:bg-brand-red-dark"
                : "bg-brand-red text-white hover:bg-brand-red-dark",
            )}
          >
            Book a viewing
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg border backdrop-blur md:hidden",
              onDark && isHome && !scrolled
                ? "border-white/25 bg-forest-950/40 text-white"
                : "border-forest-900/15 bg-white text-forest-900",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 bg-current transition",
                  open && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-0.5 w-5 bg-current transition",
                  open && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-forest-900/10 bg-sand-50 px-4 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-forest-900"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 rounded-lg bg-brand-red px-3 py-3 text-center text-base font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Book a viewing
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
