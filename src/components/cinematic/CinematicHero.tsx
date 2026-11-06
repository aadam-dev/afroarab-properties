"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const STATS = [
  {
    value: "200,000+",
    label: "Townhouses & Units",
    sub: "National Housing Initiative",
  },
  {
    value: "100%",
    label: "Titled & Registered",
    sub: "Government Surveyed Lands",
  },
  {
    value: "60-Month",
    label: "0% Interest Plans",
    sub: "Zero Hidden Surcharges",
  },
  {
    value: "15+",
    label: "Prime Estates",
    sub: "Greater Accra Corridors",
  },
];

export function CinematicHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#080E14] text-white">
      {/* Background Architectural Visual with Subtle Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-lamins.jpg"
          alt="Afro-Arab Properties Luxury Architectural Masterpiece"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-[55%_35%] opacity-35 filter brightness-90 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Multi-stop Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#080E14] via-[#080E14]/70 to-[#080E14]/90"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#080E14_90%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 opacity-15 site-plan-grid mix-blend-soft-light" aria-hidden="true" />
      </div>

      {/* Main Content Hero Container */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#C5A059]/30 bg-[#101822]/80 px-4 py-1.5 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E676] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E676]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              Executive Digital Platform · Ghana & Diaspora
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden text-xs uppercase tracking-[0.18em] text-[#F4EFE6]/60 md:block"
          >
            Accra · Prampram · Obeyeyie · Santoe
          </motion.div>
        </div>

        {/* Central Headline & Staggered Reveal */}
        <div className="my-auto max-w-4xl pt-8 pb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-base font-normal tracking-[0.12em] text-[#C5A059] sm:text-lg"
          >
            AFRO-ARAB PROPERTIES &bull; LUXURY REAL ESTATE GROUP
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-3 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[1.05] tracking-tight text-[#F4EFE6] sm:mt-4 text-balance"
          >
            Redefining Modern Living in Ghana —{" "}
            <span className="font-normal italic text-[#C5A059]">
              200,000 Townhouses
            </span>{" "}
            & Prime Titled Lands.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#F4EFE6]/80 sm:text-xl text-pretty"
          >
            Empowering Ghanaian homeowners and international diaspora investors with
            live vector plot reservations, spatial 360° floor plan walkthroughs, and
            guaranteed 60-month interest-free financing.
          </motion.p>

          {/* Luxury Action Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10"
          >
            <a href="#plot-explorer" className="btn-gold">
              Explore Live Masterplans
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>

            <a href="#payment-calculator" className="btn-outline-gold">
              60-Month 0% Calculator
            </a>

            <a
              href="#floor-plan"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EFE6]/80 transition-colors hover:text-[#C5A059]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              Take 360° Walkthrough
            </a>
          </motion.div>
        </div>

        {/* Pinned Development Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-6"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-xl border border-white/5 bg-[#101822]/40 p-3.5 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-[#101822]/80 sm:p-4"
            >
              <div className="font-display text-2xl font-normal text-[#C5A059] sm:text-3xl lg:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#F4EFE6]">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[0.7rem] text-[#F4EFE6]/50">
                {stat.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
