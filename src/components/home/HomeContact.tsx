"use client";

import { OpenAssistantButton } from "@/components/assistant/OpenAssistantButton";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SalesContact } from "@/components/site/SalesContact";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function HomeContact() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <ScrollReveal variant="left">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-light text-balance sm:text-4xl lg:text-5xl">
            Arrange a viewing
          </h2>
          <p className="prose-lux mt-4 max-w-lg text-muted text-pretty">
            Tell us which estate or plot you are considering. Call, WhatsApp, or send the
            form — same Accra sales support buyers already use. Prefer a quick answer
            first? <OpenAssistantButton className="font-semibold" />.
          </p>
          <SalesContact className="mt-8" compact />
        </ScrollReveal>
        <ScrollReveal variant="right" delay={0.08}>
          <EnquiryForm intent="viewing" />
        </ScrollReveal>
      </div>
    </section>
  );
}
