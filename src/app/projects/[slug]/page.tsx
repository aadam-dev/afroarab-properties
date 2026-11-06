import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { getProject, publishedProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.status === "draft") notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.summary,
    url: `/projects/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city,
      addressCountry: "GH",
      streetAddress: project.location,
    },
  };

  return (
    <div className="bg-sand-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="page-band relative pt-28">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <p className="eyebrow text-gold-light">{project.location}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-white text-balance sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-sand-100/90">{project.tagline}</p>
          <div className="divider-gold mt-10 max-w-xs" />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <article>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-500">{project.summary}</p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="surface-lux rounded-xl p-5">
              <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">Price</dt>
              <dd className="mt-2 font-mono-data text-lg text-forest-900">{project.priceDisplay}</dd>
            </div>
            <div className="surface-lux rounded-xl p-5">
              <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">Status</dt>
              <dd className="mt-2 text-lg capitalize text-forest-900">
                {project.status.replace("_", " ")}
              </dd>
            </div>
            {project.beds ? (
              <div className="surface-lux rounded-xl p-5">
                <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">Beds</dt>
                <dd className="mt-2 text-lg text-forest-900">{project.beds}</dd>
              </div>
            ) : null}
            {project.areaDisplay ? (
              <div className="surface-lux rounded-xl p-5">
                <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">Area</dt>
                <dd className="mt-2 text-lg text-forest-900">{project.areaDisplay}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10">
            <h2 className="font-display text-3xl text-forest-900">Highlights</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-stone-500">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 rounded-xl border border-gold/35 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-forest-800">
            <strong>Verification:</strong> {project.verificationNote} Last reviewed{" "}
            {project.lastVerified}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.hasPlotExplorer ? (
              <Link href={`/lands/${project.slug}/explorer`} className="btn-primary">
                Open plot explorer
              </Link>
            ) : null}
            {project.hasWalkthrough ? (
              <Link
                href={`/projects/${project.slug}/walkthrough`}
                className="inline-flex h-12 items-center rounded-lg border border-forest-800/15 px-5 text-sm font-semibold text-forest-800"
              >
                Floor plan walkthrough
              </Link>
            ) : null}
          </div>
        </article>

        <EnquiryForm
          projectSlug={project.slug}
          intent={project.status === "sold_out" ? "general" : "viewing"}
        />
      </div>
    </div>
  );
}
