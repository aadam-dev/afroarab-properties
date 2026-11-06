"use client";

import { useMemo, useState } from "react";
import {
  useFloorPlanStore,
  ROOM_HOTSPOTS,
  type FloorLevel,
  type RoomHotspot,
} from "@/store/useFloorPlanStore";
import { PanoramaViewer } from "./PanoramaViewer";
import { cn } from "@/lib/cn";

export function FloorPlanWalker({ projectName = "Lamin's Court Townhouse" }: { projectName?: string }) {
  const {
    activeLevel,
    setLevel,
    activeRoomId,
    inspectRoom,
    closeInspection,
    isInspectionModalOpen,
    activeFinish,
    setFinish,
    activeLighting,
    setLighting,
  } = useFloorPlanStore();

  const levelRooms = useMemo(() => {
    return ROOM_HOTSPOTS.filter((r) => r.level === activeLevel);
  }, [activeLevel]);

  const currentRoom = useMemo(() => {
    return (
      ROOM_HOTSPOTS.find((r) => r.id === activeRoomId) ??
      levelRooms[0] ??
      ROOM_HOTSPOTS[0]
    );
  }, [activeRoomId, levelRooms]);

  return (
    <section id="floor-plan" className="relative bg-[#080E14] py-20 text-[#F4EFE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E676]" />
              Spatial Floor Plan Engine
            </div>
            <h2 className="mt-3 font-display text-3xl font-light text-[#F4EFE6] sm:text-4xl lg:text-5xl">
              Spatial Walkthrough & Blueprint Engine
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#F4EFE6]/70 sm:text-base">
              Navigate architectural levels, click pulsing spatial nodes to inspect
              interiors, and launch our WebGL 360° panorama inspector with custom finish swatches.
            </p>
          </div>

          {/* Level Switcher Tabs */}
          <div className="flex items-center rounded-xl border border-white/10 bg-[#101822] p-1 backdrop-blur-md">
            {(
              [
                ["ground", "Ground Floor"],
                ["upper", "First Floor"],
                ["terrace", "Roof Terrace"],
              ] as const
            ).map(([lvl, label]) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl as FloorLevel)}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                  activeLevel === lvl
                    ? "bg-[#C5A059] text-[#080E14] shadow-md"
                    : "text-[#F4EFE6]/70 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Layout Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          {/* Blueprint SVG Canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1722] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="mb-4 flex items-center justify-between text-xs text-[#DFC283]">
              <span className="font-semibold uppercase tracking-wider">
                {projectName} &bull; {activeLevel.toUpperCase()} LEVEL
              </span>
              <span>Click any pulsing node to inspect 360°</span>
            </div>

            {/* Blueprint SVG Vector Floor Plan */}
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[680px]">
              <svg
                viewBox="0 0 600 450"
                className="h-full w-full select-none"
                role="img"
                aria-label={`${projectName} ${activeLevel} blueprint`}
              >
                <defs>
                  <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Grid Foundation */}
                <rect width="600" height="450" fill="#0C141D" rx="8" />
                <rect width="600" height="450" fill="url(#blueprint-grid)" />

                {/* Outer Wall Boundary */}
                <rect
                  x="40"
                  y="40"
                  width="520"
                  height="370"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="3.5"
                  strokeOpacity="0.8"
                />

                {/* Interior Partition Layouts based on active level */}
                {activeLevel === "ground" && (
                  <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none">
                    {/* Living & Dining Zone */}
                    <rect x="40" y="40" width="320" height="370" fill="rgba(197, 160, 89, 0.05)" />
                    <text x="200" y="240" fill="#DFC283" fontSize="14" fontFamily="Plus Jakarta Sans" textAnchor="middle" opacity="0.6">
                      LIVING & DINING SALON (26&apos;4&quot; × 18&apos;2&quot;)
                    </text>

                    {/* Kitchen Zone */}
                    <rect x="360" y="40" width="200" height="220" fill="rgba(255, 255, 255, 0.02)" />
                    <text x="460" y="150" fill="#DFC283" fontSize="13" fontFamily="Plus Jakarta Sans" textAnchor="middle" opacity="0.6">
                      CHEF&apos;S KITCHEN
                    </text>

                    {/* Entrance Foyer & Guest Cloakroom */}
                    <rect x="360" y="260" width="200" height="150" />
                    <text x="460" y="340" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                      FOYER / POWDER
                    </text>

                    {/* Sliding Glass Doors to Garden */}
                    <line x1="40" y1="120" x2="40" y2="300" stroke="#00E676" strokeWidth="4" />
                    <text x="20" y="210" fill="#00E676" fontSize="10" transform="rotate(-90 20 210)" textAnchor="middle">
                      VERANDA SLIDER
                    </text>
                  </g>
                )}

                {activeLevel === "upper" && (
                  <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none">
                    {/* Master Sanctuary Wing */}
                    <rect x="40" y="40" width="300" height="370" fill="rgba(197, 160, 89, 0.07)" />
                    <text x="190" y="220" fill="#DFC283" fontSize="14" fontFamily="Plus Jakarta Sans" textAnchor="middle" opacity="0.6">
                      MASTER SUITE &amp; SPA (22&apos;0&quot; × 16&apos;6&quot;)
                    </text>

                    {/* VIP Bedroom 2 */}
                    <rect x="340" y="40" width="220" height="190" fill="rgba(255, 255, 255, 0.02)" />
                    <text x="450" y="140" fill="#DFC283" fontSize="13" fontFamily="Plus Jakarta Sans" textAnchor="middle" opacity="0.6">
                      VIP SUITE 2
                    </text>

                    {/* VIP Bedroom 3 / Galleria */}
                    <rect x="340" y="230" width="220" height="180" />
                    <text x="450" y="320" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                      BEDROOM 3 &amp; BATH
                    </text>
                  </g>
                )}

                {activeLevel === "terrace" && (
                  <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none">
                    {/* Sky Lounge & Observatory */}
                    <rect x="40" y="40" width="520" height="370" fill="rgba(197, 160, 89, 0.08)" />
                    <text x="300" y="220" fill="#DFC283" fontSize="16" fontFamily="Plus Jakarta Sans" textAnchor="middle" opacity="0.7">
                      ROOFTOP SKY LOUNGE &amp; PERGOLA (32&apos;0&quot; × 20&apos;4&quot;)
                    </text>

                    {/* BBQ & Wet Bar area */}
                    <rect x="380" y="60" width="160" height="120" stroke="#C5A059" strokeDasharray="4 4" />
                    <text x="460" y="125" fill="#DFC283" fontSize="11" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                      BARBECUE VAULT
                    </text>
                  </g>
                )}
              </svg>

              {/* Pulsing Interactive Hotspots */}
              {levelRooms.map((room) => {
                const isCurrent = currentRoom.id === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => inspectRoom(room.id)}
                    style={{
                      left: `${room.hotspotCoords.x}%`,
                      top: `${room.hotspotCoords.y}%`,
                    }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
                    aria-label={`Inspect ${room.name}`}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A059] opacity-60" />
                      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#C5A059] shadow-lg transition-transform group-hover:scale-125">
                        <svg className="h-3 w-3 text-[#080E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                    </span>

                    {/* Room Tooltip on Hover */}
                    <span className="pointer-events-none absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#080E14]/90 px-2.5 py-1 text-[0.7rem] font-semibold text-white shadow-xl backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                      {room.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Specifications Panel */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#101822]/90 p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#C5A059]">
                  Architectural Room Node
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-[#F4EFE6]/70">
                  {currentRoom.level.toUpperCase()} LEVEL
                </span>
              </div>

              <h3 className="mt-2 font-display text-2xl font-light text-white">
                {currentRoom.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#F4EFE6]/75">
                {currentRoom.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-black/30 p-4 text-xs">
                <div>
                  <dt className="text-[#F4EFE6]/50">Dimensions</dt>
                  <dd className="mt-1 font-mono-data text-sm font-semibold text-white">
                    {currentRoom.dimensions}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#F4EFE6]/50">Internal Area</dt>
                  <dd className="mt-1 font-mono-data text-sm font-semibold text-white">
                    {currentRoom.areaSqft} sq ft
                  </dd>
                </div>
                <div>
                  <dt className="text-[#F4EFE6]/50">Ceiling Height</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#DFC283]">
                    {currentRoom.ceilingHeight}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#F4EFE6]/50">Glazing Spec</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">
                    Acoustic Double-Glazed
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                  Architectural Highlights
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-[#F4EFE6]/80">
                  {currentRoom.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Launch 360° Inspection Button */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => inspectRoom(currentRoom.id)}
                className="btn-gold w-full text-center"
              >
                Launch 360° Panorama Inspector
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Room Inspection Lightbox Modal */}
      {isInspectionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={`360 Panorama for ${currentRoom.name}`}
        >
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#080E14] shadow-2xl">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C5A059]">
                  Spatial 360° Inspection &bull; {currentRoom.level.toUpperCase()} LEVEL
                </span>
                <h3 className="font-display text-xl text-white sm:text-2xl">
                  {currentRoom.name}
                </h3>
              </div>

              {/* Toggles: Finishes & Lighting */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Finish Toggle */}
                <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFinish("marble")}
                    className={cn(
                      "rounded px-3 py-1 font-semibold transition",
                      activeFinish === "marble"
                        ? "bg-[#C5A059] text-[#080E14]"
                        : "text-[#F4EFE6]/70 hover:text-white",
                    )}
                  >
                    Calacatta Marble
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinish("hardwood")}
                    className={cn(
                      "rounded px-3 py-1 font-semibold transition",
                      activeFinish === "hardwood"
                        ? "bg-[#C5A059] text-[#080E14]"
                        : "text-[#F4EFE6]/70 hover:text-white",
                    )}
                  >
                    Smoked Oak
                  </button>
                </div>

                {/* Lighting Toggle */}
                <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLighting("daylight")}
                    className={cn(
                      "rounded px-2.5 py-1 font-semibold transition",
                      activeLighting === "daylight"
                        ? "bg-white/20 text-white"
                        : "text-[#F4EFE6]/60 hover:text-white",
                    )}
                  >
                    Daylight
                  </button>
                  <button
                    type="button"
                    onClick={() => setLighting("sunset")}
                    className={cn(
                      "rounded px-2.5 py-1 font-semibold transition",
                      activeLighting === "sunset"
                        ? "bg-amber-500/30 text-amber-200"
                        : "text-[#F4EFE6]/60 hover:text-white",
                    )}
                  >
                    Sunset
                  </button>
                  <button
                    type="button"
                    onClick={() => setLighting("ambient")}
                    className={cn(
                      "rounded px-2.5 py-1 font-semibold transition",
                      activeLighting === "ambient"
                        ? "bg-indigo-500/30 text-indigo-200"
                        : "text-[#F4EFE6]/60 hover:text-white",
                    )}
                  >
                    Evening
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeInspection}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/20"
                  aria-label="Close modal"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 360 Canvas Viewport */}
            <div className="flex-1 p-2">
              <PanoramaViewer
                roomName={currentRoom.name}
                finish={activeFinish}
                lighting={activeLighting}
              />
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/10 bg-[#080E14] px-6 py-3 text-xs text-[#F4EFE6]/70">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">Active Finish:</span>
                <span className="text-[#DFC283]">
                  {activeFinish === "marble" ? "Italian Calacatta Gold Marble" : "Engineered European Smoked Oak"}
                </span>
                <span className="text-white/20">&bull;</span>
                <span className="font-semibold text-white">Lighting Mood:</span>
                <span className="capitalize text-[#DFC283]">{activeLighting}</span>
              </div>

              <div className="flex gap-2">
                <a
                  href="#contact"
                  onClick={closeInspection}
                  className="text-xs font-semibold text-[#C5A059] underline underline-offset-4"
                >
                  Request Interior Finishes Catalog &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
