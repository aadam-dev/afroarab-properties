import { describe, expect, it } from "vitest";
import { instalmentPlan } from "./payments";

describe("instalmentPlan", () => {
  it("adds back up to the price exactly", () => {
    const p = instalmentPlan(87500, 30, 12);
    expect(p.deposit).toBe(26250);
    expect(p.deposit + p.monthly * 11 + p.finalInstalment).toBe(87500);
    expect(p.finalInstalment).toBeGreaterThanOrEqual(p.monthly);
  });

  it("treats zero months as full payment", () => {
    expect(instalmentPlan(100000, 30, 0).deposit).toBe(100000);
  });
});
