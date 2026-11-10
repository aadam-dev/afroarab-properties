import type { Metadata } from "next";
import Link from "next/link";
import { OpenAssistantButton } from "@/components/assistant/OpenAssistantButton";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PageBand } from "@/components/site/PageBand";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "Buyer FAQ",
  description:
    "Common questions about Afro Arab Properties estates, payment plans, titled land and how to reach sales.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.join(" ") },
    })),
  };
  return (
    <>
      <PageBand
        eyebrow="Help"
        title={
          <>
            Questions buyers ask <em>before they call.</em>
          </>
        }
        description={
          <>
            Straight answers on estates, payments and next steps. Still unsure?{" "}
            <OpenAssistantButton className="font-semibold text-white underline decoration-[#e3c88c]/60 underline-offset-4" /> or{" "}
            <Link href="/contact" className="font-semibold text-white underline decoration-[#e3c88c]/60 underline-offset-4">
              reach sales
            </Link>
            .
          </>
        }
        current="FAQ"
        size="compact"
      />
      <section className="section-y bg-background">
        <div className="shell max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
