import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PlotExplorer } from "@/components/plot-explorer/PlotExplorer";
import { getProject } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.name} · Plot explorer` : "Plot explorer",
    description: "Interactive plan and 3D plot explorer with live availability filters.",
  };
}

export default async function ExplorerPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.hasPlotExplorer) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-[#080E14] text-[#DFC283]">
          Loading plot explorer…
        </div>
      }
    >
      <PlotExplorer projectSlug={slug} />
    </Suspense>
  );
}
