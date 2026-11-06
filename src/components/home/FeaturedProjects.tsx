"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-[#080E14] px-4 py-24 sm:px-6 lg:px-8 text-[#F4EFE6]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              Premier Developments
            </span>
            <h2 className="mt-4 font-display text-4xl font-light text-white text-balance sm:text-5xl lg:text-[3.4rem]">
              Executive Estates & Titled Enclaves
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#F4EFE6]/70 text-pretty lg:text-right">
            Explore verified master-planned communities across Greater Accra. All developments
            feature surveyed boundaries, legal title deeds, and 60-month interest-free options.
          </p>
        </div>

        <ul className="mt-14 space-y-6">
          {projects.map((project, index) => {
            const href = project.hasPlotExplorer
              ? `/lands/${project.slug}/explorer`
              : `/projects/${project.slug}`;
            const featured = index === 0;

            return (
              <motion.li
                key={project.slug}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{
                  duration: 0.65,
                  delay: reduce ? 0 : index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={href}
                  className={
                    featured
                      ? "group relative grid overflow-hidden rounded-[1.25rem] border border-[#C5A059]/30 bg-[#101822] text-white shadow-2xl lg:min-h-[28rem] lg:grid-cols-[1.15fr_0.85fr] hover:border-[#C5A059]/60 transition-all duration-300"
                      : "group grid overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#101822]/80 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr] hover:border-[#C5A059]/40 transition-all duration-300"
                  }
                >
                  <div
                    className={
                      featured
                        ? "relative min-h-[260px] overflow-hidden lg:min-h-full"
                        : "relative min-h-[220px] overflow-hidden"
                    }
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#080E14] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#101822]"
                      aria-hidden
                    />
                  </div>

                  <div
                    className={
                      featured
                        ? "relative flex flex-col justify-end p-7 sm:p-10"
                        : "flex flex-col justify-center p-6 sm:p-8"
                    }
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#C5A059]">
                      <span>{project.location}</span>
                      <span aria-hidden>&bull;</span>
                      <span className="text-white/60">{project.status.replace("_", " ")}</span>
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-light text-white transition group-hover:text-[#DFC283] sm:text-3xl lg:text-4xl">
                      {project.name}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F4EFE6]/75">
                      {project.tagline}
                    </p>

                    <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
                      <div>
                        <span className="block text-[0.68rem] uppercase tracking-wider text-[#F4EFE6]/50">
                          Valuation
                        </span>
                        <p className="font-mono-data text-sm font-semibold text-[#C5A059]">
                          {project.priceDisplay}
                        </p>
                      </div>

                      <span className="btn-outline-gold text-xs">
                        {project.hasPlotExplorer ? "Open Plot Explorer →" : "Explore Estate →"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
