"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-2xl">
          <p className="eyebrow">Estates</p>
          <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl lg:text-5xl">
            Developments across Greater Accra
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted text-pretty">
            Townhouses, courts, and titled land corridors — with locations restored from
            the live listing maps. Prices and unit facts publish only when verified.
          </p>
        </ScrollReveal>

        <ul className="mt-14 space-y-16 lg:space-y-24">
          {projects.map((project, index) => {
            const href = project.hasPlotExplorer
              ? `/lands/${project.slug}/explorer`
              : `/projects/${project.slug}`;
            const reverse = index % 2 === 1;
            const imageVariant = reverse ? "left" : "right";
            const copyVariant = reverse ? "right" : "left";

            return (
              <li key={project.slug}>
                <Link
                  href={href}
                  className={`group grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <ScrollReveal variant={imageVariant} duration={0.8}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                  </ScrollReveal>
                  <ScrollReveal variant={copyVariant} delay={0.08} duration={0.75}>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">
                      {project.location}
                      {project.city ? ` · ${project.city}` : ""}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-light sm:text-4xl">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      {project.tagline}
                    </p>
                    <p className="mt-6 font-mono-data text-sm text-foreground">
                      {project.priceDisplay}
                    </p>
                    <span className="mt-6 inline-block text-sm font-semibold text-brand-red underline-offset-4 group-hover:underline">
                      View details
                    </span>
                  </ScrollReveal>
                </Link>
              </li>
            );
          })}
        </ul>

        <ScrollReveal className="mt-16" delay={0.05}>
          <Link href="/projects" className="btn-outline-gold">
            All estates
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
