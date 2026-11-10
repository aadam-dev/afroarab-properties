import type { Plot, Vec2 } from "./types";

export type RoomKind = "living" | "bed" | "wet" | "kitchen" | "circulation" | "store";

export type Room = {
  id: string;
  label: string;
  kind: RoomKind;
  /** Metres. x runs along the frontage (left to right facing the house), y from the front wall inwards. */
  x: number;
  y: number;
  w: number;
  d: number;
};

export type HouseType = {
  id: "two-bed" | "three-bed" | "four-bed";
  name: string;
  beds: number;
  baths: number;
  widthM: number;
  depthM: number;
  frontSetbackM: number;
  /** x position (house-local metres) of the main door on the front wall. */
  entranceX: number;
  rooms: Room[];
};

export const HOUSE_TYPES: HouseType[] = [
  {
    id: "two-bed",
    name: "2-bedroom bungalow",
    beds: 2,
    baths: 2,
    widthM: 11,
    depthM: 13,
    frontSetbackM: 6,
    entranceX: 3.25,
    rooms: [
      { id: "living", label: "Living", kind: "living", x: 0, y: 0, w: 6.5, d: 5.5 },
      { id: "kitchen", label: "Kitchen", kind: "kitchen", x: 6.5, y: 0, w: 4.5, d: 3.5 },
      { id: "dining", label: "Dining", kind: "living", x: 6.5, y: 3.5, w: 4.5, d: 3.5 },
      { id: "hall", label: "Hall", kind: "circulation", x: 0, y: 5.5, w: 6.5, d: 1.5 },
      { id: "master", label: "Master bed", kind: "bed", x: 0, y: 7, w: 5.5, d: 6 },
      { id: "bath", label: "Bath", kind: "wet", x: 5.5, y: 7, w: 2, d: 3 },
      { id: "ensuite", label: "En-suite", kind: "wet", x: 5.5, y: 10, w: 2, d: 3 },
      { id: "bed2", label: "Bedroom 2", kind: "bed", x: 7.5, y: 7, w: 3.5, d: 6 },
    ],
  },
  {
    id: "three-bed",
    name: "3-bedroom bungalow",
    beds: 3,
    baths: 3,
    widthM: 14,
    depthM: 15,
    frontSetbackM: 6,
    entranceX: 3.5,
    rooms: [
      { id: "living", label: "Living", kind: "living", x: 0, y: 0, w: 7, d: 6 },
      { id: "dining", label: "Dining", kind: "living", x: 7, y: 0, w: 4, d: 4 },
      { id: "kitchen", label: "Kitchen", kind: "kitchen", x: 11, y: 0, w: 3, d: 4 },
      { id: "hall", label: "Hall", kind: "circulation", x: 7, y: 4, w: 4, d: 2 },
      { id: "wc", label: "Guest WC", kind: "wet", x: 11, y: 4, w: 3, d: 2 },
      { id: "master", label: "Master bed", kind: "bed", x: 0, y: 6, w: 5.5, d: 5.5 },
      { id: "ensuite", label: "En-suite", kind: "wet", x: 0, y: 11.5, w: 3, d: 3.5 },
      { id: "closet", label: "Closet", kind: "store", x: 3, y: 11.5, w: 2.5, d: 3.5 },
      { id: "corridor", label: "Corridor", kind: "circulation", x: 5.5, y: 6, w: 1.5, d: 9 },
      { id: "bath", label: "Bath", kind: "wet", x: 7, y: 6, w: 2.5, d: 3 },
      { id: "store", label: "Store", kind: "store", x: 7, y: 9, w: 2.5, d: 1.5 },
      { id: "bed2", label: "Bedroom 2", kind: "bed", x: 9.5, y: 6, w: 4.5, d: 4.5 },
      { id: "bed3", label: "Bedroom 3", kind: "bed", x: 7, y: 10.5, w: 7, d: 4.5 },
    ],
  },
  {
    id: "four-bed",
    name: "4-bedroom bungalow",
    beds: 4,
    baths: 3,
    widthM: 17,
    depthM: 16,
    frontSetbackM: 7,
    entranceX: 3.5,
    rooms: [
      { id: "living", label: "Living", kind: "living", x: 0, y: 0, w: 7, d: 6 },
      { id: "dining", label: "Dining", kind: "living", x: 7, y: 0, w: 4, d: 6 },
      { id: "kitchen", label: "Kitchen", kind: "kitchen", x: 11, y: 0, w: 4, d: 4 },
      { id: "laundry", label: "Laundry", kind: "wet", x: 15, y: 0, w: 2, d: 4 },
      { id: "hall", label: "Hall", kind: "circulation", x: 11, y: 4, w: 4, d: 2 },
      { id: "wc", label: "Guest WC", kind: "wet", x: 15, y: 4, w: 2, d: 2 },
      { id: "master", label: "Master bed", kind: "bed", x: 0, y: 6, w: 6, d: 6 },
      { id: "ensuite", label: "En-suite", kind: "wet", x: 0, y: 12, w: 3, d: 4 },
      { id: "closet", label: "Walk-in", kind: "store", x: 3, y: 12, w: 3, d: 4 },
      { id: "corridor", label: "Corridor", kind: "circulation", x: 6, y: 6, w: 1.5, d: 10 },
      { id: "bed2", label: "Bedroom 2", kind: "bed", x: 7.5, y: 6, w: 4.5, d: 5 },
      { id: "bed3", label: "Bedroom 3", kind: "bed", x: 7.5, y: 11, w: 4.5, d: 5 },
      { id: "passage", label: "Passage", kind: "circulation", x: 12, y: 6, w: 1.5, d: 4 },
      { id: "store", label: "Store", kind: "store", x: 12, y: 10, w: 1.5, d: 6 },
      { id: "bath", label: "Bath", kind: "wet", x: 13.5, y: 6, w: 3.5, d: 3 },
      { id: "bed4", label: "Bedroom 4", kind: "bed", x: 13.5, y: 9, w: 3.5, d: 7 },
    ],
  },
];

export const SQM_TO_SQFT = 10.7639;

export function builtUpSqFt(type: HouseType) {
  return Math.round(type.widthM * type.depthM * SQM_TO_SQFT);
}

export function houseFits(type: HouseType, plot: Pick<Plot, "frontageFt" | "depthFt">) {
  const frontage = plot.frontageFt * 0.3048;
  const depth = plot.depthFt * 0.3048;
  return type.widthM + 6 <= frontage && type.frontSetbackM + type.depthM + 4 <= depth;
}

/**
 * Suggested type by frontage band (70 ft → 2-bed, 80 ft → 3-bed, 100 ft → 4-bed),
 * falling back to the largest type that keeps 3 m side setbacks and a 4 m rear garden.
 */
export function houseTypeForPlot(plot: Pick<Plot, "frontageFt" | "depthFt">): HouseType {
  const preferred =
    plot.frontageFt >= 100 ? "four-bed" : plot.frontageFt >= 80 ? "three-bed" : "two-bed";
  const pick = HOUSE_TYPES.find((t) => t.id === preferred)!;
  if (houseFits(pick, plot)) return pick;
  const fits = HOUSE_TYPES.filter((t) => houseFits(t, plot));
  return fits[fits.length - 1] ?? HOUSE_TYPES[0];
}

/**
 * Frame for placing a house on a plot. Returns a function mapping house-local
 * metres (x along frontage, y inwards from the front wall) to plan coordinates.
 */
export function houseFrame(plot: Pick<Plot, "frontEdge" | "inward">, type: HouseType) {
  const [a, b] = plot.frontEdge;
  const n = plot.inward;
  const u: Vec2 = [n[1], -n[0]];
  const mid: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const origin: Vec2 = [
    mid[0] - u[0] * (type.widthM / 2) + n[0] * type.frontSetbackM,
    mid[1] - u[1] * (type.widthM / 2) + n[1] * type.frontSetbackM,
  ];
  const toPlan = (x: number, y: number): Vec2 => [
    origin[0] + u[0] * x + n[0] * y,
    origin[1] + u[1] * x + n[1] * y,
  ];
  return { origin, u, n, toPlan };
}

/* ------------------------------------------------------------------ */
/* Doors: one per room, to its best neighbour                          */
/* ------------------------------------------------------------------ */

export type Door = {
  a: string;
  b: string;
  /** "h" = on a line of constant y, "v" = constant x (house-local metres). */
  line: "h" | "v";
  at: number;
  center: number;
  width: number;
};

const EPS = 1e-6;

type Shared = { line: "h" | "v"; at: number; lo: number; hi: number };

function sharedEdge(r: Room, o: Room): Shared | null {
  const ox = Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x);
  const oy = Math.min(r.y + r.d, o.y + o.d) - Math.max(r.y, o.y);
  if (Math.abs(r.y - (o.y + o.d)) < EPS && ox > 0) return { line: "h", at: r.y, lo: Math.max(r.x, o.x), hi: Math.min(r.x + r.w, o.x + o.w) };
  if (Math.abs(r.y + r.d - o.y) < EPS && ox > 0) return { line: "h", at: o.y, lo: Math.max(r.x, o.x), hi: Math.min(r.x + r.w, o.x + o.w) };
  if (Math.abs(r.x - (o.x + o.w)) < EPS && oy > 0) return { line: "v", at: r.x, lo: Math.max(r.y, o.y), hi: Math.min(r.y + r.d, o.y + o.d) };
  if (Math.abs(r.x + r.w - o.x) < EPS && oy > 0) return { line: "v", at: o.x, lo: Math.max(r.y, o.y), hi: Math.min(r.y + r.d, o.y + o.d) };
  return null;
}

function priorities(r: Room): RoomKind[] {
  const label = r.label.toLowerCase();
  if (label.includes("en-suite") || label.includes("closet") || label.includes("walk-in")) return ["bed"];
  switch (r.kind) {
    case "bed":
      return ["circulation", "living"];
    case "wet":
      return ["circulation", "living", "kitchen", "bed"];
    case "kitchen":
      return ["living", "circulation"];
    case "store":
      return ["circulation", "kitchen", "living"];
    case "circulation":
      return ["living", "circulation"];
    case "living":
      return r.id === "living" ? [] : ["living"];
  }
}

export function doorsFor(type: HouseType): Door[] {
  const doors: Door[] = [];
  const seen = new Set<string>();
  for (const r of type.rooms) {
    for (const kind of priorities(r)) {
      const match = type.rooms
        .filter((o) => o.id !== r.id && o.kind === kind)
        .map((o) => ({ o, e: sharedEdge(r, o) }))
        .filter((x): x is { o: Room; e: Shared } => Boolean(x.e && x.e.hi - x.e.lo >= 0.9))
        .sort((x, y) => y.e.hi - y.e.lo - (x.e.hi - x.e.lo))[0];
      if (!match) continue;
      const key = [r.id, match.o.id].sort().join("|");
      if (!seen.has(key)) {
        seen.add(key);
        const span = match.e.hi - match.e.lo;
        const open = r.id === "dining" || match.o.id === "dining";
        const width = Math.min(span - 0.2, open ? 2.2 : r.kind === "circulation" ? 1.2 : 0.9);
        doors.push({ a: r.id, b: match.o.id, line: match.e.line, at: match.e.at, center: (match.e.lo + match.e.hi) / 2, width });
      }
      break;
    }
  }
  return doors;
}

export type WallSegment = { x0: number; y0: number; x1: number; y1: number };

/**
 * Wall centre-line segments for a room, inset by half the wall thickness so
 * neighbouring rooms' walls sit side by side instead of overlapping.
 */
export function roomWalls(room: Room, doors: Door[], type: HouseType, thickness: number): WallSegment[] {
  const t = thickness / 2;
  const mine = doors.filter((d) => d.a === room.id || d.b === room.id);
  const entrance = room.id === "living" ? [{ line: "h" as const, at: 0, center: type.entranceX, width: 1.2 }] : [];
  const gaps = [...mine, ...entrance];
  const edges: Array<{ line: "h" | "v"; at: number; inset: number; lo: number; hi: number }> = [
    { line: "h", at: room.y, inset: room.y + t, lo: room.x, hi: room.x + room.w },
    { line: "h", at: room.y + room.d, inset: room.y + room.d - t, lo: room.x, hi: room.x + room.w },
    { line: "v", at: room.x, inset: room.x + t, lo: room.y, hi: room.y + room.d },
    { line: "v", at: room.x + room.w, inset: room.x + room.w - t, lo: room.y, hi: room.y + room.d },
  ];
  const out: WallSegment[] = [];
  for (const e of edges) {
    const cuts = gaps
      .filter((g) => g.line === e.line && Math.abs(g.at - e.at) < EPS)
      .map((g) => [g.center - g.width / 2, g.center + g.width / 2] as const)
      .sort((a, b) => a[0] - b[0]);
    let cursor = e.lo;
    const pieces: Array<[number, number]> = [];
    for (const [c0, c1] of cuts) {
      if (c0 > cursor + 0.05) pieces.push([cursor, c0]);
      cursor = Math.max(cursor, c1);
    }
    if (e.hi > cursor + 0.05) pieces.push([cursor, e.hi]);
    for (const [p0, p1] of pieces) {
      out.push(
        e.line === "h"
          ? { x0: p0, y0: e.inset, x1: p1, y1: e.inset }
          : { x0: e.inset, y0: p0, x1: e.inset, y1: p1 },
      );
    }
  }
  return out;
}

/** Format metres as feet-and-inches, e.g. 3.5 → 11′6″. */
export function feetInches(m: number) {
  const totalIn = Math.round(m / 0.0254);
  const ft = Math.floor(totalIn / 12);
  const inch = totalIn % 12;
  return `${ft}′${inch}″`;
}
