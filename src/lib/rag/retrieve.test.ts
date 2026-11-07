import { describe, expect, it } from "vitest";
import { retrieve, shouldHandoff } from "./retrieve";

describe("retrieve", () => {
  it("finds Ibra’s Court from a location question", () => {
    const hits = retrieve("Where is Ibra’s Court?");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].doc.id).toBe("project:ibras-court");
    expect(shouldHandoff(hits)).toBe(false);
  });

  it("finds payment plan content", () => {
    const hits = retrieve("Do you offer interest-free payment plans?");
    expect(hits.some((h) => h.doc.id === "payment:plans")).toBe(true);
    expect(shouldHandoff(hits)).toBe(false);
  });

  it("hands off questions outside the website corpus", () => {
    const hits = retrieve("What is the weather in Tokyo tomorrow and who won the World Cup?");
    expect(shouldHandoff(hits)).toBe(true);
  });
});
