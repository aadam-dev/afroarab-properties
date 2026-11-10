"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getEstate } from "@/data/masterplan";
import { usePlotStore } from "@/store/usePlotStore";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import {
  Compass,
  FiltersPopover,
  HintBar,
  Legend,
  ListPopover,
  PlotSearch,
  SunPopover,
  Toolbar,
  WalkHud,
} from "./ExplorerChrome";
import { PlotPanel } from "./PlotPanel";
import { SitePlan2D } from "./SitePlan2D";
import { useMatches } from "./useMatches";

function LoadingPlan({ slug }: { slug: string }) {
  const estate = getEstate(slug)!;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#cfe0e6] p-8">
      <SitePlan2D estate={estate} className="h-full max-h-[80svh] w-auto opacity-80" />
      <p className="glass-panel absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-semibold">
        Loading the 3D estate…
      </p>
    </div>
  );
}

const ExplorerScene = dynamic(() => import("./ExplorerScene"), {
  ssr: false,
  loading: () => <LoadingPlan slug="titled-lands-green-valley" />,
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

export function PlotExplorer({ slug }: { slug: string }) {
  const estate = getEstate(slug);
  const params = useSearchParams();
  const selectedCode = usePlotStore((s) => s.selectedCode);
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const setEstate = usePlotStore((s) => s.setEstate);
  const mode = usePlotStore((s) => s.mode);
  const setMode = usePlotStore((s) => s.setMode);
  const popover = usePlotStore((s) => s.popover);
  const closePopover = usePlotStore((s) => s.closePopover);
  const requestHome = usePlotStore((s) => s.requestHome);
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => null);

  const plots = useMemo(() => estate?.plots ?? [], [estate]);
  const { list: matches, set: matchSet } = useMatches(plots);
  const selected = plots.find((p) => p.code === selectedCode) ?? null;

  // Boot: estate, deep link, capability check.
  useEffect(() => {
    setEstate(slug);
    const code = params.get("plot");
    if (code && getEstate(slug)?.plots.some((p) => p.code === code)) {
      // Let the canvas mount first so the camera can fly.
      const t = setTimeout(() => usePlotStore.getState().selectPlot(code), 400);
      return () => clearTimeout(t);
    }
    // Only on first mount for this estate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Keep ?plot= in the address bar so a plot can be shared.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedCode) url.searchParams.set("plot", selectedCode);
    else url.searchParams.delete("plot");
    window.history.replaceState(window.history.state, "", url.toString());
  }, [selectedCode]);

  // Escape: popover → panel → walk.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = usePlotStore.getState();
      if (s.popover) s.closePopover();
      else if (s.selectedCode) s.selectPlot(null);
      else if (s.mode === "walk") s.setMode("orbit");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!estate) return null;

  const panelOpen = Boolean(selected) && mode !== "walk";

  return (
    <div className="explorer-root fixed inset-0 overflow-hidden bg-[#cfe0e6] text-foreground">
      <h1 className="sr-only">{estate.name} plot explorer</h1>

      {webgl === false ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 pb-28 pt-36">
          <SitePlan2D
            estate={estate}
            selectedCode={selectedCode}
            matches={matchSet}
            onSelect={(c) => selectPlot(c, { fly: false })}
            className="h-full w-auto max-w-full"
          />
        </div>
      ) : webgl ? (
        <ExplorerScene estate={estate} panelOpen={panelOpen} />
      ) : null}

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start gap-2 p-3 sm:gap-3">
        <Link
          href="/lands"
          className="glass-panel pointer-events-auto flex h-12 items-center gap-2.5 rounded-2xl pl-1.5 pr-3.5"
          aria-label={`Back to lands. ${estate.name}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900">
            <Image src="/brand/crest.png" alt="" width={26} height={26} className="h-6 w-6 object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">{estate.shortName}</span>
            <span className="block text-[0.68rem] text-muted">
              {plots.length} plots · indicative layout
            </span>
          </span>
        </Link>
        <div className="w-[min(100%,15rem)] max-sm:order-last max-sm:w-full">
          <PlotSearch plots={plots} />
        </div>
        <div className="ml-auto flex items-start gap-2 max-md:hidden">
          <Toolbar />
          <div className="glass-panel pointer-events-auto flex h-14 items-center rounded-2xl px-1">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Popovers */}
      {popover && mode !== "walk" ? (
        <div className="pointer-events-none absolute z-30 max-md:inset-x-3 max-md:bottom-[5.5rem] max-md:flex max-md:justify-center md:right-3 md:top-[5.25rem]">
          {popover === "filters" ? <FiltersPopover plots={plots} matchCount={matches.length} /> : null}
          {popover === "sun" ? <SunPopover estate={estate} /> : null}
          {popover === "list" ? <ListPopover plots={plots} matches={matches} /> : null}
        </div>
      ) : null}

      {/* Bottom-left: compass + legend */}
      {mode !== "walk" ? (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-end gap-2 max-md:bottom-[5.5rem] sm:bottom-4 sm:left-4">
          <Compass
            onReset={() => {
              closePopover();
              if (mode === "plan") setMode("orbit");
              else requestHome();
            }}
          />
          <div className={panelOpen ? "max-md:hidden" : undefined}>
            <Legend plots={plots} />
          </div>
        </div>
      ) : null}

      {/* Hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3 max-md:hidden">
        {!panelOpen ? <HintBar mode={mode} /> : null}
      </div>

      {mode === "walk" && webgl ? <WalkHud estate={estate} /> : null}

      {/* Mobile toolbar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        {!panelOpen ? <Toolbar /> : null}
      </div>

      {selected && mode !== "walk" ? (
        <PlotPanel key={selected.code} plot={selected} estate={estate} onClose={() => selectPlot(null)} />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {selected ? `Plot ${selected.code} selected` : ""}
      </p>

      {webgl === false ? (
        <p className="glass-panel absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-2 text-xs">
          <Icon name="layers" size={14} className="mr-1.5 inline" />
          3D isn&apos;t available on this device, so you&apos;re seeing the 2D site plan.
        </p>
      ) : null}
    </div>
  );
}
