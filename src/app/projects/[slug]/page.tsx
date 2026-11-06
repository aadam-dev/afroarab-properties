import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { LocationMap } from "@/components/site/LocationMap";
import { SalesContact } from "@/components/site/SalesContact";
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
    title: `${project.name} · Afro Arab Properties`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.status === "draft") notFound();

  const gallery = project.gallery?.length ? project.gallery : [project.image];

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
    <div className="min-h-screen bg-background text-foreground">
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
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.16em] text-gold-light">
            {project.location} · {project.city}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{project.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <article>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>

          {gallery.length > 1 ? (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-light">Exterior gallery</h2>
              <p className="mt-2 text-sm text-muted">
                Marketing photographs from the public site. Interior photography is not
                available for this rebuild yet.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {gallery.map((src) => (
                  <li key={src} className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                    <Image
                      src={src}
                      alt={`${project.name} exterior`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-surface p-5">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">Location</dt>
              <dd className="mt-2 text-xl">
                {project.location}
                <span className="mt-1 block text-sm text-muted">{project.city}</span>
              </dd>
            </div>
            <div className="border border-border bg-surface p-5">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">Price</dt>
              <dd className="mt-2 font-mono-data text-xl">{project.priceDisplay}</dd>
            </div>
            <div className="border border-border bg-surface p-5">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">Status</dt>
              <dd className="mt-2 text-xl capitalize">{project.status.replace("_", " ")}</dd>
            </div>
            {project.beds ? (
              <div className="border border-border bg-surface p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Bedrooms</dt>
                <dd className="mt-2 text-xl">{project.beds}</dd>
              </div>
            ) : null}
            {project.areaDisplay ? (
              <div className="border border-border bg-surface p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Floor area</dt>
                <dd className="mt-2 text-xl">{project.areaDisplay}</dd>
              </div>
            ) : null}
          </dl>

          {project.mapQuery ? (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-light">Location</h2>
              <p className="mt-2 text-sm text-muted">
                Map embed restored from the live Afro Arab listing for {project.name}.
              </p>
              <LocationMap
                className="mt-5"
                query={project.mapQuery}
                zoom={project.mapZoom ?? 14}
                title={`${project.name} — ${project.location}`}
              />
            </div>
          ) : null}

          <div className="mt-10">
            <h2 className="font-display text-2xl font-light">Highlights</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border border-border bg-surface-muted px-5 py-4 text-xs leading-relaxed text-muted">
            <strong className="text-foreground">Verification:</strong> {project.verificationNote}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.hasPlotExplorer ? (
              <Link href={`/lands/${project.slug}/explorer`} className="btn-primary">
                Open plot explorer
              </Link>
            ) : null}
            {project.hasWalkthrough ? (
              <Link href={`/projects/${project.slug}/walkthrough`} className="btn-outline-gold">
                Floor plan preview
              </Link>
            ) : null}
            <Link href="/payment-plans" className="btn-outline-gold">
              Payment plans
            </Link>
          </div>
        </article>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <SalesContact projectName={project.name} compact />
          <EnquiryForm
            projectSlug={project.slug}
            intent={project.status === "sold_out" ? "general" : "viewing"}
          />
        </div>
      </div>
    </div>
  );
}
