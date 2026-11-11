"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { LocationMap } from "@/components/site/LocationMap";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Icon } from "@/components/ui/Icon";

export function ProjectStory({ project }: { project: Project }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <ScrollReveal>
            <p className="eyebrow">The estate</p>
            <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl">
              Place, programme, and promise
            </h2>
            <p className="prose-lux mt-6 text-muted">{project.summary}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="mt-12">
            <h3 className="font-display text-2xl font-light">Highlights</h3>
            <ul className="mt-6 space-y-0 border-t border-border">
              {project.highlights.map((h, i) => (
                <li
                  key={h}
                  className="flex gap-5 border-b border-border py-4 text-base leading-relaxed text-foreground"
                >
                  <span className="font-figure w-8 shrink-0 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {project.features?.length ? (
            <ScrollReveal delay={0.1} className="mt-14">
              <h3 className="font-display text-2xl font-light">Property features</h3>
              <ul className="mt-6 columns-1 gap-x-10 sm:columns-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="mb-3 break-inside-avoid border-l-2 border-gold/50 pl-4 text-sm leading-relaxed text-muted"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ) : null}

          <ScrollReveal className="mt-12 flex flex-wrap gap-3">
            {project.hasPlotExplorer ? (
              <Link href={`/lands/${project.slug}/explorer`} className="btn-primary">
                Open plot explorer
              </Link>
            ) : null}
            {project.hasWalkthrough ? (
              <Link href={`/projects/${project.slug}/walkthrough`} className="btn-gold">
                <Icon name="cube" size={16} /> Explore in 3D
              </Link>
            ) : null}
            <Link href="/payment-plans" className="btn-outline-gold">
              Payment plans
            </Link>
          </ScrollReveal>

          <ScrollReveal className="mt-10 text-xs leading-relaxed text-muted">
            <strong className="text-foreground">Verification:</strong> {project.verificationNote}
          </ScrollReveal>
        </div>

        <div className="space-y-8">
          {project.mapQuery ? (
            <ScrollReveal variant="right">
              <p className="eyebrow">Location</p>
              <h3 className="mt-2 font-display text-2xl font-light">
                {project.location}
              </h3>
              <p className="mt-2 text-sm text-muted">{project.city}, Ghana</p>
              <LocationMap
                className="mt-6"
                query={project.mapQuery}
                zoom={project.mapZoom ?? 14}
                title={`${project.name} — ${project.location}`}
              />
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
