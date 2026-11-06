"use client";

import { useMemo, useState } from "react";
import {
  useCalculatorStore,
  PAYMENT_MILESTONES,
  formatCurrencyAmount,
} from "@/store/useCalculatorStore";
import { cn } from "@/lib/cn";

const PRESETS = [
  { label: "Prime Titled Plot", priceUsd: 28000, category: "Land" },
  { label: "2-Bed Townhouse", priceUsd: 75000, category: "Home" },
  { label: "3-Bed Executive Court", priceUsd: 120000, category: "Home" },
  { label: "4-Bed Luxury Penthouse", priceUsd: 210000, category: "Luxury" },
];

export function PaymentCalculator() {
  const {
    propertyPrice,
    setPropertyPrice,
    currency,
    setCurrency,
    paymentMode,
    setPaymentMode,
    downPaymentPercent,
    setDownPaymentPercent,
    tenorMonths,
    buyerName,
    buyerEmail,
    buyerPhone,
    setBuyerDetails,
  } = useCalculatorStore();

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const rate = 15.5; // 1 USD = 15.5 GHS

  // Financial calculations
  const priceInSelectedCurrency = currency === "USD" ? propertyPrice : Math.round(propertyPrice * rate);

  const calculations = useMemo(() => {
    if (paymentMode === "upfront") {
      // 10% instant discount for 100% upfront cash settlement
      const discount = Math.round(priceInSelectedCurrency * 0.1);
      const finalPrice = priceInSelectedCurrency - discount;
      return {
        discount,
        finalPrice,
        downPayment: finalPrice,
        monthlyPayment: 0,
        totalInterest: 0,
        effectiveTenor: 0,
      };
    }

    // Standard 60-Month Interest-Free Plan
    const downPayment = Math.round(priceInSelectedCurrency * (downPaymentPercent / 100));
    const principalRemaining = priceInSelectedCurrency - downPayment;
    const monthlyPayment = Math.round(principalRemaining / tenorMonths);

    return {
      discount: 0,
      finalPrice: priceInSelectedCurrency,
      downPayment,
      monthlyPayment,
      totalInterest: 0,
      effectiveTenor: tenorMonths,
    };
  }, [priceInSelectedCurrency, paymentMode, downPaymentPercent, tenorMonths]);

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <section id="payment-calculator" className="relative bg-[#080E14] py-20 text-[#F4EFE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3D9B6E]" />
              Institutional Financial Simulator
            </div>
            <h2 className="mt-3 font-display text-3xl font-light text-[#F4EFE6] sm:text-4xl lg:text-5xl">
              60-Month Interest-Free Simulator
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#F4EFE6]/70 sm:text-base">
              Calculate transparent ownership terms. Spread your capital over 5 equal
              interest-free years with zero bank intermediation and zero hidden surcharges.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-[#101822] p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                currency === "USD"
                  ? "bg-[#C5A059] text-[#080E14] shadow-md"
                  : "text-[#F4EFE6]/70 hover:text-white",
              )}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("GHS")}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                currency === "GHS"
                  ? "bg-[#C5A059] text-[#080E14] shadow-md"
                  : "text-[#F4EFE6]/70 hover:text-white",
              )}
            >
              GHS (GH¢)
            </button>
          </div>
        </div>

        {/* Preset Property Tiers */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          <span className="self-center text-xs uppercase tracking-wider text-[#F4EFE6]/50 mr-2">
            Quick Estimates:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPropertyPrice(preset.priceUsd)}
              className={cn(
                "rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all",
                propertyPrice === preset.priceUsd
                  ? "border-[#C5A059] bg-[#C5A059]/20 text-[#DFC283]"
                  : "border-white/10 bg-[#101822]/60 text-[#F4EFE6]/80 hover:border-white/20 hover:text-white",
              )}
            >
              {preset.label} &bull; ${preset.priceUsd.toLocaleString("en-US")}
            </button>
          ))}
        </div>

        {/* Main Calculator Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Sliders & Input Controls */}
          <div className="rounded-2xl border border-white/10 bg-[#101822]/90 p-6 backdrop-blur-xl sm:p-8">
            {/* Mode Toggle: 60-Month vs 100% Upfront */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-black/40 p-1.5">
              <button
                type="button"
                onClick={() => setPaymentMode("installment")}
                className={cn(
                  "rounded-lg py-2.5 text-xs font-bold transition-all sm:text-sm",
                  paymentMode === "installment"
                    ? "bg-[#C5A059] text-[#080E14] shadow-lg"
                    : "text-[#F4EFE6]/70 hover:text-white",
                )}
              >
                60-Month 0% Interest Plan
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("upfront")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all sm:text-sm",
                  paymentMode === "upfront"
                    ? "bg-[#3D9B6E] text-[#080E14] shadow-lg"
                    : "text-[#F4EFE6]/70 hover:text-white",
                )}
              >
                <span>100% Upfront</span>
                <span className="rounded bg-black/30 px-1.5 py-0.5 text-[0.65rem] uppercase">
                  10% OFF
                </span>
              </button>
            </div>

            {/* Property Price Slider */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label htmlFor="price-slider" className="text-xs uppercase tracking-wider text-[#C5A059]">
                  Property / Land Valuation
                </label>
                <div className="font-display text-2xl font-light text-white sm:text-3xl">
                  {currency === "USD"
                    ? `$${propertyPrice.toLocaleString("en-US")}`
                    : `GH¢${Math.round(propertyPrice * rate).toLocaleString("en-GH")}`}
                </div>
              </div>

              <input
                id="price-slider"
                type="range"
                min={20000}
                max={450000}
                step={5000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="mt-4 w-full accent-[#C5A059]"
              />

              <div className="mt-2 flex justify-between text-[0.7rem] text-[#F4EFE6]/50">
                <span>$20,000 (Titled Land)</span>
                <span>$200,000 (Townhouse Court)</span>
                <span>$450,000 (Executive Penthouse)</span>
              </div>
            </div>

            {/* Down Payment Percentage Slider (Only in Installment mode) */}
            {paymentMode === "installment" && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="down-slider" className="text-xs uppercase tracking-wider text-[#C5A059]">
                      Upfront Allocation Deposit
                    </label>
                    <p className="text-xs text-[#F4EFE6]/60">Minimum 40% standard</p>
                  </div>
                  <div className="font-display text-2xl font-light text-white">
                    {downPaymentPercent}%
                  </div>
                </div>

                <input
                  id="down-slider"
                  type="range"
                  min={30}
                  max={70}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="mt-4 w-full accent-[#C5A059]"
                />

                <div className="mt-2 flex justify-between text-[0.7rem] text-[#F4EFE6]/50">
                  <span>30% Special</span>
                  <span>40% Recommended Standard</span>
                  <span>70% Accelerated Equity</span>
                </div>
              </div>
            )}

            {/* Construction & Handover Milestones Timeline */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                5-Year Development & Payment Milestones
              </h4>
              <div className="mt-4 space-y-3">
                {PAYMENT_MILESTONES.map((ms) => (
                  <div
                    key={ms.month}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/20 p-3 text-xs"
                  >
                    <span className="rounded bg-[#C5A059]/20 px-2 py-1 font-mono font-bold text-[#DFC283]">
                      M{ms.month}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{ms.label}</div>
                      <div className="text-[#F4EFE6]/60">{ms.description}</div>
                    </div>
                    <span className="font-mono text-white/70">{ms.sharePercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results & Schedule Breakdown Card */}
          <div className="rounded-2xl border border-[#C5A059]/30 bg-[#101822] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C5A059]">
                  Schedule Preview
                </span>
                <h3 className="font-display text-2xl font-light text-white">
                  Payment Summary
                </h3>
              </div>
              <span className="rounded-full bg-[#3D9B6E]/20 px-3 py-1 text-xs font-bold text-[#3D9B6E]">
                0% APR Guaranteed
              </span>
            </div>

            {/* Key Figures */}
            <div className="mt-6 space-y-4">
              {paymentMode === "installment" ? (
                <>
                  <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-[#F4EFE6]/60">
                      Upfront Allocation ({downPaymentPercent}%)
                    </div>
                    <div className="mt-1 font-display text-3xl font-light text-white">
                      {currency === "USD"
                        ? `$${calculations.downPayment.toLocaleString("en-US")}`
                        : `GH¢${calculations.downPayment.toLocaleString("en-GH")}`}
                    </div>
                    <p className="mt-1 text-[0.7rem] text-[#F4EFE6]/50">
                      Secures plot reservation & legal title deed processing
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#3D9B6E]/30 bg-[#3D9B6E]/5 p-4">
                    <div className="text-xs uppercase tracking-wider text-[#3D9B6E]">
                      Monthly Payment (60 Installments)
                    </div>
                    <div className="mt-1 font-display text-3xl font-light text-[#3D9B6E]">
                      {currency === "USD"
                        ? `$${calculations.monthlyPayment.toLocaleString("en-US")}`
                        : `GH¢${calculations.monthlyPayment.toLocaleString("en-GH")}`}
                      <span className="text-xs text-[#F4EFE6]/70"> / month</span>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-[#F4EFE6]/60">
                      Spread over 60 equal monthly tranches with 0% interest
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-[#3D9B6E]/40 bg-[#3D9B6E]/10 p-5">
                  <div className="text-xs uppercase tracking-wider text-[#3D9B6E]">
                    Instant Cash Savings (10% Off)
                  </div>
                  <div className="mt-1 font-display text-3xl font-light text-white">
                    {currency === "USD"
                      ? `$${calculations.discount.toLocaleString("en-US")}`
                      : `GH¢${calculations.discount.toLocaleString("en-GH")}`}
                  </div>
                  <div className="mt-3 border-t border-[#3D9B6E]/20 pt-3">
                    <div className="text-xs text-[#F4EFE6]/70">Net Settlement Due:</div>
                    <div className="font-display text-2xl text-[#3D9B6E]">
                      {currency === "USD"
                        ? `$${calculations.finalPrice.toLocaleString("en-US")}`
                        : `GH¢${calculations.finalPrice.toLocaleString("en-GH")}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Metrics */}
              <dl className="divide-y divide-white/5 rounded-xl border border-white/5 bg-black/20 p-4 text-xs">
                <div className="flex justify-between py-2">
                  <dt className="text-[#F4EFE6]/60">Financing Interest Rate</dt>
                  <dd className="font-bold text-[#3D9B6E]">0.00% (Strictly Free)</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[#F4EFE6]/60">Arrangement & Bank Fees</dt>
                  <dd className="font-bold text-[#3D9B6E]">$0.00 (Zero Fees)</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[#F4EFE6]/60">Tenor Length</dt>
                  <dd className="text-white">
                    {paymentMode === "installment" ? "60 Months (5 Years)" : "Immediate"}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[#F4EFE6]/60">Title Deed Clearance</dt>
                  <dd className="text-white">Upon 100% Final Settlement</dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="btn-gold w-full text-center"
              >
                Generate Buyer Schedule Summary
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handlePrintSchedule}
                className="btn-outline-gold w-full text-center text-xs"
              >
                Print / Save PDF Amortization
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download / Buyer Schedule Summary Modal */}
      {downloadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#080E14] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C5A059]">
                  Official Buyer Summary
                </span>
                <h3 className="font-display text-xl text-white">
                  Afro-Arab Properties Amortization
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/70" htmlFor="calc-name">
                  Buyer Full Legal Name:
                </label>
                <input
                  id="calc-name"
                  value={buyerName}
                  onChange={(e) => setBuyerDetails({ name: e.target.value })}
                  placeholder="e.g. Samuel K. Boateng"
                  className="mt-1 h-10 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/70" htmlFor="calc-email">
                  Email Address for Delivery:
                </label>
                <input
                  id="calc-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerDetails({ email: e.target.value })}
                  placeholder="samuel@example.com"
                  className="mt-1 h-10 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Summary Receipt Box */}
              <div className="rounded-xl border border-[#C5A059]/40 bg-[#101822] p-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#F4EFE6]/70">Property Valuation:</span>
                  <span className="font-bold text-white">
                    {currency === "USD"
                      ? `$${propertyPrice.toLocaleString("en-US")}`
                      : `GH¢${Math.round(propertyPrice * rate).toLocaleString("en-GH")}`}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#F4EFE6]/70">Down Payment ({downPaymentPercent}%):</span>
                  <span className="font-bold text-[#DFC283]">
                    {currency === "USD"
                      ? `$${calculations.downPayment.toLocaleString("en-US")}`
                      : `GH¢${calculations.downPayment.toLocaleString("en-GH")}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-[#F4EFE6]/70">60-Month Installment:</span>
                  <span className="font-bold text-[#3D9B6E]">
                    {currency === "USD"
                      ? `$${calculations.monthlyPayment.toLocaleString("en-US")}`
                      : `GH¢${calculations.monthlyPayment.toLocaleString("en-GH")}`} / mo
                  </span>
                </div>
              </div>

              <div className="text-[0.68rem] leading-relaxed text-[#F4EFE6]/60">
                Official Afro-Arab Escrow Account details (Fidelity Bank Ghana & Ecobank Ghana)
                will be generated alongside this schedule for international diaspora wire transfer.
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setDownloadModalOpen(false);
                }}
                className="btn-gold flex-1 text-center"
              >
                Download / Print Schedule PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
