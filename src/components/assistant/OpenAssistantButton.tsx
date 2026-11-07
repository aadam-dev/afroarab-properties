"use client";

import { openAssistant } from "@/lib/assistant/events";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/** Inline CTA that opens the floating site guide. */
export function OpenAssistantButton({ className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => openAssistant()}
      className={cn(
        "text-left font-semibold text-foreground underline underline-offset-4",
        className,
      )}
    >
      {children ?? "Ask our guide"}
    </button>
  );
}
