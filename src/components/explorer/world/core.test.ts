import { describe, expect, it } from "vitest";
import { sunState, yawForPlanDir } from "./core";
import { compassFor as genCompass } from "@/data/masterplan/generate";

const ACCRA = { lat: 5.7167, lng: 0.1 };
const base = new Date(Date.UTC(2026, 10, 10));

describe("sunState (Accra, November)", () => {
  it("puts the morning sun in the east-south-east, well above the horizon", () => {
    const s = sunStateAt(9.5);
    expect(s.altitudeDeg).toBeGreaterThan(35);
    expect(s.altitudeDeg).toBeLessThan(60);
    expect(["E", "SE"]).toContain(s.compass);
    expect(s.dir.x).toBeGreaterThan(0); // east
  });

  it("puts the afternoon sun in the west", () => {
    const s = sunStateAt(16);
    expect(["W", "SW"]).toContain(s.compass);
    expect(s.dir.x).toBeLessThan(0);
  });

  it("is high near solar noon", () => {
    expect(sunStateAt(12).altitudeDeg).toBeGreaterThan(65);
  });
});

function sunStateAt(hour: number) {
  // sunState uses today's date; pin it for a stable test.
  const RealDate = Date;
  globalThis.Date = class extends RealDate {
    constructor(...args: unknown[]) {
      if (args.length === 0) super(base.getTime());
      else super(...(args as [number]));
    }
    static UTC = RealDate.UTC;
  } as DateConstructor;
  try {
    return sunState(hour, ACCRA.lat, ACCRA.lng);
  } finally {
    globalThis.Date = RealDate;
  }
}

describe("orientation helpers", () => {
  it("yaw for north is zero and for east is -90°", () => {
    expect(yawForPlanDir(0, 1)).toBeCloseTo(0);
    expect(yawForPlanDir(1, 0)).toBeCloseTo(-Math.PI / 2);
  });

  it("compass words come from plan directions", () => {
    expect(genCompass(0, 1)).toBe("N");
    expect(genCompass(1, 0)).toBe("E");
    expect(genCompass(0, -1)).toBe("S");
  });
});
