import Link from "next/link";
import { OpenAssistantButton } from "@/components/assistant/OpenAssistantButton";
import { site, whatsappHref } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { BrandLogo } from "./BrandLogo";

const EXPLORER_HREF = "/lands/titled-lands-green-valley/explorer";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/projects", label: "Estates & courts" },
      { href: "/lands", label: "Land & plots" },
      { href: EXPLORER_HREF, label: "3D plot explorer" },
      { href: "/payment-plans", label: "Payment plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About Afro Arab" },
      { href: "/plotline", label: "Plotline news" },
      { href: "/faq", label: "Buyer FAQ" },
      { href: "/contact", label: "Contact & viewings" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/payment-terms", label: "Payment terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms of use" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-forest-950 text-white">
      {/* CTA band */}
      <div className="shell grid gap-10 border-b border-white/10 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <h2 className="t-h1 max-w-2xl text-balance">
          Find your plot. <em>Build your home.</em>
        </h2>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href={EXPLORER_HREF} className="btn-gold btn-lg">
            <Icon name="cube" size={18} /> Explore in 3D
          </Link>
          <Link href="/contact" className="btn-ghost btn-lg">
            Book a viewing
          </Link>
        </div>
      </div>

      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.15fr_2fr]">
        <div>
          <BrandLogo size="footer" surface="dark" />
          <p className="t-lead mt-6 max-w-sm text-white/70">
            Homes and titled land across Greater Accra, with interest-free payment plans for buyers
            in Ghana and abroad.
          </p>
          <address className="mt-8 space-y-2.5 text-sm not-italic text-white/75">
            <p className="flex items-start gap-2.5">
              <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-[#e3c88c]" />
              {site.address.line1}, {site.address.line2}, {site.address.country}
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="phone" size={17} className="shrink-0 text-[#e3c88c]" />
              <span>
                {site.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? " · " : null}
                    <a href={`tel:${site.phoneTel[i]}`} className="link-draw hover:text-white">
                      {p}
                    </a>
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="mail" size={17} className="shrink-0 text-[#e3c88c]" />
              <a href={`mailto:${site.email}`} className="link-draw hover:text-white">
                {site.email}
              </a>
            </p>
          </address>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
            <a
              href={whatsappHref("Hello Afro Arab sales, I'd like to arrange a viewing.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold transition hover:border-[#e3c88c] hover:text-[#e3c88c]"
            >
              <Icon name="whatsapp" size={17} /> WhatsApp sales
            </a>
            <span className="text-white/70">
              or <OpenAssistantButton className="font-semibold text-white underline underline-offset-4" />
            </span>
          </div>
        </div>

        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="t-meta text-[0.64rem] text-[#e3c88c]">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-draw text-[0.95rem] text-white/75 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="shell font-display text-[clamp(4.5rem,17.5vw,17rem)] font-light leading-[0.78] tracking-[-0.045em] text-transparent [-webkit-text-stroke:1px_rgba(227,200,140,0.35)]">
          Afro Arab
        </p>
      </div>

      <div className="border-t border-white/10">
        {/* Right padding keeps the credit clear of the floating guide launcher. */}
        <div className="shell flex flex-col gap-x-8 gap-y-3 py-6 pb-28 text-xs text-white/55 sm:flex-row sm:flex-wrap sm:items-center sm:pb-6 lg:pr-72">
          <p>
            © {year} {site.name} Ltd · A member of the {site.group}
          </p>
          <p>Personal data handled under Ghana&apos;s Data Protection Act, 2012 (Act 843)</p>
          <p>
            Built by{" "}
            <a
              href="https://aadambuilds.dev"
              target="_blank"
              rel="noopener"
              className="font-semibold text-white/80 underline-offset-4 transition hover:text-[#e3c88c] hover:underline"
            >
              Aadam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
