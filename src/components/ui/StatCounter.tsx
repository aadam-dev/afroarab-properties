"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts up to `value` once when visible. Server-renders the final value. */
export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  format = (n: number) => Math.round(n).toLocaleString("en-GH"),
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, format]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${prefix}${format(value)}${suffix}`}
    </span>
  );
}
