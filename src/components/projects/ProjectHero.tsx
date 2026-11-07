"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { easeOutLux } from "@/components/motion/ScrollReveal";

export function ProjectHero({ project }: { project: Project }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden bg-forest-950 text-white">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.5, ease: easeOutLux }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-soft-light site-plan-grid text-white"
          aria-hidden
        />
      </motion.div>

      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOutLux, delay: 0.1 }}
        >
          {project.propertyLabel ?? project.type}
          <span className="mx-2 text-white/40">/</span>
          {project.location}
        </motion.p>

        <div className="mt-4 overflow-hidden">
          <motion.h1
            className="max-w-4xl font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-tight text-balance"
            style={{ textRendering: "geometricPrecision" }}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: easeOutLux, delay: 0.16 }}
          >
            {project.name}
          </motion.h1>
        </div>

        <motion.p
          className="prose-lux mt-5 max-w-xl text-white/80"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easeOutLux, delay: 0.38 }}
        >
          {project.tagline}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-white/15 pt-6"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOutLux, delay: 0.5 }}
        >
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55">Asking</p>
            <p className="font-figure mt-1 text-3xl text-white sm:text-4xl">{project.priceDisplay}</p>
          </div>
          {project.priceUsdDisplay ? (
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55">USD band</p>
              <p className="font-figure mt-1 text-xl text-gold-light sm:text-2xl">
                {project.priceUsdDisplay}
              </p>
            </div>
          ) : null}
          <div className="ml-auto flex flex-wrap gap-3">
            <Link href="#enquire" className="btn-primary">
              Enquire
            </Link>
            <Link href="#gallery" className="btn-ghost">
              View gallery
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
