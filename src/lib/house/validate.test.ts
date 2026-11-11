import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateHouse } from "../../../tools/house3d/validate.mjs";
import meta from "@/data/houses/lamins-court.meta.json";

const specPath = path.resolve(__dirname, "../../../tools/house3d/houses/lamins-court/house.json");
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

describe("house spec validator", () => {
  it("accepts the Lamin's Court spec", () => {
    expect(validateHouse(spec)).toEqual([]);
  });

  it("flags an opening that does not fit its wall", () => {
    const broken = structuredClone(spec);
    broken.openings[0].center = [40, 40];
    expect(validateHouse(broken).join("\n")).toMatch(/does not fit on wall/);
  });

  it("requires evidence on every element", () => {
    const broken = structuredClone(spec);
    delete broken.rooms[0].evidence;
    broken.walls[0].evidence = "guess";
    const errors = validateHouse(broken).join("\n");
    expect(errors).toMatch(/living: no evidence/);
    expect(errors).toMatch(/not photo:<id>, plan:<id> or inferred/);
  });

  it("flags overlapping rooms on the same floor", () => {
    const broken = structuredClone(spec);
    broken.rooms[1].rect = [...broken.rooms[0].rect];
    expect(validateHouse(broken).join("\n")).toMatch(/overlap/);
  });
});

describe("built house metadata", () => {
  it("lists every room with a size and a walkable area on each floor", () => {
    expect(meta.rooms).toHaveLength(spec.rooms.length);
    for (const lv of meta.levels) expect(meta.walk.levels[lv.id as keyof typeof meta.walk.levels].length).toBeGreaterThan(0);
    expect(meta.photos.map((p) => p.file)).toContain("/images/projects/lamins-court.jpg");
  });
});
