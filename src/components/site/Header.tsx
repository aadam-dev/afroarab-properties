"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/projects", label: "Estates" },
  { href: "/#plot-explorer", label: "Plot Explorer" },
  { href: "/#floor-plan", label: "Floor Plans" },
  { href: "/#payment-calculator", label: "Payment Calculator" },
  { href: "/company", label: "Company" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const isExplorer = pathname.includes("/explorer");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-[#080E14]/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-white/5 bg-[#080E14]/65 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Afro-Arab Brand Typography Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C5A059]/40 bg-[#101822] font-display text-lg font-bold text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-transform duration-300 group-hover:scale-105">
            AA
          </span>
          <span className="font-display text-xl font-light tracking-tight text-[#F4EFE6] sm:text-2xl">
            Afro-Arab <span className="font-normal italic text-[#C5A059]">Properties</span>
          </span>
        </Link>

        {/* Primary Desktop Navigation Bar */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#101822]/80 px-2 py-1 backdrop-blur-xl md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-[#F4EFE6]/80 transition-all hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* High-Contrast Gold Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-gold hidden h-10 items-center rounded-lg px-5 text-xs font-bold sm:inline-flex"
          >
            Inquire Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#101822] text-[#F4EFE6] backdrop-blur-md md:hidden"
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

      {/* Mobile Slide-Down Drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/10 bg-[#080E14]/95 px-5 py-5 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#F4EFE6] transition hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-white/10 pt-4">
                <Link
                  href="/contact"
                  className="btn-gold flex h-11 w-full items-center justify-center text-center text-sm font-bold"
                  onClick={() => setOpen(false)}
                >
                  Inquire Now &bull; Private Viewing
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
