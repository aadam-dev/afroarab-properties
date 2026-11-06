import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Titled Lands & Live Masterplan Explorer",
  description:
    "Explore Afro-Arab Properties 100% titled and registered land banks across Prampram, Obeyeyie, and Santoe with live vector plot exploration.",
};

export default function LandsPage() {
  const lands = publishedProjects().filter((p) => p.type === "land" || p.hasPlotExplorer);

  return (
    <div className="bg-[#080E14] text-[#F4EFE6] min-h-screen">
      <PageBand
        eyebrow="Titled Land Bank"
        title="100% Surveyed & Registered Titled Lands"
        description="Select a master-planned corridor, filter individual plots by dimensions and cardinal orientation, and reserve your plot with official Lands Commission boundary proof."
        imageSrc="/images/lands-prampram.jpg"
        imageAlt="Afro Arab land corridor imagery"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-6">
          {lands.map((land) => (
            <li key={land.slug}>
              <Link
                href={`/lands/${land.slug}/explorer`}
                className="group grid overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#101822]/80 backdrop-blur-xl transition-all duration-300 hover:border-[#C5A059]/50 hover:shadow-2xl md:grid-cols-[0.85fr_1.15fr]"
              >
                <div className="relative min-h-[240px]">
                  <Image
                    src={land.image}
                    alt={land.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101822] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#101822]" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059]">
                    <span>{land.location}</span>
                    <span>&bull;</span>
                    <span className="text-white/60">Registered Masterplan</span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl font-light text-white transition group-hover:text-[#DFC283] sm:text-4xl">
                    {land.name}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F4EFE6]/75">
                    {land.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="btn-gold text-xs">
                      Launch Vector Plot Explorer &rarr;
                    </span>
                    <span className="font-mono-data text-xs text-[#DFC283]">
                      {land.priceDisplay}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
