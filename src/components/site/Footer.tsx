import Link from "next/link";
import { site } from "@/data/site";

const columns = [
  {
    title: "Estates & Land",
    links: [
      { href: "/projects", label: "Executive Estates" },
      { href: "/lands", label: "Titled Lands Bank" },
      { href: "/#plot-explorer", label: "Live Plot Explorer" },
      { href: "/#floor-plan", label: "Spatial Floor Plans" },
    ],
  },
  {
    title: "Financing & Terms",
    links: [
      { href: "/payment-plans", label: "60-Month 0% Financing" },
      { href: "/payment-terms", label: "Official Payment Terms" },
      { href: "/#payment-calculator", label: "Mortgage Simulator" },
      { href: "/contact", label: "Book VIP Site Viewing" },
    ],
  },
  {
    title: "Corporate & Legal",
    links: [
      { href: "/company", label: "Afro-Arab Group Heritage" },
      { href: "/insights", label: "Market Insights" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#080E14] text-[#F4EFE6] border-t border-white/10">
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 font-display text-[20vw] font-light leading-none text-white/[0.02]">
        AFRO-ARAB
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.35fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C5A059]/40 bg-[#101822] font-display text-base font-bold text-[#C5A059]">
              AA
            </span>
            <span className="font-display text-xl font-light tracking-tight text-white">
              Afro-Arab <span className="font-normal italic text-[#C5A059]">Properties</span>
            </span>
          </div>

          <p className="mt-4 font-display text-3xl font-light text-white">
            Architecting Generational Wealth
          </p>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F4EFE6]/70">
            A proud subsidiary of the Afro-Arab Group of Companies. Pioneering 200,000 housing
            units and litigation-free titled lands across Ghana with direct developer 0% financing.
          </p>

          <div className="mt-8 space-y-1.5 text-xs text-[#F4EFE6]/65">
            <p className="font-semibold text-white">Headquarters:</p>
            <p>{site.address.line1}, {site.address.line2}, {site.address.country}</p>
            <p>
              Inquiries:{" "}
              <a href={`mailto:${site.email}`} className="text-[#DFC283] underline underline-offset-4">
                {site.email}
              </a>
            </p>
            <p>
              VIP Concierge:{" "}
              <a href={`tel:${site.phoneTel[0]}`} className="hover:text-white">
                {site.phones[0]}
              </a>
              {" / "}
              <a href={`tel:${site.phoneTel[1]}`} className="hover:text-white">
                {site.phones[1]}
              </a>
            </p>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#F4EFE6]/75 transition-colors hover:text-white"
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

      <div className="relative border-t border-white/10 px-4 py-6 text-xs text-[#F4EFE6]/50 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Afro-Arab Properties Ltd. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Data Protection Act 2012 (Act 843)</span>
            <span>&bull;</span>
            <span>Government Surveyed Cadastral Proof</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
