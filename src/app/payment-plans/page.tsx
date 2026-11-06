import type { Metadata } from "next";
import Link from "next/link";
import { PaymentCalculator } from "@/components/calculator/PaymentCalculator";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: "Payment plans",
  description:
    "Interest-free payment schedules on selected Afro Arab inventory, with a simple repayment calculator.",
};

export default function PaymentPlansPage() {
  return (
    <div className="bg-background pt-28 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Payment plans</p>
          <h1 className="mt-3 font-display text-4xl font-light text-balance sm:text-5xl lg:text-6xl">
            Interest-free schedules on selected inventory
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            Selected homes and plots can use a developer-backed pathway with an allocation
            deposit and monthly instalments. Confirm formal terms before payment.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PaymentCalculator />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 border-t border-border px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-light">How it works</h2>
          <ol className="mt-6 space-y-5 text-sm text-muted">
            <li>
              <strong className="text-foreground">1. Choose inventory</strong>
              <p className="mt-1">Select a plot or unit and confirm availability with sales.</p>
            </li>
            <li>
              <strong className="text-foreground">2. Allocation deposit</strong>
              <p className="mt-1">Typical marketing path uses a substantial upfront allocation.</p>
            </li>
            <li>
              <strong className="text-foreground">3. Monthly instalments</strong>
              <p className="mt-1">
                Remaining balance may be spread over a published tenor. Read{" "}
                <Link href="/payment-terms" className="text-foreground underline underline-offset-4">
                  payment terms
                </Link>
                .
              </p>
            </li>
          </ol>
        </div>
        <EnquiryForm intent="payment" />
      </div>
    </div>
  );
}
