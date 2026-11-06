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
    <div className="bg-sand-50 pt-28">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link href={`/projects/${project.slug}`} className="text-sm text-brand-red">
          ← Back to {project.name}
        </Link>
        <h1 className="mt-4 font-display text-5xl text-forest-900">{project.name} walkthrough</h1>
        <p className="mt-3 max-w-2xl text-lg text-stone-500">
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
