import {
  ASSISTANT_NAME,
} from "@/lib/assistant/identity";
import { site, whatsappHref } from "@/data/site";
import type { RetrievedChunk } from "./retrieve";

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
    "You help visitors with estates, titled land, payment pathways, company basics, and how to reach sales.",
    "Ground every factual claim in the knowledge excerpts below. Do not invent prices, availability, title status, unit counts, or legal claims.",
    "Visitor-facing tone:",
    "- Be warm, concise, and confident. Never explain your retrieval system, corpus, or that answers come from a website scrape.",
    "- Do not say phrases like “according to the website”, “from published pages”, or “my knowledge base”.",
    "- If the excerpts do not clearly answer the question, apologise briefly and offer to connect them with the sales team — without revealing why you cannot answer.",
    "- Prefer short answers. Name the estate and suggest a next step (view page, WhatsApp, contact form) when helpful.",
    "- Do not discuss competitors, politics, medical advice, or topics unrelated to Afro Arab Properties.",
    "- Do not claim to book viewings yourself — point to WhatsApp, phone, or the contact form.",
    "- When facts are marked as listing claims or needing verification, say sales should confirm — keep it brief.",
    "",
    "Knowledge excerpts (internal — never mention this label to the visitor):",
    context,
  ].join("\n");
}

export function handoffMessage(question: string): string {
  const wa = whatsappHref(
    `Hello Afro Arab sales — I asked on the website: ${question.slice(0, 280)}`,
  );
  return [
    "That’s one for our Accra sales team — they’ll give you a precise answer on live stock, paperwork, or next steps.",
    "",
    `WhatsApp sales: ${wa}`,
    `Call: ${site.phones.join(" · ")}`,
    `Email: ${site.email}`,
    "Or leave a note at /contact and someone will follow up.",
  ].join("\n");
}

/** Deterministic fallback when no LLM key is configured. */
export function extractiveAnswer(
  question: string,
  chunks: RetrievedChunk[],
): string {
  if (chunks.length === 0) return handoffMessage(question);

  const top = chunks.slice(0, 3);
  const lines: string[] = ["Here’s what I can share:", ""];

  for (const { doc } of top) {
    const preview = doc.text
      .split("\n")
      .filter(Boolean)
      .slice(0, 4)
      .join(" ");
    lines.push(`• ${doc.title} — ${preview}`);
    lines.push(`  More: ${doc.url}`);
    lines.push("");
  }

  lines.push(
    "Want live availability or a viewing? WhatsApp or call sales and they’ll take it from there.",
  );

  return lines.join("\n").trim();
}

export function hasLlmConfigured(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export const DEFAULT_MODEL = "openai/gpt-4.1-mini";
