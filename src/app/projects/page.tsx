import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Icon } from "@/components/ui/Icon";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Estates & developments",
  description:
    "Browse Afro Arab Properties townhouses, apartment courts and mixed communities across Greater Accra, with locations, published prices and viewing contacts.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = publishedProjects().filter((p) => p.type !== "land");

  return (
    <>
      <PageBand
        eyebrow="Estates & courts"
        title={
          <>
            Homes across <em>Greater Accra.</em>
          </>
        }
        description="Townhouses, apartment courts and mixed communities. Locations come from Afro Arab's listing maps; prices show only where they have been published."
        imageSrc="/images/projects/cephas-court-2.png"
        imageAlt="Cephas Court townhouses by Afro Arab Properties"
        current="Estates"
        actions={
          <Link href="/lands" className="btn-ghost">
            Looking for land? <Icon name="arrowRight" size={16} className="btn-arrow" />
          </Link>
        }
      />
      <section className="section-y bg-background">
        <div className="shell">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
