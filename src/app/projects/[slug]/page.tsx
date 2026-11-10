import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEnquire } from "@/components/projects/ProjectEnquire";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectStory } from "@/components/projects/ProjectStory";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { getProject, publishedProjects, relatedProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.status === "draft") notFound();

  const gallery = project.gallery?.length ? project.gallery : [project.image];
  const related = relatedProjects(project, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.summary,
    url: `/projects/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city,
      addressCountry: "GH",
      streetAddress: project.location,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <ProjectHero project={project} />
      <ProjectFacts project={project} />
      <ProjectGallery name={project.name} images={gallery} />
      <ProjectStory project={project} />
      <ProjectEnquire project={project} />
      <RelatedProjects projects={related} />
    </div>
  );
}
