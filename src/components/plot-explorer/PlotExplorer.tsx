"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  statusColor,
  statusLabel,
  estateNames,
  estateSlugs,
  type Plot,
  type PlotStatus,
} from "@/data/plots";
import { usePlotStore, type FilterStatus } from "@/store/usePlotStore";
import { usePlotFilter } from "@/hooks/usePlotFilter";
import { PlotDetailDrawer } from "./PlotDetailDrawer";
import { cn } from "@/lib/cn";

const PlotScene = dynamic(() => import("./PlotScene").then((m) => m.PlotScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[440px] items-center justify-center bg-[#080E14] text-sm text-[#DFC283]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#C5A059] border-t-transparent" />
        <span>Initializing 3D Spatial Canvas…</span>
      </div>
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
    facingFilter,
    setFacingFilter,
    cornerOnly,
    setCornerOnly,
    viewMode,
    setViewMode,
    isDrawerOpen,
    setDrawerOpen,
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    resetFilters,
  } = usePlotStore();

  useEffect(() => {
    if (targetSlug) {
      setActiveEstate(targetSlug);
    }
  }, [targetSlug, setActiveEstate]);

  const { estatePlots, filteredPlots, selectedPlot, counts } = usePlotFilter();

  // Bounding box for SVG canvas — extra top pad keeps boulevard label inside viewBox
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

  return (
    <section id="plot-explorer" className="relative bg-[#080E14] py-16 text-[#F4EFE6]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3D9B6E]" />
              Interactive Vector Engine
            </div>
            <h2 className="mt-3 font-display text-3xl font-light text-[#F4EFE6] sm:text-4xl lg:text-5xl">
              Live Masterplan Plot Explorer
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#F4EFE6]/70 sm:text-base">
              Inspect surveyed estate boundaries in real time. Select individual titled plots
              to verify dimensions, cardinal orientation, and 60-month interest-free schedules.
            </p>
          </div>

          {/* Estate Selector Dropdown / Pills */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="estate-select" className="text-xs uppercase tracking-wider text-[#F4EFE6]/60">
              Active Masterplan:
            </label>
            <select
              id="estate-select"
              value={activeEstate}
              onChange={(e) => setActiveEstate(e.target.value)}
              className="h-11 rounded-xl border border-white/15 bg-[#101822] px-4 text-sm font-semibold text-[#DFC283] outline-none transition hover:border-[#C5A059] focus:border-[#C5A059]"
            >
              {estateSlugs.map((slug) => (
                <option key={slug} value={slug} className="bg-[#101822] text-white">
                  {estateNames[slug] ?? slug}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-Time Filter Toolbar */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#101822]/80 p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-2 text-xs uppercase tracking-wider text-[#F4EFE6]/50">Status:</span>
              {(
                [
                  ["all", "All", counts.total],
                  ["available", "Available", counts.available],
                  ["reserved", "Reserved", counts.reserved],
                  ["sold", "Sold Out", counts.sold],
                ] as const
              ).map(([statusKey, label, count]) => {
                const isActive = statusFilter === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => setStatusFilter(statusKey as FilterStatus)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                      isActive
                        ? "bg-[#C5A059] text-[#080E14] shadow-[0_2px_12px_rgba(197,160,89,0.4)]"
                        : "bg-white/5 text-[#F4EFE6]/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[0.65rem] font-bold",
                        isActive ? "bg-[#080E14]/20 text-[#080E14]" : "bg-black/30 text-[#DFC283]",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle (2D Plan vs 3D) */}
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setViewMode("plan")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition",
                  viewMode === "plan"
                    ? "bg-[#C5A059] text-[#080E14]"
                    : "text-[#F4EFE6]/70 hover:text-white",
                )}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                2D Plan
              </button>
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition",
                  viewMode === "3d"
                    ? "bg-[#C5A059] text-[#080E14]"
                    : "text-[#F4EFE6]/70 hover:text-white",
                )}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                3D Terrain
              </button>
            </div>
          </div>

          {/* Secondary Controls: Size, Budget, Search */}
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/5 pt-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <label htmlFor="plot-query" className="block text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/60">
                Search Plot Code
              </label>
              <input
                id="plot-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 12 or BV-04"
                className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="min-w-0">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/60">
                Dimensions
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {SIZE_OPTIONS.map((sz) => {
                  const isCurrent = sz === "All" ? sizeFilter === null : sizeFilter === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSizeFilter(sz === "All" ? null : sz)}
                      className={cn(
                        "rounded px-2.5 py-1.5 text-[0.7rem] font-semibold transition",
                        isCurrent
                          ? "border border-[#C5A059] bg-[#C5A059]/25 text-[#DFC283]"
                          : "bg-white/5 text-[#F4EFE6]/70 hover:bg-white/10",
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex justify-between text-[0.7rem] uppercase tracking-wider text-[#F4EFE6]/60">
                <span>Max Budget</span>
                <span className="font-mono-data text-[#DFC283]">
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
                className="mt-2 w-full accent-[#C5A059]"
              />
            </div>

            <div className="flex items-end md:justify-start xl:justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 shrink-0 rounded-lg border border-white/10 px-3 text-xs font-semibold text-[#C5A059] transition hover:border-[#C5A059]/50 hover:bg-white/5 hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Masterplan Canvas Area */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A121A] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Zoom & View Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#080E14]/85 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={zoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={zoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom"
              aria-label="Reset Zoom"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[0.65rem] font-bold text-[#C5A059] hover:bg-white/10"
            >
              1:1
            </button>
          </div>

          {/* Compass Rose Overlay */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#080E14]/85 px-3 py-2 backdrop-blur-md">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#C5A059]/40 bg-black/40">
              <span className="text-[0.65rem] font-bold text-[#C5A059]">N</span>
              <div className="absolute -top-1 h-2 w-0.5 bg-[#C5A059]" />
            </div>
            <div className="text-[0.7rem] leading-tight text-[#F4EFE6]/70">
              <span className="font-semibold text-white">Cadastral Grid</span>
              <br />
              WGS84 Coordinates
            </div>
          </div>

          {/* Canvas Rendering */}
          <div className="flex min-h-[520px] w-full items-center justify-center overflow-hidden p-6 sm:p-8">
            {viewMode === "plan" ? (
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: "transform 0.25s ease-out",
                }}
                className="w-full max-w-[1100px]"
              >
                <svg
                  viewBox={viewBox}
                  className="h-auto w-full select-none overflow-visible"
                  role="img"
                  aria-label={`${estateNames[activeEstate] ?? "Afro-Arab"} estate site plan`}
                >
                  <defs>
                    <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Estate Site Boundary Ground */}
                  <rect
                    x={bounds.minX}
                    y={bounds.minY}
                    width={bounds.maxX - bounds.minX}
                    height={bounds.maxY - bounds.minY}
                    fill="#0F1722"
                    stroke="#1C2735"
                    strokeWidth="1"
                    rx="4"
                  />
                  <rect
                    x={bounds.minX}
                    y={bounds.minY}
                    width={bounds.maxX - bounds.minX}
                    height={bounds.maxY - bounds.minY}
                    fill="url(#grid-pattern)"
                  />

                  {/* Access Roads Labeling — kept short so it stays inside the viewBox */}
                  <text
                    x={(bounds.minX + bounds.maxX) / 2}
                    y={bounds.minY + 6}
                    textAnchor="middle"
                    fill="rgba(197, 160, 89, 0.55)"
                    fontSize="2.4"
                    fontFamily="var(--font-manrope), system-ui, sans-serif"
                    letterSpacing="0.8"
                  >
                    MAIN BOULEVARD · 12M
                  </text>

                  {/* Render Plots */}
                  {estatePlots.map((plot) => {
                    const isFiltered = filteredPlots.some((f) => f.id === plot.id);
                    const isSelected = selectedPlotCode === plot.code;
                    const points = plot.polygon.map((p) => p.join(",")).join(" ");
                    const cx = plot.polygon.reduce((n, p) => n + p[0], 0) / plot.polygon.length;
                    const cy = plot.polygon.reduce((n, p) => n + p[1], 0) / plot.polygon.length;
                    const fillColor = statusColor[plot.status];

                    return (
                      <g key={plot.id} className="transition-all duration-200">
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
                            "cursor-pointer outline-none transition-all duration-150",
                            isFiltered ? "hover:fill-opacity-90 hover:stroke-white" : "cursor-not-allowed",
                          )}
                          onClick={() => {
                            if (isFiltered) selectPlot(plot.code);
                          }}
                          onKeyDown={(e) => {
                            if (!isFiltered) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectPlot(plot.code);
                            }
                          }}
                        />

                        {/* Plot Number & Dimension Label */}
                        <text
                          x={cx}
                          y={cy - 1.2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? "#080E14" : "#FFFFFF"}
                          fontSize="2.4"
                          fontWeight={isSelected ? "bold" : "600"}
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
                          fill={isSelected ? "#080E14" : "rgba(255,255,255,0.7)"}
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

          {/* Bottom Interactive Legend Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#080E14]/90 px-6 py-3.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#F4EFE6]/70">
              <span className="font-semibold text-white">Status Key:</span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3D9B6E]" />
                Available ({counts.available})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D4A017]" />
                Reserved ({counts.reserved})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2A3340] ring-1 ring-white/20" />
                Sold Out ({counts.sold})
              </span>
            </div>

            <div className="text-xs text-[#DFC283]">
              Click any plot polygon to open 60-Month Payment Schedule
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {isDrawerOpen && (
        <PlotDetailDrawer
          plot={selectedPlot}
          estateName={estateNames[activeEstate] ?? "Afro-Arab Estate"}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </section>
  );
}
