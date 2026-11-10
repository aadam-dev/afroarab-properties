import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MaskedText } from "@/components/ui/MaskedText";

type Crumb = { href: string; label: string };

type Props = {
  eyebrow?: string;
  /** Use <em> for the italic gold accent. */
  title: ReactNode;
  description?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Breadcrumb trail after Home. The current page is added automatically. */
  crumbs?: Crumb[];
  current?: string;
  actions?: ReactNode;
  /** Compact for legal/utility pages. */
  size?: "default" | "compact";
};

/**
 * Dark page hero shared by inner pages, so the transparent header always sits on
 * a dark surface. Emits BreadcrumbList structured data.
 */
export function PageBand({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  crumbs = [],
  current,
  actions,
  size = "default",
}: Props) {
  const trail = [{ href: "/", label: "Home" }, ...crumbs];
  const jsonLd = current
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [...trail.map((c) => ({ name: c.label, path: c.href })), { name: current, path: null }].map(
          (c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.path ? { item: c.path } : {}),
          }),
        ),
      }
    : null;

  return (
    <section
      className={cn(
        "on-dark grain relative isolate flex items-end overflow-hidden bg-forest-950 text-white",
        size === "compact" ? "min-h-[44svh]" : "min-h-[62svh]",
      )}
    >
      {imageSrc ? (
        <>
          <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,14,10,0.7)_0%,rgba(8,14,10,0.45)_40%,rgba(8,14,10,0.9)_100%)]" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_85%_10%,rgba(201,168,90,0.2),transparent_60%),radial-gradient(60%_70%_at_5%_100%,rgba(47,86,67,0.6),transparent_65%)]"
        />
      )}

      <div className={cn("shell relative w-full pt-36", size === "compact" ? "pb-12" : "pb-14 sm:pb-20")}>
        {current ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/60">
              {trail.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <Link href={c.href} className="transition hover:text-white">
                    {c.label}
                  </Link>
                  <span aria-hidden>/</span>
                </li>
              ))}
              <li aria-current="page" className="text-white/90">
                {current}
              </li>
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-current opacity-60" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className={cn("mt-5 max-w-4xl text-balance", size === "compact" ? "t-h1" : "t-display")}>
          <MaskedText immediate delay={0.1}>
            {title}
          </MaskedText>
        </h1>
        {description || actions ? (
          <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            {description ? <div className="t-lead max-w-2xl text-white/80 text-pretty">{description}</div> : <span />}
            {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
          </div>
        ) : null}
      </div>

      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
    </section>
  );
}
