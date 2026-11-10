"use client";

import { useMemo } from "react";
import type { Plot } from "@/data/masterplan";
import { filterPlots, hasActiveFilters } from "@/lib/plots/filters";
import { usePlotStore } from "@/store/usePlotStore";

/** Plots passing the active filters, plus a Set of codes (null when no filter is active). */
export function useMatches(plots: Plot[]) {
  const filters = usePlotStore((s) => s.filters);
  return useMemo(() => {
    const active = hasActiveFilters(filters);
    const list = active ? filterPlots(plots, filters) : plots;
    return { list, set: active ? new Set(list.map((p) => p.code)) : null, active };
  }, [plots, filters]);
}
