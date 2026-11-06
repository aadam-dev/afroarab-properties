import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Afro Arab Properties developments across Greater Accra — homes, apartments, and titled land.",
};

export default function ProjectsPage() {
  const projects = publishedProjects().filter((p) => p.type !== "land");

  return (
    <div className="bg-sand-50">
      <PageBand
        eyebrow="Projects"
        title="Developments across Greater Accra"
        description="Specs marked “verify” wait on Afro Arab confirmation. We will not republish the legacy site’s conflicting sizes and counts."
        imageSrc="/images/projects/cephas-court-2.png"
        imageAlt="Cephas Court by Afro Arab Properties"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-sand-200/80 bg-white transition hover:shadow-[var(--shadow-soft)]"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">
                    <span>{project.type}</span>
                    <span>{project.status.replace("_", " ")}</span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl text-forest-900 transition group-hover:text-brand-red">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">{project.location}</p>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-forest-800/80">
                    {project.summary}
                  </p>
                  <p className="mt-6 font-mono-data text-sm font-semibold text-brand-red">
                    {project.priceDisplay}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
