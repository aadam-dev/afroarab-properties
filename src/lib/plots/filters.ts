import type { Plot } from "@/data/plots";

export type PlotFilters = {
  query?: string;
  facing?: Plot["facing"] | null;
  size?: string | null;
  availableOnly?: boolean;
  cornerOnly?: boolean;
};

export function filterPlots(plots: Plot[], filters: PlotFilters) {
  return plots.filter((p) => {
    if (filters.query && !p.code.includes(filters.query.trim())) return false;
    if (filters.facing && p.facing !== filters.facing) return false;
    if (filters.size) {
      const key = `${p.widthFt}×${p.depthFt}`;
      const normalized = filters.size.replace(/x/gi, "×");
      if (key !== normalized) return false;
    }
    if (filters.availableOnly && p.status !== "available") return false;
    if (filters.cornerOnly && !p.isCorner) return false;
    return true;
  });
}

export function canTransition(from: Plot["status"], to: Plot["status"]) {
  const allowed: Record<Plot["status"], Plot["status"][]> = {
    available: ["held", "reserved", "sold", "unreleased"],
    held: ["available", "reserved", "sold"],
    reserved: ["sold", "available"],
    sold: ["available"],
    unreleased: ["available"],
  };
  return allowed[from].includes(to);
}
