"use client";

import { useMemo } from "react";
import { type Plot, allEstatePlots } from "@/data/plots";
import { usePlotStore } from "@/store/usePlotStore";

export function usePlotFilter() {
  const {
    activeEstate,
    statusFilter,
    sizeFilter,
    budgetMax,
    searchQuery,
    facingFilter,
    cornerOnly,
    selectedPlotCode,
  } = usePlotStore();

  const estatePlots = useMemo(() => {
    return allEstatePlots.filter((p) => p.projectSlug === activeEstate);
  }, [activeEstate]);

  const filteredPlots = useMemo(() => {
    return estatePlots.filter((plot) => {
      // Status filter
      if (statusFilter !== "all" && plot.status !== statusFilter) {
        return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = plot.code.toLowerCase().includes(q);
        const roadMatch = plot.roadAccess.toLowerCase().includes(q);
        if (!codeMatch && !roadMatch) return false;
      }

      // Facing filter
      if (facingFilter && plot.facing !== facingFilter) {
        return false;
      }

      // Corner only
      if (cornerOnly && !plot.isCorner) {
        return false;
      }

      // Size filter
      if (sizeFilter) {
        const currentSize = `${plot.widthFt}×${plot.depthFt}`;
        if (currentSize !== sizeFilter.replace("x", "×").replace("X", "×")) {
          return false;
        }
      }

      // Budget filter
      if (plot.priceGhs > budgetMax) {
        return false;
      }

      return true;
    });
  }, [
    estatePlots,
    statusFilter,
    searchQuery,
    facingFilter,
    cornerOnly,
    sizeFilter,
    budgetMax,
  ]);

  const selectedPlot = useMemo(() => {
    if (!selectedPlotCode) return null;
    return (
      estatePlots.find((p) => p.code === selectedPlotCode) ??
      allEstatePlots.find((p) => p.code === selectedPlotCode) ??
      null
    );
  }, [estatePlots, selectedPlotCode]);

  const counts = useMemo(() => {
    return {
      total: estatePlots.length,
      available: estatePlots.filter((p) => p.status === "available").length,
      reserved: estatePlots.filter((p) => p.status === "reserved" || p.status === "held").length,
      sold: estatePlots.filter((p) => p.status === "sold").length,
      unreleased: estatePlots.filter((p) => p.status === "unreleased").length,
    };
  }, [estatePlots]);

  return {
    estatePlots,
    filteredPlots,
    selectedPlot,
    counts,
  };
}
