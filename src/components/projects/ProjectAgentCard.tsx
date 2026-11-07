"use client";

import Image from "next/image";
import type { ProjectAgent } from "@/data/projects";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/cn";

type Props = {
  agent: ProjectAgent;
  projectName: string;
  className?: string;
};

export function ProjectAgentCard({ agent, projectName, className }: Props) {
  const message = encodeURIComponent(
    `Hello ${agent.name} — I’m interested in ${projectName} with Afro Arab Properties.`,
  );
  const wa = `https://wa.me/${agent.whatsappE164}?text=${message}`;

  return (
    <ScrollReveal
      className={cn(
        "overflow-hidden border border-border bg-forest-950 text-white",
        className,
      )}
    >
      <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[4/5] min-h-[16rem] bg-forest-900 sm:aspect-auto sm:min-h-full">
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 280px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-forest-950/40"
            aria-hidden
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
            Contact agent
          </p>
          <h3 className="mt-3 font-display text-2xl font-light sm:text-3xl">{agent.name}</h3>
          <p className="mt-2 text-sm text-white/65">{agent.role}</p>
          <p className="prose-lux mt-5 text-[1.05rem] text-white/75">
            Speak with the project manager listed on the live Afro Arab estate page for{" "}
            {projectName}.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <a
              href={`tel:${agent.phoneTel}`}
              className="block text-base text-white underline-offset-4 hover:underline"
            >
              {agent.phoneDisplay}
            </a>
            <a
              href={`mailto:${agent.email}`}
              className="block text-white/80 underline underline-offset-4"
            >
              {agent.email}
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary">
              WhatsApp agent
            </a>
            <a href={`tel:${agent.phoneTel}`} className="btn-ghost">
              Call
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
