import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBand } from "@/components/site/PageBand";
import { Icon } from "@/components/ui/Icon";
import { FloorPlanWalkthrough } from "@/components/walkthrough/FloorPlanWalkthrough";
import { getProject, publishedProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedProjects()
    .filter((p) => p.hasWalkthrough)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.name} floor plan` : "Floor plan",
    description: project ? `Floor plan preview for ${project.name}. Illustrative until project drawings are published.` : undefined,
  };
}

export default async function WalkthroughPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.hasWalkthrough) notFound();

  return (
    <>
      <PageBand
        eyebrow="Floor plan preview"
        title={
          <>
            {project.name}, <em>room by room.</em>
          </>
        }
        description="An illustrative layout for orientation. Dimensions and interiors are indicative until Afro Arab publishes the project drawings."
        crumbs={[
          { href: "/projects", label: "Estates" },
          { href: `/projects/${project.slug}`, label: project.name },
        ]}
        current="Floor plan"
        size="compact"
        actions={
          <Link href={`/projects/${project.slug}`} className="btn-ghost">
            <Icon name="arrowLeft" size={16} /> Back to {project.name}
          </Link>
        }
      />
      <div className="bg-background">
        <FloorPlanWalkthrough projectName={project.name} />
      </div>
    </>
  );
}
