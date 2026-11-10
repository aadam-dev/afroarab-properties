import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { SitePlan2D } from "@/components/explorer/SitePlan2D";
import { ArchReveal } from "@/components/ui/ArchReveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { SectionHeading } from "@/components/ui/Section";
import { formatGhs, getEstate, lowestPrice, plotLegend } from "@/data/masterplan";

export const metadata: Metadata = {
  title: "Land & plots",
  description:
    "Serviced, titled plots at Green Valley Estate, Greater Accra. Explore every plot in 3D with sizes, prices, road access and documents, then reserve by plot number.",
  alternates: { canonical: "/lands" },
};

const SLUG = "titled-lands-green-valley";
const EXPLORER = `/lands/${SLUG}/explorer`;

const checks: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "ruler", title: "Check the plot", body: "Frontage, depth, area and which roads it touches, straight from the site plan." },
  { icon: "doc", title: "Check the papers", body: "Indenture, Lands Commission site plan and title status are listed for every plot." },
  { icon: "pin", title: "Visit the site", body: "Book a viewing and stand on the plot. The pillars carry the same number you saw online." },
  { icon: "wallet", title: "Pay in steps", body: "Reserve with a deposit, then pay the balance monthly with no interest added." },
];

export default function LandsPage() {
  const estate = getEstate(SLUG)!;
  const legend = plotLegend(estate.plots);
  const from = lowestPrice(SLUG);

  return (
    <>
      <PageBand
        eyebrow="Land & plots"
        title={
          <>
            Titled plots, <em>ready to build on.</em>
          </>
        }
        description="Choose your plot by number, size and road access, see where the sun falls and what house fits, then reserve with the same number on the site plan."
        imageSrc="/images/lands-atmosphere.jpg"
        imageAlt="Illustrative aerial view of laid-out residential plots"
        current="Land & plots"
        actions={
          <Link href={EXPLORER} className="btn-gold btn-lg">
            <Icon name="cube" size={18} /> Explore in 3D
          </Link>
        }
      />

      <section className="section-y bg-background">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={estate.location}
              title={
                <>
                  {estate.name.split(" ").slice(0, -1).join(" ")} <em>{estate.name.split(" ").slice(-1)}</em>
                </>
              }
              lead="A gated layout with a 12 m boulevard from the gate, 9 m streets, a children's park and a landscaped buffer. Plots are 70, 80 or 100 ft wide and 100 ft deep."
            />
            <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-border py-7">
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">Plots</dt>
                <dd className="font-figure mt-1 text-4xl">{estate.plots.length}</dd>
              </div>
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">Available</dt>
                <dd className="font-figure mt-1 text-4xl text-available">{legend.available}</dd>
              </div>
              <div>
                <dt className="t-meta text-[0.62rem] text-muted">From</dt>
                <dd className="font-figure mt-1 text-3xl">{from ? formatGhs(from) : "—"}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={EXPLORER} className="btn-ink">
                Open the explorer <Icon name="arrowRight" size={16} className="btn-arrow" />
              </Link>
              <Link href={`${EXPLORER}?plot=1`} className="btn-outline-gold">
                Start at plot 1
              </Link>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Layout, statuses and prices are indicative until Afro Arab&apos;s surveyed masterplan and
              price list are loaded. Sales confirms every plot before payment.
            </p>
          </div>

          <FadeUp>
            <Link href={EXPLORER} className="group relative block overflow-hidden rounded-[1.5rem] border border-border bg-[#cfe0e6] p-4 shadow-lux sm:p-6">
              <SitePlan2D estate={estate} className="h-auto w-full transition duration-700 group-hover:scale-[1.015]" />
              <span className="glass-panel absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                <Icon name="cube" size={16} /> Open in 3D
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <ArchReveal src="/images/lands-prampram.jpg" alt="Land along the Prampram coast" className="mx-auto aspect-[4/5] w-full max-w-sm" />
          <div>
            <SectionHeading
              eyebrow="Buying land safely"
              title={
                <>
                  Four checks <em>before you pay.</em>
                </>
              }
            />
            <ol className="mt-10 grid gap-8 sm:grid-cols-2">
              {checks.map((c, i) => (
                <li key={c.title}>
                  <FadeUp delay={i * 0.06}>
                    <Icon name={c.icon} size={22} className="text-gold" />
                    <h3 className="t-h3 mt-3">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
                  </FadeUp>
                </li>
              ))}
            </ol>
            <Link href="/faq" className="group mt-10 inline-flex items-center gap-1.5 text-sm font-semibold">
              <span className="link-draw">More buyer questions</span>
              <Icon name="arrowRight" size={15} className="btn-arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
