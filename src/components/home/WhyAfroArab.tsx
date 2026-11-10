import Link from "next/link";
import { ArchReveal } from "@/components/ui/ArchReveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

const points: Array<{ icon: IconName; title: string; body: string; href: string; cta: string }> = [
  {
    icon: "cube",
    title: "See it before you fly in",
    body: "Walk an estate in 3D, check plot sizes, road access and where the sun falls, then ask the same Accra sales team questions on WhatsApp.",
    href: "/lands/titled-lands-green-valley/explorer",
    cta: "Open the explorer",
  },
  {
    icon: "wallet",
    title: "Pay without interest",
    body: "Selected homes and plots come with interest-free schedules: a deposit, then equal monthly payments agreed in writing before you pay.",
    href: "/payment-plans",
    cta: "Payment plans",
  },
  {
    icon: "shield",
    title: "Know what you're buying",
    body: "Each plot lists its indenture, site plan and title status, so you know which documents are ready and can run your own search.",
    href: "/faq",
    cta: "Buyer questions",
  },
];

export function WhyAfroArab() {
  return (
    <Section tone="surface" labelledBy="why-title">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ArchReveal
            src="/images/projects/ibras-court.png"
            alt="Ibra's Court townhouses by Afro Arab Properties"
            className="aspect-[3/4] w-[78%]"
          />
          <ArchReveal
            src="/images/detail-entrance.jpg"
            alt="Entrance detail at an Afro Arab development"
            shape="rect"
            className="absolute -bottom-10 right-0 aspect-square w-[46%] rounded-[1.25rem] border-[6px] border-surface shadow-lux"
            sizes="(max-width: 768px) 46vw, 22vw"
          />
        </div>

        <div>
          <SectionHeading
            id="why-title"
            eyebrow="Why Afro Arab"
            title={
              <>
                Built for families <em>here and abroad.</em>
              </>
            }
          />
          <ol className="mt-12 space-y-10">
            {points.map((p, i) => (
              <li key={p.title}>
                <FadeUp delay={i * 0.08} className="grid grid-cols-[auto_1fr] gap-x-5">
                  <span className="font-figure row-span-3 pt-1 text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="flex items-center gap-2.5 font-display text-2xl font-light">
                    <Icon name={p.icon} size={20} className="text-gold" />
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-[0.97rem] leading-relaxed text-muted">{p.body}</p>
                  <Link href={p.href} className="group mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold">
                    <span className="link-draw">{p.cta}</span>
                    <Icon name="arrowRight" size={15} className="btn-arrow" />
                  </Link>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
