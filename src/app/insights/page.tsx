import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights",
  description: "Buyer guides from Afro Arab Properties.",
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
    <div className="min-h-screen bg-background pt-28 text-foreground">
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="eyebrow">Insights</p>
        <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">
          Guides for serious buyers
        </h1>
        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border pb-8">
              <h2 className="font-display text-2xl font-light sm:text-3xl">
                <Link href={`/insights/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
