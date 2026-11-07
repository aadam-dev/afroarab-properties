"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function RelatedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="border-t border-border bg-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-2xl">
          <p className="eyebrow">Also listed</p>
          <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl lg:text-5xl">
            Continue exploring
          </h2>
          <p className="prose-lux mt-4 text-muted">
            Other estates featured beside this listing on the live Afro Arab site.
          </p>
        </ScrollReveal>

        <ul className="mt-14 space-y-16 lg:space-y-20">
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
                  <ScrollReveal variant={reverse ? "left" : "right"}>
                    <div className="relative aspect-[5/4] overflow-hidden bg-surface-muted">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.025]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </ScrollReveal>
                  <ScrollReveal variant={reverse ? "right" : "left"} delay={0.08}>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">
                      {project.propertyLabel ?? project.type}
                      {" · "}
                      {project.location}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-light sm:text-4xl">
                      {project.name}
                    </h3>
                    <p className="prose-lux mt-4 text-[1.05rem] text-muted">{project.tagline}</p>
                    <p className="font-figure mt-6 text-2xl text-foreground">
                      {project.priceDisplay}
                    </p>
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
      </div>
    </section>
  );
}
