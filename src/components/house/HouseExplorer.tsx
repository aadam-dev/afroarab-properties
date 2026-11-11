"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { HouseModel } from "@/data/houses";
import { whatsappHref } from "@/data/site";
import { houseWalkInput, useHouseStore, type HouseMode } from "@/store/useHouseStore";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const HouseScene = dynamic(() => import("./HouseScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="glass-panel rounded-full px-4 py-2 text-sm font-semibold">Loading the house…</p>
    </div>
  ),
});

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const c = document.createElement("canvas");
      webglSupport = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

const MODES: { id: HouseMode; label: string; icon: IconName; hint: string }[] = [
  { id: "outside", label: "Outside", icon: "house", hint: "Drag to turn · right-drag to pan · scroll to zoom" },
  { id: "inside", label: "Floors", icon: "layers", hint: "Pick a floor, then tap a room for its size" },
  { id: "walk", label: "Walk", icon: "walk", hint: "W A S D or arrows to walk · drag to look · tap the floor to move" },
];

function evidenceChip(evidence: string) {
  const fromPhoto = evidence.startsWith("photo");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em]",
        fromPhoto ? "bg-available/15 text-available" : "bg-foreground/[0.07] text-muted",
      )}
    >
      <Icon name={fromPhoto ? "camera" : "ruler"} size={12} />
      {fromPhoto ? "From photos" : "Indicative"}
    </span>
  );
}

function Joystick() {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<[number, number]>([0, 0]);
  const pointer = useRef<number | null>(null);
  function update(cx: number, cy: number) {
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const max = r.width / 2 - 16;
    let dx = cx - (r.left + r.width / 2);
    let dy = cy - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob([dx, dy]);
    houseWalkInput.x = dx / max;
    houseWalkInput.y = -dy / max;
  }
  function release() {
    pointer.current = null;
    setKnob([0, 0]);
    houseWalkInput.x = 0;
    houseWalkInput.y = 0;
  }
  useEffect(() => release, []);
  return (
    <div
      ref={base}
      role="application"
      aria-label="Walk joystick. Drag to move."
      className="glass-panel pointer-events-auto relative h-28 w-28 touch-none select-none rounded-full"
      onPointerDown={(e) => {
        pointer.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (pointer.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-forest-800 shadow-lux ring-4 ring-white/40 dark:bg-gold"
        style={{ transform: `translate(calc(-50% + ${knob[0]}px), calc(-50% + ${knob[1]}px))` }}
      />
    </div>
  );
}

export function HouseExplorer({ house, projectName }: { house: HouseModel; projectName: string }) {
  const { meta } = house;
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => null);
  const mode = useHouseStore((s) => s.mode);
  const level = useHouseStore((s) => s.level);
  const roomId = useHouseStore((s) => s.roomId);
  const photoId = useHouseStore((s) => s.photoId);
  const setMode = useHouseStore((s) => s.setMode);
  const setLevel = useHouseStore((s) => s.setLevel);
  const selectRoom = useHouseStore((s) => s.selectRoom);
  const showPhoto = useHouseStore((s) => s.showPhoto);
  const requestHome = useHouseStore((s) => s.requestHome);
  const reset = useHouseStore((s) => s.reset);
  const ready = useHouseStore((s) => s.ready);
  const root = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    reset();
    return reset;
  }, [reset]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useHouseStore.getState();
      if (s.photoId) s.requestHome();
      else if (s.roomId && s.mode !== "walk") s.selectRoom(null);
      else if (s.mode === "walk") s.setMode("outside");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const room = meta.rooms.find((r) => r.id === roomId) ?? null;
  const photo = meta.photos.find((p) => p.id === photoId) ?? null;
  const levelName = meta.levels.find((l) => l.id === level)?.name ?? "";
  const hint = MODES.find((m) => m.id === mode)?.hint;
  const upper = meta.levels[1]?.id;

  return (
    <div
      ref={root}
      className={cn(
        "relative overflow-hidden bg-[#cfdde6] text-foreground",
        fullscreen ? "h-svh w-full" : "h-[78svh] min-h-[34rem] rounded-[1.75rem] border border-border shadow-soft",
      )}
    >
      {webgl === false ? (
        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
          {meta.photos.map((p) => (
            <div key={p.id} className="relative">
              <Image src={p.file} alt={p.shows} fill sizes="50vw" className="object-cover" />
            </div>
          ))}
          <p className="glass-panel absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs">
            3D isn&apos;t available on this device, so you&apos;re seeing the photographs.
          </p>
        </div>
      ) : webgl ? (
        <HouseScene house={house} />
      ) : null}

      {webgl && !ready ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <p className="glass-panel rounded-full px-4 py-2 text-sm font-semibold">Loading the house…</p>
        </div>
      ) : null}

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start gap-2 p-3">
        <div className="glass-panel pointer-events-auto rounded-2xl px-3.5 py-2 leading-tight max-sm:hidden">
          <p className="text-sm font-bold">{projectName}</p>
          <p className="text-[0.68rem] text-muted">3D model · indicative layout</p>
        </div>
        <nav aria-label="View" className="glass-panel pointer-events-auto ml-auto flex items-center gap-0.5 rounded-2xl p-1 max-sm:mx-auto">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[0.68rem] font-semibold transition-colors",
                mode === m.id ? "bg-forest-800 text-white dark:bg-gold dark:text-ink" : "text-foreground/80 hover:bg-foreground/[0.06]",
              )}
            >
              <Icon name={m.icon} size={19} />
              {m.label}
            </button>
          ))}
          <span className="mx-0.5 h-8 w-px bg-border max-sm:hidden" aria-hidden />
          <button
            type="button"
            onClick={() => (fullscreen ? document.exitFullscreen() : root.current?.requestFullscreen())}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 hover:bg-foreground/[0.06] max-sm:hidden"
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          >
            <Icon name="expand" size={19} />
          </button>
        </nav>
      </div>

      {/* Floor switch */}
      {mode === "inside" ? (
        <div className="pointer-events-none absolute left-3 top-[4.75rem] z-20">
          <div role="group" aria-label="Floor" className="seg glass-panel pointer-events-auto rounded-2xl p-1">
            {meta.levels.map((l) => (
              <button key={l.id} type="button" aria-pressed={level === l.id} onClick={() => setLevel(l.id)}>
                {l.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Photos */}
      {mode !== "walk" && !photo && !(room && mode === "inside") ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 max-w-[calc(100%-1.5rem)]">
          <div className="glass-panel pointer-events-auto rounded-2xl p-2">
            <p className="px-1 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">Real photos</p>
            <div className="flex gap-1.5">
              {meta.photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => showPhoto(p.id)}
                  className="relative h-12 w-16 overflow-hidden rounded-lg ring-1 ring-border transition hover:ring-2 hover:ring-gold"
                  aria-label={`Go to where this photo was taken: ${p.shows}`}
                >
                  <Image src={p.file} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Photo card */}
      {photo ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 w-[min(22rem,calc(100%-1.5rem))]">
          <div className="glass-panel pointer-events-auto overflow-hidden rounded-2xl">
            <div className="relative aspect-[3/2]">
              <Image src={photo.file} alt={photo.shows} fill sizes="352px" className="object-cover" />
            </div>
            <div className="p-3.5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold">Photographed here</p>
              <p className="mt-1 text-sm leading-relaxed">{photo.shows}</p>
              <p className="mt-1.5 text-xs text-muted">The 3D view is set to the same spot so you can compare.</p>
              <button type="button" onClick={requestHome} className="btn-ghost mt-3 !px-3 !py-1.5 text-xs">
                <Icon name="arrowLeft" size={14} /> Back to the house
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Room panel */}
      {room && mode === "inside" ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 w-[min(21rem,calc(100%-1.5rem))]">
          <div className="glass-panel pointer-events-auto rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">
                  {meta.levels.find((l) => l.id === room.level)?.name}
                </p>
                <h3 className="mt-0.5 font-display text-2xl font-light">{room.name}</h3>
              </div>
              <button type="button" onClick={() => selectRoom(null)} aria-label="Close room details" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-foreground/[0.06]">
                <Icon name="close" size={18} />
              </button>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-foreground/[0.04] p-2.5">
                <dt className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-muted">Size</dt>
                <dd className="font-figure mt-0.5">{room.size}</dd>
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-2.5">
                <dt className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-muted">Area</dt>
                <dd className="font-figure mt-0.5">
                  {room.areaSqm} m² · {room.areaSqft} sq ft
                </dd>
              </div>
            </dl>
            <div className="mt-3">{evidenceChip(room.evidence)}</div>
            {room.note ? <p className="mt-2 text-xs leading-relaxed text-muted">{room.note}</p> : null}
            <p className="mt-2 text-xs leading-relaxed text-muted">Sizes are approximate, worked out from photographs.</p>
          </div>
        </div>
      ) : null}

      {/* Walk HUD */}
      {mode === "walk" ? (
        <>
          <div className="pointer-events-none absolute left-1/2 top-[4.75rem] z-20 -translate-x-1/2">
            <p className="glass-panel whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold" aria-live="polite">
              {room ? room.name : "Outside"} · {levelName}
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 z-20 md:hidden">
            <Joystick />
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-20 flex flex-col items-end gap-2">
            {upper ? (
              <button
                type="button"
                onClick={() => (houseWalkInput.stair = level === upper ? "down" : "up")}
                className="btn-gold pointer-events-auto"
              >
                <Icon name="stairs" size={16} /> {level === upper ? "Go downstairs" : "Go upstairs"}
              </button>
            ) : null}
            <button type="button" onClick={() => setMode("outside")} className="btn-ink pointer-events-auto">
              <Icon name="close" size={16} /> Exit walk
            </button>
          </div>
        </>
      ) : null}

      {/* Hint */}
      {!photo && !(room && mode === "inside") ? (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-md:hidden">
          <p className="glass-panel rounded-full px-3.5 py-1.5 text-xs text-muted">{hint}</p>
        </div>
      ) : null}

      {/* Enquire */}
      {mode !== "walk" ? (
        <a
          href={whatsappHref(`Hello Afro Arab, I'm looking at the 3D model of ${projectName} and would like to know more.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary absolute left-3 top-[4.75rem] z-20 !px-3.5 !py-2 text-xs data-[hidden=true]:hidden"
          data-hidden={mode === "inside"}
        >
          <Icon name="whatsapp" size={15} /> Ask about this home
        </a>
      ) : null}

      <button type="button" className="sr-only" onClick={requestHome}>
        Reset the view
      </button>
    </div>
  );
}
