import Image from "next/image";
import Link from "next/link";
import { plotlineCategoryLabel, plotlinePosts } from "@/data/plotline";
import { Icon } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/MaskedText";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PlotlineTeasers() {
  const posts = [...plotlinePosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <Section labelledBy="plotline-title">
      <Container>
        <SectionHeading
          id="plotline-title"
          eyebrow="Plotline"
          title={
            <>
              News, offers <em>and buyer guides.</em>
            </>
          }
          action={
            <Link href="/plotline" className="btn-outline-gold">
              All stories <Icon name="arrowRight" size={16} className="btn-arrow" />
            </Link>
          }
        />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <FadeUp delay={i * 0.08}>
                <Link href={`/plotline/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-surface-muted">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="site-plan-grid absolute inset-0 flex items-end bg-[radial-gradient(120%_90%_at_80%_10%,#2f5643_0%,#15261d_55%,#0f1c16_100%)] p-6 text-white/10">
                        <span className="font-display text-[5.5rem] font-light italic leading-none text-[#e3c88c]/80 transition duration-700 group-hover:translate-x-1">
                          {plotlineCategoryLabel[p.category]}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground">
                      {plotlineCategoryLabel[p.category]}
                    </span>
                  </div>
                  <p className="t-meta mt-4 text-[0.64rem] text-muted">
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </p>
                  <h3 className="mt-2 font-display text-[1.45rem] font-light leading-snug text-balance">
                    <span className="link-draw">{p.title}</span>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
