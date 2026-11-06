import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles: Record<
  string,
  { title: string; body: string[] }
> = {
  "how-we-verify-project-facts": {
    title: "How we verify project facts before publishing",
    body: [
      "The previous Afro Arab website showed conflicting property sizes, locations, and inventory counts. In real estate, that is not a copy issue — it is a trust issue.",
      "This rebuild introduces a publication checklist: status, price display, location, unit facts, last-verified date, and a verification note. Conflicting required fields cannot go live.",
      "Buyers should still confirm final commercial terms with Afro Arab sales before payment.",
    ],
  },
  "reading-a-plot-explorer": {
    title: "How to use the plot explorer",
    body: [
      "Start in Plan mode on mobile. Search by plot number or filter by facing, size, availability, and corner plots.",
      "Status is shown with colour and text labels. Availability is driven by inventory records, not by colours painted into a 3D file.",
      "Sun path is indicative until the estate’s surveyed coordinates and true-north rotation are confirmed.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  return { title: article?.title ?? "Insight" };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: { "@type": "Organization", name: "Afro Arab Properties" },
  };

  return (
    <div className="min-h-screen bg-[#080E14] pt-28 text-[#F4EFE6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link
          href="/insights"
          className="text-sm text-[#C5A059] underline-offset-4 hover:underline"
        >
          ← All insights
        </Link>
        <h1 className="mt-4 font-display text-4xl font-light text-white text-balance sm:text-5xl">
          {article.title}
        </h1>
        <div className="divider-gold mt-8 max-w-xs" />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#F4EFE6]/75">
          {article.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
