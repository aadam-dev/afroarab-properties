import Link from "next/link";
import { site, whatsappHref } from "@/data/site";
import { BrandLogo } from "./BrandLogo";

const columns = [
  {
    title: "Estates & Land",
    links: [
      { href: "/projects", label: "Estates" },
      { href: "/lands", label: "Titled lands" },
      { href: "/#plot-explorer", label: "Plot explorer" },
    ],
  },
  {
    title: "Financing",
    links: [
      { href: "/payment-plans", label: "Payment plans" },
      { href: "/payment-terms", label: "Payment terms" },
      { href: "/contact", label: "Book a viewing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/insights", label: "Insights" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted text-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <BrandLogo size="footer" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Homes and titled land across Greater Accra, with clearer inventory and
            interest-free payment paths for Ghana and the diaspora.
          </p>
          <div className="mt-6 space-y-1 text-sm text-muted">
            <p>
              {site.address.line1}, {site.address.line2}, {site.address.country}
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-foreground underline underline-offset-4">
                {site.email}
              </a>
            </p>
            <p>
              <a href={`tel:${site.phoneTel[0]}`}>{site.phones[0]}</a>
              {" · "}
              <a href={`tel:${site.phoneTel[1]}`}>{site.phones[1]}</a>
            </p>
            <p className="pt-2">
              <a
                href={whatsappHref("Hello Afro Arab sales — I’d like to arrange a viewing.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground underline underline-offset-4"
              >
                WhatsApp sales
              </a>
            </p>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition hover:text-foreground"
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

      <div className="border-t border-border px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Afro Arab Properties Ltd.</p>
          <p>Data Protection Act 2012 (Act 843)</p>
        </div>
      </div>
    </footer>
  );
}
