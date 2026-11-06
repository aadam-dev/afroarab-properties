"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const pillars = [
  {
    title: "Interest-free pathways",
    body: "Structured schedules on selected inventory — formal terms with sales, not vague promises.",
  },
  {
    title: "Verified project records",
    body: "This rebuild refuses placeholder sizes and conflicting locations before anything goes live.",
  },
  {
    title: "Live land inventory",
    body: "Explore plots by size and facing, then enquire with the exact plot number attached.",
  },
];

export function ProvenanceStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-forest-950 text-white">
      <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <Image
          src="/images/projects/hassy-homes-2.png"
          alt="Hassy Homes by Afro Arab Properties"
          fill
          className="object-cover opacity-55"
          sizes="46vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-forest-950" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div>
          <p className="eyebrow text-gold-light">Why Afro Arab</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-balance sm:text-5xl">
            Attainable ownership with titled confidence
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-sand-200/85">
            Warm Ghanaian modernism — craft, clarity, and proof — instead of generic luxury copy.
          </p>

          <ul className="mt-10 space-y-8">
            {pillars.map((item, i) => (
              <motion.li
                key={item.title}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-l border-gold/40 pl-5"
              >
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-200/80">{item.body}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/payment-plans" className="btn-primary">
              See payment plans
            </Link>
            <Link href="/company" className="btn-ghost">
              Company & proof
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
