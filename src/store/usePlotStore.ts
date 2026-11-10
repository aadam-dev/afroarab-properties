import { create } from "zustand";
import type { Compass8 } from "@/data/masterplan";

export type ExplorerMode = "orbit" | "plan" | "walk";
export type ColourMode = "status" | "natural";
export type ExplorerPopover = "filters" | "sun" | "list" | null;

export type ExplorerFilters = {
  facings: Compass8[];
  sizes: string[];
  availableOnly: boolean;
  cornerOnly: boolean;
  mainRoadOnly: boolean;
};

export type CameraRequest =
  | { kind: "plot"; code: string; nonce: number }
  | { kind: "home"; nonce: number }
  | { kind: "stand"; code: string; nonce: number };

export const DEFAULT_FILTERS: ExplorerFilters = {
  facings: [],
  sizes: [],
  availableOnly: false,
  cornerOnly: false,
  mainRoadOnly: false,
};

type State = {
  estateSlug: string;
  selectedCode: string | null;
  hoveredCode: string | null;
  mode: ExplorerMode;
  colourMode: ColourMode;
  popover: ExplorerPopover;
  filters: ExplorerFilters;
  /** Local solar hour in Accra (UTC+0), 6 → 18.5. */
  sunHour: number;
  sunPlaying: boolean;
  housesVisible: boolean;
  /** Plot the walker is standing on, for the walk banner. */
  walkPlotCode: string | null;
  cameraRequest: CameraRequest | null;

  setEstate: (slug: string) => void;
  selectPlot: (code: string | null, opts?: { fly?: boolean }) => void;
  hoverPlot: (code: string | null) => void;
  setMode: (mode: ExplorerMode) => void;
  standOnPlot: (code: string) => void;
  setColourMode: (mode: ColourMode) => void;
  togglePopover: (p: Exclude<ExplorerPopover, null>) => void;
  closePopover: () => void;
  setFilters: (patch: Partial<ExplorerFilters>) => void;
  resetFilters: () => void;
  setSunHour: (h: number) => void;
  setSunPlaying: (p: boolean) => void;
  setHousesVisible: (v: boolean) => void;
  setWalkPlotCode: (code: string | null) => void;
  requestHome: () => void;
};

let nonce = 0;

export const usePlotStore = create<State>((set, get) => ({
  estateSlug: "titled-lands-green-valley",
  selectedCode: null,
  hoveredCode: null,
  mode: "orbit",
  colourMode: "status",
  popover: null,
  filters: DEFAULT_FILTERS,
  sunHour: 9.5,
  sunPlaying: false,
  housesVisible: true,
  walkPlotCode: null,
  cameraRequest: null,

  setEstate: (estateSlug) =>
    set({
      estateSlug,
      selectedCode: null,
      hoveredCode: null,
      mode: "orbit",
      popover: null,
      filters: DEFAULT_FILTERS,
      cameraRequest: { kind: "home", nonce: ++nonce },
    }),

  selectPlot: (code, opts) => {
    const fly = opts?.fly ?? true;
    const { mode } = get();
    set({
      selectedCode: code,
      popover: code ? null : get().popover,
      // Selecting from walk mode drops back to the aerial view so the panel and plot are both visible.
      mode: code && mode === "walk" ? "orbit" : mode,
      // Closing the panel keeps the current view; the rig only clears its focal offset.
      cameraRequest: code && fly ? { kind: "plot", code, nonce: ++nonce } : get().cameraRequest,
    });
  },

  hoverPlot: (hoveredCode) => {
    if (get().hoveredCode !== hoveredCode) set({ hoveredCode });
  },

  setMode: (mode) => {
    const prev = get().mode;
    if (prev === mode) return;
    set({
      mode,
      popover: null,
      cameraRequest:
        mode === "orbit" && get().selectedCode
          ? { kind: "plot", code: get().selectedCode!, nonce: ++nonce }
          : { kind: "home", nonce: ++nonce },
    });
  },

  standOnPlot: (code) =>
    set({
      mode: "walk",
      popover: null,
      selectedCode: null,
      cameraRequest: { kind: "stand", code, nonce: ++nonce },
    }),

  setColourMode: (colourMode) => set({ colourMode }),

  togglePopover: (p) => set({ popover: get().popover === p ? null : p }),
  closePopover: () => set({ popover: null }),

  setFilters: (patch) => set({ filters: { ...get().filters, ...patch } }),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  setSunHour: (sunHour) => set({ sunHour: Math.min(18.5, Math.max(6, sunHour)) }),
  setSunPlaying: (sunPlaying) => set({ sunPlaying }),
  setHousesVisible: (housesVisible) => set({ housesVisible }),
  setWalkPlotCode: (walkPlotCode) => {
    if (get().walkPlotCode !== walkPlotCode) set({ walkPlotCode });
  },
  requestHome: () => set({ cameraRequest: { kind: "home", nonce: ++nonce } }),
}));
