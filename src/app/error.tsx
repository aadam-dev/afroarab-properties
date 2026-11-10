"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site, whatsappHref } from "@/data/site";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="on-dark relative flex min-h-[100svh] items-center bg-forest-950 text-white">
      <div className="shell py-32">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="t-h1 mt-5 max-w-2xl text-balance">
          This page didn&apos;t load. <em>Let&apos;s try again.</em>
        </h1>
        <p className="t-lead mt-5 max-w-xl text-white/75">
          If it keeps happening, sales can help on {site.phones[0]} or WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className="btn-gold btn-lg">
            Try again
          </button>
          <Link href="/" className="btn-ghost btn-lg">
            Home
          </Link>
          <a href={whatsappHref("Hello Afro Arab, a page on your website didn't load for me.")} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">
            WhatsApp sales
          </a>
        </div>
      </div>
    </section>
  );
}
