"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const pillars = [
  {
    title: "60-Month 0% Developer Financing",
    body: "Direct developer-backed payment plans with zero interest charges, zero bank commissions, and transparent 5-year schedules.",
  },
  {
    title: "100% Surveyed & Titled Lands",
    body: "Every estate carries verified cadastral surveys and title registration with the Lands Commission of Ghana. Strictly litigation-free.",
  },
  {
    title: "Live Vector Inventory & Cadastral Mapping",
    body: "Explore plots by exact dimensions and cardinal orientation, then reserve with the exact plot identifier registered on the site map.",
  },
];

export function ProvenanceStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#080E14] text-[#F4EFE6] border-t border-white/10">
      <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <Image
          src="/images/projects/hassy-homes-2.png"
          alt="Hassy Homes by Afro Arab Properties"
          fill
          className="object-cover opacity-35 filter brightness-90"
          sizes="46vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080E14]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            The Afro-Arab Guarantee
          </span>
          <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-white text-balance sm:text-5xl">
            Attainable Luxury with Titled Permanence
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#F4EFE6]/75">
            Empowering Ghanaian families and diaspora investors with architectural integrity,
            verifiable land titles, and unmatched 60-month zero-interest flexibility.
          </p>

          <ul className="mt-10 space-y-8">
            {pillars.map((item, i) => (
              <motion.li
                key={item.title}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-[#C5A059] pl-5"
              >
                <h3 className="font-display text-2xl font-light text-white">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#F4EFE6]/70">{item.body}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex gap-4">
            <Link href="/projects" className="btn-gold">
              View All 15+ Estates
            </Link>
            <Link href="/company" className="btn-outline-gold">
              Afro-Arab Group Heritage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
