import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { SalesContact } from "@/components/site/SalesContact";
import { leadership } from "@/data/site";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Afro Arab Properties — a subsidiary of the Afro-Arab Group of Companies.",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageBand
        eyebrow="Company"
        title="Afro Arab Properties"
        description="A subsidiary of the Afro-Arab Group of Companies, developing homes and titled land across Greater Accra."
        imageSrc="/images/detail-entrance.jpg"
        imageAlt="Afro Arab corporate entrance"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-light">About</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Afro Arab Properties markets residential estates and titled land with clearer
            inventory presentation and interest-free payment pathways on selected stock.
            Large national housing-count claims are treated as marketing goals until the
            client provides verified programme documentation.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-3xl font-light">Leadership</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Published on the current Afro Arab About page. Biographies and awards stay
            unpublished until the client confirms copy and certificates.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {leadership.map((person) => (
              <li key={person.name}>
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
                  <Image
                    src={person.image}
                    alt={person.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl font-light">{person.name}</h3>
                <p className="mt-1 text-sm text-muted">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-light">Sales support</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              The same Accra sales lines and WhatsApp path buyers already use on the
              current site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                View estates
              </Link>
              <Link href="/contact" className="btn-outline-gold">
                Book a viewing
              </Link>
            </div>
          </div>
          <SalesContact />
        </div>
      </div>
    </div>
  );
}
