"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Rises text out of a mask when it enters the viewport. Keeps the real text in
 * the DOM (no splitting into spans), so screen readers and SEO read it normally.
 */
export function MaskedText({
  children,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  /** Animate on mount instead of on scroll (for heroes). */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  // The in-view trigger sits on the visible mask, not the clipped line inside it:
  // a line translated fully out of an overflow:hidden box never "intersects".
  return (
    <motion.span
      className="block overflow-hidden pb-[0.08em]"
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } })}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "105%", opacity: 0.001 }, show: { y: "0%", opacity: 1 } }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Fade + rise for paragraphs and small groups. */
export function FadeUp({
  children,
  delay = 0,
  className,
  y = 22,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.85, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
