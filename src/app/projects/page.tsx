import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Estates & Developments",
  description:
    "Browse Afro-Arab Properties luxury residential developments across Greater Accra — townhouses, executive courts, and titled masterplans.",
};

export default function ProjectsPage() {
  const projects = publishedProjects().filter((p) => p.type !== "land");

  return (
    <div className="bg-[#080E14] text-[#F4EFE6] min-h-screen">
      <PageBand
        eyebrow="Portfolio"
        title="Executive Developments Across Greater Accra"
        description="Every community features verified cadastral surveys, legal title deeds, and eligibility for the Afro-Arab 60-month interest-free developer plan."
        imageSrc="/images/projects/cephas-court-2.png"
        imageAlt="Cephas Court by Afro Arab Properties"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <ul className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#101822]/80 backdrop-blur-xl transition-all duration-300 hover:border-[#C5A059]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101822] via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#C5A059]">
                    <span>{project.type}</span>
                    <span className="text-white/60">{project.status.replace("_", " ")}</span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-light text-white transition group-hover:text-[#DFC283]">
                    {project.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#F4EFE6]/60">{project.location}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#F4EFE6]/75">
                    {project.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="font-mono-data text-sm font-semibold text-[#DFC283]">
                      {project.priceDisplay}
                    </p>
                    <span className="text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
