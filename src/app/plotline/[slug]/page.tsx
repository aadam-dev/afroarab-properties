import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { notFound } from "next/navigation";
import {
  formatPlotlineDate,
  getPlotlinePost,
  plotlineCategoryLabel,
  plotlinePosts,
  plotlineSorted,
} from "@/data/plotline";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return plotlinePosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPlotlinePost(slug);
  if (!post) return { title: "Plotline" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PlotlineArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPlotlinePost(slug);
  if (!post) notFound();

  const related = plotlineSorted()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article>
        <PageBand
          eyebrow={`${formatPlotlineDate(post.date)} · ${plotlineCategoryLabel[post.category]}`}
          title={post.title}
          description={post.excerpt}
          imageSrc={post.image}
          imageAlt={post.imageAlt ?? ""}
          crumbs={[{ href: "/plotline", label: "Plotline" }]}
          current={plotlineCategoryLabel[post.category]}
          size="compact"
        />

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {post.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          {post.sources?.length ? (
            <aside className="mt-12 border-t border-border pt-8">
              <p className="font-mono-data text-xs uppercase tracking-[0.16em] text-muted">
                Reported in
              </p>
              <ul className="mt-3 space-y-2">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground underline underline-offset-4"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                Marketing terms in press coverage should be confirmed with Afro Arab sales
                before payment.
              </p>
            </aside>
          ) : null}

          <div className="mt-14 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              View estates
            </Link>
            <Link href="/contact" className="btn-outline-gold">
              Talk to sales
            </Link>
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-light">More on Plotline</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted">
                  {formatPlotlineDate(p.date)}
                </p>
                <h3 className="mt-2 font-display text-xl font-light">
                  <Link
                    href={`/plotline/${p.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {p.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
