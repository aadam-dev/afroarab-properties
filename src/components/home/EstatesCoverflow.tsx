"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

const statusText: Partial<Record<Project["status"], string>> = {
  coming_soon: "Coming soon",
  sold_out: "Sold out",
};

/**
 * Horizontal estate carousel with a coverflow tilt. Native scroll + snap, so it
 * works with touch, trackpad, keyboard and screen readers; the 3D tilt is purely
 * visual and driven from scroll position.
 */
export function EstatesCoverflow({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce) return;
      const mid = track.scrollLeft + track.clientWidth / 2;
      for (const li of Array.from(track.children) as HTMLElement[]) {
        const card = li.firstElementChild as HTMLElement | null;
        if (!card) continue;
        const centre = li.offsetLeft + li.offsetWidth / 2;
        const d = Math.max(-1.6, Math.min(1.6, (centre - mid) / li.offsetWidth));
        card.style.transform = `perspective(1400px) rotateY(${(-d * 16).toFixed(2)}deg) scale(${(1 - Math.min(Math.abs(d), 1) * 0.08).toFixed(3)})`;
        card.style.opacity = String(1 - Math.min(Math.abs(d), 1.4) * 0.28);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    track.scrollBy({ left: dir * (first.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <Section labelledBy="estates-title" className="overflow-hidden">
      <Container>
        <SectionHeading
          id="estates-title"
          eyebrow="Estates & courts"
          title={
            <>
              Places we <em>build.</em>
            </>
          }
          lead="Townhouses, apartment courts and serviced land across Greater Accra. Prices show only where Afro Arab has published them."
          action={
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => step(-1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-gold" aria-label="Previous estates">
                <Icon name="arrowLeft" size={18} />
              </button>
              <button type="button" onClick={() => step(1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-gold" aria-label="Next estates">
                <Icon name="arrowRight" size={18} />
              </button>
              <Link href="/projects" className="btn-outline-gold ml-2 max-sm:hidden">
                All estates
              </Link>
            </div>
          }
        />
      </Container>

      <ul
        ref={trackRef}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1rem,calc((100vw-82rem)/2+2.5rem))] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent-wheel
        aria-label="Estates"
      >
        {projects.map((p, i) => (
          <li key={p.slug} className="w-[min(82vw,400px)] shrink-0 snap-center">
            <Link
              href={p.hasPlotExplorer ? `/lands/${p.slug}/explorer` : `/projects/${p.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-surface-muted shadow-lux transition-[transform,opacity] duration-200 will-change-transform"
            >
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                sizes="(max-width: 640px) 82vw, 400px"
                className="object-cover transition duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(8,12,10,0.88)_100%)]" />
              {statusText[p.status] ? (
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink">{statusText[p.status]}</span>
              ) : p.hasPlotExplorer ? (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#e3c88c] px-3 py-1 text-xs font-bold text-ink">
                  <Icon name="cube" size={13} /> Explore in 3D
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="t-meta text-[0.62rem] text-white/70">{p.location}</p>
                <h3 className="mt-2 font-display text-[1.9rem] font-light leading-tight">{p.name}</h3>
                <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/20 pt-4">
                  <p className="font-figure text-lg leading-tight">{p.priceDisplay}</p>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-[#e3c88c] group-hover:text-ink">
                    <Icon name="arrowUpRight" size={18} />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
