import { describe, expect, it } from "vitest";
import { FT, generateEstate } from "./generate";
import { doorsFor, houseFits, houseFrame, houseTypeForPlot, HOUSE_TYPES } from "./house-types";
import type { Plot } from "./types";

const estate = generateEstate();
const plots = estate.plots;

function bbox(p: Plot) {
  const xs = p.polygon.map((v) => v[0]);
  const ys = p.polygon.map((v) => v[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

describe("generateEstate", () => {
  it("is deterministic", () => {
    const again = generateEstate();
    expect(again.plots.map((p) => [p.code, p.status, p.priceGhs])).toEqual(
      plots.map((p) => [p.code, p.status, p.priceGhs]),
    );
  });

  it("produces a realistic number of uniquely numbered plots", () => {
    expect(plots.length).toBeGreaterThanOrEqual(40);
    expect(plots.length).toBeLessThanOrEqual(70);
    expect(new Set(plots.map((p) => p.code)).size).toBe(plots.length);
    expect(plots.map((p) => p.number)).toEqual(plots.map((_, i) => i + 1));
  });

  it("keeps plots inside the boundary and off every road", () => {
    for (const p of plots) {
      const b = bbox(p);
      expect(b.x0).toBeGreaterThanOrEqual(-0.01);
      expect(b.y0).toBeGreaterThanOrEqual(-0.01);
      expect(b.x1).toBeLessThanOrEqual(estate.width + 0.01);
      expect(b.y1).toBeLessThanOrEqual(estate.height + 0.01);
      for (const r of estate.roads) {
        const overlapX = Math.min(b.x1, r.rect.x1) - Math.max(b.x0, r.rect.x0);
        const overlapY = Math.min(b.y1, r.rect.y1) - Math.max(b.y0, r.rect.y0);
        expect(overlapX > 0.01 && overlapY > 0.01).toBe(false);
      }
    }
  });

  it("has no overlapping plots", () => {
    for (let i = 0; i < plots.length; i++) {
      for (let j = i + 1; j < plots.length; j++) {
        const a = bbox(plots[i]);
        const b = bbox(plots[j]);
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        expect(ox > 0.01 && oy > 0.01).toBe(false);
      }
    }
  });

  it("matches stated dimensions and area to the polygon", () => {
    for (const p of plots) {
      const b = bbox(p);
      expect(b.x1 - b.x0).toBeCloseTo(p.frontageFt * FT, 2);
      expect(b.y1 - b.y0).toBeCloseTo(p.depthFt * FT, 2);
      expect(p.areaSqFt).toBe(p.frontageFt * p.depthFt);
    }
  });

  it("gives every plot a front road, and corner flags come from two frontages", () => {
    for (const p of plots) {
      expect(p.frontages.some((f) => f.side === "front")).toBe(true);
      expect(p.isCorner).toBe(p.frontages.length >= 2);
    }
    const corners = plots.filter((p) => p.isCorner);
    expect(corners.length).toBeGreaterThan(0);
    expect(corners.every((p) => p.onMainRoad)).toBe(true);
  });

  it("derives facing from the frontage direction", () => {
    for (const p of plots) {
      const expected = p.inward[1] > 0 ? "S" : "N";
      expect(p.facing).toBe(expected);
    }
  });

  it("marks phase 2 plots as unreleased", () => {
    const phase2 = plots.filter((p) => p.phase === 2);
    expect(phase2.length).toBeGreaterThan(0);
    expect(phase2.every((p) => p.status === "unreleased")).toBe(true);
  });
});

describe("house types", () => {
  it("every suggested house fits its plot with setbacks", () => {
    for (const p of plots) {
      expect(houseFits(houseTypeForPlot(p), p)).toBe(true);
    }
  });

  it("rooms tile each footprint exactly", () => {
    for (const t of HOUSE_TYPES) {
      const area = t.rooms.reduce((s, r) => s + r.w * r.d, 0);
      expect(area).toBeCloseTo(t.widthM * t.depthM, 5);
      for (const r of t.rooms) {
        expect(r.x + r.w).toBeLessThanOrEqual(t.widthM + 1e-9);
        expect(r.y + r.d).toBeLessThanOrEqual(t.depthM + 1e-9);
      }
    }
  });

  it("gives every room except the living room a door", () => {
    for (const t of HOUSE_TYPES) {
      const doors = doorsFor(t);
      for (const r of t.rooms) {
        if (r.id === "living") continue;
        expect(doors.some((d) => d.a === r.id || d.b === r.id), `${t.id}/${r.id}`).toBe(true);
      }
    }
  });

  it("places the house inside the plot", () => {
    for (const p of plots) {
      const t = houseTypeForPlot(p);
      const { toPlan } = houseFrame(p, t);
      const b = bbox(p);
      for (const [x, y] of [
        [0, 0],
        [t.widthM, 0],
        [t.widthM, t.depthM],
        [0, t.depthM],
      ]) {
        const [px, py] = toPlan(x, y);
        expect(px).toBeGreaterThan(b.x0);
        expect(px).toBeLessThan(b.x1);
        expect(py).toBeGreaterThan(b.y0);
        expect(py).toBeLessThan(b.y1);
      }
    }
  });
});
