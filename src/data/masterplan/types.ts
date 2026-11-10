/**
 * Masterplan model: one record per plot drives the 3D scene, the plan view,
 * the plot panel, filters, admin and enquiry attribution.
 *
 * Plan space is metres with x = east and y = north. The 3D scene maps a plan
 * point (x, y) to world (x, height, -y) so that -Z is true north.
 */

export type Vec2 = [number, number];

export type PlotStatus = "available" | "held" | "reserved" | "sold" | "unreleased";

export type Compass8 = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export type Rect = { x0: number; y0: number; x1: number; y1: number };

export type FrontageSide = "front" | "left" | "right" | "back";

export type RoadFrontage = {
  roadId: string;
  side: FrontageSide;
  facing: Compass8;
};

export type DocumentStatus = "ready" | "in_progress" | "on_request";

export type PlotDocument = {
  key: "indenture" | "site_plan" | "search" | "land_title";
  label: string;
  status: DocumentStatus;
};

export type Plot = {
  id: string;
  projectSlug: string;
  /** Display number, e.g. "14". Searchable and used in ?plot= links. */
  code: string;
  number: number;
  block: string;
  phase: 1 | 2;
  status: PlotStatus;
  statusVersion: number;

  frontageFt: number;
  depthFt: number;
  /** Alias of frontageFt kept for admin and older call sites. */
  widthFt: number;
  areaSqFt: number;
  areaSqm: number;

  /** Direction the main frontage faces (from the plot towards its road). */
  facing: Compass8;
  frontages: RoadFrontage[];
  isCorner: boolean;
  onMainRoad: boolean;
  roadAccess: string;

  ratePerSqFtGhs: number;
  priceGhs: number;

  /** CCW rectangle in plan metres. */
  polygon: Vec2[];
  centroid: Vec2;
  /** Frontage edge endpoints, ordered so that (u, inward) is right-handed. */
  frontEdge: [Vec2, Vec2];
  /** Unit vector pointing from the frontage into the plot. */
  inward: Vec2;

  titleStatus: "registered" | "in_process";
  documents: PlotDocument[];
};

export type Road = {
  id: string;
  name: string;
  widthM: number;
  kind: "boulevard" | "street";
  rect: Rect;
};

export type Amenity = {
  id: string;
  kind: "park" | "community" | "gatehouse" | "green";
  label: string;
  rect: Rect;
};

export type TreeInstance = {
  position: Vec2;
  scale: number;
  kind: "broadleaf" | "palm" | "shrub";
};

export type Estate = {
  slug: string;
  name: string;
  shortName: string;
  monogram: string;
  location: string;
  lat: number;
  lng: number;
  /** Clockwise degrees from plan +y to true north. 0 means plan-up is north. */
  trueNorthDeg: number;
  width: number;
  height: number;
  boundary: Vec2[];
  gate: { x: number; y: number; widthM: number };
  roads: Road[];
  plots: Plot[];
  amenities: Amenity[];
  trees: TreeInstance[];
  lamps: Vec2[];
  /** True until a surveyed layout replaces the generated one. */
  indicative: boolean;
};
