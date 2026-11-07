import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  DEFAULT_MODEL,
  extractiveAnswer,
  formatContext,
  handoffMessage,
  hasLlmConfigured,
  ragInstructions,
} from "@/lib/rag/answer";
import { lastUserText } from "@/lib/rag/messages";
import { retrieve, shouldHandoff } from "@/lib/rag/retrieve";

export const maxDuration = 30;

function textStreamResponse(text: string, handoff: boolean, sources: string[]) {
  const stream = createUIMessageStream({
    execute({ writer }) {
      const id = "assistant-text";
      writer.write({
        type: "data-assistant-meta",
        data: { handoff, sources },
      });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: text });
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(request: Request) {
  let body: { messages?: UIMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages ?? [];
  const question = lastUserText(messages);
  if (!question) {
    return new Response(JSON.stringify({ error: "Empty question" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const chunks = retrieve(question, 5);
  const sources = chunks.map((c) => c.doc.url);
  const handoff = shouldHandoff(chunks);

  if (handoff) {
    return textStreamResponse(handoffMessage(question), true, sources);
  }

  const context = formatContext(chunks);

  if (!hasLlmConfigured()) {
    return textStreamResponse(extractiveAnswer(question, chunks), false, sources);
  }

  try {
    const result = streamText({
      model: DEFAULT_MODEL,
      instructions: ragInstructions(context),
      messages: await convertToModelMessages(messages),
      temperature: 0.2,
      maxOutputTokens: 600,
    });

    const stream = createUIMessageStream({
      execute({ writer }) {
        writer.write({
          type: "data-assistant-meta",
          data: { handoff: false, sources },
        });
        writer.merge(toUIMessageStream({ stream: result.stream }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("[assistant] LLM failed, falling back to extractive", error);
    return textStreamResponse(extractiveAnswer(question, chunks), false, sources);
  }
}
