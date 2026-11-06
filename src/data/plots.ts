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

export const demoPlots: Plot[] = Array.from({ length: 24 }, (_, i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const size = sizes[i % sizes.length];
  const areaSqm = Math.round(size.widthFt * size.depthFt * 0.092903);
  return {
    id: `demo-${i + 1}`,
    projectSlug: "titled-lands-green-valley",
    code: String(i + 1),
    status: statuses[i],
    widthFt: size.widthFt,
    depthFt: size.depthFt,
    areaSqm,
    facing: facings[i % facings.length],
    isCorner: col === 0 || col === 5 || row === 0 || row === 3,
    priceGhs: 85000 + (i % 5) * 15000 + (size.widthFt - 30) * 1200,
    roadAccess: row === 0 || row === 3 ? "9 m internal road" : "7.5 m access road",
    polygon: gridPolygon(col, row),
    statusVersion: 1,
  };
});

export function plotsForProject(slug: string) {
  return demoPlots.filter((p) => p.projectSlug === slug);
}

export function getPlot(slug: string, code: string) {
  return demoPlots.find((p) => p.projectSlug === slug && p.code === code);
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
  available: "#1f7a4c",
  held: "#c47b1a",
  reserved: "#b45309",
  sold: "#9b1c1c",
  unreleased: "#6e675d",
};
