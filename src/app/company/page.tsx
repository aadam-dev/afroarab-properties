import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { SalesContact } from "@/components/site/SalesContact";
import { ArchReveal } from "@/components/ui/ArchReveal";
import { Icon } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { SectionHeading } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { allPlots } from "@/data/masterplan";
import { publishedProjects } from "@/data/projects";
import { leadership, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Afro Arab",
  description:
    "Afro Arab Properties, a member of the Afro Arab Group, develops homes and titled land across Greater Accra for buyers in Ghana and the diaspora.",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  const projects = publishedProjects();
  const housing = projects.filter((p) => p.type !== "land").length;
  return (
    <>
      <PageBand
        eyebrow="About"
        title={
          <>
            Building homes <em>Ghanaians can own.</em>
          </>
        }
        description={`${site.name} is a member of the ${site.group}, developing townhouses, apartment courts and titled land across Greater Accra.`}
        imageSrc="/images/detail-entrance.jpg"
        imageAlt="Entrance detail at an Afro Arab development"
        current="About"
      />

      <section className="section-y bg-background">
        <div className="shell grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  Everyone can <em>buy a house.</em>
                </>
              }
            />
            <FadeUp className="t-lead mt-6 max-w-xl space-y-4 text-muted">
              <p>
                Afro Arab develops residential estates and serviced land for families in Ghana and
                for Ghanaians abroad who want a home to return to.
              </p>
              <p>
                Interest-free payment plans on selected homes and plots spread the cost into
                monthly steps, and every plot can be explored in 3D before a site visit.
              </p>
            </FadeUp>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">Housing estates</dt>
                <dd className="font-figure mt-1 text-4xl"><StatCounter value={housing} /></dd>
              </div>
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">Plots mapped in 3D</dt>
                <dd className="font-figure mt-1 text-4xl"><StatCounter value={allPlots.length} /></dd>
              </div>
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">Interest on plans</dt>
                <dd className="font-figure mt-1 text-4xl">0%</dd>
              </div>
            </dl>
          </div>
          <ArchReveal src="/images/hero-compound.jpg" alt="An Afro Arab residential compound at sunset" className="mx-auto aspect-[4/5] w-full max-w-md" />
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="shell">
          <SectionHeading
            eyebrow="Leadership"
            title={
              <>
                The people <em>behind the estates.</em>
              </>
            }
            lead="As published on Afro Arab's current About page."
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {leadership.map((person, i) => (
              <li key={person.name}>
                <FadeUp delay={i * 0.08}>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-surface-muted">
                    <Image
                      src={person.image}
                      alt={person.imageAlt}
                      fill
                      className="object-cover object-top grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  </div>
                  <h3 className="t-h3 mt-5">{person.name}</h3>
                  <p className="t-meta mt-1.5 text-[0.64rem] text-gold">{person.role}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-surface-muted">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Talk to us"
              title={
                <>
                  Visit the office <em>or call sales.</em>
                </>
              }
              lead="The same Accra sales lines and WhatsApp number buyers already use."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-ink">
                View estates <Icon name="arrowRight" size={16} className="btn-arrow" />
              </Link>
              <Link href="/contact" className="btn-outline-gold">
                Book a viewing
              </Link>
            </div>
          </div>
          <SalesContact />
        </div>
      </section>
    </>
  );
}
