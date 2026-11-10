import { generateEstate } from "./generate";
import type { Estate, Plot, PlotStatus } from "./types";

export * from "./types";
export {
  HOUSE_TYPES,
  houseTypeForPlot,
  houseFrame,
  builtUpSqFt,
  feetInches,
  doorsFor,
  roomWalls,
  type HouseType,
  type Room,
  type Door,
} from "./house-types";

const greenValley = generateEstate();

const estates: Record<string, Estate> = {
  [greenValley.slug]: greenValley,
};

export const estateSlugs = Object.keys(estates);

export function getEstate(slug: string): Estate | undefined {
  return estates[slug];
}

export const allPlots: Plot[] = Object.values(estates).flatMap((e) => e.plots);

/** Plots for an estate. Returns [] for estates without a layout — never another estate's data. */
export function plotsForProject(slug: string): Plot[] {
  return estates[slug]?.plots ?? [];
}

export function getPlot(slug: string, code: string): Plot | undefined {
  return estates[slug]?.plots.find((p) => p.code === code.trim());
}

export function plotLegend(plots: Plot[]): Record<PlotStatus, number> {
  const counts: Record<PlotStatus, number> = {
    available: 0,
    held: 0,
    reserved: 0,
    sold: 0,
    unreleased: 0,
  };
  for (const p of plots) counts[p.status] += 1;
  return counts;
}

/** Available plots closest in size and price, nearest first. */
export function similarPlots(plot: Plot, pool: Plot[], limit = 3): Plot[] {
  return pool
    .filter((p) => p.id !== plot.id && p.status === "available")
    .map((p) => ({
      p,
      score:
        Math.abs(p.areaSqFt - plot.areaSqFt) / 1000 +
        Math.abs(p.priceGhs - plot.priceGhs) / 20000 +
        Math.hypot(p.centroid[0] - plot.centroid[0], p.centroid[1] - plot.centroid[1]) / 200,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export function lowestPrice(slug: string): number | null {
  const prices = plotsForProject(slug)
    .filter((p) => p.status === "available")
    .map((p) => p.priceGhs);
  return prices.length ? Math.min(...prices) : null;
}

export const statusLabel: Record<PlotStatus, string> = {
  available: "Available",
  held: "On hold",
  reserved: "Reserved",
  sold: "Sold",
  unreleased: "Phase 2",
};

/** Status colours shared by the 3D scene, plan and UI chips. Tuned to read on grass and on sand. */
export const statusColor: Record<PlotStatus, string> = {
  available: "#4fa86a",
  held: "#d68b2e",
  reserved: "#e4b443",
  sold: "#c04a42",
  unreleased: "#9d978b",
};

export const sizeKey = (p: Pick<Plot, "frontageFt" | "depthFt">) => `${p.frontageFt}×${p.depthFt}`;

export function formatGhs(n: number) {
  return `GH¢${n.toLocaleString("en-GH")}`;
}
