import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { PlotExplorer } from "@/components/plot-explorer/PlotExplorer";
import { FloorPlanWalker } from "@/components/floor-plan/FloorPlanWalker";
import { PaymentCalculator } from "@/components/calculator/PaymentCalculator";
import { ProvenanceStrip } from "@/components/home/ProvenanceStrip";
import { TaglineReveal } from "@/components/home/TaglineReveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { publishedProjects } from "@/data/projects";

export default function HomePage() {
  const featured = publishedProjects()
    .filter(
      (p) =>
        p.featured ||
        ["bella-vista", "blakk-rastas-court", "cephas-court", "lamins-court", "hassy-homes"].includes(
          p.slug,
        ),
    )
    .slice(0, 6);

  return (
    <>
      {/* 1. Cinematic Scroll-Driven Hero with Staggered Reveals & Pinned Stats */}
      <CinematicHero />

      {/* 2. Executive Estates & Townhouses Showcase */}
      <FeaturedProjects projects={featured} />

      {/* 3. Live Interactive Plot Explorer Engine (Vector Masterplan) */}
      <PlotExplorer initialProjectSlug="bella-vista" />

      {/* 4. Spatial Floor Plan Walkthrough Engine (Blueprint + 360 Panorama) */}
      <FloorPlanWalker projectName="Bella Vista Executive Townhouse" />

      {/* 5. 60-Month Interest-Free Mortgage Simulator & Amortization Engine */}
      <PaymentCalculator />

      {/* 6. Provenance & Title Verification Strip */}
      <ProvenanceStrip />

      {/* 7. Brand Philosophy & Vision Reveal */}
      <TaglineReveal />

      {/* 8. Private Viewing & VIP Diaspora Concierge Inquiries */}
      <section id="contact" className="relative bg-[#080E14] px-4 py-24 sm:px-6 lg:px-8 border-t border-white/10 text-[#F4EFE6]">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <div className="lg:pt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              VIP Sales Concierge
            </span>
            <h2 className="mt-4 max-w-xl font-display text-4xl text-white text-balance sm:text-5xl">
              Arrange a Private Site Inspection or Diaspora Virtual Briefing
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#F4EFE6]/75 text-pretty">
              Whether you are acquiring titled land in Prampram or reserving an executive
              townhouse in Amasaman or Spintex, our investment advisory team provides
              instant cadastral coordinates, title deed verification, and customized 60-month schedules.
            </p>
            <div className="divider-gold mt-10 max-w-[12rem]" />

            <div className="mt-8 space-y-4 text-xs text-[#F4EFE6]/70">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C5A059]/20 text-[#DFC283]">
                  ✓
                </span>
                <span>Government of Ghana Lands Commission Titled & Surveyed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C5A059]/20 text-[#DFC283]">
                  ✓
                </span>
                <span>Direct Escrow with Fidelity Bank Ghana & Ecobank Ghana</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C5A059]/20 text-[#DFC283]">
                  ✓
                </span>
                <span>International Diaspora Concierge (London &bull; Atlanta &bull; Dubai)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101822]/90 p-6 backdrop-blur-xl sm:p-8">
            <EnquiryForm intent="viewing" />
          </div>
        </div>
      </section>
    </>
  );
}
