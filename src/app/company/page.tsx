import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";

export const metadata: Metadata = {
  title: "Afro-Arab Group Heritage & Leadership",
  description:
    "Learn about Afro-Arab Properties, a premier subsidiary of the Afro-Arab Group of Companies led by Executive Chairman Alhaji Salamu Amadu.",
};

export default function CompanyPage() {
  return (
    <div className="bg-[#080E14] text-[#F4EFE6] min-h-screen">
      <PageBand
        eyebrow="Corporate Heritage"
        title="Redefining Modern Living in Ghana"
        description="A premier subsidiary of the Afro-Arab Group of Companies, established to pioneer institutional housing solutions, litigation-free titled lands, and accessible 60-month financing."
        imageSrc="/images/detail-entrance.jpg"
        imageAlt="Afro-Arab Corporate Entrance"
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Mission Statement */}
        <div className="rounded-2xl border border-white/10 bg-[#101822]/90 p-8 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
            The 200,000 Housing Initiative
          </span>
          <h2 className="mt-3 font-display text-3xl font-light text-white sm:text-4xl">
            Generational Wealth Through Titled Ownership
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#F4EFE6]/75">
            Afro-Arab Properties operates under the visionary leadership of the Afro-Arab Group.
            Our core mission is to bridge Ghana’s national housing deficit by delivering
            200,000 contemporary housing units alongside prime, surveyed, and fully registered
            titled lands across Greater Accra’s most strategic growth corridors.
          </p>
        </div>

        {/* Leadership */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#101822]/90 p-8 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
            Executive Governance
          </span>
          <h2 className="mt-3 font-display text-3xl font-light text-white">
            Leadership & Vision
          </h2>
          <div className="mt-6 border-l-2 border-[#C5A059] pl-6">
            <h3 className="font-display text-2xl text-white">
              Alhaji Salamu Amadu
            </h3>
            <p className="text-xs uppercase tracking-wider text-[#C5A059]">
              Executive Chairman, Afro-Arab Group of Companies
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#F4EFE6]/75">
              An acclaimed business visionary, philanthropist, and champion of private-sector-led
              urban development in Ghana. Under Alhaji Salamu’s stewardship, the Afro-Arab Group has
              expanded across real estate, microfinance, trade, and logistics, championing transparency
              and direct developer financing so that every Ghanaian can achieve homeownership.
            </p>
          </div>
        </div>

        {/* Institutional Pillars */}
        <div id="proof" className="mt-12">
          <h2 className="font-display text-3xl font-light text-white">
            Core Development Pillars
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <span className="font-display text-xl text-[#C5A059]">01</span>
              <h3 className="mt-2 text-sm font-semibold text-white">Titled Permanence</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#F4EFE6]/70">
                100% of our land banks are registered with the Lands Commission of Ghana. We guarantee zero chieftaincy disputes and zero land guard encroachment.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <span className="font-display text-xl text-[#C5A059]">02</span>
              <h3 className="mt-2 text-sm font-semibold text-white">0% Developer Financing</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#F4EFE6]/70">
                Direct in-house amortization schedules spreading payments over 60 interest-free months, eliminating predatory 30%+ commercial bank mortgage rates.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <span className="font-display text-xl text-[#C5A059]">03</span>
              <h3 className="mt-2 text-sm font-semibold text-white">Spatial Vector Proof</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#F4EFE6]/70">
                Live interactive masterplans and 360° architectural blueprints allow diaspora buyers to verify orientation, boundaries, and materials prior to commitment.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/projects" className="btn-gold">
            Explore Developments Portfolio
          </Link>
          <Link href="/contact" className="btn-outline-gold">
            Consult Executive Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
