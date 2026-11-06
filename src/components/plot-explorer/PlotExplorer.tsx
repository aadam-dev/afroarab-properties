"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  statusColor,
  statusLabel,
  estateNames,
  estateSlugs,
} from "@/data/plots";
import { usePlotStore, type FilterStatus } from "@/store/usePlotStore";
import { usePlotFilter } from "@/hooks/usePlotFilter";
import { PlotDetailDrawer } from "./PlotDetailDrawer";
import { cn } from "@/lib/cn";

const PlotScene = dynamic(() => import("./PlotScene").then((m) => m.PlotScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[440px] items-center justify-center bg-surface-muted text-sm text-muted">
      Loading 3D view…
    </div>
  ),
});

const SIZE_OPTIONS = ["All", "30×40", "40×40", "35×50", "40×50"] as const;

export function PlotExplorer({
  initialProjectSlug,
  projectSlug,
}: {
  initialProjectSlug?: string;
  projectSlug?: string;
}) {
  const targetSlug = initialProjectSlug || projectSlug;
  const {
    activeEstate,
    setActiveEstate,
    selectedPlotCode,
    selectPlot,
    statusFilter,
    setStatusFilter,
    sizeFilter,
    setSizeFilter,
    budgetMax,
    setBudgetMax,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isDrawerOpen,
    setDrawerOpen,
    zoomLevel,
    panX,
    panY,
    setPan,
    setZoomLevel,
    zoomIn,
    zoomOut,
    resetView,
    resetFilters,
  } = usePlotStore();

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
  } | null>(null);

  useEffect(() => {
    if (targetSlug) setActiveEstate(targetSlug);
  }, [targetSlug, setActiveEstate]);

  const { estatePlots, filteredPlots, selectedPlot, counts } = usePlotFilter();

  const bounds = useMemo(() => {
    if (estatePlots.length === 0) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    }
    const pts = estatePlots.flatMap((p) => p.polygon);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      minX: Math.min(...xs) - 10,
      maxX: Math.max(...xs) + 10,
      minY: Math.min(...ys) - 14,
      maxY: Math.max(...ys) + 10,
    };
  }, [estatePlots]);

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${bounds.maxY - bounds.minY}`;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (viewMode !== "plan") return;
      if ((e.target as HTMLElement).closest('[role="button"]')) return;
      dragRef.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        originPanX: panX,
        originPanY: panY,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [panX, panY, viewMode],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.active) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
      setPan(drag.originPanX + dx, drag.originPanY + dy);
    },
    [setPan],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (viewMode !== "plan") return;
      e.preventDefault();
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const nextZoom = Math.max(0.6, Math.min(3, zoomLevel * factor));
      const scale = nextZoom / zoomLevel;
      setZoomLevel(nextZoom);
      setPan(mx - (mx - panX) * scale, my - (my - panY) * scale);
    },
    [viewMode, zoomLevel, panX, panY, setZoomLevel, setPan],
  );

  const selectPlotCentered = useCallback(
    (code: string) => {
      const plot = estatePlots.find((p) => p.code === code);
      selectPlot(code);
      if (!plot) return;
      const cx = plot.polygon.reduce((n, p) => n + p[0], 0) / plot.polygon.length;
      const cy = plot.polygon.reduce((n, p) => n + p[1], 0) / plot.polygon.length;
      const midX = (bounds.minX + bounds.maxX) / 2;
      const midY = (bounds.minY + bounds.maxY) / 2;
      const el = viewportRef.current;
      if (!el) return;
      const scaleX = el.clientWidth / (bounds.maxX - bounds.minX);
      const scaleY = el.clientHeight / (bounds.maxY - bounds.minY);
      const base = Math.min(scaleX, scaleY);
      setPan((midX - cx) * base * zoomLevel, (midY - cy) * base * zoomLevel);
    },
    [estatePlots, selectPlot, bounds, zoomLevel, setPan],
  );

  return (
    <section id="plot-explorer" className="relative bg-background py-16 text-foreground lg:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Plot explorer</p>
            <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl lg:text-5xl">
              Live masterplan
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              Drag to pan, scroll to zoom, and select a plot for dimensions and payment context.
              Demo inventory — confirm availability with sales.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="estate-select" className="text-xs uppercase tracking-wider text-muted">
              Estate
            </label>
            <select
              id="estate-select"
              value={activeEstate}
              onChange={(e) => setActiveEstate(e.target.value)}
              className="h-11 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-foreground outline-none focus:border-gold"
            >
              {estateSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {estateNames[slug] ?? slug}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ["all", "All", counts.total],
                  ["available", "Available", counts.available],
                  ["reserved", "Reserved", counts.reserved],
                  ["sold", "Sold", counts.sold],
                ] as const
              ).map(([statusKey, label, count]) => {
                const isActive = statusFilter === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => setStatusFilter(statusKey as FilterStatus)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                      isActive
                        ? "bg-forest-900 text-white dark:bg-gold dark:text-ink"
                        : "bg-surface-muted text-muted hover:text-foreground",
                    )}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
            <div className="flex items-center rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => setViewMode("plan")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold",
                  viewMode === "plan" ? "bg-forest-900 text-white dark:bg-gold dark:text-ink" : "text-muted",
                )}
              >
                2D plan
              </button>
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold",
                  viewMode === "3d" ? "bg-forest-900 text-white dark:bg-gold dark:text-ink" : "text-muted",
                )}
              >
                3D
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 md:grid-cols-2 xl:grid-cols-[1fr_1.3fr_1fr_auto]">
            <div>
              <label htmlFor="plot-query" className="block text-[0.7rem] uppercase tracking-wider text-muted">
                Search plot
              </label>
              <input
                id="plot-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. BV-04"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-gold"
              />
            </div>
            <div>
              <span className="block text-[0.7rem] uppercase tracking-wider text-muted">Dimensions</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {SIZE_OPTIONS.map((sz) => {
                  const isCurrent = sz === "All" ? sizeFilter === null : sizeFilter === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSizeFilter(sz === "All" ? null : sz)}
                      className={cn(
                        "rounded px-2.5 py-1.5 text-[0.7rem] font-semibold",
                        isCurrent
                          ? "border border-gold bg-gold/15 text-foreground"
                          : "bg-surface-muted text-muted",
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[0.7rem] uppercase tracking-wider text-muted">
                <span>Max budget</span>
                <span className="font-mono-data text-foreground">
                  GH¢{budgetMax.toLocaleString("en-GH")}
                </span>
              </div>
              <input
                type="range"
                min={70000}
                max={200000}
                step={5000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--aa-gold-500)]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 text-xs font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden border border-border bg-surface-muted">
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 border border-border bg-surface p-1.5">
            <button type="button" onClick={zoomIn} aria-label="Zoom in" className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-surface-muted">+</button>
            <button type="button" onClick={zoomOut} aria-label="Zoom out" className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-surface-muted">−</button>
            <button type="button" onClick={resetView} aria-label="Reset view" className="flex h-8 w-8 items-center justify-center text-xs font-bold text-gold hover:bg-surface-muted">Fit</button>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 z-20 border border-border bg-surface/95 px-3 py-2 text-[0.7rem] text-muted backdrop-blur-sm">
            Drag to pan · Scroll to zoom
          </div>

          <div
            ref={viewportRef}
            className={cn(
              "relative flex min-h-[520px] w-full items-center justify-center overflow-hidden p-6",
              viewMode === "plan" && "cursor-grab active:cursor-grabbing touch-none",
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {viewMode === "plan" ? (
              <div
                style={{
                  transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
                className="w-full max-w-[1100px] will-change-transform"
              >
                <svg
                  viewBox={viewBox}
                  className="h-auto w-full select-none"
                  role="img"
                  aria-label={`${estateNames[activeEstate] ?? "Afro Arab"} estate site plan`}
                >
                  <defs>
                    <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect
                    x={bounds.minX}
                    y={bounds.minY}
                    width={bounds.maxX - bounds.minX}
                    height={bounds.maxY - bounds.minY}
                    className="fill-[var(--surface)] dark:fill-[#0F1722]"
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                    rx="2"
                  />
                  <rect
                    x={bounds.minX}
                    y={bounds.minY}
                    width={bounds.maxX - bounds.minX}
                    height={bounds.maxY - bounds.minY}
                    fill="url(#grid-pattern)"
                  />
                  <text
                    x={(bounds.minX + bounds.maxX) / 2}
                    y={bounds.minY + 6}
                    textAnchor="middle"
                    fill="var(--aa-gold-500)"
                    fillOpacity="0.7"
                    fontSize="2.4"
                    fontFamily="var(--font-manrope), system-ui, sans-serif"
                    letterSpacing="0.8"
                  >
                    MAIN BOULEVARD · 12M
                  </text>
                  {estatePlots.map((plot) => {
                    const isFiltered = filteredPlots.some((f) => f.id === plot.id);
                    const isSelected = selectedPlotCode === plot.code;
                    const points = plot.polygon.map((p) => p.join(",")).join(" ");
                    const cx = plot.polygon.reduce((n, p) => n + p[0], 0) / plot.polygon.length;
                    const cy = plot.polygon.reduce((n, p) => n + p[1], 0) / plot.polygon.length;
                    const fillColor = statusColor[plot.status];

                    return (
                      <g key={plot.id}>
                        <polygon
                          points={points}
                          tabIndex={isFiltered ? 0 : -1}
                          role="button"
                          aria-label={`Plot ${plot.code}, ${statusLabel[plot.status]}, ${plot.widthFt} by ${plot.depthFt} feet`}
                          aria-pressed={isSelected}
                          fill={fillColor}
                          fillOpacity={isFiltered ? (isSelected ? 0.95 : 0.65) : 0.12}
                          stroke={isSelected ? "#FFFFFF" : isFiltered ? fillColor : "#1F2937"}
                          strokeWidth={isSelected ? 1.2 : 0.6}
                          className={cn(
                            "outline-none",
                            isFiltered ? "cursor-pointer" : "cursor-not-allowed",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dragRef.current?.moved) return;
                            if (isFiltered) selectPlotCentered(plot.code);
                          }}
                          onKeyDown={(e) => {
                            if (!isFiltered) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectPlotCentered(plot.code);
                            }
                          }}
                        />
                        <text
                          x={cx}
                          y={cy - 1.2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? "#080E14" : "#FFFFFF"}
                          fontSize="2.4"
                          fontWeight="600"
                          fontFamily="var(--font-plex), ui-monospace, monospace"
                          pointerEvents="none"
                          opacity={isFiltered ? 1 : 0.3}
                        >
                          {plot.code}
                        </text>
                        <text
                          x={cx}
                          y={cy + 2.2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? "#080E14" : "rgba(255,255,255,0.75)"}
                          fontSize="1.6"
                          fontFamily="var(--font-manrope), system-ui, sans-serif"
                          pointerEvents="none"
                          opacity={isFiltered ? 1 : 0.25}
                        >
                          {plot.widthFt}×{plot.depthFt}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="h-[520px] w-full">
                <PlotScene
                  plots={filteredPlots}
                  allPlots={estatePlots}
                  selectedCode={selectedPlotCode}
                  onSelect={selectPlot}
                  sunAltitude={35}
                  sunAzimuth={140}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-surface px-6 py-3.5 text-xs text-muted">
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-available" />
                Available ({counts.available})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-reserved" />
                Reserved ({counts.reserved})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sold ring-1 ring-border" />
                Sold ({counts.sold})
              </span>
            </div>
            <span>Select a plot for schedule details</span>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <PlotDetailDrawer
          plot={selectedPlot}
          estateName={estateNames[activeEstate] ?? "Afro Arab Estate"}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </section>
  );
}
