"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { site, whatsappHref } from "@/data/site";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Where is Ibra’s Court?",
  "Do you offer interest-free payment plans?",
  "How do I book a viewing?",
  "Tell me about Bella Vista plots",
];

function messageText(parts: ReadonlyArray<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("\n");
}

function isHandoff(parts: ReadonlyArray<{ type: string; data?: unknown }>): boolean {
  return parts.some((p) => {
    if (p.type !== "data-assistant-meta" || !p.data || typeof p.data !== "object") {
      return false;
    }
    return (p.data as { handoff?: boolean }).handoff === true;
  });
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/assistant" }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const busy = status === "submitted" || status === "streaming";

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex h-[min(34rem,72vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden border border-border bg-surface shadow-lux"
          >
            <header className="border-b border-border bg-band px-4 py-3 text-band-fg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-light tracking-wide">
                    Site guide
                  </p>
                  <p className="mt-0.5 text-xs text-band-fg/75">
                    Answers from this website only · unknowns go to sales
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-2 py-1 text-sm text-band-fg/80 hover:bg-white/10 hover:text-band-fg"
                  aria-label="Close assistant"
                >
                  Close
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted">
                    Ask about estates, payment pathways, or how to reach{" "}
                    {site.name}. I won’t invent facts that aren’t on the site.
                  </p>
                  <ul className="space-y-2">
                    {SUGGESTIONS.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => submit(q)}
                          className="w-full border border-border bg-surface-muted px-3 py-2 text-left text-sm text-foreground transition hover:border-gold/50"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {messages.map((message) => {
                const text = messageText(message.parts);
                const handoff = isHandoff(message.parts);
                if (!text && message.role === "assistant") return null;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[95%] whitespace-pre-wrap text-sm leading-relaxed",
                      message.role === "user"
                        ? "ml-auto bg-forest-900 px-3 py-2 text-white"
                        : "mr-auto border border-border bg-surface-muted px-3 py-2 text-foreground",
                    )}
                  >
                    {text}
                    {handoff ? (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                        <a
                          href={whatsappHref(
                            "Hello Afro Arab sales — I need help with a question the website guide couldn’t answer.",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary !px-3 !py-1.5 !text-xs"
                        >
                          WhatsApp sales
                        </a>
                        <Link
                          href="/contact"
                          className="btn-outline-gold !px-3 !py-1.5 !text-xs"
                        >
                          Contact form
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {busy ? (
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Looking through the site…
                </p>
              ) : null}

              {error ? (
                <p className="text-sm text-brand-red">
                  Something went wrong. Try again, or WhatsApp sales directly.
                </p>
              ) : null}
            </div>

            <form
              className="border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
            >
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="aa-assistant-input">
                  Ask a question
                </label>
                <input
                  id="aa-assistant-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy}
                  placeholder="Ask about an estate…"
                  className="min-w-0 flex-1 border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="btn-primary !px-3 !py-2 !text-xs disabled:opacity-50"
                >
                  Send
                </button>
              </div>
              {messages.length > 0 ? (
                <button
                  type="button"
                  className="mt-2 text-xs text-muted underline-offset-2 hover:underline"
                  onClick={() => setMessages([])}
                >
                  Clear chat
                </button>
              ) : null}
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layout
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto border border-border bg-band px-4 py-3 font-display text-base font-light tracking-wide text-band-fg shadow-soft transition hover:bg-forest-800"
        aria-expanded={open}
        aria-controls="aa-assistant-panel"
      >
        {open ? "Hide guide" : "Ask the site"}
      </motion.button>
    </div>
  );
}
