import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FloorPlanWalkthrough } from "@/components/walkthrough/FloorPlanWalkthrough";
import { getProject } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.name} walkthrough` : "Walkthrough",
  };
}

export default async function WalkthroughPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.hasWalkthrough) notFound();

  return (
    <div className="min-h-screen bg-[#080E14] pt-28 text-[#F4EFE6]">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-[#C5A059] underline-offset-4 hover:underline"
        >
          ← Back to {project.name}
        </Link>
        <h1 className="mt-4 font-display text-4xl font-light text-white sm:text-5xl">
          {project.name} walkthrough
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[#F4EFE6]/70">
          Interactive plan preview using the reusable floor-plan pipeline. Replace this demo with
          project CAD/IFC assets after verification.
        </p>
        <div className="mt-10">
          <FloorPlanWalkthrough projectName={project.name} />
        </div>
      </div>
    </div>
  );
}
