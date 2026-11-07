"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  formatPlotlineDate,
  plotlineCategoryLabel,
  type PlotlinePost,
} from "@/data/plotline";
import { cn } from "@/lib/cn";

type Props = {
  featured: PlotlinePost[];
  rest: PlotlinePost[];
};

export function PlotlineIndex({ featured, rest }: Props) {
  const reduce = useReducedMotion();
  const hero = featured[0];
  const side = featured.slice(1, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-band text-band-fg">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 12% 20%, rgba(197,160,89,0.22), transparent 42%), radial-gradient(ellipse at 88% 80%, rgba(47,86,67,0.45), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono-data text-xs uppercase tracking-[0.22em] text-gold-light">
              Afro Arab · Plotline
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-light tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Plotline
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-band-fg/78">
              News, offers, and buyer notes from the ground — what’s moving across
              Afro Arab estates and titled land in Greater Accra.
            </p>
          </motion.div>
        </div>
      </section>

      {hero ? (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:gap-14">
            <Link
              href={`/plotline/${hero.slug}`}
              className="group block focus-visible:outline-none"
            >
              {hero.image ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                  <Image
                    src={hero.image}
                    alt={hero.imageAlt ?? hero.title}
                    fill
                    priority
                    className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              ) : null}
              <div className="mt-6">
                <p className="font-mono-data text-xs uppercase tracking-[0.16em] text-muted">
                  {formatPlotlineDate(hero.date)} · {plotlineCategoryLabel[hero.category]}
                </p>
                <h2 className="mt-3 font-display text-3xl font-light text-balance transition group-hover:underline sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                  {hero.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {hero.excerpt}
                </p>
              </div>
            </Link>

            <div className="flex flex-col justify-between gap-10 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="font-mono-data text-xs uppercase tracking-[0.16em] text-muted">
                Also moving
              </p>
              <ul className="space-y-8">
                {side.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/plotline/${post.slug}`} className="group block">
                      <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted">
                        {formatPlotlineDate(post.date)} ·{" "}
                        {plotlineCategoryLabel[post.category]}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-light text-balance transition group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-border bg-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-light sm:text-4xl">
              The feed
            </h2>
            <p className="hidden max-w-xs text-right text-sm text-muted sm:block">
              Chronological notes — press moments, offers, and practical guides.
            </p>
          </div>

          <ol className="mt-12">
            {rest.map((post, i) => (
              <li
                key={post.slug}
                className={cn(
                  "grid gap-4 border-t border-border py-8 sm:grid-cols-[7rem_1fr] sm:gap-10 lg:grid-cols-[8.5rem_1fr_12rem]",
                  i === rest.length - 1 && "border-b",
                )}
              >
                <time
                  dateTime={post.date}
                  className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted"
                >
                  {formatPlotlineDate(post.date)}
                </time>
                <div>
                  <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-gold">
                    {plotlineCategoryLabel[post.category]}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-light text-balance sm:text-[1.75rem]">
                    <Link
                      href={`/plotline/${post.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                    {post.excerpt}
                  </p>
                </div>
                <div className="hidden lg:block">
                  <Link
                    href={`/plotline/${post.slug}`}
                    className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    Read
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
