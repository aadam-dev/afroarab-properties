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
        "surface-lux rounded-[1.15rem] p-6 sm:p-8",
        className,
      )}
      noValidate
    >
      <div className="mb-6">
        <p className="eyebrow">Enquiry</p>
        <h2 className="mt-3 font-display text-3xl text-forest-900">
          {plotCode ? `Plot ${plotCode}` : "Book a viewing"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          We use your details only to respond to this enquiry. Read our{" "}
          <a href="/privacy" className="text-forest-800 underline decoration-gold/50 underline-offset-4">
            privacy policy
          </a>
          .
        </p>
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-forest-800">Full name</span>
          <input
            name="fullName"
            required
            autoComplete="name"
            className="h-12 w-full rounded-lg border border-sand-200 bg-sand-50/80 px-3.5 outline-none transition focus:border-forest-600 focus:bg-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-forest-800">Phone</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="h-12 w-full rounded-lg border border-sand-200 bg-sand-50/80 px-3.5 outline-none transition focus:border-forest-600 focus:bg-white"
          />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block font-medium text-forest-800">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-12 w-full rounded-lg border border-sand-200 bg-sand-50/80 px-3.5 outline-none transition focus:border-forest-600 focus:bg-white"
          />
        </label>
        <label className={cn("block text-sm", !compact && "sm:col-span-2")}>
          <span className="mb-1.5 block font-medium text-forest-800">Message</span>
          <textarea
            name="message"
            rows={compact ? 3 : 4}
            className="w-full rounded-lg border border-sand-200 bg-sand-50/80 px-3.5 py-3 outline-none transition focus:border-forest-600 focus:bg-white"
            placeholder="Preferred viewing day, budget, or questions…"
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-forest-800">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-sand-200"
        />
        <span>
          I consent to Afro Arab Properties processing my personal data to respond to this enquiry
          under Ghana’s Data Protection Act 2012.
        </span>
      </label>

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full">
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>

      {message ? (
        <p
          role="status"
          className={cn("mt-3 text-sm", status === "ok" ? "text-forest-700" : "text-brand-red")}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
