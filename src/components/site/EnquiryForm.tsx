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

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-[1.25rem] border border-white/10 bg-[#101822]/90 p-6 sm:p-8 text-[#F4EFE6] backdrop-blur-xl shadow-2xl",
        className,
      )}
      noValidate
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
          Direct Inquiry
        </span>
        <h2 className="mt-3 font-display text-3xl font-light text-white">
          {plotCode ? `Reserve Plot ${plotCode}` : "Arrange a Private Viewing"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#F4EFE6]/70">
          We use your details only to respond to this inquiry. Read our{" "}
          <a href="/privacy" className="text-[#C5A059] underline underline-offset-4">
            privacy policy
          </a>
          .
        </p>
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#F4EFE6]/70">Full name</span>
          <input
            name="fullName"
            required
            autoComplete="name"
            placeholder="e.g. Samuel K. Mensah"
            className="h-12 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 text-white placeholder-white/30 outline-none transition focus:border-[#C5A059] focus:bg-black/60"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#F4EFE6]/70">Phone / WhatsApp</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+233 24 000 0000"
            className="h-12 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 text-white placeholder-white/30 outline-none transition focus:border-[#C5A059] focus:bg-black/60"
          />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#F4EFE6]/70">Email address</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="samuel@example.com"
            className="h-12 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 text-white placeholder-white/30 outline-none transition focus:border-[#C5A059] focus:bg-black/60"
          />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#F4EFE6]/70">Message & Details</span>
          <textarea
            name="message"
            rows={compact ? 3 : 4}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-3 text-white placeholder-white/30 outline-none transition focus:border-[#C5A059] focus:bg-black/60"
            placeholder="Preferred viewing day, target corridor, or payment plan questions…"
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-[#F4EFE6]/70 cursor-pointer">
        <input
          name="consent"
          type="checkbox"
          required
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded accent-[#C5A059]"
        />
        <span>
          I consent to Afro Arab Properties processing my personal data to respond to this enquiry
          under Ghana’s Data Protection Act 2012 (Act 843).
        </span>
      </label>

      <button type="submit" disabled={status === "loading"} className="btn-gold mt-6 w-full text-center">
        {status === "loading" ? "Submitting Inquiry..." : "Submit VIP Inquiry"}
      </button>

      {message ? (
        <p
          role="status"
          className={cn(
            "mt-3 text-sm text-center font-medium",
            status === "ok" ? "text-[#00E676]" : "text-brand-red",
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
