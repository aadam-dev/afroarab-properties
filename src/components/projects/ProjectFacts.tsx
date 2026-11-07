"use client";

import type { Project } from "@/data/projects";
import { ScrollReveal, StaggerItem, StaggerReveal } from "@/components/motion/ScrollReveal";

function Fact({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p
        className={
          large
            ? "font-figure mt-2 text-3xl leading-none text-foreground sm:text-4xl"
            : "font-figure mt-2 text-2xl leading-none text-foreground sm:text-3xl"
        }
      >
        {value}
      </p>
    </div>
  );
}

export function ProjectFacts({ project }: { project: Project }) {
  const facts: { label: string; value: string; large?: boolean }[] = [];
  if (project.beds) facts.push({ label: "Bedrooms", value: project.beds, large: true });
  if (project.baths) facts.push({ label: "Baths", value: project.baths, large: true });
  if (project.unitCount) facts.push({ label: "Units", value: project.unitCount, large: true });
  if (project.yearBuilt) facts.push({ label: "Year", value: project.yearBuilt });
  if (project.parking) facts.push({ label: "Parking", value: project.parking });
  if (project.areaDisplay) facts.push({ label: "Area", value: project.areaDisplay });

  return (
    <section className="border-b border-border bg-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">At a glance</p>
            <h2 className="mt-2 font-display text-2xl font-light sm:text-3xl">
              {project.propertyLabel ?? project.type}
              <span className="text-muted"> · </span>
              {project.city}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Status:{" "}
            <span className="font-semibold capitalize text-foreground">
              {project.status.replace("_", " ")}
            </span>
            {project.electricalPower ? (
              <>
                <br />
                Power listing: {project.electricalPower}
              </>
            ) : null}
          </p>
        </ScrollReveal>

        {facts.length ? (
          <StaggerReveal className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-3 lg:grid-cols-6">
            {facts.map((fact) => (
              <StaggerItem key={fact.label}>
                <Fact {...fact} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        ) : null}
      </div>
    </section>
  );
}
