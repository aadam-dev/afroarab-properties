import laminsCourt from "./lamins-court.meta.json";

/** Rectangle in three.js plan space: [minX, minZ, maxX, maxZ]. */
export type Rect3 = [number, number, number, number];
export type Pose = { pos: [number, number]; facing: [number, number] };

export type HouseRoom = {
  id: string;
  name: string;
  level: string;
  areaSqm: number;
  areaSqft: number;
  size: string;
  evidence: string;
  note: string;
  ffl: number;
  ceiling: number;
  /** Floor centre in three.js space. */
  center: [number, number, number];
};

export type HousePhoto = {
  id: string;
  file: string;
  shows: string;
  pos: [number, number, number];
  target: [number, number, number];
  lensMm: number;
};

export type HouseMeta = {
  slug: string;
  name: string;
  summary: string;
  levels: { id: string; name: string; ffl: number; ceiling: number }[];
  rooms: HouseRoom[];
  photos: HousePhoto[];
  anchors: { what: string; value: string; usedFor: string }[];
  evidence: { fromPhotos: string[]; inferred: string[] };
  walk: {
    levels: Record<string, Rect3[]>;
    exclude: { level: string; rect: Rect3 }[];
    eye: number;
    start?: Pose;
    stair?: { bottomZone: Rect3; topZone: Rect3; bottomPose: Pose; topPose: Pose };
  };
};

export type HouseModel = {
  /** GLB built by tools/house3d/build_house.py. */
  model: string;
  meta: HouseMeta;
};

const houses: Record<string, HouseModel> = {
  "lamins-court": { model: "/models/houses/lamins-court.glb", meta: laminsCourt as unknown as HouseMeta },
};

export function getHouse(slug: string): HouseModel | undefined {
  return houses[slug];
}

export const houseSlugs = Object.keys(houses);

/** Vertical field of view for a lens on a 36 x 24 mm frame. */
export function lensToFov(lensMm: number) {
  return (2 * Math.atan(12 / lensMm) * 180) / Math.PI;
}
