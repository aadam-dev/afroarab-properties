"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatGhs,
  plotLegend,
  sizeKey,
  statusColor,
  statusLabel,
  type Compass8,
  type Estate,
  type Plot,
  type PlotStatus,
} from "@/data/masterplan";
import { cn } from "@/lib/cn";
import { usePlotStore, type ExplorerMode } from "@/store/usePlotStore";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SitePlan2D } from "./SitePlan2D";
import { COMPASS_WORDS, formatHour, headingBus, sunState, sunTimes, walkInput } from "./world/core";

/* ------------------------------------------------------------------ */
/* Toolbar                                                              */
/* ------------------------------------------------------------------ */

function ToolButton({
  icon,
  label,
  pressed,
  onClick,
  badge,
  controls,
}: {
  icon: IconName;
  label: string;
  pressed?: boolean;
  onClick: () => void;
  badge?: number;
  controls?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-controls={controls}
      className={cn(
        "relative flex min-h-12 min-w-[2.6rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[0.66rem] font-semibold leading-none transition-colors duration-150 sm:min-w-12 sm:px-2",
        pressed
          ? "bg-forest-800 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] dark:bg-gold dark:text-ink"
          : "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground",
      )}
    >
      <Icon name={icon} size={19} />
      <span>{label}</span>
      {badge ? (
        <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[0.6rem] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function Toolbar() {
  const mode = usePlotStore((s) => s.mode);
  const setMode = usePlotStore((s) => s.setMode);
  const popover = usePlotStore((s) => s.popover);
  const togglePopover = usePlotStore((s) => s.togglePopover);
  const colourMode = usePlotStore((s) => s.colourMode);
  const setColourMode = usePlotStore((s) => s.setColourMode);
  const filters = usePlotStore((s) => s.filters);
  const activeCount =
    filters.facings.length +
    filters.sizes.length +
    Number(filters.availableOnly) +
    Number(filters.cornerOnly) +
    Number(filters.mainRoadOnly);

  const modes: Array<{ id: ExplorerMode; icon: IconName; label: string }> = [
    { id: "walk", icon: "walk", label: "Walk" },
    { id: "orbit", icon: "cube", label: "3D" },
    { id: "plan", icon: "plan", label: "Plan" },
  ];

  return (
    <nav aria-label="Explorer tools" className="glass-panel pointer-events-auto flex max-w-full items-center gap-0 overflow-x-auto rounded-2xl p-1 sm:gap-0.5">
      <ToolButton icon="filter" label="Filters" pressed={popover === "filters"} onClick={() => togglePopover("filters")} badge={activeCount} controls="explorer-popover" />
      <ToolButton icon="sun" label="Sun" pressed={popover === "sun"} onClick={() => togglePopover("sun")} controls="explorer-popover" />
      <ToolButton
        icon={colourMode === "status" ? "swatch" : "leaf"}
        label={colourMode === "status" ? "Status" : "Natural"}
        onClick={() => setColourMode(colourMode === "status" ? "natural" : "status")}
      />
      <ToolButton icon="list" label="List" pressed={popover === "list"} onClick={() => togglePopover("list")} controls="explorer-popover" />
      <span className="mx-0.5 h-8 w-px bg-border" aria-hidden />
      {modes.map((m) => (
        <ToolButton key={m.id} icon={m.icon} label={m.label} pressed={mode === m.id} onClick={() => setMode(m.id)} />
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Search                                                               */
/* ------------------------------------------------------------------ */

export function PlotSearch({ plots }: { plots: Plot[] }) {
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      className="glass-panel pointer-events-auto relative flex h-12 items-center gap-1 rounded-2xl pl-3 pr-1"
      onSubmit={(e) => {
        e.preventDefault();
        const code = value.trim().replace(/^plot\s*/i, "");
        if (!code) return;
        const hit = plots.find((p) => p.code === code);
        if (!hit) {
          setError(`No plot ${code}. Plots run 1–${plots.length}.`);
          return;
        }
        setError("");
        selectPlot(hit.code);
        inputRef.current?.blur();
      }}
    >
      <Icon name="search" size={18} className="shrink-0 text-muted" />
      <label htmlFor="plot-search" className="sr-only">
        Go to plot number
      </label>
      <input
        id="plot-search"
        ref={inputRef}
        inputMode="numeric"
        autoComplete="off"
        placeholder="Go to plot no."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError("");
        }}
        className="h-full w-full min-w-0 bg-transparent px-1.5 text-sm font-medium text-foreground placeholder:text-muted focus:outline-none"
        aria-describedby={error ? "plot-search-error" : undefined}
      />
      <button type="submit" className="h-10 shrink-0 rounded-xl bg-forest-800 px-4 text-sm font-semibold text-white transition hover:bg-forest-700 dark:bg-gold dark:text-ink">
        Go
      </button>
      {error ? (
        <p id="plot-search-error" role="alert" className="glass-panel absolute left-0 top-full mt-2 rounded-xl px-3 py-2 text-xs font-medium">
          {error}
        </p>
      ) : null}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Popovers                                                             */
/* ------------------------------------------------------------------ */

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-3.5 text-sm font-semibold transition-colors duration-150",
        pressed
          ? "border-forest-800 bg-forest-800 text-white dark:border-gold dark:bg-gold dark:text-ink"
          : "border-border bg-surface/70 text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

function PopoverShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      id="explorer-popover"
      role="dialog"
      aria-label={title}
      className="glass-panel pointer-events-auto w-[min(92vw,360px)] rounded-2xl p-5 motion-safe:animate-[aa-pop_180ms_var(--ease-out-soft)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-normal">{title}</h2>
        <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-foreground/[0.06] hover:text-foreground" aria-label={`Close ${title.toLowerCase()}`}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function FiltersPopover({ plots, matchCount }: { plots: Plot[]; matchCount: number }) {
  const filters = usePlotStore((s) => s.filters);
  const setFilters = usePlotStore((s) => s.setFilters);
  const resetFilters = usePlotStore((s) => s.resetFilters);
  const close = usePlotStore((s) => s.closePopover);
  const sizes = useMemo(
    () => [...new Set(plots.map(sizeKey))].sort((a, b) => parseInt(a) - parseInt(b)),
    [plots],
  );
  const facings: Compass8[] = ["N", "E", "S", "W"];

  return (
    <PopoverShell title="Find a plot" onClose={close}>
      <fieldset>
        <legend className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">Has a road frontage facing</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {facings.map((f) => (
            <Chip key={f} pressed={filters.facings.includes(f)} onClick={() => setFilters({ facings: toggle(filters.facings, f) })}>
              {COMPASS_WORDS[f]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">Size (ft)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <Chip key={s} pressed={filters.sizes.includes(s)} onClick={() => setFilters({ sizes: toggle(filters.sizes, s) })}>
              {s.replace("×", " × ")}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">Show only</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip pressed={filters.availableOnly} onClick={() => setFilters({ availableOnly: !filters.availableOnly })}>
            Available
          </Chip>
          <Chip pressed={filters.cornerOnly} onClick={() => setFilters({ cornerOnly: !filters.cornerOnly })}>
            Corner plots
          </Chip>
          <Chip pressed={filters.mainRoadOnly} onClick={() => setFilters({ mainRoadOnly: !filters.mainRoadOnly })}>
            On the boulevard
          </Chip>
        </div>
      </fieldset>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <p aria-live="polite">
          <strong className="font-figure text-lg">{matchCount}</strong> of {plots.length} plots match
        </p>
        <button type="button" onClick={resetFilters} className="font-semibold text-brand-red underline-offset-4 hover:underline">
          Clear all
        </button>
      </div>
    </PopoverShell>
  );
}

export function SunPopover({ estate }: { estate: Estate }) {
  const hour = usePlotStore((s) => s.sunHour);
  const setHour = usePlotStore((s) => s.setSunHour);
  const playing = usePlotStore((s) => s.sunPlaying);
  const setPlaying = usePlotStore((s) => s.setSunPlaying);
  const close = usePlotStore((s) => s.closePopover);
  const sun = sunState(hour, estate.lat, estate.lng, estate.trueNorthDeg);
  const times = useMemo(() => sunTimes(estate.lat, estate.lng), [estate]);
  const up = sun.altitudeDeg > 0;

  return (
    <PopoverShell title="Sun path" onClose={close}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            if (!playing && hour >= 18.4) setHour(6);
            setPlaying(!playing);
          }}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-ink shadow-soft transition hover:brightness-105"
          aria-label={playing ? "Pause sun animation" : "Play the day"}
        >
          <Icon name={playing ? "pause" : "play"} size={20} />
        </button>
        <div>
          <p className="font-figure text-3xl leading-none">{formatHour(hour)}</p>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {up
              ? `Sun in the ${sun.compass} · ${Math.round(sun.altitudeDeg)}° above horizon`
              : "Sun below the horizon"}
          </p>
        </div>
      </div>
      <label htmlFor="sun-hour" className="sr-only">
        Time of day
      </label>
      <input
        id="sun-hour"
        type="range"
        min={6}
        max={18.5}
        step={0.25}
        value={hour}
        onChange={(e) => {
          setPlaying(false);
          setHour(Number(e.target.value));
        }}
        className="range-gold mt-5 w-full"
        aria-valuetext={formatHour(hour)}
      />
      <div className="mt-1.5 flex justify-between text-[0.7rem] font-semibold text-muted">
        <span>Sunrise {formatHour(times.sunrise)} · E</span>
        <span>Noon</span>
        <span>Sunset {formatHour(times.sunset)} · W</span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Today&apos;s sun over Greater Accra, near the equator, so the sun climbs almost overhead at
        noon. Shows where shade falls through the day. Indicative: approximate coordinates.
      </p>
    </PopoverShell>
  );
}

export function ListPopover({ plots, matches }: { plots: Plot[]; matches: Plot[] }) {
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const close = usePlotStore((s) => s.closePopover);
  return (
    <PopoverShell title={`Plots (${matches.length})`} onClose={close}>
      <div className="-mx-2 max-h-[min(56svh,460px)] overflow-y-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Plots matching the current filters</caption>
          <thead className="sticky top-0 bg-surface/95 text-[0.66rem] uppercase tracking-[0.12em] text-muted backdrop-blur">
            <tr>
              <th scope="col" className="px-2 py-2 text-left">Plot</th>
              <th scope="col" className="px-2 py-2 text-left">Size</th>
              <th scope="col" className="px-2 py-2 text-left">Status</th>
              <th scope="col" className="px-2 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-2 py-1.5">
                  <button type="button" onClick={() => selectPlot(p.code)} className="font-display text-base underline-offset-4 hover:underline">
                    {p.code}
                    {p.isCorner ? <span className="sr-only"> (corner)</span> : null}
                  </button>
                </td>
                <td className="px-2 py-1.5 text-muted">{p.frontageFt}×{p.depthFt}</td>
                <td className="px-2 py-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[p.status] }} aria-hidden />
                    {statusLabel[p.status]}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right font-figure">{formatGhs(p.priceGhs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {matches.length === 0 ? <p className="px-2 py-6 text-center text-sm text-muted">No plots match. Clear a filter to see more.</p> : null}
      </div>
      <p className="mt-3 text-xs text-muted">{plots.length} plots in this layout.</p>
    </PopoverShell>
  );
}

/* ------------------------------------------------------------------ */
/* Compass & legend                                                     */
/* ------------------------------------------------------------------ */

export function Compass({ onReset }: { onReset: () => void }) {
  const roseRef = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      headingBus.subscribe((heading) => {
        if (roseRef.current) roseRef.current.style.transform = `rotate(${(-heading).toFixed(1)}deg)`;
      }),
    [],
  );
  return (
    <button
      type="button"
      onClick={onReset}
      className="glass-panel pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full"
      aria-label="Compass. Reset view"
      title="Reset view"
    >
      <div ref={roseRef} className="absolute inset-1.5 will-change-transform">
        <svg viewBox="-30 -30 60 60" className="h-full w-full" aria-hidden>
          <path d="M0 -21 L5 0 L0 -3 L-5 0 Z" fill="#c4161c" />
          <path d="M0 21 L5 0 L0 3 L-5 0 Z" className="fill-foreground/35" />
          <text y={-23} textAnchor="middle" fontSize={7.5} fontWeight={800} className="fill-foreground">N</text>
          <text x={25} y={2.6} textAnchor="middle" fontSize={6.5} fontWeight={700} className="fill-muted">E</text>
          <text y={28.5} textAnchor="middle" fontSize={6.5} fontWeight={700} className="fill-muted">S</text>
          <text x={-25} y={2.6} textAnchor="middle" fontSize={6.5} fontWeight={700} className="fill-muted">W</text>
        </svg>
      </div>
    </button>
  );
}

const legendOrder: PlotStatus[] = ["available", "reserved", "held", "sold", "unreleased"];

export function Legend({ plots }: { plots: Plot[] }) {
  const counts = plotLegend(plots);
  const colourMode = usePlotStore((s) => s.colourMode);
  return (
    <div className="glass-panel pointer-events-auto rounded-2xl px-3.5 py-3 text-sm">
      {colourMode === "natural" ? (
        <p className="max-w-[11rem] text-xs leading-relaxed text-muted">
          Natural view. Switch to <strong className="text-foreground">Status</strong> to colour plots by availability.
        </p>
      ) : (
        <ul className="grid gap-1" aria-label="Plot availability">
          {legendOrder
            .filter((s) => counts[s] > 0)
            .map((s) => (
              <li key={s} className="flex items-center justify-between gap-5">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[4px]" style={{ background: statusColor[s] }} aria-hidden />
                  {statusLabel[s]}
                </span>
                <span className="font-figure text-base">{counts[s]}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Walk HUD                                                             */
/* ------------------------------------------------------------------ */

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<[number, number]>([0, 0]);
  const active = useRef<number | null>(null);

  function update(clientX: number, clientY: number) {
    const el = baseRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const max = r.width / 2 - 18;
    let dx = clientX - (r.left + r.width / 2);
    let dy = clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob([dx, dy]);
    walkInput.x = dx / max;
    walkInput.y = -dy / max;
    walkInput.target = null;
  }
  function release() {
    active.current = null;
    setKnob([0, 0]);
    walkInput.x = 0;
    walkInput.y = 0;
  }
  useEffect(() => release, []);

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Walk joystick. Drag to move."
      className="glass-panel pointer-events-auto relative h-32 w-32 touch-none select-none rounded-full"
      onPointerDown={(e) => {
        active.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (active.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {(["chevronUp", "chevronDown"] as const).map((n, i) => (
        <Icon key={n} name={n} size={16} className={cn("absolute left-1/2 -translate-x-1/2 text-muted", i === 0 ? "top-2" : "bottom-2")} />
      ))}
      <span
        className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full bg-forest-800 shadow-lux ring-4 ring-white/40 dark:bg-gold"
        style={{ transform: `translate(calc(-50% + ${knob[0]}px), calc(-50% + ${knob[1]}px))` }}
      />
    </div>
  );
}

export function WalkHud({ estate }: { estate: Estate }) {
  const code = usePlotStore((s) => s.walkPlotCode);
  const setMode = usePlotStore((s) => s.setMode);
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const plot = code ? estate.plots.find((p) => p.code === code) : null;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-[5.25rem] z-20 flex justify-center px-3 max-md:top-[7.25rem]">
        <div className="glass-panel pointer-events-auto flex items-center gap-4 rounded-2xl py-2 pl-4 pr-2" role="status">
          <div>
            <p className="font-display text-lg leading-tight">{plot ? `You're on plot ${plot.code}` : "Exploring on foot"}</p>
            <p className="text-xs text-muted">
              {plot
                ? `${plot.frontageFt} × ${plot.depthFt} ft · ${statusLabel[plot.status]} · ${formatGhs(plot.priceGhs)}`
                : "Walk the roads and step onto any plot"}
            </p>
          </div>
          {plot ? (
            <button type="button" className="btn-gold h-10 min-h-0 px-3 text-xs" onClick={() => selectPlot(plot.code)}>
              Details
            </button>
          ) : null}
          <button type="button" className="btn-primary h-10 min-h-0 gap-1.5 px-3 text-xs" onClick={() => setMode("orbit")}>
            <Icon name="close" size={14} /> Exit walk
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-3 z-20 flex flex-col items-start gap-3 sm:left-4">
        <div className="glass-panel pointer-events-auto w-40 overflow-hidden rounded-2xl p-1.5 sm:w-48">
          <div className="flex items-center justify-between px-1.5 pb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted">
            <span>Map · tap to jump</span>
            <span>N ↑</span>
          </div>
          <SitePlan2D
            estate={estate}
            compact
            showWalker
            className="block h-auto w-full rounded-xl"
            title="Minimap. Tap to jump there."
            onGround={(x, y) => {
              walkInput.teleport = [x, y];
            }}
            onSelect={(c) => {
              const p = estate.plots.find((pl) => pl.code === c);
              if (p) walkInput.teleport = [p.centroid[0], p.centroid[1]];
            }}
          />
        </div>
        <Joystick />
      </div>
    </>
  );
}

export function HintBar({ mode }: { mode: ExplorerMode }) {
  const text =
    mode === "walk"
      ? "W A S D or arrow keys to walk · Shift to run · drag to look · click the ground to walk there"
      : mode === "plan"
        ? "Tap a plot for details · drag to pan · scroll or pinch to zoom"
        : "Tap any plot for details · drag to rotate · right-drag to pan · scroll or pinch to zoom";
  return (
    <p className="glass-panel pointer-events-none max-w-[min(92vw,640px)] rounded-full px-4 py-2 text-center text-xs font-medium text-foreground/80">
      {text}
    </p>
  );
}
