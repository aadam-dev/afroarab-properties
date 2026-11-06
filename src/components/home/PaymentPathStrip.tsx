"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function PaymentPathStrip() {
  return (
    <section className="border-y border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <ScrollReveal className="max-w-xl" variant="up">
          <p className="eyebrow">Payment plans</p>
          <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl">
            Interest-free schedules on selected inventory
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted text-pretty">
            Selected homes and plots offer developer-backed payment pathways. Review
            formal terms before you pay.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1} variant="fade">
          <Link href="/payment-plans" className="btn-primary shrink-0">
            View payment plans
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
