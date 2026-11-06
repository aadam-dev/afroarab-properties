export type PlotStatus =
  | "available"
  | "held"
  | "reserved"
  | "sold"
  | "unreleased";

export type Plot = {
  id: string;
  projectSlug: string;
  code: string;
  status: PlotStatus;
  widthFt: number;
  depthFt: number;
  areaSqm: number;
  facing: "N" | "E" | "S" | "W";
  isCorner: boolean;
  priceGhs: number;
  roadAccess: string;
  /** Local site coordinates in metres (plan space) */
  polygon: [number, number][];
  statusVersion: number;
};

/** Demo estate: 4×6 grid = 24 plots for interactive MVP */
function gridPolygon(
  col: number,
  row: number,
  w = 12,
  d = 15,
  gap = 2,
  originX = 8,
  originY = 8,
): [number, number][] {
  const x = originX + col * (w + gap);
  const y = originY + row * (d + gap);
  return [
    [x, y],
    [x + w, y],
    [x + w, y + d],
    [x, y + d],
  ];
}

const statuses: PlotStatus[] = [
  "available",
  "available",
  "sold",
  "available",
  "held",
  "available",
  "available",
  "reserved",
  "available",
  "available",
  "sold",
  "available",
  "available",
  "available",
  "held",
  "available",
  "sold",
  "available",
  "available",
  "available",
  "reserved",
  "available",
  "available",
  "unreleased",
];

const facings: Array<Plot["facing"]> = ["N", "E", "S", "W"];
const sizes = [
  { widthFt: 30, depthFt: 40 },
  { widthFt: 40, depthFt: 40 },
  { widthFt: 35, depthFt: 50 },
  { widthFt: 40, depthFt: 50 },
];

export const estateSlugs = [
  "bella-vista",
  "old-ningo-prampram",
  "obeyeyie",
  "santoe",
  "titled-lands-green-valley",
] as const;

export const estateNames: Record<string, string> = {
  "bella-vista": "Bella Vista Luxury Enclave (Prampram Beach Rd)",
  "old-ningo-prampram": "Old Ningo Masterplan (Prampram Coast)",
  obeyeyie: "Lamin's Court & Plots (Obeyeyie - Amasaman)",
  santoe: "Santoe Executive Hills",
  "titled-lands-green-valley": "Green Valley Titled Lands (Greater Accra)",
};

function generateEstatePlots(slug: string, basePrice: number, prefix: string): Plot[] {
  return Array.from({ length: 24 }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const size = sizes[i % sizes.length];
    const areaSqm = Math.round(size.widthFt * size.depthFt * 0.092903);
    const code = prefix ? `${prefix}-${String(i + 1).padStart(2, "0")}` : String(i + 1);
    return {
      id: `${slug}-${i + 1}`,
      projectSlug: slug,
      code,
      status: statuses[(i + slug.length) % statuses.length],
      widthFt: size.widthFt,
      depthFt: size.depthFt,
      areaSqm,
      facing: facings[i % facings.length],
      isCorner: col === 0 || col === 5 || row === 0 || row === 3,
      priceGhs: basePrice + (i % 5) * 12000 + (size.widthFt - 30) * 1500,
      roadAccess: row === 0 || row === 3 ? "12 m Dual Boulevard" : "9 m Paved Residential Street",
      polygon: gridPolygon(col, row),
      statusVersion: 1,
    };
  });
}

export const allEstatePlots: Plot[] = [
  ...generateEstatePlots("titled-lands-green-valley", 85000, ""),
  ...generateEstatePlots("bella-vista", 125000, "BV"),
  ...generateEstatePlots("old-ningo-prampram", 75000, "PR"),
  ...generateEstatePlots("obeyeyie", 95000, "OB"),
  ...generateEstatePlots("santoe", 145000, "ST"),
];

export const demoPlots: Plot[] = allEstatePlots;

export function plotsForProject(slug: string) {
  const matching = demoPlots.filter((p) => p.projectSlug === slug);
  if (matching.length > 0) return matching;
  // If not matched directly, return bella-vista as default
  return demoPlots.filter((p) => p.projectSlug === "bella-vista");
}

export function getPlot(slug: string, code: string) {
  return demoPlots.find((p) => (p.projectSlug === slug || !slug) && p.code === code);
}

export function plotLegend(plots: Plot[]) {
  return {
    available: plots.filter((p) => p.status === "available").length,
    held: plots.filter((p) => p.status === "held").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
    sold: plots.filter((p) => p.status === "sold").length,
    unreleased: plots.filter((p) => p.status === "unreleased").length,
  };
}

export const statusLabel: Record<PlotStatus, string> = {
  available: "Available",
  held: "On hold",
  reserved: "Reserved",
  sold: "Sold",
  unreleased: "Unreleased",
};

export const statusColor: Record<PlotStatus, string> = {
  available: "#00E676",
  held: "#F59E0B",
  reserved: "#FFB300",
  sold: "#374151",
  unreleased: "#4B5563",
};
