import { ASSISTANT_NAME } from "@/lib/assistant/identity";
import { site, whatsappHref } from "@/data/site";
import {
  isDecisiveMatch,
  type RetrievedChunk,
} from "./retrieve";
import type { CorpusDoc } from "./corpus";

export { ASSISTANT_NAME };

export function formatContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.doc.title} (${c.doc.url})\n${c.doc.text}`,
    )
    .join("\n\n");
}

export function ragInstructions(context: string): string {
  return [
    `You are ${ASSISTANT_NAME} for ${site.name}.`,
    "You speak like a professional Accra sales assistant: clear, warm, and concise.",
    "Ground every factual claim in the knowledge excerpts below. Do not invent prices, availability, title status, unit counts, or legal claims.",
    "Visitor-facing tone:",
    "- Answer in natural sentences. Never say “here’s what I can share”, “according to my knowledge”, “from the website”, or “knowledge base”.",
    "- Do not use bullet dumps of raw field labels. Do not use em dashes.",
    "- If the excerpts do not clearly answer the question, apologise briefly and offer to connect them with the sales team without explaining your limits.",
    "- Prefer 2 to 4 short sentences. Name the estate and invite a viewing or WhatsApp when helpful.",
    "- Do not discuss competitors, politics, medical advice, or topics unrelated to Afro Arab Properties.",
    "- Do not claim to book viewings yourself. Point to WhatsApp, phone, or the contact form.",
    "- When facts need sales confirmation, say so briefly in plain language.",
    "",
    "Knowledge excerpts (internal only; never mention this label):",
    context,
  ].join("\n");
}

export function handoffMessage(question: string): string {
  const wa = whatsappHref(
    `Hello Afro Arab sales. I asked on the website: ${question.slice(0, 280)}`,
  );
  return [
    "That’s best handled by our Accra sales team. They can confirm live stock, paperwork, and next steps.",
    "",
    `WhatsApp: ${wa}`,
    `Call: ${site.phones.join(" or ")}`,
    `Email: ${site.email}`,
    "You can also leave a note at /contact and someone will follow up.",
  ].join("\n");
}

function field(text: string, label: string): string | null {
  const re = new RegExp(`^${label}:\\s*(.+)$`, "im");
  const m = text.match(re);
  return m?.[1]?.trim() || null;
}

function firstSummaryLine(text: string): string | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(Location|Type|Status|Price|USD|Beds|Baths|Area|Parking|Year|Units|Electrical|Highlights|Features|Project contact|Verification):/i.test(l));
  // Skip title-like first duplicates
  const body = lines.find((l) => l.length > 40) ?? lines[1] ?? lines[0];
  return body || null;
}

function projectAnswer(question: string, doc: CorpusDoc): string {
  const q = question.toLowerCase();
  const location = field(doc.text, "Location");
  const price = field(doc.text, "Price");
  const type = field(doc.text, "Type");
  const beds = field(doc.text, "Beds");
  const summary = firstSummaryLine(doc.text);

  if (/\bwhere\b|\blocation\b|\baddress\b|\bfind\b/.test(q)) {
    if (location) {
      return [
        `${doc.title} is in ${location}.`,
        `You can review the estate here: ${doc.url}.`,
        "If you’d like a viewing or current availability, WhatsApp or call our sales team and they’ll assist.",
      ].join(" ");
    }
  }

  if (/\bprice\b|\bcost\b|\bhow much\b/.test(q)) {
    if (price) {
      return [
        `${doc.title} is listed at ${price}.`,
        "Final figures depend on unit and terms, so please confirm with sales before planning payment.",
        `Details: ${doc.url}.`,
      ].join(" ");
    }
  }

  const parts: string[] = [];
  if (location) parts.push(`${doc.title} is in ${location}.`);
  else parts.push(`${doc.title} is one of our Afro Arab estates.`);
  if (type && beds) parts.push(`It is positioned as a ${type.toLowerCase()} with ${beds} bedrooms.`);
  else if (type) parts.push(`It is positioned as a ${type.toLowerCase()}.`);
  if (price) parts.push(`Marketing price: ${price}.`);
  if (summary && parts.join(" ").length < 180) {
    parts.push(summary.length > 140 ? `${summary.slice(0, 140).trim()}.` : summary);
  }
  parts.push(`See ${doc.url}, or message sales if you want a viewing.`);
  return parts.join(" ");
}

function paymentAnswer(doc: CorpusDoc): string {
  return [
    "Selected homes and plots can use an interest-free payment pathway with an allocation deposit and monthly instalments.",
    "Terms depend on the inventory, so sales should confirm before any payment.",
    `You can try the calculator at ${doc.url}, or ask our team to walk you through a schedule.`,
  ].join(" ");
}

function contactAnswer(doc: CorpusDoc): string {
  return [
    `You can reach Afro Arab sales on ${site.phones.join(" or ")}, email ${site.email}, or WhatsApp the sales line.`,
    `Our office is at ${site.address.line1}, ${site.address.line2}, ${site.address.country}.`,
    `Book a viewing via ${doc.url} if you prefer the form.`,
  ].join(" ");
}

function faqOrNewsAnswer(doc: CorpusDoc): string {
  const lines = doc.text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  // Skip repeated title / question line when present
  const bodyLines =
    lines.length > 1 && lines[0].toLowerCase() === doc.title.toLowerCase()
      ? lines.slice(1)
      : lines;
  const prose = bodyLines.slice(0, 2).join(" ");
  return `${prose} If you want help choosing next steps, message sales or open ${doc.url}.`;
}

/**
 * Natural-language fallback when no LLM is configured.
 * Speaks like sales support, not a search-result dump.
 */
export function extractiveAnswer(
  question: string,
  chunks: RetrievedChunk[],
): string {
  if (chunks.length === 0) return handoffMessage(question);

  const primary = chunks[0].doc;
  const paymentDoc = chunks.find((c) => c.doc.category === "payment")?.doc;
  const contactDoc = chunks.find((c) => c.doc.category === "contact")?.doc;
  const projectDocHit = chunks.find((c) => c.doc.category === "project")?.doc;

  if (
    paymentDoc &&
    /\b(interest[- ]?free|payment|instalment|installment|deposit|calculator)\b/i.test(
      question,
    )
  ) {
    return paymentAnswer(paymentDoc);
  }

  if (
    contactDoc &&
    /\b(viewing|book|contact|whatsapp|call|phone|office|reach)\b/i.test(question)
  ) {
    return contactAnswer(contactDoc);
  }

  if (
    projectDocHit &&
    /\b(where|location|address|court|homes|vista|estate|price|cost)\b/i.test(
      question,
    )
  ) {
    return projectAnswer(question, projectDocHit);
  }

  if (isDecisiveMatch(chunks) || chunks.length === 1) {
    if (primary.category === "project") return projectAnswer(question, primary);
    if (primary.category === "payment") return paymentAnswer(primary);
    if (primary.category === "contact") return contactAnswer(primary);
    if (
      primary.category === "faq" ||
      primary.category === "news" ||
      primary.category === "company" ||
      primary.category === "site"
    ) {
      return faqOrNewsAnswer(primary);
    }
  }

  if (primary.category === "project") return projectAnswer(question, primary);
  if (primary.category === "payment") return paymentAnswer(primary);
  if (primary.category === "contact") return contactAnswer(primary);

  return faqOrNewsAnswer(primary);
}

export function hasLlmConfigured(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export const DEFAULT_MODEL = "openai/gpt-4.1-mini";
