"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { MaskedText } from "@/components/ui/MaskedText";

const ease = [0.16, 1, 0.3, 1] as const;

export function HomeHero({ estateCount, plotCount }: { estateCount: number; plotCount: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="on-dark grain relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-forest-950 text-white">
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { scale, y }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.12, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease }}
        >
          <Image
            src="/images/hero-lamins.jpg"
            alt="Completed Afro Arab townhouses at Lamin's Court, Obeyeyie"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_40%]"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,14,10,0.55)_0%,rgba(8,14,10,0.12)_38%,rgba(8,14,10,0.78)_100%)]" />

      <motion.div style={reduce ? undefined : { opacity: fade }} className="shell flex h-full flex-col justify-end pb-10 pt-32 sm:pb-14">
        <motion.p
          className="t-meta flex items-center gap-3 text-[#e3c88c]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        >
          <span aria-hidden className="h-px w-10 bg-current" />
          Afro Arab Properties · Accra
        </motion.p>

        <h1 className="t-display mt-6 max-w-[14ch] text-balance">
          <MaskedText immediate delay={0.35}>Homes and titled land</MaskedText>
          <MaskedText immediate delay={0.5}>
            across <em>Greater Accra.</em>
          </MaskedText>
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.75 }}
          >
            <p className="t-lead max-w-xl text-white/85 text-pretty">
              Townhouses, courts and serviced plots for families in Ghana and the diaspora, with
              interest-free payment plans and every plot mapped in 3D.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/projects" className="btn-gold btn-lg">
                Explore estates <Icon name="arrowRight" size={18} className="btn-arrow" />
              </Link>
              <Link href="/lands/titled-lands-green-valley/explorer" className="btn-ghost btn-lg">
                <Icon name="cube" size={18} /> See plots in 3D
              </Link>
            </div>
          </motion.div>

          <motion.dl
            className="grid grid-cols-3 gap-6 border-t border-white/20 pt-5 text-sm sm:gap-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div>
              <dt className="t-meta text-[0.6rem] text-white/60">Estates</dt>
              <dd className="font-figure mt-1 text-3xl">{estateCount}</dd>
            </div>
            <div>
              <dt className="t-meta text-[0.6rem] text-white/60">Plots in 3D</dt>
              <dd className="font-figure mt-1 text-3xl">{plotCount}</dd>
            </div>
            <div>
              <dt className="t-meta text-[0.6rem] text-white/60">Interest</dt>
              <dd className="font-figure mt-1 text-3xl">0%</dd>
            </div>
          </motion.dl>
        </div>

        <div aria-hidden className="mt-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:flex">
          <span className="relative block h-10 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-4 bg-white motion-safe:animate-[aa-scroll-cue_2.2s_ease-in-out_infinite]" />
          </span>
          Scroll to build an estate
        </div>
      </motion.div>
    </section>
  );
}
