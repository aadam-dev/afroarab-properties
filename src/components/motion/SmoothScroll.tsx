"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resizeLenis, setLenis } from "@/lib/lenis";

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

  // Route changes start at the top, and the new page is measured afresh: a limit carried over
  // from a shorter page would stop the wheel partway down this one.
  useEffect(() => {
    window.scrollTo(0, 0);
    resizeLenis();
    const later = window.setTimeout(resizeLenis, 400);
    return () => window.clearTimeout(later);
  }, [pathname]);

  return null;
}
