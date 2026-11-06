import Link from "next/link";
import { site } from "@/data/site";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/lands", label: "Lands & plot explorer" },
      { href: "/payment-plans", label: "Payment plans" },
      { href: "/contact", label: "Book a viewing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About Afro Arab" },
      { href: "/insights", label: "Insights" },
      { href: "/company#proof", label: "Awards & proof" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
      { href: "/cookies", label: "Cookie policy" },
      { href: "/payment-terms", label: "Payment terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-sand-100 grain">
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none text-white/[0.035]">
        Afro Arab
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.35fr_2fr] lg:px-8">
        <div>
          <p className="eyebrow text-gold-light">{site.name}</p>
          <p className="mt-4 font-display text-4xl text-white">Built for ownership</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand-200/80">
            Development and construction helping Ghanaians and the diaspora buy titled land and
            homes with clearer payment paths.
          </p>
          <p className="mt-8 text-sm leading-relaxed text-sand-200/70">
            {site.address.line1}
            <br />
            {site.address.line2}, {site.address.country}
            <br />
            <a href={`mailto:${site.email}`} className="text-gold-light underline underline-offset-4">
              {site.email}
            </a>
            <br />
            <a href={`tel:${site.phoneTel[0]}`} className="hover:text-white">
              {site.phones[0]}
            </a>
            {" / "}
            <a href={`tel:${site.phoneTel[1]}`} className="hover:text-white">
              {site.phones[1]}
            </a>
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sand-100/85 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 text-xs text-sand-200/55 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Data Protection Act 2012 (Act 843) — see Privacy.</p>
        </div>
      </div>
    </footer>
  );
}
