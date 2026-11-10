import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PlotExplorer } from "@/components/explorer/PlotExplorer";
import { estateSlugs, getEstate, plotLegend } from "@/data/masterplan";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return estateSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const estate = getEstate(slug);
  if (!estate) return { title: "Plot explorer" };
  const available = plotLegend(estate.plots).available;
  return {
    title: `${estate.name} · 3D plot explorer`,
    description: `Explore ${estate.plots.length} plots at ${estate.name} in 3D: ${available} available, with sizes, prices, road access, sun path and a suggested home on every plot.`,
    alternates: { canonical: `/lands/${slug}/explorer` },
  };
}

export default async function ExplorerPage({ params }: Props) {
  const { slug } = await params;
  if (!getEstate(slug)) notFound();

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#cfe0e6] text-sm font-semibold text-ink">
          Loading plot explorer…
        </div>
      }
    >
      <PlotExplorer slug={slug} />
    </Suspense>
  );
}
