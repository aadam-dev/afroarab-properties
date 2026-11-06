import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: "Payment plans",
  description:
    "Interest-free payment pathways for Afro Arab Properties — formal terms and eligibility via sales.",
};

export default function PaymentPlansPage() {
  return (
    <div className="bg-sand-50 pt-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
            Payment plans
          </p>
          <h1 className="mt-3 font-display text-5xl text-forest-900 text-balance">
            Ownership schedules without interest charges
          </h1>
          <p className="mt-5 text-lg text-stone-500 text-pretty">
            Afro Arab markets interest-free payment plans on selected projects. Exact deposits,
            tenors, insurance, and income documentation requirements are confirmed with sales and
            documented in{" "}
            <Link href="/payment-terms" className="underline underline-offset-2">
              payment terms
            </Link>
            .
          </p>
          <ol className="mt-8 space-y-4 text-stone-500">
            <li>
              <strong className="text-forest-800">1. Choose a project</strong> — homes or titled
              land with verified availability.
            </li>
            <li>
              <strong className="text-forest-800">2. Review the schedule</strong> — sales shares the
              current plan for that inventory.
            </li>
            <li>
              <strong className="text-forest-800">3. Complete KYC / documentation</strong> — as
              required for the selected plan.
            </li>
          </ol>
        </div>
        <EnquiryForm intent="payment" />
      </div>
    </div>
  );
}
