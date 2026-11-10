"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { formatGhs, getEstate, lowestPrice, plotLegend } from "@/data/masterplan";
import { Icon } from "@/components/ui/Icon";
import { SitePlan2D } from "@/components/explorer/SitePlan2D";
import { cn } from "@/lib/cn";

const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

const SLUG = "titled-lands-green-valley";
const EXPLORER = `/lands/${SLUG}/explorer`;

type Stage = { key: string; label: string; title: React.ReactNode; body: string; stat: string };

function useStages(): Stage[] {
  const estate = getEstate(SLUG)!;
  const legend = plotLegend(estate.plots);
  const from = lowestPrice(SLUG);
  return [
    {
      key: "land",
      label: "The land",
      title: (
        <>
          Every estate starts <em>as open land.</em>
        </>
      ),
      body: "Green Valley sits off the Prampram road: a gated parcel with a single entrance, laid out before a single block is cast.",
      stat: `${Math.round((estate.width * estate.height) / 4047)} acres · one gate`,
    },
    {
      key: "survey",
      label: "Surveyed",
      title: (
        <>
          Surveyed, <em>plot by plot.</em>
        </>
      ),
      body: "Each plot has fixed dimensions, a number and road access, so the plot you reserve is the plot on the site plan.",
      stat: `${estate.plots.length} plots · 70, 80 & 100 ft frontages`,
    },
    {
      key: "roads",
      label: "Roads in",
      title: (
        <>
          Roads in <em>before you build.</em>
        </>
      ),
      body: "A 12 m boulevard from the gate and 9 m streets serve every plot, with street lighting, a children's park and a landscaped buffer.",
      stat: "12 m boulevard · 9 m streets",
    },
    {
      key: "homes",
      label: "Homes rise",
      title: (
        <>
          Then the <em>homes rise.</em>
        </>
      ),
      body: "Every plot fits a family home with proper setbacks. See a suggested 2, 3 or 4-bedroom layout on any plot before you commit.",
      stat: "2 to 4-bedroom layouts that fit",
    },
    {
      key: "yours",
      label: "Choose yours",
      title: (
        <>
          Choose yours, <em>in 3D.</em>
        </>
      ),
      body: "Walk the roads, check the sun and road access, compare prices, then reserve with the exact plot number on WhatsApp or by phone.",
      stat: `${legend.available} available${from ? ` · from ${formatGhs(from)}` : ""}`,
    },
  ];
}

const noop = () => () => {};
function canUse3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function StaticStory({ stages }: { stages: Stage[] }) {
  const estate = getEstate(SLUG)!;
  return (
    <div className="shell section-y">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <ol className="space-y-10">
          {stages.map((s, i) => (
            <li key={s.key}>
              <p className="t-meta text-gold-light">
                {String(i + 1).padStart(2, "0")} · {s.label}
              </p>
              <h3 className="t-h3 mt-2">{s.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-band-fg/75">{s.body}</p>
            </li>
          ))}
        </ol>
        <div>
          <SitePlan2D estate={estate} className="h-auto w-full rounded-2xl" />
          <Link href={EXPLORER} className="btn-gold btn-lg mt-8">
            Open the 3D explorer <Icon name="arrowRight" size={18} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EstateStory() {
  const stages = useStages();
  const estate = getEstate(SLUG)!;
  const focus = useMemo(
    () => estate.plots.find((p) => p.status === "available" && p.isCorner) ?? estate.plots[0],
    [estate],
  );
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const can3D = useSyncExternalStore(noop, canUse3D, () => true);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const s = Math.min(stages.length - 1, Math.floor(p * stages.length * 0.999 + 0.0001));
    if (s !== stage) setStage(s);
    const next = Math.round(p * 100);
    if (next !== pct) setPct(next);
  });

  // Mount the canvas shortly before the section arrives; pause it when off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mount = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const run = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "10% 0px" });
    mount.observe(el);
    run.observe(el);
    return () => {
      mount.disconnect();
      run.disconnect();
    };
  }, []);

  if (reduce || !can3D) {
    return (
      <section aria-labelledby="story-title" className="on-dark relative bg-band text-band-fg">
        <h2 id="story-title" className="sr-only">
          How Green Valley Estate is laid out
        </h2>
        <StaticStory stages={stages} />
      </section>
    );
  }

  const current = stages[stage];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="story-title"
      className="on-dark relative bg-[#cfe0e6] text-white"
      style={{ height: `${stages.length * 100 + 60}svh` }}
    >
      <h2 id="story-title" className="sr-only">
        How Green Valley Estate is laid out, in five stages
      </h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {near ? <StoryCanvas estate={estate} focus={focus} progress={scrollYProgress} active={inView} /> : null}

        {/* Legibility veils */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b1510]/70 via-[#0b1510]/15 to-transparent max-md:bg-gradient-to-t max-md:from-[#0b1510]/85 max-md:via-[#0b1510]/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b1510]/60 to-transparent" />

        {/* Stage copy */}
        <div className="shell relative flex h-full flex-col justify-end pb-32 pt-28 md:justify-center md:pb-24">
          <div className="max-w-[34rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="t-meta flex items-center gap-3 text-[#e3c88c]">
                  <span className="font-figure text-base tracking-normal">{String(stage + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="h-px w-8 bg-current opacity-60" />
                  {current.label}
                </p>
                <h3 className="t-h1 mt-4 text-balance [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">{current.title}</h3>
                <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-white/85">{current.body}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md">
                  <Icon name="sparkle" size={14} /> {current.stat}
                </p>
                {current.key === "yours" ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`${EXPLORER}?plot=${focus.code}`} className="btn-gold btn-lg">
                      Open the 3D explorer <Icon name="arrowRight" size={18} className="btn-arrow" />
                    </Link>
                    <Link href="/lands" className="btn-ghost btn-lg">
                      About the land
                    </Link>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="shell flex items-end gap-5 pb-6 sm:gap-8">
            <p className="shrink-0">
              <span className="font-figure block text-3xl leading-none sm:text-4xl">{pct}%</span>
              <span className="t-meta mt-1 block text-[0.58rem] text-white/60">Indicative layout</span>
            </p>
            <ol className="flex items-end gap-1.5 sm:gap-3" aria-label="Story progress">
              {stages.map((s, i) => (
                <li key={s.key} className="flex flex-col gap-2">
                  <span
                    className={cn(
                      "t-meta hidden text-[0.62rem] transition-colors duration-300 md:block",
                      i === stage ? "text-white" : "text-white/45",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="relative block h-[3px] w-10 overflow-hidden rounded-full bg-white/25 sm:w-16 md:w-24">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-[#e3c88c] transition-[width] duration-200"
                      style={{
                        width: `${i < stage ? 100 : i > stage ? 0 : Math.min(100, ((pct / 100) * stages.length - i) * 100)}%`,
                      }}
                    />
                  </span>
                </li>
              ))}
            </ol>

          </div>
        </div>
      </div>
    </section>
  );
}
