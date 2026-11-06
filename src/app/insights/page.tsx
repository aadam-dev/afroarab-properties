import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights",
  description: "Buyer guides and project updates from Afro Arab Properties.",
};

const posts = [
  {
    slug: "how-we-verify-project-facts",
    title: "How we verify project facts before publishing",
    excerpt:
      "Why conflicting sizes and inventory counts destroy trust — and the publication checklist we now enforce.",
  },
  {
    slug: "reading-a-plot-explorer",
    title: "How to use the plot explorer",
    excerpt:
      "Filter by facing and size, read status colours with labels, and enquire with plot context.",
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#080E14] pt-28 text-[#F4EFE6]">
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A059]">Insights</p>
        <h1 className="mt-3 font-display text-4xl font-light text-white sm:text-5xl">
          Guides for serious buyers
        </h1>
        <div className="divider-gold mt-8 max-w-xs" />
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-white/10 pb-6">
              <article>
                <h2 className="font-display text-2xl font-light text-white sm:text-3xl">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="transition hover:text-[#DFC283]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[#F4EFE6]/70">{post.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
