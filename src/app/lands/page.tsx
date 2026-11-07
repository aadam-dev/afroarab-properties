import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Titled Lands",
  description:
    "Explore Afro Arab Properties titled land corridors with live plot exploration.",
};

export default function LandsPage() {
  const lands = publishedProjects().filter((p) => p.type === "land" || p.hasPlotExplorer);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageBand
        eyebrow="Lands"
        title="Titled land corridors"
        description="Select a corridor, filter plots by size and facing, and enquire with plot context. Demo geometry until surveyed masterplans are ingested."
        imageSrc="/images/lands-prampram.jpg"
        imageAlt="Afro Arab land corridor imagery"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-14">
          {lands.map((land) => (
            <li key={land.slug}>
              <Link
                href={`/lands/${land.slug}/explorer`}
                className="group grid gap-8 md:grid-cols-2 md:items-center"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  <Image
                    src={land.image}
                    alt={land.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    {land.location}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-light sm:text-4xl">
                    {land.name}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {land.summary}
                  </p>
                  <p className="font-figure mt-6 text-xl">{land.priceDisplay}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-red underline-offset-4 group-hover:underline">
                    Open plot explorer
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
