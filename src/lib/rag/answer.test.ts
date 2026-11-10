import { describe, expect, it } from "vitest";
import { extractiveAnswer } from "./answer";
import { retrieve } from "./retrieve";

describe("extractiveAnswer", () => {
  it("answers Ibra’s Court location in natural prose", () => {
    const q = "Where is Ibra’s Court?";
    const chunks = retrieve(q);
    const answer = extractiveAnswer(q, chunks);

    expect(chunks).toHaveLength(1);
    expect(chunks[0].doc.id).toBe("project:ibras-court");
    expect(answer.toLowerCase()).toContain("ibra");
    expect(answer.toLowerCase()).toMatch(/haatso|narhman/);
    expect(answer).toContain("/projects/ibras-court");
    expect(answer.toLowerCase()).not.toContain("here’s what i can share");
    expect(answer.toLowerCase()).not.toContain("here's what i can share");
    expect(answer).not.toContain("•");
    expect(answer).not.toMatch(/Afugu/);
    expect(answer).not.toMatch(/Blakk Rasta/);
    expect(answer).not.toContain("—");
  });

  it("answers payment questions without a dump", () => {
    const q = "Do you offer interest-free payment plans?";
    const chunks = retrieve(q);
    const answer = extractiveAnswer(q, chunks);

    expect(chunks[0].doc.id).toBe("payment:plans");
    expect(answer.toLowerCase()).toMatch(/interest-free|payment/);
    expect(answer).toContain("/payment-plans");
    expect(answer).not.toContain("Here’s what I can share");
    expect(answer).not.toContain("•");
    expect(answer).not.toContain("…");
    expect(answer).not.toContain("—");
  });

  it("answers plot availability from the Green Valley inventory", () => {
    const q = "Which plots are available at Green Valley?";
    const answer = extractiveAnswer(q, retrieve(q));

    expect(answer).toMatch(/\d+ are available right now/);
    expect(answer).toContain("/lands/titled-lands-green-valley/explorer");
    expect(answer).not.toMatch(/Bella Vista/);
  });

  it("lists the newest Plotline stories for news questions", () => {
    const q = "What's the latest news from Afro Arab?";
    const answer = extractiveAnswer(q, retrieve(q));

    expect(answer).toContain("200,000 homes");
    expect(answer).toContain("/plotline");
  });
});
