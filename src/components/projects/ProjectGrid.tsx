"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-10 md:grid-cols-2">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ScrollReveal
            delay={(index % 2) * 0.06}
            variant={index % 2 === 0 ? "left" : "right"}
          >
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-muted">
                  <span>{project.type}</span>
                  <span>{project.status.replace("_", " ")}</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-light sm:text-3xl">
                  {project.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {project.location}
                  {project.city ? ` · ${project.city}` : ""}
                </p>
                <p className="mt-4 font-mono-data text-sm">{project.priceDisplay}</p>
              </div>
            </Link>
          </ScrollReveal>
        </li>
      ))}
    </ul>
  );
}
