"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

/**
 * Lenis smooth scrolling for content pages. Off for reduced motion and on
 * full-screen tools (explorer, walkthrough) that own their own input.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const disabled = pathname.includes("/explorer") || pathname.includes("/walkthrough") || pathname.startsWith("/admin");

  useEffect(() => {
    if (disabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -88 } });
    setLenis(lenis);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, [disabled]);

  // Route changes start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
