"use client";

import type { Project } from "@/data/projects";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ProjectAgentCard } from "@/components/projects/ProjectAgentCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function ProjectEnquire({ project }: { project: Project }) {
  return (
    <section
      id="enquire"
      className="border-t border-border bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-2xl">
          <p className="eyebrow">Enquire</p>
          <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl lg:text-5xl">
            Arrange a viewing for {project.name}
          </h2>
          <p className="prose-lux mt-4 text-muted">
            Message the project agent or send the form. We respond with availability,
            viewing options, and payment-plan context.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {project.agent ? (
            <ProjectAgentCard agent={project.agent} projectName={project.name} />
          ) : (
            <div />
          )}
          <ScrollReveal variant="right" delay={0.08}>
            <EnquiryForm
              projectSlug={project.slug}
              intent={project.status === "sold_out" ? "general" : "viewing"}
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
