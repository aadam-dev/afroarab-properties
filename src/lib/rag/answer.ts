import { site, whatsappHref } from "@/data/site";
import type { RetrievedChunk } from "./retrieve";

export const ASSISTANT_NAME = "Afro Arab site guide";

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
    "You answer ONLY from the website knowledge excerpts provided below.",
    "Rules:",
    "- Never invent prices, availability, title status, unit counts, or legal claims.",
    "- If the excerpts do not clearly answer the question, say you do not have that on the website and ask the buyer to speak with the sales team.",
    "- Prefer short, plain answers. Mention the relevant estate name and page path when helpful.",
    "- Do not discuss competitors, politics, medical advice, or topics unrelated to Afro Arab Properties.",
    "- Do not claim to book viewings yourself — point to WhatsApp, phone, or the contact form.",
    "- When facts are marked as listing claims or needing verification, say so briefly.",
    "",
    "Website knowledge excerpts:",
    context,
  ].join("\n");
}

export function handoffMessage(question: string): string {
  const wa = whatsappHref(
    `Hello Afro Arab sales — I asked on the website: ${question.slice(0, 280)}`,
  );
  return [
    "I only answer from what’s published on this Afro Arab Properties website, and I don’t have a clear match for that question in the site content.",
    "",
    "The sales team can help with live availability, negotiated pricing, title packs, and viewing appointments.",
    "",
    `WhatsApp sales: ${wa}`,
    `Call: ${site.phones.join(" · ")}`,
    `Email: ${site.email}`,
    "Or use the contact form at /contact.",
  ].join("\n");
}

/** Deterministic fallback when no LLM key is configured. */
export function extractiveAnswer(
  question: string,
  chunks: RetrievedChunk[],
): string {
  if (chunks.length === 0) return handoffMessage(question);

  const top = chunks.slice(0, 3);
  const lines: string[] = [
    "Here’s what the website says:",
    "",
  ];

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
    "If you need live availability, a viewing, or anything not listed above, WhatsApp or call the sales team and they’ll take it from there.",
  );

  return lines.join("\n").trim();
}

export function hasLlmConfigured(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export const DEFAULT_MODEL = "openai/gpt-4.1-mini";
