import * as THREE from "three";
import * as SunCalc from "suncalc";
import type { Compass8, Vec2 } from "@/data/masterplan";

/** Plan (x east, y north) → world (x, h, -y). */
export function toWorld(p: Vec2, h = 0): [number, number, number] {
  return [p[0], h, -p[1]];
}

/**
 * Y-rotation that turns a flat, upright-reading label so its "up" points along a
 * plan-space direction. A label with rotation 0 reads with north up.
 */
export function yawForPlanDir(dx: number, dy: number) {
  return Math.atan2(-dx, dy);
}

export const palette = {
  sky: "#cfe0e6",
  skyDusk: "#e9c7a3",
  fog: "#d7e3df",
  grassOuter: "#89a65e",
  grassOuterDark: "#6f8a4a",
  lawn: "#a0bd78",
  parkLawn: "#93bf68",
  laterite: "#b77b4f",
  plotNatural: "#a9b773",
  plotNaturalAlt: "#b99a6b",
  asphalt: "#43464b",
  asphaltLight: "#55585d",
  marking: "#efe4c4",
  kerb: "#d8d2c4",
  median: "#7da153",
  wall: "#ece4d6",
  wallCap: "#b8a88d",
  roofRed: "#9b3326",
  concrete: "#d9d3c7",
  gold: "#c9a85a",
  goldDeep: "#8a6828",
  trunk: "#6e4b33",
  leaf: "#4f7a39",
  leafLight: "#6b9447",
  palmLeaf: "#5e8a3a",
  house: "#f2ece2",
  houseRoof: "#7d4a3a",
  dimmed: "#a7a596",
} as const;

export const roomFloor: Record<string, string> = {
  living: "#e9dcc6",
  bed: "#d9c3a5",
  wet: "#c9dbe0",
  kitchen: "#e6d3b0",
  circulation: "#efe7da",
  store: "#d8d1c4",
};

export const COMPASS_WORDS: Record<Compass8, string> = {
  N: "North",
  NE: "North-east",
  E: "East",
  SE: "South-east",
  S: "South",
  SW: "South-west",
  W: "West",
  NW: "North-west",
};

/* ------------------------------------------------------------------ */
/* Painted text labels (canvas textures, no external font fetch)       */
/* ------------------------------------------------------------------ */

export type LabelStyle = {
  /** CSS font weight */
  weight?: number;
  /** Pixel size of the first line on the canvas */
  size?: number;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Second line, smaller */
  sub?: string;
  subColor?: string;
  letterSpacing?: number;
  uppercase?: boolean;
};

const labelCache = new Map<string, { texture: THREE.CanvasTexture; aspect: number }>();

function fontFamily() {
  if (typeof window === "undefined") return "system-ui, sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-manrope").trim();
  return v ? `${v}, system-ui, sans-serif` : "system-ui, sans-serif";
}

export function labelTexture(text: string, style: LabelStyle = {}) {
  const key = JSON.stringify([text, style]);
  const hit = labelCache.get(key);
  if (hit) return hit;

  const {
    weight = 800,
    size = 96,
    color = "#ffffff",
    stroke,
    strokeWidth = 10,
    sub,
    subColor = color,
    letterSpacing = 0,
    uppercase = false,
  } = style;
  const family = fontFamily();
  const main = uppercase ? text.toUpperCase() : text;
  const subSize = Math.round(size * 0.36);
  const pad = Math.ceil(size * 0.2 + (stroke ? strokeWidth : 0));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${weight} ${size}px ${family}`;
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
  const mainW = ctx.measureText(main).width;
  ctx.font = `700 ${subSize}px ${family}`;
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${Math.round(subSize * 0.12)}px`;
  const subW = sub ? ctx.measureText(sub).width : 0;

  const w = Math.ceil(Math.max(mainW, subW) + pad * 2);
  const h = Math.ceil(size * 1.05 + (sub ? subSize * 1.35 : 0) + pad * 2);
  canvas.width = w;
  canvas.height = h;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.font = `${weight} ${size}px ${family}`;
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
  const mainY = pad + size * 0.55;
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(main, w / 2, mainY);
  }
  ctx.fillStyle = color;
  ctx.fillText(main, w / 2, mainY);

  if (sub) {
    ctx.font = `700 ${subSize}px ${family}`;
    if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${Math.round(subSize * 0.12)}px`;
    const subY = pad + size * 1.05 + subSize * 0.62;
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth * 0.6;
      ctx.strokeText(sub, w / 2, subY);
    }
    ctx.fillStyle = subColor;
    ctx.fillText(sub, w / 2, subY);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  const out = { texture, aspect: w / h };
  labelCache.set(key, out);
  return out;
}

/* ------------------------------------------------------------------ */
/* Sun                                                                  */
/* ------------------------------------------------------------------ */

/** Date for "today" at a local solar hour in Accra (UTC+0). */
export function accraDate(hour: number, base = new Date()) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), h, m));
}

export type SunState = {
  /** Unit vector in world space pointing towards the sun. */
  dir: THREE.Vector3;
  altitudeDeg: number;
  bearingDeg: number;
  compass: Compass8;
};

const COMPASS8: Compass8[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function sunState(hour: number, lat: number, lng: number, trueNorthDeg = 0): SunState {
  const pos = SunCalc.getPosition(accraDate(hour), lat, lng);
  // suncalc 2.x: azimuth in degrees clockwise from north, altitude in degrees.
  const bearing = ((pos.azimuth % 360) + 360) % 360;
  const planBearing = ((bearing - trueNorthDeg) * Math.PI) / 180;
  const alt = (pos.altitude * Math.PI) / 180;
  const dir = new THREE.Vector3(
    Math.sin(planBearing) * Math.cos(alt),
    Math.sin(alt),
    -Math.cos(planBearing) * Math.cos(alt),
  ).normalize();
  return {
    dir,
    altitudeDeg: (alt * 180) / Math.PI,
    bearingDeg: bearing,
    compass: COMPASS8[Math.round(bearing / 45) % 8],
  };
}

export function sunTimes(lat: number, lng: number) {
  const t = SunCalc.getTimes(new Date(), lat, lng);
  const toHour = (d: Date | null, fallback: number) => (d ? d.getUTCHours() + d.getUTCMinutes() / 60 : fallback);
  return { sunrise: toHour(t.sunrise, 6), sunset: toHour(t.sunset, 18), noon: toHour(t.solarNoon, 12) };
}

export function formatHour(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m === 60 ? 0 : m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/* ------------------------------------------------------------------ */
/* Heading bus: camera heading for the compass/minimap without React   */
/* re-renders every frame.                                             */
/* ------------------------------------------------------------------ */

type HeadingListener = (headingDeg: number, pos: Vec2) => void;
const headingListeners = new Set<HeadingListener>();
let lastHeading = 0;
let lastPos: Vec2 = [0, 0];

export const headingBus = {
  emit(headingDeg: number, pos: Vec2) {
    if (Math.abs(headingDeg - lastHeading) < 0.05 && Math.abs(pos[0] - lastPos[0]) < 0.02 && Math.abs(pos[1] - lastPos[1]) < 0.02) return;
    lastHeading = headingDeg;
    lastPos = pos;
    headingListeners.forEach((l) => l(headingDeg, pos));
  },
  subscribe(l: HeadingListener) {
    headingListeners.add(l);
    l(lastHeading, lastPos);
    return () => {
      headingListeners.delete(l);
    };
  },
};

/** Joystick input shared between the DOM joystick and the walk controller. */
export const walkInput = { x: 0, y: 0, target: null as Vec2 | null, teleport: null as Vec2 | null };
