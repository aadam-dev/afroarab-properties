import { create } from "zustand";

export type FloorLevel = "ground" | "upper" | "terrace";
export type RoomFinish = "marble" | "hardwood";
export type RoomLighting = "daylight" | "sunset" | "ambient";

export interface RoomHotspot {
  id: string;
  name: string;
  level: FloorLevel;
  dimensions: string;
  areaSqft: number;
  ceilingHeight: string;
  description: string;
  highlights: string[];
  hotspotCoords: { x: number; y: number }; // percentage 0-100% on floor plan
  previewImage: string;
}

export const ROOM_HOTSPOTS: RoomHotspot[] = [
  {
    id: "living-salon",
    name: "Grand Living & Dining Salon",
    level: "ground",
    dimensions: "26'4\" × 18'2\"",
    areaSqft: 478,
    ceilingHeight: "10'6\" Coffered",
    description:
      "Expansive reception gallery opening directly onto the private landscaped veranda with floor-to-ceiling double-glazed solar attenuation glass.",
    highlights: [
      "Custom Italian recessed architectural downlighting",
      "Concealed Daikin VRV climate management",
      "Seamless indoor-to-veranda acoustic threshold",
    ],
    hotspotCoords: { x: 38, y: 44 },
    previewImage: "/images/hero-lamins.jpg",
  },
  {
    id: "chef-kitchen",
    name: "Poliform Chef's Culinary Suite",
    level: "ground",
    dimensions: "16'8\" × 14'0\"",
    areaSqft: 233,
    ceilingHeight: "10'0\"",
    description:
      "Precision-crafted culinary kitchen featuring waterfall stone countertops, integrated German appliances, and discrete pantry access.",
    highlights: [
      "Integrated induction cooktop & extractor",
      "Dual refrigeration & concealed wine vault",
      "Soft-touch matte cabinetry with bronze hardware",
    ],
    hotspotCoords: { x: 74, y: 35 },
    previewImage: "/images/projects/estate-6.jpeg",
  },
  {
    id: "master-sanctuary",
    name: "Executive Master Sanctuary",
    level: "upper",
    dimensions: "22'0\" × 16'6\"",
    areaSqft: 363,
    ceilingHeight: "10'2\"",
    description:
      "Private retreat spanning the entire southern wing with a dedicated dressing galleria, private morning balcony, and five-fixture en-suite spa.",
    highlights: [
      "Freestanding soaking tub & rain shower chamber",
      "Bespoke walk-in dressing wardrobe",
      "Sunrise-oriented panoramic private terrace",
    ],
    hotspotCoords: { x: 42, y: 40 },
    previewImage: "/images/projects/lamins-court-2.jpg",
  },
  {
    id: "junior-suite",
    name: "VIP Guest Suite 2",
    level: "upper",
    dimensions: "15'4\" × 13'8\"",
    areaSqft: 210,
    ceilingHeight: "9'8\"",
    description:
      "Generously proportioned bedroom with dedicated en-suite bath, custom wardrobes, and landscaped courtyard vistas.",
    highlights: [
      "Integrated European porcelain bath",
      "Acoustically insulated partition walling",
      "High-speed optical fiber point",
    ],
    hotspotCoords: { x: 72, y: 62 },
    previewImage: "/images/projects/estate-8.jpeg",
  },
  {
    id: "sky-lounge",
    name: "Rooftop Sky Lounge & Observatory",
    level: "terrace",
    dimensions: "32'0\" × 20'4\"",
    areaSqft: 650,
    ceilingHeight: "Open Sky / Pergola 11'0\"",
    description:
      "Private entertainer's terrace overlooking the coastal Prampram horizon or Amasaman green ridges, equipped with outdoor barbecue connections and lounge pergola.",
    highlights: [
      "Weather-treated African Teak pergolas",
      "Outdoor sound & ambient mood lighting system",
      "Reinforced footprint ready for private spa pool",
    ],
    hotspotCoords: { x: 50, y: 48 },
    previewImage: "/images/projects/front-view.jpg",
  },
];

interface FloorPlanStoreState {
  activeLevel: FloorLevel;
  activeRoomId: string | null;
  activeFinish: RoomFinish;
  activeLighting: RoomLighting;
  isInspectionModalOpen: boolean;

  // Actions
  setLevel: (level: FloorLevel) => void;
  inspectRoom: (roomId: string) => void;
  closeInspection: () => void;
  setFinish: (finish: RoomFinish) => void;
  setLighting: (lighting: RoomLighting) => void;
}

export const useFloorPlanStore = create<FloorPlanStoreState>((set) => ({
  activeLevel: "ground",
  activeRoomId: "living-salon",
  activeFinish: "marble",
  activeLighting: "daylight",
  isInspectionModalOpen: false,

  setLevel: (activeLevel) =>
    set((state) => {
      // Pick first room in that level if current room is not in that level
      const matching = ROOM_HOTSPOTS.filter((r) => r.level === activeLevel);
      const nextRoomId = matching.some((r) => r.id === state.activeRoomId)
        ? state.activeRoomId
        : (matching[0]?.id ?? null);
      return { activeLevel, activeRoomId: nextRoomId };
    }),

  inspectRoom: (activeRoomId) =>
    set({
      activeRoomId,
      isInspectionModalOpen: true,
    }),

  closeInspection: () => set({ isInspectionModalOpen: false }),

  setFinish: (activeFinish) => set({ activeFinish }),

  setLighting: (activeLighting) => set({ activeLighting }),
}));
