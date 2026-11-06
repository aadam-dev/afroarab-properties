import { describe, expect, it } from "vitest";
import { demoPlots } from "@/data/plots";
import { canTransition, filterPlots } from "./filters";

describe("filterPlots", () => {
  it("filters available corner plots facing north", () => {
    const result = filterPlots(demoPlots, {
      facing: "N",
      availableOnly: true,
      cornerOnly: true,
    });
    expect(result.every((p) => p.facing === "N")).toBe(true);
    expect(result.every((p) => p.status === "available")).toBe(true);
    expect(result.every((p) => p.isCorner)).toBe(true);
  });

  it("finds plot by code", () => {
    const result = filterPlots(demoPlots, { query: "12" });
    expect(result.some((p) => p.code === "12")).toBe(true);
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
