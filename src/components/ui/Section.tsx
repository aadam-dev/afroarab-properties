import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MaskedText } from "./MaskedText";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** "page" uses the sand/ink background, "surface" a lifted white, "band" the forest band. */
  tone?: "page" | "surface" | "muted" | "band";
  /** Remove vertical padding (for edge-to-edge media sections). */
  flush?: boolean;
  labelledBy?: string;
};

const tones = {
  page: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  muted: "bg-surface-muted text-foreground",
  band: "on-dark bg-band text-band-fg",
} as const;

export function Section({ id, className, children, tone = "page", flush, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative", tones[tone], !flush && "section-y", className)}>
      {children}
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("shell", className)}>{children}</div>;
}

type HeadingProps = {
  id?: string;
  eyebrow?: string;
  /** Use <em> for the italic gold accent word(s). */
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  size?: "h1" | "h2";
  className?: string;
  as?: "h1" | "h2";
  /** Animate the title in line by line. */
  reveal?: boolean;
  action?: ReactNode;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  size = "h2",
  className,
  as,
  reveal = true,
  action,
}: HeadingProps) {
  const Tag = as ?? (size === "h1" ? "h1" : "h2");
  const cls = size === "h1" ? "t-h1" : "t-h2";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-current opacity-60" />
            {eyebrow}
          </p>
        ) : null}
        <Tag id={id} className={cn(cls, "mt-4 text-balance")}>
          {reveal ? <MaskedText>{title}</MaskedText> : title}
        </Tag>
        {lead ? <div className="t-lead mt-5 max-w-2xl text-muted text-pretty">{lead}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
