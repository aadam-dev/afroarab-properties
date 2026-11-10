import type {
  Amenity,
  Compass8,
  Estate,
  FrontageSide,
  Plot,
  PlotDocument,
  PlotStatus,
  Rect,
  Road,
  RoadFrontage,
  TreeInstance,
  Vec2,
} from "./types";

/**
 * Deterministic, illustrative masterplan.
 *
 * Geometry follows common Greater Accra estate practice: 100 ft deep plots
 * with 70, 80 and 100 ft frontages, double-loaded blocks on 9 m streets, and a
 * 12 m boulevard from the gate. Facing, corner and main-road flags are derived
 * from the geometry, never assigned by hand. Replace with surveyed polygons when
 * the client's masterplan is ingested; the Plot shape stays the same.
 */

export const FT = 0.3048;

const PLOT_DEPTH_FT = 100;
const SIDE_LENGTH_FT = 400;
const BOULEVARD_W = 12;
const STREET_W = 9;
const AMENITY_BAND = 46;
const NORTH_BUFFER = 14;
const BLOCKS = 3;
const BASE_RATE_GHS_PER_SQFT = 12.5;

/** Frontage patterns (ft) from the boulevard outwards. Each sums to SIDE_LENGTH_FT. */
const ROW_PATTERNS: number[][] = [
  [100, 80, 70, 70, 80],
  [80, 80, 80, 80, 80],
  [100, 100, 100, 100],
  [70, 70, 80, 80, 100],
  [100, 70, 70, 80, 80],
  [80, 70, 100, 70, 80],
];

const STREET_NAMES = ["Akwaaba Street", "Sankofa Street", "Adinkra Street", "Ananse Street"];
const BLOCK_LETTERS = ["A", "B", "C"];

/** Small seeded PRNG so the layout and statuses are identical on server and client. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMPASS: Compass8[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/** Compass point for a plan-space direction, after applying true-north rotation. */
export function compassFor(dx: number, dy: number, trueNorthDeg = 0): Compass8 {
  const bearing = ((Math.atan2(dx, dy) * 180) / Math.PI + trueNorthDeg + 360) % 360;
  return COMPASS[Math.round(bearing / 45) % 8];
}

const EPS = 0.01;

function edgeTouchesRect(a: Vec2, b: Vec2, r: Rect) {
  const horizontal = Math.abs(a[1] - b[1]) < EPS;
  if (horizontal) {
    const y = a[1];
    if (Math.abs(y - r.y0) > EPS && Math.abs(y - r.y1) > EPS) return false;
    const lo = Math.min(a[0], b[0]);
    const hi = Math.max(a[0], b[0]);
    return Math.min(hi, r.x1) - Math.max(lo, r.x0) > 0.5;
  }
  const x = a[0];
  if (Math.abs(x - r.x0) > EPS && Math.abs(x - r.x1) > EPS) return false;
  const lo = Math.min(a[1], b[1]);
  const hi = Math.max(a[1], b[1]);
  return Math.min(hi, r.y1) - Math.max(lo, r.y0) > 0.5;
}

function sideFor(dir: Vec2, u: Vec2, n: Vec2): FrontageSide {
  const du = dir[0] * u[0] + dir[1] * u[1];
  const dn = dir[0] * n[0] + dir[1] * n[1];
  if (Math.abs(dn) >= Math.abs(du)) return dn < 0 ? "front" : "back";
  return du > 0 ? "right" : "left";
}

export function frontagesFor(
  polygon: Vec2[],
  inward: Vec2,
  roads: Road[],
  trueNorthDeg: number,
): RoadFrontage[] {
  const c: Vec2 = [
    polygon.reduce((s, p) => s + p[0], 0) / polygon.length,
    polygon.reduce((s, p) => s + p[1], 0) / polygon.length,
  ];
  const u: Vec2 = [inward[1], -inward[0]];
  const out: RoadFrontage[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    for (const road of roads) {
      if (!edgeTouchesRect(a, b, road.rect)) continue;
      const mid: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const dir: Vec2 = [mid[0] - c[0], mid[1] - c[1]];
      out.push({
        roadId: road.id,
        side: sideFor(dir, u, inward),
        facing: compassFor(dir[0], dir[1], trueNorthDeg),
      });
    }
  }
  const order: Record<FrontageSide, number> = { front: 0, left: 1, right: 1, back: 2 };
  return out.sort((x, y) => order[x.side] - order[y.side]);
}

function pickStatus(rand: number): PlotStatus {
  if (rand < 0.6) return "available";
  if (rand < 0.7) return "reserved";
  if (rand < 0.76) return "held";
  return "sold";
}

function documentsFor(
  status: PlotStatus,
  phase: 1 | 2,
  titleStatus: Plot["titleStatus"],
  rand: number,
): PlotDocument[] {
  if (phase === 2) {
    return [
      { key: "indenture", label: "Indenture", status: "on_request" },
      { key: "site_plan", label: "Site plan (Lands Commission)", status: "in_progress" },
      { key: "search", label: "Official search report", status: "on_request" },
      { key: "land_title", label: "Land title certificate", status: "in_progress" },
    ];
  }
  return [
    { key: "indenture", label: "Indenture", status: "ready" },
    {
      key: "site_plan",
      label: "Site plan (Lands Commission)",
      status: status === "sold" || status === "reserved" || rand < 0.7 ? "ready" : "in_progress",
    },
    { key: "search", label: "Official search report", status: "on_request" },
    {
      key: "land_title",
      label: "Land title certificate",
      status: titleStatus === "registered" ? "ready" : "in_progress",
    },
  ];
}

function rect(x0: number, y0: number, x1: number, y1: number): Rect {
  return { x0, y0, x1, y1 };
}

function inRect(p: Vec2, r: Rect, pad = 0) {
  return p[0] > r.x0 - pad && p[0] < r.x1 + pad && p[1] > r.y0 - pad && p[1] < r.y1 + pad;
}

export function generateEstate(): Estate {
  const rng = mulberry32(20261110);
  const trueNorthDeg = 0;

  const D = PLOT_DEPTH_FT * FT;
  const L = SIDE_LENGTH_FT * FT;
  const W = BOULEVARD_W + 2 * L;
  const cx = W / 2;
  const yStreet = (i: number) => AMENITY_BAND + i * (STREET_W + 2 * D);
  const roadTop = yStreet(BLOCKS) + STREET_W;
  const H = roadTop + NORTH_BUFFER;

  const roads: Road[] = [
    {
      id: "boulevard",
      name: "Green Valley Boulevard",
      widthM: BOULEVARD_W,
      kind: "boulevard",
      rect: rect(cx - BOULEVARD_W / 2, 0, cx + BOULEVARD_W / 2, roadTop),
    },
    ...Array.from({ length: BLOCKS + 1 }, (_, i): Road => ({
      id: `street-${i + 1}`,
      name: STREET_NAMES[i],
      widthM: STREET_W,
      kind: "street",
      rect: rect(0, yStreet(i), W, yStreet(i) + STREET_W),
    })),
    {
      id: "approach",
      name: "Estate approach",
      widthM: BOULEVARD_W,
      kind: "boulevard",
      rect: rect(cx - BOULEVARD_W / 2, -46, cx + BOULEVARD_W / 2, 0),
    },
    {
      id: "trunk",
      name: "Prampram–Old Ningo Road",
      widthM: 14,
      kind: "boulevard",
      rect: rect(-260, -60, W + 260, -46),
    },
  ];
  const estateRoads = roads.filter((r) => r.id === "boulevard" || r.id.startsWith("street"));
  const roadName = (id: string) => roads.find((r) => r.id === id);

  type Draft = Omit<Plot, "number" | "code" | "id"> & { sortY: number; sortX: number };
  const drafts: Draft[] = [];

  for (let b = 0; b < BLOCKS; b++) {
    const by0 = yStreet(b) + STREET_W;
    const rows: Array<{ y0: number; y1: number; inward: Vec2 }> = [
      { y0: by0, y1: by0 + D, inward: [0, 1] },
      { y0: by0 + D, y1: by0 + 2 * D, inward: [0, -1] },
    ];
    for (const row of rows) {
      for (const side of ["west", "east"] as const) {
        const pattern = ROW_PATTERNS[Math.floor(rng() * ROW_PATTERNS.length)];
        let cursor = 0;
        for (const frontageFt of pattern) {
          const f = frontageFt * FT;
          const x0 = side === "east" ? cx + BOULEVARD_W / 2 + cursor : cx - BOULEVARD_W / 2 - cursor - f;
          const x1 = x0 + f;
          cursor += f;

          const polygon: Vec2[] = [
            [x0, row.y0],
            [x1, row.y0],
            [x1, row.y1],
            [x0, row.y1],
          ];
          const frontEdge: [Vec2, Vec2] =
            row.inward[1] > 0
              ? [
                  [x0, row.y0],
                  [x1, row.y0],
                ]
              : [
                  [x1, row.y1],
                  [x0, row.y1],
                ];
          const frontages = frontagesFor(polygon, row.inward, estateRoads, trueNorthDeg);
          const main = frontages.find((fr) => fr.side === "front") ?? frontages[0];
          const isCorner = frontages.length >= 2;
          const onMainRoad = frontages.some((fr) => fr.roadId === "boulevard");
          const facesAmenities = b === 0 && row.inward[1] > 0;

          const phase: 1 | 2 = b === BLOCKS - 1 && side === "east" ? 2 : 1;
          const statusRand = rng();
          const status: PlotStatus = phase === 2 ? "unreleased" : pickStatus(statusRand);

          const areaSqFt = frontageFt * PLOT_DEPTH_FT;
          const rawRate =
            BASE_RATE_GHS_PER_SQFT *
            (isCorner ? 1.1 : 1) *
            (onMainRoad ? 1.06 : 1) *
            (facesAmenities ? 1.04 : 1);
          const ratePerSqFtGhs = Math.round(rawRate * 4) / 4;
          const priceGhs = Math.round((areaSqFt * ratePerSqFtGhs) / 500) * 500;
          const titleStatus: Plot["titleStatus"] = rng() < 0.72 ? "registered" : "in_process";

          const access = frontages
            .map((fr) => {
              const road = roadName(fr.roadId);
              return road ? `${road.widthM} m ${road.name}` : fr.roadId;
            })
            .join(" + ");

          drafts.push({
            projectSlug: "titled-lands-green-valley",
            block: `Block ${BLOCK_LETTERS[b]}`,
            phase,
            status,
            statusVersion: 1,
            frontageFt,
            depthFt: PLOT_DEPTH_FT,
            widthFt: frontageFt,
            areaSqFt,
            areaSqm: Math.round(areaSqFt * FT * FT * 10) / 10,
            facing: main?.facing ?? "N",
            frontages,
            isCorner,
            onMainRoad,
            roadAccess: access,
            ratePerSqFtGhs,
            priceGhs,
            polygon,
            centroid: [(x0 + x1) / 2, (row.y0 + row.y1) / 2],
            frontEdge,
            inward: row.inward,
            titleStatus,
            documents: documentsFor(status, phase, titleStatus, rng()),
            sortY: row.y0,
            sortX: x0,
          });
        }
      }
    }
  }

  // Number left-to-right, bottom-to-top so numbers read naturally on the plan.
  drafts.sort((a, b) => a.sortY - b.sortY || a.sortX - b.sortX);
  const plots: Plot[] = drafts.map(({ sortX: _sx, sortY: _sy, ...d }, i) => {
    void _sx;
    void _sy;
    return {
      ...d,
      id: `green-valley-${i + 1}`,
      number: i + 1,
      code: String(i + 1),
    };
  });

  const amenities: Amenity[] = [
    { id: "gatehouse", kind: "gatehouse", label: "Gatehouse", rect: rect(cx - 17, 2, cx - 9, 8) },
    {
      id: "park",
      kind: "park",
      label: "Children's park",
      rect: rect(8, 6, cx - 22, AMENITY_BAND - 5),
    },
    {
      id: "community",
      kind: "community",
      label: "Community centre (future)",
      rect: rect(cx + 14, 6, W - 8, AMENITY_BAND - 5),
    },
    {
      id: "buffer",
      kind: "green",
      label: "Landscaped buffer",
      rect: rect(0, roadTop, W, H),
    },
  ];

  const intersections = roads
    .filter((r) => r.id.startsWith("street"))
    .map((r) => r.rect);

  const lamps: Vec2[] = [];
  for (let y = 10; y < roadTop; y += 24) {
    if (intersections.some((r) => y > r.y0 - 4 && y < r.y1 + 4)) continue;
    lamps.push([cx - BOULEVARD_W / 2 - 0.6, y], [cx + BOULEVARD_W / 2 + 0.6, y]);
  }
  for (const r of intersections) {
    for (let x = 14; x < W; x += 32) {
      if (Math.abs(x - cx) < 14) continue;
      lamps.push([x, r.y0 - 0.6]);
    }
  }

  const trees: TreeInstance[] = [];
  // Palms on the boulevard median, gate to buffer.
  for (let y = 6; y < roadTop; y += 14) {
    if (intersections.some((r) => y > r.y0 - 3 && y < r.y1 + 3)) continue;
    trees.push({ position: [cx, y], scale: 0.9 + rng() * 0.3, kind: "palm" });
  }
  // Approach avenue palms.
  for (let y = -40; y < -2; y += 10) {
    trees.push({ position: [cx - BOULEVARD_W / 2 - 2, y], scale: 1, kind: "palm" });
    trees.push({ position: [cx + BOULEVARD_W / 2 + 2, y], scale: 1, kind: "palm" });
  }
  // Park and community green.
  const park = amenities[1].rect;
  for (let i = 0; i < 16; i++) {
    const p: Vec2 = [park.x0 + 3 + rng() * (park.x1 - park.x0 - 6), park.y0 + 3 + rng() * (park.y1 - park.y0 - 6)];
    const centre: Vec2 = [(park.x0 + park.x1) / 2, (park.y0 + park.y1) / 2];
    if (Math.hypot(p[0] - centre[0], p[1] - centre[1]) < 11) continue;
    trees.push({ position: p, scale: 0.8 + rng() * 0.5, kind: rng() < 0.35 ? "shrub" : "broadleaf" });
  }
  const community = amenities[2].rect;
  for (let x = community.x0 + 4; x < community.x1; x += 11) {
    trees.push({ position: [x, community.y0 + 2], scale: 0.85, kind: "broadleaf" });
  }
  // Buffer row along the north wall.
  for (let x = 6; x < W; x += 11) {
    trees.push({ position: [x + rng() * 3, roadTop + NORTH_BUFFER / 2 + (rng() - 0.5) * 4], scale: 0.9 + rng() * 0.4, kind: "broadleaf" });
  }
  // Surrounding bush for context, kept off the boundary, the approach and the trunk road.
  const keepOut = [rect(-6, -6, W + 6, H + 6), roads.find((r) => r.id === "approach")!.rect, roads.find((r) => r.id === "trunk")!.rect];
  let placed = 0;
  let guard = 0;
  while (placed < 170 && guard < 4000) {
    guard++;
    const p: Vec2 = [-90 + rng() * (W + 180), -110 + rng() * (H + 190)];
    if (keepOut.some((r) => inRect(p, r, 3))) continue;
    trees.push({ position: p, scale: 0.8 + rng() * 0.8, kind: rng() < 0.2 ? "palm" : rng() < 0.3 ? "shrub" : "broadleaf" });
    placed++;
  }

  return {
    slug: "titled-lands-green-valley",
    name: "Green Valley Estate",
    shortName: "Green Valley",
    monogram: "GV",
    location: "Greater Accra",
    lat: 5.7167,
    lng: 0.1,
    trueNorthDeg,
    width: W,
    height: H,
    boundary: [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ],
    gate: { x: cx, y: 0, widthM: BOULEVARD_W },
    roads,
    plots,
    amenities,
    trees,
    lamps,
    indicative: true,
  };
}
