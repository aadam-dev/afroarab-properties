import type { Compass8, Plot, PlotStatus } from "@/data/masterplan";

export type PlotFilters = {
  /** Plot number search. Exact match on number, or prefix match while typing. */
  query?: string;
  /** Matches when any road frontage faces one of these directions. */
  facings?: Compass8[];
  /** Size keys like "70×100". */
  sizes?: string[];
  availableOnly?: boolean;
  cornerOnly?: boolean;
  mainRoadOnly?: boolean;
  maxPriceGhs?: number | null;
};

const CARDINAL: Record<Compass8, Compass8[]> = {
  N: ["N", "NE", "NW"],
  E: ["E", "NE", "SE"],
  S: ["S", "SE", "SW"],
  W: ["W", "NW", "SW"],
  NE: ["NE"],
  SE: ["SE"],
  SW: ["SW"],
  NW: ["NW"],
};

export function plotFaces(plot: Plot, dir: Compass8) {
  const accepted = CARDINAL[dir];
  return plot.frontages.some((f) => accepted.includes(f.facing));
}

export function filterPlots(plots: Plot[], filters: PlotFilters) {
  const q = filters.query?.trim().replace(/^plot\s*/i, "") ?? "";
  return plots.filter((p) => {
    if (q && !p.code.startsWith(q)) return false;
    if (filters.facings?.length && !filters.facings.some((d) => plotFaces(p, d))) return false;
    if (filters.sizes?.length) {
      const key = `${p.frontageFt}×${p.depthFt}`;
      const normalized = filters.sizes.map((s) => s.replace(/x/gi, "×"));
      if (!normalized.includes(key)) return false;
    }
    if (filters.availableOnly && p.status !== "available") return false;
    if (filters.cornerOnly && !p.isCorner) return false;
    if (filters.mainRoadOnly && !p.onMainRoad) return false;
    if (filters.maxPriceGhs && p.priceGhs > filters.maxPriceGhs) return false;
    return true;
  });
}

export function hasActiveFilters(f: PlotFilters) {
  return Boolean(
    f.facings?.length ||
      f.sizes?.length ||
      f.availableOnly ||
      f.cornerOnly ||
      f.mainRoadOnly ||
      f.maxPriceGhs,
  );
}

export function canTransition(from: PlotStatus, to: PlotStatus) {
  const allowed: Record<PlotStatus, PlotStatus[]> = {
    available: ["held", "reserved", "sold", "unreleased"],
    held: ["available", "reserved", "sold"],
    reserved: ["sold", "available"],
    sold: ["available"],
    unreleased: ["available"],
  };
  return allowed[from].includes(to);
}
