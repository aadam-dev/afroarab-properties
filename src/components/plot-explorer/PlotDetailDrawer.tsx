"use client";

import { useEffect, useState } from "react";
import { type Plot, statusColor, statusLabel } from "@/data/plots";
import { usePlotStore } from "@/store/usePlotStore";
import { formatCurrencyAmount } from "@/store/useCalculatorStore";

interface PlotDetailDrawerProps {
  plot: Plot | null;
  estateName: string;
  onClose: () => void;
}

export function PlotDetailDrawer({ plot, estateName, onClose }: PlotDetailDrawerProps) {
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [currency, setCurrency] = useState<"USD" | "GHS">("USD");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!plot) return null;

  // Currency math (assuming 1 USD = 15.5 GHS)
  const rate = 15.5;
  const priceGhs = plot.priceGhs;
  const priceUsd = Math.round(plot.priceGhs / rate);
  const currentPrice = currency === "USD" ? priceUsd : priceGhs;

  // 40% Down payment + 60-Month Installment
  const downPayment = Math.round(currentPrice * 0.4);
  const remaining = currentPrice - downPayment;
  const monthlyInstallment = Math.round(remaining / 60);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setReservedSuccess(true);
  };

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#080E14]/95 text-[#F4EFE6] shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-transform duration-300 ease-out"
      role="dialog"
      aria-modal="true"
      aria-label={`Plot details for ${plot.code}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${statusColor[plot.status]}20`,
              color: statusColor[plot.status],
              border: `1px solid ${statusColor[plot.status]}40`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: statusColor[plot.status] }}
            />
            {statusLabel[plot.status]}
          </span>
          <h2 className="mt-1 font-display text-2xl font-light text-[#F4EFE6]">
            Plot {plot.code}
          </h2>
          <p className="text-xs text-[#F4EFE6]/60">{estateName}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#F4EFE6]/70 transition-colors hover:border-[#C5A059] hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {/* Price & Currency Switcher */}
        <div className="rounded-xl border border-[#C5A059]/25 bg-[#101822] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#C5A059]">
              Total Title Valuation
            </span>
            <div className="flex rounded-md border border-white/10 bg-black/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  currency === "USD"
                    ? "bg-[#C5A059] text-[#080E14]"
                    : "text-[#F4EFE6]/70 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("GHS")}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  currency === "GHS"
                    ? "bg-[#C5A059] text-[#080E14]"
                    : "text-[#F4EFE6]/70 hover:text-white"
                }`}
              >
                GHS (GH¢)
              </button>
            </div>
          </div>

          <div className="mt-3 font-display text-3xl font-light text-white">
            {currency === "USD"
              ? `$${priceUsd.toLocaleString("en-US")}`
              : `GH¢${priceGhs.toLocaleString("en-GH")}`}
          </div>

          <p className="mt-1 text-xs text-[#F4EFE6]/60">
            {currency === "USD"
              ? `Equivalent: GH¢${priceGhs.toLocaleString("en-GH")} (FX 1 USD ≈ 15.5 GHS)`
              : `Equivalent: $${priceUsd.toLocaleString("en-US")}`}
          </p>
        </div>

        {/* 60-Month Payment Plan Breakdown */}
        <div className="rounded-xl border border-white/10 bg-[#101822]/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
              60-Month Interest-Free Pathway
            </h3>
            <span className="rounded bg-[#00E676]/20 px-2 py-0.5 text-[0.65rem] font-bold text-[#00E676]">
              0% INTEREST
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/60">
                40% Down Payment
              </div>
              <div className="mt-1 font-display text-lg text-white">
                {currency === "USD"
                  ? `$${downPayment.toLocaleString("en-US")}`
                  : `GH¢${downPayment.toLocaleString("en-GH")}`}
              </div>
              <div className="text-[0.65rem] text-[#F4EFE6]/50">Due upon allocation</div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/60">
                Monthly (60 Mos)
              </div>
              <div className="mt-1 font-display text-lg text-[#00E676]">
                {currency === "USD"
                  ? `$${monthlyInstallment.toLocaleString("en-US")}`
                  : `GH¢${monthlyInstallment.toLocaleString("en-GH")}`}
                <span className="text-xs text-[#F4EFE6]/60">/mo</span>
              </div>
              <div className="text-[0.65rem] text-[#F4EFE6]/50">Spread over 5 years</div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="rounded-xl border border-white/10 bg-[#101822]/40 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            Plot Specifications
          </h3>

          <dl className="mt-3 divide-y divide-white/5 text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Dimensions</dt>
              <dd className="font-mono-data text-white">
                {plot.widthFt} ft × {plot.depthFt} ft
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Surveyed Area</dt>
              <dd className="font-mono-data text-white">
                {plot.areaSqm} m² ({Math.round(plot.widthFt * plot.depthFt)} sqft)
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Cardinal Facing</dt>
              <dd className="text-white">
                {plot.facing === "N"
                  ? "North (Optimal Breeze)"
                  : plot.facing === "S"
                    ? "South (Sunlit)"
                    : plot.facing === "E"
                      ? "East (Sunrise)"
                      : "West (Sunset)"}
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Access Infrastructure</dt>
              <dd className="text-right text-white">{plot.roadAccess}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Plot Typology</dt>
              <dd className="text-white">
                {plot.isCorner ? "Corner Plot (Dual Frontage)" : "Standard Residential Plot"}
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#F4EFE6]/60">Title Classification</dt>
              <dd className="font-medium text-[#00E676]">Lands Commission Registered</dd>
            </div>
          </dl>
        </div>

        {/* Reservation / Inquire Form */}
        {plot.status === "available" ? (
          reservedSuccess ? (
            <div className="rounded-xl border border-[#00E676]/40 bg-[#00E676]/10 p-5 text-center">
              <svg
                className="mx-auto h-8 w-8 text-[#00E676]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h4 className="mt-2 font-display text-lg text-white">
                Priority Allocation Hold Initiated
              </h4>
              <p className="mt-1 text-xs text-[#F4EFE6]/80">
                Our executive sales concierge has been notified. We will contact you at{" "}
                <span className="font-semibold text-white">{buyerPhone || "your contact"}</span> within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReserve} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                Reserve Plot {plot.code} Priority Hold
              </h4>
              <div>
                <label className="block text-[0.75rem] text-[#F4EFE6]/70" htmlFor="buyer-name">
                  Full Name
                </label>
                <input
                  id="buyer-name"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Nana Kwesi Mensah"
                  className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[0.75rem] text-[#F4EFE6]/70" htmlFor="buyer-phone">
                  WhatsApp / Phone (Include Country Code)
                </label>
                <input
                  id="buyer-phone"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+233 24 000 0000 or +44 7000 000000"
                  className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C5A059]"
                />
              </div>
              <button type="submit" className="btn-gold w-full text-center">
                Reserve Plot Now (Hold for 48 Hours)
              </button>
            </form>
          )
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-sm text-[#F4EFE6]/70">
              This plot is currently{" "}
              <span className="font-semibold text-white">{statusLabel[plot.status].toLowerCase()}</span>.
            </p>
            <a
              href="#contact"
              onClick={onClose}
              className="mt-3 inline-block text-xs font-semibold text-[#C5A059] underline underline-offset-4"
            >
              Inquire about next release in this sector &rarr;
            </a>
          </div>
        )}

        <div className="flex gap-2">
          <a
            href="https://wa.me/233244000000?text=Hello%20Afro-Arab%20Properties,%20I%20am%20inquiring%20about%20Plot%20"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold flex-1 text-center text-xs"
          >
            Chat with Sales VIP Concierge
          </a>
        </div>
      </div>
    </div>
  );
}
