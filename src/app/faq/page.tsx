import type { Metadata } from "next";
import Link from "next/link";
import { OpenAssistantButton } from "@/components/assistant/OpenAssistantButton";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Afro Arab Properties estates, payment pathways, titled land, and how to reach sales.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="page-band relative flex min-h-[42vh] items-end">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8 lg:pb-16">
          <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-gold-light">
            Help
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light text-balance sm:text-5xl lg:text-6xl">
            Questions buyers ask before they call
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-band-fg/80 sm:text-lg">
            Straight answers on estates, payments, and next steps. Still unsure?{" "}
            <OpenAssistantButton className="font-semibold text-band-fg underline decoration-gold/50 underline-offset-4" />{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-semibold text-band-fg underline decoration-gold/50 underline-offset-4"
            >
              reach sales
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  );
}
