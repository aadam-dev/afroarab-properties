import { create } from "zustand";
import type { PlotStatus } from "@/data/plots";

export type FilterStatus = "all" | PlotStatus;
export type FacingDirection = "N" | "E" | "S" | "W" | null;

interface PlotStoreState {
  activeEstate: string;
  selectedPlotCode: string | null;
  statusFilter: FilterStatus;
  sizeFilter: string | null;
  budgetMax: number;
  searchQuery: string;
  facingFilter: FacingDirection;
  cornerOnly: boolean;
  viewMode: "plan" | "3d";
  isDrawerOpen: boolean;
  zoomLevel: number;
  
  // Actions
  setActiveEstate: (estateSlug: string) => void;
  selectPlot: (code: string | null) => void;
  setStatusFilter: (status: FilterStatus) => void;
  setSizeFilter: (size: string | null) => void;
  setBudgetMax: (max: number) => void;
  setSearchQuery: (query: string) => void;
  setFacingFilter: (facing: FacingDirection) => void;
  setCornerOnly: (corner: boolean) => void;
  setViewMode: (mode: "plan" | "3d") => void;
  setDrawerOpen: (open: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  resetFilters: () => void;
}

export const usePlotStore = create<PlotStoreState>((set) => ({
  activeEstate: "bella-vista",
  selectedPlotCode: null,
  statusFilter: "all",
  sizeFilter: null,
  budgetMax: 200000,
  searchQuery: "",
  facingFilter: null,
  cornerOnly: false,
  viewMode: "plan",
  isDrawerOpen: false,
  zoomLevel: 1,

  setActiveEstate: (estateSlug) =>
    set({
      activeEstate: estateSlug,
      selectedPlotCode: null,
      isDrawerOpen: false,
      zoomLevel: 1,
    }),

  selectPlot: (code) =>
    set({
      selectedPlotCode: code,
      isDrawerOpen: code !== null,
    }),

  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSizeFilter: (sizeFilter) => set({ sizeFilter }),
  setBudgetMax: (budgetMax) => set({ budgetMax }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFacingFilter: (facingFilter) => set({ facingFilter }),
  setCornerOnly: (cornerOnly) => set({ cornerOnly }),
  setViewMode: (viewMode) => set({ viewMode }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  setZoomLevel: (zoomLevel) =>
    set({ zoomLevel: Math.max(0.7, Math.min(2.5, zoomLevel)) }),

  zoomIn: () =>
    set((state) => ({ zoomLevel: Math.min(2.5, state.zoomLevel + 0.25) })),

  zoomOut: () =>
    set((state) => ({ zoomLevel: Math.max(0.7, state.zoomLevel - 0.25) })),

  resetZoom: () => set({ zoomLevel: 1 }),

  resetFilters: () =>
    set({
      statusFilter: "all",
      sizeFilter: null,
      budgetMax: 200000,
      searchQuery: "",
      facingFilter: null,
      cornerOnly: false,
    }),
}));
