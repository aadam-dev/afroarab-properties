"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  builtUpSqFt,
  feetInches,
  formatGhs,
  houseTypeForPlot,
  similarPlots,
  statusColor,
  statusLabel,
  type DocumentStatus,
  type Estate,
  type Plot,
} from "@/data/masterplan";
import { whatsappHref } from "@/data/site";
import { instalmentPlan, LAND_PLAN_OPTIONS } from "@/lib/payments";
import { cn } from "@/lib/cn";
import { usePlotStore } from "@/store/usePlotStore";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Icon } from "@/components/ui/Icon";
import { PlotFloorPlan } from "./PlotFloorPlan";
import { COMPASS_WORDS } from "./world/core";

const docTone: Record<DocumentStatus, { label: string; cls: string }> = {
  ready: { label: "Ready", cls: "bg-available/12 text-available" },
  in_progress: { label: "In progress", cls: "bg-held/15 text-held" },
  on_request: { label: "On request", cls: "bg-foreground/8 text-muted" },
};

function Fact({ label, value, sub, emphasis }: { label: string; value: string; sub?: string; emphasis?: boolean }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface/70 px-3.5 py-3">
      <dt className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className={cn("mt-1 font-figure text-[1.35rem] leading-tight", emphasis && "text-forest-700 dark:text-gold-light")}>
        {value}
      </dd>
      {sub ? <dd className="mt-0.5 text-xs text-muted">{sub}</dd> : null}
    </div>
  );
}

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="border-t border-border/70 pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-normal">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PlotPanel({ plot, estate, onClose }: { plot: Plot; estate: Estate; onClose: () => void }) {
  const housesVisible = usePlotStore((s) => s.housesVisible);
  const setHousesVisible = usePlotStore((s) => s.setHousesVisible);
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const standOnPlot = usePlotStore((s) => s.standOnPlot);

  const [expanded, setExpanded] = useState(false);
  const [deposit, setDeposit] = useState<number>(LAND_PLAN_OPTIONS.defaultDeposit);
  const [months, setMonths] = useState<number>(LAND_PLAN_OPTIONS.defaultMonths);
  const [enquiring, setEnquiring] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const type = useMemo(() => houseTypeForPlot(plot), [plot]);
  const similar = useMemo(() => similarPlots(plot, estate.plots, 3), [plot, estate]);
  const plan = instalmentPlan(plot.priceGhs, deposit, months);
  const available = plot.status === "available";

  // The panel is keyed by plot code, so this runs once per plot.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const roads = plot.frontages.map((f) => {
    const road = estate.roads.find((r) => r.id === f.roadId);
    return { ...f, name: road?.name ?? f.roadId, width: road?.widthM ?? 0 };
  });
  const facesPark = plot.block === "Block A" && plot.facing === "S";
  const standardPlots = plot.areaSqFt / 7000;

  const message = `Hello Afro Arab, I'm interested in Plot ${plot.code} at ${estate.name} (${plot.frontageFt} × ${plot.depthFt} ft, ${formatGhs(plot.priceGhs)}). Is it still available?`;

  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("plot", plot.code);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside
      aria-labelledby="plot-panel-title"
      className={cn(
        "glass-panel pointer-events-auto fixed inset-x-0 bottom-0 z-30 flex max-h-[80svh] flex-col rounded-t-3xl transition-[max-height] duration-300 ease-[var(--ease-out-soft)]",
        !expanded && "max-md:max-h-[46svh]",
        "md:absolute md:inset-x-auto md:bottom-3 md:right-3 md:top-[5.25rem] md:max-h-none md:w-[400px] md:rounded-2xl",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full justify-center pb-1 pt-2.5 md:hidden"
        aria-label={expanded ? "Collapse plot details" : "Expand plot details"}
        aria-expanded={expanded}
      >
        <span className="h-1.5 w-11 rounded-full bg-foreground/20" />
      </button>

      <div ref={scrollRef} className="overflow-y-auto overscroll-contain px-5 pb-6 pt-2 md:pt-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{plot.block} · Plot</p>
            <h2 id="plot-panel-title" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-5xl font-light leading-none outline-none">
              {plot.code}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {COMPASS_WORDS[plot.facing]}-facing
              {plot.isCorner ? " · corner plot" : ""}
              {plot.phase === 2 ? " · Phase 2" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: statusColor[plot.status] }}
            >
              {available ? <Icon name="check" size={13} strokeWidth={2.5} /> : null}
              {statusLabel[plot.status]}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground transition hover:bg-surface"
              aria-label="Close plot details"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>

        {!available ? (
          <p className="mt-4 rounded-xl border border-border bg-surface-muted/70 px-4 py-3 text-sm leading-relaxed">
            {plot.status === "unreleased"
              ? "Phase 2 is not on sale yet. Register interest and sales will contact you before release."
              : plot.status === "sold"
                ? "This plot has been sold. Similar available plots are listed below."
                : "This plot is currently held for another buyer. Ask sales to be told if it is released."}
          </p>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-[#dfe6cf] p-2 dark:bg-[#1d2a20]">
          <PlotFloorPlan plot={plot} estate={estate} type={type} showHouse={housesVisible} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2.5">
          <Fact label="Dimensions" value={`${plot.frontageFt}′ × ${plot.depthFt}′`} sub="frontage × depth" />
          <Fact
            label="Plot area"
            value={`${plot.areaSqFt.toLocaleString("en-GH")} sq ft`}
            sub={`${plot.areaSqm.toLocaleString("en-GH")} m² · ${standardPlots.toFixed(2)} std plots`}
          />
          <Fact label="Rate" value={`GH¢${plot.ratePerSqFtGhs.toFixed(2)}`} sub="per sq ft" />
          <Fact label="Price" value={formatGhs(plot.priceGhs)} sub="Indicative · excl. fees" emphasis />
        </dl>

        <div className="mt-2.5 rounded-xl border border-border/70 bg-surface/70 px-3.5 py-3">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">Road access</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {roads.map((r) => (
              <li key={r.roadId + r.side} className="flex justify-between gap-3">
                <span className="font-semibold">
                  {r.width} m · {r.name}
                </span>
                <span className="text-muted">{COMPASS_WORDS[r.facing]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {plot.onMainRoad ? <span className="chip-soft">On the 12 m boulevard</span> : null}
            {plot.isCorner ? <span className="chip-soft">Corner · two frontages</span> : null}
            {facesPark ? <span className="chip-soft">Faces the park side</span> : null}
            <span className="chip-soft">{plot.frontageFt === 70 ? "Standard 70 × 100 plot" : `${standardPlots.toFixed(2)} × standard plot`}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5">
          {available || plot.status === "unreleased" ? (
            <button type="button" className="btn-primary w-full" onClick={() => setEnquiring((v) => !v)} aria-expanded={enquiring}>
              {plot.status === "unreleased" ? "Register Phase 2 interest" : `Enquire about plot ${plot.code}`}
            </button>
          ) : null}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              className="btn-outline-gold gap-2"
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
            <button type="button" className="btn-outline-gold gap-2" onClick={() => standOnPlot(plot.code)}>
              <Icon name="walk" size={18} /> Stand here
            </button>
          </div>
          {enquiring ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <EnquiryForm projectSlug={estate.slug} plotCode={plot.code} intent="plot" compact />
            </div>
          ) : null}
        </div>

        <div className="mt-7 space-y-7">
          <Section title="Pay over time" aside={<span className="text-xs font-semibold text-available">Interest-free</span>}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <fieldset>
                <legend className="mb-1.5 font-bold uppercase tracking-[0.12em] text-muted">Deposit</legend>
                <div className="seg">
                  {LAND_PLAN_OPTIONS.deposits.map((d) => (
                    <button key={d} type="button" aria-pressed={deposit === d} onClick={() => setDeposit(d)}>
                      {d}%
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-1.5 font-bold uppercase tracking-[0.12em] text-muted">Months</legend>
                <div className="seg">
                  {LAND_PLAN_OPTIONS.months.map((m) => (
                    <button key={m} type="button" aria-pressed={months === m} onClick={() => setMonths(m)}>
                      {m}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <Fact label="Deposit today" value={formatGhs(plan.deposit)} />
              <Fact label={`Then ${plan.months} × monthly`} value={formatGhs(plan.monthly)} sub={plan.finalInstalment !== plan.monthly ? `Final ${formatGhs(plan.finalInstalment)}` : undefined} />
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              Indicative schedule. Confirm terms with sales before paying.{" "}
              <Link href="/payment-plans" className="font-semibold text-foreground underline underline-offset-4">
                Payment plans
              </Link>
            </p>
          </Section>

          <Section
            title="Suggested home"
            aside={<span className="text-xs text-muted">{builtUpSqFt(type).toLocaleString("en-GH")} sq ft built-up</span>}
          >
            <p className="text-sm">
              <strong>{type.name}</strong> · {type.beds} bed · {type.baths} bath, {type.frontSetbackM} m front setback
            </p>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">Room sizes for the suggested {type.name}</caption>
              <tbody>
                {type.rooms
                  .filter((r) => r.kind !== "circulation")
                  .map((r) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0">
                      <th scope="row" className="py-1.5 text-left font-medium">
                        {r.label}
                      </th>
                      <td className="py-1.5 text-right font-mono-data text-xs text-muted">
                        {feetInches(r.w)} × {feetInches(r.d)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              type="button"
              className="btn-outline-gold mt-3 w-full gap-2"
              onClick={() => setHousesVisible(!housesVisible)}
              aria-pressed={housesVisible}
            >
              <Icon name="house" size={18} />
              {housesVisible ? "Hide house on plot" : "Show house on plot"}
            </button>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              For visualising the plot only. Your architect designs the final house, and building
              permits come from the district assembly.
            </p>
          </Section>

          <Section title="Title & documents">
            <p className="text-sm">
              Land title:{" "}
              <strong>{plot.titleStatus === "registered" ? "Registered" : "Registration in process"}</strong>
            </p>
            <ul className="mt-3 space-y-2">
              {plot.documents.map((d) => (
                <li key={d.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <Icon name="doc" size={16} className="text-muted" />
                    {d.label}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", docTone[d.status].cls)}>
                    {docTone[d.status].label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              Placeholder statuses for this demo layout. Sales confirms every document, and you can
              run your own search at the Lands Commission before paying.
            </p>
          </Section>

          {similar.length ? (
            <Section title={available ? "Similar available plots" : "Available alternatives"}>
              <ul className="grid gap-2">
                {similar.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => selectPlot(p.code)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface/70 px-3.5 py-2.5 text-left text-sm transition hover:border-gold"
                    >
                      <span>
                        <strong className="font-display text-lg font-normal">Plot {p.code}</strong>
                        <span className="ml-2 text-muted">
                          {p.frontageFt}×{p.depthFt} · {COMPASS_WORDS[p.facing]}
                          {p.isCorner ? " · corner" : ""}
                        </span>
                      </span>
                      <span className="font-figure">{formatGhs(p.priceGhs)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-foreground">
            <Icon name="link" size={16} />
            <span aria-live="polite">{copied ? "Link copied" : "Copy link to this plot"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
