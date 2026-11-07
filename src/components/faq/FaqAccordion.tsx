"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { FaqItem } from "@/data/faq";
import { cn } from "@/lib/cn";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id}>
            <h2>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition hover:text-foreground"
              >
                <span className="font-display text-xl font-light text-balance sm:text-2xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-1 shrink-0 font-mono-data text-sm text-muted transition",
                    open && "text-gold",
                  )}
                  aria-hidden
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl space-y-3 pb-6 text-base leading-relaxed text-muted">
                    {item.answer.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                    {item.links?.length ? (
                      <p className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-foreground underline underline-offset-4"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
