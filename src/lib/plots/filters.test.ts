import { describe, expect, it } from "vitest";
import { plotsForProject } from "@/data/masterplan";
import { canTransition, filterPlots, plotFaces } from "./filters";

const plots = plotsForProject("titled-lands-green-valley");

describe("filterPlots", () => {
  it("filters available corner plots with a north frontage", () => {
    const result = filterPlots(plots, { facings: ["N"], availableOnly: true, cornerOnly: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => plotFaces(p, "N"))).toBe(true);
    expect(result.every((p) => p.status === "available")).toBe(true);
    expect(result.every((p) => p.isCorner)).toBe(true);
  });

  it("finds a plot by exact number and prefix", () => {
    expect(filterPlots(plots, { query: "12" }).map((p) => p.code)).toContain("12");
    expect(filterPlots(plots, { query: "Plot 4" }).every((p) => p.code.startsWith("4"))).toBe(true);
  });

  it("matches east/west only through corner side frontages", () => {
    const east = filterPlots(plots, { facings: ["E"] });
    expect(east.length).toBeGreaterThan(0);
    expect(east.every((p) => p.isCorner)).toBe(true);
  });

  it("filters by size key", () => {
    const result = filterPlots(plots, { sizes: ["100x100"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.frontageFt === 100 && p.depthFt === 100)).toBe(true);
  });
});

describe("canTransition", () => {
  it("allows available to held", () => {
    expect(canTransition("available", "held")).toBe(true);
  });

  it("blocks sold to reserved", () => {
    expect(canTransition("sold", "reserved")).toBe(false);
  });
});
