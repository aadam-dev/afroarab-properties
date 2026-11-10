"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  projectSlug?: string;
  plotCode?: string;
  intent?: "viewing" | "plot" | "payment" | "general" | "whatsapp";
  className?: string;
  compact?: boolean;
};

export function EnquiryForm({
  projectSlug,
  plotCode,
  intent = "viewing",
  className,
  compact,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          projectSlug,
          plotCode,
          intent,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Unable to send enquiry");
      }
      setStatus("ok");
      form.reset();
      setMessage("Thank you. Our sales team will respond shortly.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const field = "field";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(compact ? "" : "card-lux p-6 sm:p-9", className)}
      noValidate
    >
      <div className="mb-6">
        <h2 className={cn("font-display font-light text-foreground", compact ? "text-xl" : "text-2xl sm:text-3xl")}>
          {plotCode ? `Enquire about plot ${plotCode}` : "Arrange a viewing"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We use your details only to respond to this enquiry. Read our{" "}
          <a href="/privacy" className="text-foreground underline underline-offset-4">
            privacy policy
          </a>
          .
        </p>
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Full name</span>
          <input name="fullName" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Phone / WhatsApp</span>
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block text-xs font-semibold text-muted">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block text-xs font-semibold text-muted">Message</span>
          <textarea
            name="message"
            rows={compact ? 3 : 4}
            className="field min-h-0"
            placeholder="Preferred viewing day, estate, or payment questions"
          />
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          name="consent"
          type="checkbox"
          required
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded accent-[var(--aa-gold-500)]"
        />
        <span>
          I consent to Afro Arab Properties processing my personal data to respond to this
          enquiry under Ghana’s Data Protection Act 2012 (Act 843).
        </span>
      </label>

      <button type="submit" disabled={status === "loading"} className="btn-primary btn-lg mt-6 w-full disabled:opacity-70">
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>

      {message ? (
        <p
          role="status"
          className={cn(
            "mt-3 text-center text-sm font-medium",
            status === "ok" ? "text-available" : "text-brand-red",
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
