"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="space-y-16 lg:space-y-24">
      {projects.map((project, index) => {
        const reverse = index % 2 === 1;
        return (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className={`group grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ScrollReveal variant={reverse ? "left" : "right"} duration={0.8}>
                <div className="relative aspect-[5/4] overflow-hidden bg-surface-muted">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal variant={reverse ? "right" : "left"} delay={0.08}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
                  <span>{project.propertyLabel ?? project.type}</span>
                  <span className="text-border">·</span>
                  <span className="capitalize">{project.status.replace("_", " ")}</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">{project.name}</h2>
                <p className="mt-2 text-sm text-muted">
                  {project.location}
                  {project.city ? ` · ${project.city}` : ""}
                </p>
                <p className="prose-lux mt-4 text-[1.05rem] text-muted">{project.tagline}</p>
                <p className="font-figure mt-6 text-2xl text-foreground">{project.priceDisplay}</p>
                {project.priceUsdDisplay ? (
                  <p className="font-figure mt-1 text-base text-muted">{project.priceUsdDisplay}</p>
                ) : null}
                <span className="mt-6 inline-block text-sm font-semibold text-brand-red underline-offset-4 group-hover:underline">
                  View estate
                </span>
              </ScrollReveal>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
