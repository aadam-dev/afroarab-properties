"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { site, whatsappHref } from "@/data/site";
import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant/events";
import { ASSISTANT_NAME } from "@/lib/assistant/identity";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Where is Ibra’s Court?",
  "Do you offer interest-free payment plans?",
  "How do I book a viewing?",
  "Tell me about Bella Vista plots",
];

const TEASER_STORAGE_KEY = "aa-site-guide-teaser";
const TEASER_DELAY_MS = 4200;

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

function readTeaserDismissed(): boolean {
  try {
    return localStorage.getItem(TEASER_STORAGE_KEY) === "dismissed";
  } catch {
    return false;
  }
}

function persistTeaserDismissed() {
  try {
    localStorage.setItem(TEASER_STORAGE_KEY, "dismissed");
  } catch {
    /* ignore quota / private mode */
  }
}

export function AssistantWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserEligible, setTeaserEligible] = useState(false);
  const [launcherNudge, setLauncherNudge] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/assistant" }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const busy = status === "submitted" || status === "streaming";

  function dismissTeaser() {
    setTeaserVisible(false);
    setLauncherNudge(false);
    persistTeaserDismissed();
  }

  function openPanel() {
    setOpen(true);
    setTeaserVisible(false);
    setLauncherNudge(false);
    persistTeaserDismissed();
  }

  function closePanel() {
    setOpen(false);
  }

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  useEffect(() => {
    setTeaserEligible(!readTeaserDismissed());
  }, []);

  useEffect(() => {
    if (!teaserEligible || open) return;
    setLauncherNudge(true);
    const timer = window.setTimeout(() => {
      setTeaserVisible(true);
      setLauncherNudge(false);
    }, TEASER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [teaserEligible, open]);

  useEffect(() => {
    function onOpenEvent() {
      setOpen(true);
      setTeaserVisible(false);
      setLauncherNudge(false);
      persistTeaserDismissed();
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpenEvent);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpenEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            id="aa-assistant-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aa-assistant-title"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex h-[min(36rem,78vh)] w-[min(24.5rem,calc(100vw-2rem))] flex-col overflow-hidden border border-border bg-surface shadow-lux"
          >
            <header className="border-b border-border bg-band px-4 py-3.5 text-band-fg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="relative mt-0.5 size-10 shrink-0 overflow-hidden border border-white/20 bg-forest-900">
                    <Image
                      src="/brand/crest-180.png"
                      alt=""
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </span>
                  <div>
                    <p
                      id="aa-assistant-title"
                      className="font-display text-lg font-light tracking-wide"
                    >
                      {ASSISTANT_NAME}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-band-fg/75">
                      Answers from this website only · unknowns go to sales
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-sm px-2 py-1 text-sm text-band-fg/80 hover:bg-white/10 hover:text-band-fg"
                  aria-label="Close site guide"
                >
                  Close
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="border border-border bg-surface-muted px-3.5 py-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                      Hello
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      I’m the <strong className="font-semibold">{ASSISTANT_NAME}</strong>{" "}
                      for {site.name}. I can help with estates, titled land, payment
                      pathways, and how to reach the Accra sales team — using only what’s
                      published on this site.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      I won’t invent prices or availability. If it’s not on the website,
                      I’ll connect you to sales.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Try asking
                    </p>
                    <ul className="mt-2 space-y-2">
                      {SUGGESTIONS.map((q) => (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => submit(q)}
                            className="w-full border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground transition hover:border-gold/50"
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  Ask the site guide a question
                </label>
                <input
                  ref={inputRef}
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

      <AnimatePresence>
        {!open && teaserVisible ? (
          <motion.aside
            key="teaser"
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[min(20.5rem,calc(100vw-5.5rem))] border border-border bg-surface p-3.5 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <span className="relative size-9 shrink-0 overflow-hidden border border-border bg-surface-muted">
                <Image
                  src="/brand/crest-180.png"
                  alt=""
                  width={36}
                  height={36}
                  className="size-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-light text-foreground">
                  {ASSISTANT_NAME}
                </p>
                <p className="mt-1 text-sm leading-snug text-muted">
                  I answer from this website only — estates, payments, and how to reach
                  sales. Ask me anything published here.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openPanel}
                    className="btn-primary !min-h-0 !px-3 !py-1.5 !text-xs"
                  >
                    Chat with me
                  </button>
                  <button
                    type="button"
                    onClick={dismissTeaser}
                    className="px-2 py-1.5 text-xs text-muted underline-offset-2 hover:underline"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layout={!reduceMotion}
        onClick={() => (open ? closePanel() : openPanel())}
        className={cn(
          "pointer-events-auto flex items-center gap-3 border border-border bg-band py-2.5 pl-2.5 pr-4 text-band-fg shadow-soft transition hover:bg-forest-800",
          !open && launcherNudge && !reduceMotion && "aa-guide-pulse",
        )}
        aria-expanded={open}
        aria-controls="aa-assistant-panel"
        aria-label={open ? "Hide site guide" : "Open Afro Arab site guide"}
      >
        <span className="relative size-10 shrink-0 overflow-hidden border border-white/15 bg-forest-900">
          <Image
            src="/brand/crest-180.png"
            alt=""
            width={40}
            height={40}
            className="size-full object-cover"
          />
          {!open ? (
            <span
              className="absolute right-0.5 top-0.5 size-2 rounded-full bg-gold"
              aria-hidden
            />
          ) : null}
        </span>
        <span className="text-left">
          <span className="block font-display text-base font-light tracking-wide">
            {open ? "Hide guide" : "Ask the site"}
          </span>
          {!open ? (
            <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.14em] text-band-fg/70">
              Site guide · free to ask
            </span>
          ) : null}
        </span>
      </motion.button>
    </div>
  );
}
