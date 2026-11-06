"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getPosition as getSunPosition } from "suncalc";
import {
  demoPlots,
  plotLegend,
  statusColor,
  statusLabel,
  type Plot,
  type PlotStatus,
} from "@/data/plots";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { cn } from "@/lib/cn";

const PlotScene = dynamic(() => import("./PlotScene").then((m) => m.PlotScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-forest-950 text-sm text-sand-200">
      Loading 3D view…
    </div>
  ),
});

type Mode = "plan" | "3d";
type Facing = "N" | "E" | "S" | "W";

const SIZE_OPTIONS = ["30×40", "40×40", "35×50", "40×50"] as const;

function sizeKey(p: Plot) {
  return `${p.widthFt}×${p.depthFt}`;
}

function formatPrice(n: number) {
  return `GH¢${n.toLocaleString("en-GH")}`;
}

export function PlotExplorer({ projectSlug }: { projectSlug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allPlots = useMemo(
    () => demoPlots.filter((p) => p.projectSlug === projectSlug),
    [projectSlug],
  );

  const [mode, setMode] = useState<Mode>("plan");
  const [query, setQuery] = useState("");
  const [facing, setFacing] = useState<Facing | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [cornerOnly, setCornerOnly] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(
    searchParams.get("plot"),
  );
  const [hour, setHour] = useState(10);
  const [sunPlaying, setSunPlaying] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("plot");
    if (fromUrl) setSelectedCode(fromUrl);
  }, [searchParams]);

  const selectPlot = useCallback(
    (code: string | null) => {
      setSelectedCode(code);
      const params = new URLSearchParams(searchParams.toString());
      if (code) params.set("plot", code);
      else params.delete("plot");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(() => {
    return allPlots.filter((p) => {
      if (query && !p.code.includes(query.trim())) return false;
      if (facing && p.facing !== facing) return false;
      if (size && sizeKey(p) !== size.replace("×", "×")) {
        const normalized = size.replace("x", "×").replace("X", "×");
        if (sizeKey(p) !== normalized) return false;
      }
      if (availableOnly && p.status !== "available") return false;
      if (cornerOnly && !p.isCorner) return false;
      return true;
    });
  }, [allPlots, availableOnly, cornerOnly, facing, query, size]);

  const selected = allPlots.find((p) => p.code === selectedCode) ?? null;
  const legend = plotLegend(allPlots);

  // Demo Accra-ish coordinates; replace with surveyed lat/long
  const sun = getSunPosition(
    new Date(new Date().setHours(hour, 0, 0, 0)),
    5.6037,
    -0.187,
  );
  const sunAltitudeDeg = (sun.altitude * 180) / Math.PI;
  const sunAzimuthDeg = ((sun.azimuth * 180) / Math.PI + 180) % 360;

  useEffect(() => {
    if (!sunPlaying) return;
    const id = window.setInterval(() => {
      setHour((h) => (h >= 18 ? 6 : h + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [sunPlaying]);

  const bounds = useMemo(() => {
    const pts = allPlots.flatMap((p) => p.polygon);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      minX: Math.min(...xs) - 4,
      maxX: Math.max(...xs) + 4,
      minY: Math.min(...ys) - 4,
      maxY: Math.max(...ys) + 4,
    };
  }, [allPlots]);

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${bounds.maxY - bounds.minY}`;

  return (
    <div className="flex min-h-[100svh] flex-col bg-forest-950 pt-20 text-sand-50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-3 px-3 pb-4 sm:px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Plot explorer</p>
            <h1 className="font-display text-2xl text-white sm:text-3xl">Demo Estate</h1>
          </div>
          <form
            className="flex min-w-[220px] flex-1 items-center gap-2 sm:max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              const match = allPlots.find((p) => p.code === query.trim());
              if (match) selectPlot(match.code);
            }}
          >
            <label className="sr-only" htmlFor="plot-search">
              Plot number
            </label>
            <input
              id="plot-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Go to plot no."
              className="h-11 w-full rounded-lg border border-white/15 bg-forest-900/80 px-3 text-sm text-white outline-none"
            />
            <button
              type="submit"
              className="h-11 rounded-lg bg-forest-600 px-4 text-sm font-semibold text-white"
            >
              Go
            </button>
          </form>
          <div className="flex flex-wrap gap-2" role="group" aria-label="View mode">
            {(
              [
                ["plan", "Plan"],
                ["3d", "3D"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "h-11 rounded-lg px-4 text-sm font-semibold",
                  mode === value ? "bg-brand-red text-white" : "bg-white/10 text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-3 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Find a plot</h2>
            <p className="mt-1 text-xs text-sand-200/70">
              {filtered.length} of {allPlots.length} plots
            </p>

            <fieldset className="mt-4">
              <legend className="text-xs uppercase tracking-[0.14em] text-sand-200/70">
                Facing
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["N", "E", "S", "W"] as Facing[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={facing === f}
                    onClick={() => setFacing((v) => (v === f ? null : f))}
                    className={cn(
                      "h-10 min-w-10 rounded-lg px-3 text-sm font-semibold",
                      facing === f ? "bg-gold text-forest-950" : "bg-white/10",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-4">
              <legend className="text-xs uppercase tracking-[0.14em] text-sand-200/70">
                Size (ft)
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize((v) => (v === s ? null : s))}
                    className={cn(
                      "h-10 rounded-lg px-3 text-sm font-semibold",
                      size === s ? "bg-gold text-forest-950" : "bg-white/10",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-4 space-y-2">
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                Available only
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cornerOnly}
                  onChange={(e) => setCornerOnly(e.target.checked)}
                />
                Corner plots
              </label>
            </div>

            <button
              type="button"
              className="mt-4 text-sm text-gold underline underline-offset-2"
              onClick={() => {
                setFacing(null);
                setSize(null);
                setAvailableOnly(false);
                setCornerOnly(false);
                setQuery("");
              }}
            >
              Clear all
            </button>

            <div className="mt-6 space-y-2 text-sm" aria-live="polite">
              {(Object.keys(legend) as Array<keyof typeof legend>).map((key) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: statusColor[key as PlotStatus] }}
                      aria-hidden
                    />
                    {statusLabel[key as PlotStatus]}
                  </span>
                  <span className="font-mono-data">{legend[key]}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-forest-900">
            {mode === "plan" ? (
              <svg
                viewBox={viewBox}
                className="h-full w-full"
                role="img"
                aria-label="Interactive site plan. Select a plot to view details."
              >
                <rect
                  x={bounds.minX}
                  y={bounds.minY}
                  width={bounds.maxX - bounds.minX}
                  height={bounds.maxY - bounds.minY}
                  fill="#15261d"
                />
                {allPlots.map((plot) => {
                  const active = filtered.some((f) => f.id === plot.id);
                  const points = plot.polygon.map((p) => p.join(",")).join(" ");
                  const cx =
                    plot.polygon.reduce((n, p) => n + p[0], 0) / plot.polygon.length;
                  const cy =
                    plot.polygon.reduce((n, p) => n + p[1], 0) / plot.polygon.length;
                  return (
                    <g key={plot.id}>
                      <polygon
                        points={points}
                        tabIndex={active ? 0 : -1}
                        role="button"
                        aria-label={`Plot ${plot.code}, ${statusLabel[plot.status]}, ${plot.widthFt} by ${plot.depthFt} feet`}
                        aria-pressed={selectedCode === plot.code}
                        fill={statusColor[plot.status]}
                        fillOpacity={active ? 0.85 : 0.18}
                        stroke={selectedCode === plot.code ? "#f7f4ef" : "#0f1c16"}
                        strokeWidth={selectedCode === plot.code ? 0.7 : 0.35}
                        className="cursor-pointer outline-none"
                        onClick={() => active && selectPlot(plot.code)}
                        onKeyDown={(e) => {
                          if (!active) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectPlot(plot.code);
                          }
                        }}
                      />
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="2.4"
                        fontFamily="IBM Plex Mono, monospace"
                        pointerEvents="none"
                        opacity={active ? 1 : 0.35}
                      >
                        {plot.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <PlotScene
                plots={filtered}
                allPlots={allPlots}
                selectedCode={selectedCode}
                onSelect={selectPlot}
                sunAltitude={sunAltitudeDeg}
                sunAzimuth={sunAzimuthDeg}
              />
            )}

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/80 px-3 py-2 text-xs text-sand-100">
              Tap a plot for details · keyboard supported in Plan mode
            </div>
          </section>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-sm font-semibold text-white">Sun path</h2>
              <p className="mt-1 text-xs text-sand-200/70">
                Indicative only. Based on Accra coordinates and today’s date until surveyed
                site north is provided.
              </p>
              <label className="mt-3 block text-xs text-sand-200/80">
                Time of day: {String(hour).padStart(2, "0")}:00
                <input
                  type="range"
                  min={6}
                  max={18}
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="mt-2 w-full"
                  aria-valuemin={6}
                  aria-valuemax={18}
                  aria-valuenow={hour}
                />
              </label>
              <p className="mt-2 font-mono-data text-xs text-sand-100">
                Alt {sunAltitudeDeg.toFixed(1)}° · Az {sunAzimuthDeg.toFixed(1)}°
              </p>
              <button
                type="button"
                className="mt-3 h-10 rounded-lg bg-white/10 px-3 text-sm font-semibold"
                onClick={() => setSunPlaying((v) => !v)}
              >
                {sunPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <div className="max-h-[280px] overflow-auto rounded-2xl border border-white/10 bg-white/5">
              <ul className="divide-y divide-white/10" aria-label="Plot list">
                {filtered.map((plot) => (
                  <li key={plot.id}>
                    <button
                      type="button"
                      onClick={() => selectPlot(plot.code)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm",
                        selectedCode === plot.code && "bg-white/10",
                      )}
                    >
                      <span>
                        Plot {plot.code}
                        <span className="mt-0.5 block text-xs text-sand-200/70">
                          {sizeKey(plot)} · {plot.facing}-facing
                        </span>
                      </span>
                      <span className="font-mono-data text-xs">
                        {statusLabel[plot.status]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {selected ? (
              <div className="rounded-2xl border border-white/10 bg-white p-4 text-ink">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">
                  Plot {selected.code}
                </p>
                <p className="mt-1 font-display text-2xl text-forest-900">
                  {formatPrice(selected.priceGhs)}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-stone-500">Size</dt>
                    <dd className="font-mono-data">{sizeKey(selected)} ft</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Area</dt>
                    <dd className="font-mono-data">{selected.areaSqm} m²</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Facing</dt>
                    <dd>{selected.facing}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Status</dt>
                    <dd>{statusLabel[selected.status]}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-sm text-stone-500">{selected.roadAccess}</p>
                {selected.status === "available" ? (
                  <div className="mt-4">
                    <EnquiryForm
                      compact
                      projectSlug={projectSlug}
                      plotCode={selected.code}
                      intent="plot"
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">
                    This plot is {statusLabel[selected.status].toLowerCase()}.{" "}
                    <Link href="/contact" className="underline">
                      Ask sales about alternatives
                    </Link>
                    .
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-sand-200/80">
                Select a plot on the plan or from the list to see pricing and enquire.
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
