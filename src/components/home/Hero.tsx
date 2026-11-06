import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-forest-950 text-white grain">
      <Image
        src="/images/hero-lamins.jpg"
        alt="Lamin’s Court townhouses by Afro Arab Properties"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[55%_40%]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,22,18,0.92)_0%,rgba(12,22,18,0.78)_38%,rgba(12,22,18,0.45)_66%,rgba(12,22,18,0.7)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-0 opacity-20 site-plan-grid mix-blend-soft-light" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forest-950 via-forest-950/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:justify-center sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <p className="eyebrow anim-fade-rise text-gold-light">
          Accra · Greater Accra · Diaspora
        </p>

        <p className="mt-3 font-display text-[clamp(2.75rem,11vw,7.75rem)] leading-[0.9] tracking-[-0.03em] text-white sm:mt-5">
          Afro Arab
          <span className="mt-1 block text-gold">Properties</span>
        </p>

        <h1 className="anim-fade-rise anim-fade-rise-delay-1 mt-5 max-w-xl text-balance text-xl font-medium leading-snug text-sand-100 sm:mt-7 sm:text-3xl lg:text-[2.05rem]">
          Everyone can buy a house — when the project facts are clear.
        </h1>

        <p className="anim-fade-rise anim-fade-rise-delay-2 mt-3 max-w-lg text-pretty text-sm leading-relaxed text-sand-200/90 sm:mt-4 sm:text-lg">
          Interest-free payment paths, titled land, and Accra-corridor homes — with live plot
          availability and walkthrough-ready floor plans.
        </p>

        <div className="anim-fade-rise anim-fade-rise-delay-3 mt-6 flex flex-wrap gap-3 sm:mt-9">
          <Link href="/projects" className="btn-primary">
            Explore projects
          </Link>
          <Link href="/lands/titled-lands-green-valley/explorer" className="btn-ghost">
            Open plot explorer
          </Link>
        </div>

        <div className="mt-8 hidden flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-[0.68rem] uppercase tracking-[0.18em] text-sand-200/70 sm:mt-14 sm:flex">
          <span>Titled land process</span>
          <span className="text-gold/50" aria-hidden>
            ◆
          </span>
          <span>Interest-free plans</span>
          <span className="text-gold/50" aria-hidden>
            ◆
          </span>
          <span>Live inventory</span>
        </div>
      </div>
    </section>
  );
}
