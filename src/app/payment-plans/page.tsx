import type { Metadata } from "next";
import Link from "next/link";
import { PaymentCalculator } from "@/components/calculator/PaymentCalculator";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: "60-Month Interest-Free Payment Plans & Simulator",
  description:
    "Explore Afro-Arab Properties 60-Month interest-free payment simulator. 40% initial allocation, 0% interest financing, and guaranteed title delivery.",
};

export default function PaymentPlansPage() {
  return (
    <div className="bg-[#080E14] pt-28 text-[#F4EFE6]">
      {/* Intro Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E676]" />
            Direct Developer Financing
          </span>
          <h1 className="mt-4 font-display text-4xl font-light text-white sm:text-5xl lg:text-6xl text-balance">
            60-Month Interest-Free Ownership Schedules
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#F4EFE6]/75 text-pretty">
            Afro-Arab Properties eliminates the barrier of commercial bank mortgage rates.
            Acquire titled land or an executive townhouse with an initial 40% allocation
            deposit and spread the remainder across 60 equal monthly payments with 0.00% interest.
          </p>
        </div>
      </div>

      {/* Embedded Live 60-Month Simulator */}
      <div className="mt-8">
        <PaymentCalculator />
      </div>

      {/* Explanatory Terms & Enquiry Form */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 border-t border-white/10">
        <div>
          <h2 className="font-display text-3xl font-light text-white">
            How Afro-Arab 0% Financing Works
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#F4EFE6]/70">
            Unlike traditional bank mortgages that impose 28% to 34% annual percentage rates,
            Afro-Arab operates a direct developer-to-buyer financing framework backed by our
            fully titled land bank.
          </p>

          <div className="mt-8 space-y-5 text-sm">
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <div className="flex items-center gap-3 font-semibold text-[#DFC283]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A059] text-xs font-bold text-[#080E14]">
                  1
                </span>
                Reserve Inventory on the Live Plot Explorer
              </div>
              <p className="mt-2 text-xs text-[#F4EFE6]/70">
                Select your preferred plot or townhouse unit code with verified boundary coordinates.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <div className="flex items-center gap-3 font-semibold text-[#DFC283]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A059] text-xs font-bold text-[#080E14]">
                  2
                </span>
                Formal Allocation & 40% Deposit
              </div>
              <p className="mt-2 text-xs text-[#F4EFE6]/70">
                Deposit escrow is wired directly to official accounts at Fidelity Bank or Ecobank Ghana.
                An official Allocation Deed is immediately executed.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <div className="flex items-center gap-3 font-semibold text-[#DFC283]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A059] text-xs font-bold text-[#080E14]">
                  3
                </span>
                60 Equal Interest-Free Payments
              </div>
              <p className="mt-2 text-xs text-[#F4EFE6]/70">
                Payments can be executed via standing orders, diaspora international wires, or local clearing.
                Review our complete{" "}
                <Link href="/payment-terms" className="text-[#C5A059] underline underline-offset-2">
                  legal payment terms
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#101822]/90 p-6 backdrop-blur-xl sm:p-8">
          <h3 className="font-display text-2xl text-white">
            Request Formal Amortization Deed
          </h3>
          <p className="mt-2 text-xs text-[#F4EFE6]/70">
            Submit your contact information to receive our official escrow banking coordinates and schedule paperwork.
          </p>
          <div className="mt-6">
            <EnquiryForm intent="payment" />
          </div>
        </div>
      </div>
    </div>
  );
}
