import type { Metadata } from "next";
import Link from "next/link";
import { PaymentCalculator } from "@/components/calculator/PaymentCalculator";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageBand } from "@/components/site/PageBand";
import { Icon } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Payment plans",
  description:
    "Interest-free payment schedules on selected Afro Arab homes and plots: a deposit, then equal monthly payments. Work out a plan with the calculator.",
  alternates: { canonical: "/payment-plans" },
};

const steps = [
  { title: "Choose", body: "Pick a home or plot and confirm with sales that it is available on a payment plan." },
  { title: "Deposit", body: "Pay the agreed allocation deposit and sign a written schedule showing every instalment." },
  { title: "Instalments", body: "Pay the balance in equal monthly instalments. No interest is added on qualifying plans." },
  { title: "Handover", body: "Documents and keys are released when the schedule is complete." },
];

export default function PaymentPlansPage() {
  return (
    <>
      <PageBand
        eyebrow="Payment plans"
        title={
          <>
            Own it in <em>monthly steps.</em>
          </>
        }
        description="Selected homes and plots can be paid for with a deposit and equal monthly instalments, with no interest added. Agree the schedule in writing before you pay."
        imageSrc="/images/projects/hassy-homes.png"
        imageAlt="Hassy Homes by Afro Arab Properties"
        current="Payment plans"
        actions={
          <Link href="#calculator" className="btn-gold">
            Work out a plan <Icon name="arrowRight" size={16} className="btn-arrow" />
          </Link>
        }
      />

      <section className="section-y bg-background">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Four steps, <em>in writing.</em>
              </>
            }
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.25rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-surface p-7">
                <FadeUp delay={i * 0.06}>
                  <p className="font-figure text-sm text-gold">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="t-h3 mt-2">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </FadeUp>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            Read the{" "}
            <Link href="/payment-terms" className="font-semibold text-foreground underline underline-offset-4">
              payment terms
            </Link>{" "}
            for eligibility, fees and what happens if a payment is missed.
          </p>
        </div>
      </section>

      <section id="calculator" className="scroll-mt-24">
        <PaymentCalculator />
      </section>

      <section className="section-y bg-surface-muted">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Talk to sales"
            title={
              <>
                Ask for a <em>written schedule.</em>
              </>
            }
            lead="Tell us the home or plot and the deposit you can manage. Sales replies with the exact schedule for that unit."
          />
          <EnquiryForm intent="payment" />
        </div>
      </section>
    </>
  );
}
