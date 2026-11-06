"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected developments</p>
            <h2 className="mt-4 font-display text-4xl text-forest-900 text-balance sm:text-5xl lg:text-[3.4rem]">
              Homes and land with clearer facts
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-stone-500 text-pretty lg:text-right">
            Imagery and project names from Afro Arab’s public site. Specs still carry verification
            notes until the client confirms.
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
                      ? "group relative grid overflow-hidden rounded-[1.25rem] bg-forest-950 text-white lg:min-h-[28rem] lg:grid-cols-[1.15fr_0.85fr]"
                      : "group grid overflow-hidden rounded-[1.1rem] border border-sand-200/80 bg-white lg:grid-cols-[0.9fr_1.1fr]"
                  }
                >
                  <div
                    className={
                      featured
                        ? "relative min-h-[240px] overflow-hidden lg:min-h-full"
                        : "relative min-h-[200px] overflow-hidden"
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
                      className={
                        featured
                          ? "absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-forest-950/20"
                          : "absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
                      }
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
                    <div
                      className={
                        featured
                          ? "flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-gold-light/90"
                          : "flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-stone-500"
                      }
                    >
                      <span>{project.location}</span>
                      <span aria-hidden>·</span>
                      <span>{project.status.replace("_", " ")}</span>
                    </div>
                    <h3
                      className={
                        featured
                          ? "mt-4 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl"
                          : "mt-3 font-display text-3xl text-forest-900 transition group-hover:text-brand-red sm:text-4xl"
                      }
                    >
                      {project.name}
                    </h3>
                    <p
                      className={
                        featured
                          ? "mt-3 max-w-md text-base text-sand-200/85"
                          : "mt-3 max-w-xl text-base text-stone-500"
                      }
                    >
                      {project.tagline}
                    </p>
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                      <p
                        className={
                          featured
                            ? "font-mono-data text-sm text-gold-light"
                            : "font-mono-data text-sm text-forest-800"
                        }
                      >
                        {project.priceDisplay}
                      </p>
                      <span
                        className={
                          featured
                            ? "text-sm font-semibold text-white"
                            : "text-sm font-semibold text-brand-red"
                        }
                      >
                        {project.hasPlotExplorer ? "Open explorer →" : "View project →"}
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
