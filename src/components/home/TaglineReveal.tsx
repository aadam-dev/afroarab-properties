"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const line =
  "Clear vector inventory. 60-Month interest-free pathways. 200,000 executive homes and titled lands built for generational legacy.";

export function TaglineReveal() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });
  const words = line.split(" ");

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#080E14] px-4 py-28 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
      <div className="mx-auto max-w-5xl text-balance text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-6">
          The Afro-Arab Commitment
        </span>
        <p className="font-display text-3xl font-light leading-[1.25] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            if (reduce) {
              return (
                <span key={`${word}-${i}`} className="mr-[0.28em] inline-block">
                  {word}
                </span>
              );
            }
            return (
              <Word key={`${word}-${i}`} progress={scrollYProgress} start={start} end={end}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}
