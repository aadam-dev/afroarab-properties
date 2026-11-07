import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
        <header className="mx-auto max-w-3xl px-4 pt-28 sm:px-6 lg:px-8">
          <Link
            href="/plotline"
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            ← Plotline
          </Link>
          <p className="mt-8 font-mono-data text-xs uppercase tracking-[0.16em] text-muted">
            {formatPlotlineDate(post.date)} · {plotlineCategoryLabel[post.category]}
          </p>
          <h1 className="mt-4 font-display text-4xl font-light text-balance sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="prose-lux mt-6 text-muted text-pretty">{post.excerpt}</p>
        </header>

        {post.image ? (
          <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 64rem"
              />
            </div>
          </div>
        ) : null}

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
