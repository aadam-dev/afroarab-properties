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

/** Common estate words that match almost every project and dilute ranking. */
const GENERIC = new Set([
  "court",
  "courts",
  "home",
  "homes",
  "house",
  "houses",
  "estate",
  "estates",
  "land",
  "lands",
  "plot",
  "plots",
  "townhouse",
  "townhouses",
  "bedroom",
  "bedrooms",
  "accra",
  "ghana",
  "property",
  "properties",
  "afro",
  "arab",
]);

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function normalizePhrase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenWeight(token: string): number {
  return GENERIC.has(token) ? 0.35 : 1;
}

/** Lexical retrieval over the site corpus — no external vector store. */
export function retrieve(query: string, limit = 5): RetrievedChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const specificTokens = tokens.filter((t) => !GENERIC.has(t));
  const queryPhrase = normalizePhrase(query);

  const scored = getCorpus().map((doc) => {
    const titleNorm = normalizePhrase(doc.title);
    const hay = `${doc.title}\n${doc.text}`.toLowerCase();
    const keywordSet = new Set(doc.keywords);
    let score = 0;

    for (const token of tokens) {
      const w = tokenWeight(token);
      if (keywordSet.has(token)) score += 3 * w;
      if (titleNorm.split(" ").includes(token)) score += 4 * w;
      else if (doc.title.toLowerCase().includes(token)) score += 2 * w;
      if (doc.url.toLowerCase().includes(token)) score += 2.5 * w;

      let from = 0;
      let hits = 0;
      while (hits < 3) {
        const idx = hay.indexOf(token, from);
        if (idx === -1) break;
        hits += 1;
        from = idx + token.length;
      }
      score += hits * w;
    }

    // Exact-ish title / slug phrase boost (e.g. "ibras court")
    if (specificTokens.length >= 1) {
      const nameHits = specificTokens.filter(
        (t) => titleNorm.includes(t) || doc.url.toLowerCase().includes(t),
      ).length;
      if (nameHits === specificTokens.length && specificTokens.length > 0) {
        score += 12;
      } else if (nameHits > 0) {
        score += nameHits * 3;
      }
    }

    if (
      specificTokens.length >= 2 &&
      specificTokens.every((t) => titleNorm.includes(t))
    ) {
      score += 8;
    }

    // Prefer project docs for "where is X court" style questions
    if (
      doc.category === "project" &&
      specificTokens.some((t) => titleNorm.includes(t) || doc.url.includes(t))
    ) {
      score += 4;
    }

    // Soft-penalise news when the query is clearly about a named estate location
    if (
      doc.category === "news" &&
      /\bwhere\b|\blocation\b|\baddress\b/i.test(query)
    ) {
      score *= 0.45;
    }

    // Prefer the dedicated payment page over FAQ mirrors for financing questions
    if (
      /\b(interest[- ]?free|payment|instalment|installment|deposit|calculator)\b/i.test(
        query,
      )
    ) {
      if (doc.id === "payment:plans") score += 25;
      if (doc.category === "faq" && doc.id.includes("payment")) score *= 0.55;
    }

    // Prefer contact doc for viewing / reach-out questions
    if (/\b(viewing|book|contact|whatsapp|call|phone|office)\b/i.test(query)) {
      if (doc.id === "contact:sales") score += 18;
    }

    const covered = tokens.filter(
      (t) => keywordSet.has(t) || hay.includes(t),
    ).length;
    score += (covered / tokens.length) * 1.5;

    // Tiny boost if the normalised query contains the title phrase
    if (queryPhrase.includes(titleNorm) || titleNorm.includes(queryPhrase.replace(/^(where|what|tell me about)\s+/, ""))) {
      score += 3;
    }

    return { doc, score };
  });

  const ranked = scored
    .filter((c) => c.score >= 2.5)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return [];

  // If the leader is a clear name match, don't let weak siblings dilute answering
  const [best, ...rest] = ranked;
  const clearLead =
    best.score >= 10 && (rest.length === 0 || best.score >= rest[0].score * 1.6);

  if (clearLead) {
    return [best, ...rest.filter((c) => c.score >= best.score * 0.55)].slice(
      0,
      limit,
    );
  }

  return ranked.slice(0, limit);
}

/** Below this top score we treat the question as outside published knowledge. */
export const HANDOFF_SCORE_THRESHOLD = 3.5;

/** Requests only a person can action: holding stock, negotiating, signing or refunds. */
const NEEDS_PERSON =
  /\b(hold|reserve|reservation|negotiat\w*|discount|bargain|sign|signing|refund|cancel|lower (the )?price|best price)\b/i;

export function shouldHandoff(chunks: RetrievedChunk[], question = ""): boolean {
  if (NEEDS_PERSON.test(question)) return true;
  if (chunks.length === 0) return true;
  return chunks[0].score < HANDOFF_SCORE_THRESHOLD;
}

/** True when the top hit is a decisive match and should drive a single answer. */
export function isDecisiveMatch(chunks: RetrievedChunk[]): boolean {
  if (chunks.length === 0) return false;
  if (chunks.length === 1) return chunks[0].score >= HANDOFF_SCORE_THRESHOLD;
  return chunks[0].score >= 10 && chunks[0].score >= chunks[1].score * 1.45;
}
