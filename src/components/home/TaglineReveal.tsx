"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const line =
  "Clear inventory. Interest-free paths. Homes Ghanaian families can actually plan for.";

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
      className="relative overflow-hidden bg-[linear-gradient(180deg,#efe8dc_0%,#f8f5f0_45%,#efe8dc_100%)] px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <p className="mx-auto max-w-5xl text-balance text-center font-display text-3xl leading-[1.15] tracking-tight text-forest-900 sm:text-4xl md:text-5xl lg:text-[3.35rem]">
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
