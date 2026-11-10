"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Icon } from "@/components/ui/Icon";

const statusText: Record<Project["status"], string> = {
  published: "Selling now",
  coming_soon: "Coming soon",
  sold_out: "Sold out",
  draft: "Draft",
};

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
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.4rem] bg-surface-muted shadow-soft">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover transition duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal variant={reverse ? "right" : "left"} delay={0.08}>
                <p className="font-figure text-sm text-gold">{String(index + 1).padStart(2, "0")}</p>
                <div className="t-meta mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.64rem] text-muted">
                  <span>{project.propertyLabel ?? project.type}</span>
                  <span aria-hidden>·</span>
                  <span className={project.status === "published" ? "text-available" : undefined}>{statusText[project.status]}</span>
                </div>
                <h2 className="t-h2 mt-3">{project.name}</h2>
                <p className="mt-2 text-sm text-muted">
                  {project.location}
                  {project.city ? ` · ${project.city}` : ""}
                </p>
                <p className="prose-lux mt-4 text-[1.05rem] text-muted">{project.tagline}</p>
                <p className="font-figure mt-6 text-2xl text-foreground">{project.priceDisplay}</p>
                {project.priceUsdDisplay ? (
                  <p className="font-figure mt-1 text-base text-muted">{project.priceUsdDisplay}</p>
                ) : null}
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <span className="link-draw">View estate</span>
                  <Icon name="arrowRight" size={15} className="btn-arrow" />
                </span>
              </ScrollReveal>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
