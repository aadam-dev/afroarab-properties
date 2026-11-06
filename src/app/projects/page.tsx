import type { Metadata } from "next";
import { PageBand } from "@/components/site/PageBand";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Estates & Developments",
  description:
    "Browse Afro Arab Properties residential developments across Greater Accra — townhouses, courts, and masterplans.",
};

export default function ProjectsPage() {
  const projects = publishedProjects().filter((p) => p.type !== "land");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageBand
        eyebrow="Estates"
        title="Developments across Greater Accra"
        description="Townhouses, courts, and mixed communities — with locations from the live listing maps. Prices and unit facts publish only when verified."
        imageSrc="/images/projects/cephas-court-2.png"
        imageAlt="Cephas Court by Afro Arab Properties"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
