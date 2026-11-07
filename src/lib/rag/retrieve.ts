import { getCorpus, type CorpusDoc } from "./corpus";

export type RetrievedChunk = {
  doc: CorpusDoc;
  score: number;
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "with",
  "at",
  "by",
  "from",
  "as",
  "it",
  "this",
  "that",
  "do",
  "does",
  "did",
  "can",
  "could",
  "will",
  "would",
  "i",
  "me",
  "my",
  "we",
  "you",
  "your",
  "what",
  "where",
  "when",
  "who",
  "how",
  "which",
  "about",
  "please",
  "tell",
  "know",
  "need",
  "want",
]);

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Lexical retrieval over the site corpus — no external vector store. */
export function retrieve(query: string, limit = 5): RetrievedChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = getCorpus().map((doc) => {
    const hay = `${doc.title}\n${doc.text}`.toLowerCase();
    const keywordSet = new Set(doc.keywords);
    let score = 0;

    for (const token of tokens) {
      if (keywordSet.has(token)) score += 3;
      if (doc.title.toLowerCase().includes(token)) score += 2.5;
      if (doc.url.toLowerCase().includes(token)) score += 1.5;

      // Count occurrences in body (cap to avoid long-doc bias)
      let from = 0;
      let hits = 0;
      while (hits < 4) {
        const idx = hay.indexOf(token, from);
        if (idx === -1) break;
        hits += 1;
        from = idx + token.length;
      }
      score += hits;
    }

    // Light boost when most query tokens appear
    const covered = tokens.filter(
      (t) => keywordSet.has(t) || hay.includes(t),
    ).length;
    score += (covered / tokens.length) * 2;

    return { doc, score };
  });

  return scored
    .filter((c) => c.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Below this top score we treat the question as outside published knowledge. */
export const HANDOFF_SCORE_THRESHOLD = 3.5;

export function shouldHandoff(chunks: RetrievedChunk[]): boolean {
  if (chunks.length === 0) return true;
  return chunks[0].score < HANDOFF_SCORE_THRESHOLD;
}
