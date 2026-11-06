"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/site/BrandLogo";
import { easeOutLux } from "@/components/motion/ScrollReveal";

export function CinematicHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-forest-950 text-white">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.6, ease: easeOutLux }}
      >
        <Image
          src="/images/hero-lamins.jpg"
          alt="Afro Arab residential development"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/40"
          aria-hidden
        />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutLux, delay: 0.1 }}
        >
          <BrandLogo size="hero" priority invert className="mb-8" />
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="max-w-3xl font-display text-[clamp(2.25rem,6vw,4.25rem)] font-light leading-[1.08] tracking-tight text-balance"
            style={{ textRendering: "geometricPrecision" }}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: easeOutLux, delay: 0.18 }}
          >
            Homes and titled land across Greater Accra
          </motion.h1>
        </div>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/80 text-pretty sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easeOutLux, delay: 0.42 }}
        >
          Clearer inventory, live plot selection, and interest-free payment paths for
          buyers in Ghana and the diaspora.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOutLux, delay: 0.55 }}
        >
          <Link href="/projects" className="btn-primary">
            Explore estates
          </Link>
          <Link href="/contact" className="btn-ghost">
            Enquire
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
