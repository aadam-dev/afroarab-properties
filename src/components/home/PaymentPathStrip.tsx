import Link from "next/link";
import { formatGhs, lowestPrice } from "@/data/masterplan";
import { instalmentPlan, LAND_PLAN_OPTIONS } from "@/lib/payments";
import { Icon } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function PaymentPathStrip() {
  const from = lowestPrice("titled-lands-green-valley") ?? 87500;
  const plan = instalmentPlan(from, LAND_PLAN_OPTIONS.defaultDeposit, LAND_PLAN_OPTIONS.defaultMonths);
  const steps = [
    { k: "Reserve", v: "Choose a plot or unit and confirm availability with sales." },
    { k: "Deposit", v: "Pay the agreed deposit and sign the payment schedule." },
    { k: "Monthly", v: "Equal monthly payments with no interest added." },
    { k: "Handover", v: "Documents released on completion of the schedule." },
  ];

  return (
    <Section tone="band" labelledBy="pay-title" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,90,0.18),transparent_65%)]" />
      <Container className="relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <SectionHeading
            id="pay-title"
            eyebrow="Payment plans"
            title={
              <>
                Own it in <em>monthly steps.</em>
              </>
            }
            lead="Interest-free schedules on selected homes and plots. Agree the terms in writing with sales before you pay anything."
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.k} className="bg-band p-5">
                <p className="font-figure text-sm text-[#e3c88c]">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 font-display text-xl font-light">{s.k}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-band-fg/70">{s.v}</p>
              </li>
            ))}
          </ol>
        </div>

        <FadeUp className="rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
          <p className="t-meta text-[0.62rem] text-band-fg/60">Example · a 70 × 100 ft plot at Green Valley</p>
          <p className="font-figure mt-4 text-5xl leading-none sm:text-6xl">{formatGhs(plan.monthly)}</p>
          <p className="mt-2 text-sm text-band-fg/70">a month for {plan.months} months, after a {formatGhs(plan.deposit)} deposit ({plan.depositPercent}%)</p>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#e3c88c]" style={{ width: `${plan.depositPercent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-band-fg/60">
            <span>Deposit {plan.depositPercent}%</span>
            <span>Balance over {plan.months} months · 0% interest</span>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-band-fg/55">
            Total {formatGhs(plan.price)}. Indicative figures from the demo layout; sales confirms the
            price and schedule for each plot.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/payment-plans" className="btn-gold">
              Work out a plan <Icon name="arrowRight" size={17} className="btn-arrow" />
            </Link>
            <Link href="/payment-terms" className="btn-ghost">
              Read the terms
            </Link>
          </div>
        </FadeUp>
      </Container>
    </Section>
  );
}
