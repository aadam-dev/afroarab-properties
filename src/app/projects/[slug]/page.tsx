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
    title: `${project.name} · Afro-Arab Properties`,
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
    <div className="bg-[#080E14] text-[#F4EFE6] min-h-screen">
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
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            {project.location} &bull; {project.city}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.05] text-white text-balance sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-[#F4EFE6]/80">{project.tagline}</p>
          <div className="divider-gold mt-10 max-w-xs" />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <article>
          <p className="max-w-2xl text-lg leading-relaxed text-[#F4EFE6]/75">{project.summary}</p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Valuation</dt>
              <dd className="mt-2 font-mono-data text-xl text-white">{project.priceDisplay}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Inventory Status</dt>
              <dd className="mt-2 text-xl capitalize text-white">
                {project.status.replace("_", " ")}
              </dd>
            </div>
            {project.beds ? (
              <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Bedrooms</dt>
                <dd className="mt-2 text-xl text-white">{project.beds} Bedrooms</dd>
              </div>
            ) : null}
            {project.areaDisplay ? (
              <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Floor Area</dt>
                <dd className="mt-2 text-xl text-white">{project.areaDisplay}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-light text-white">Development Highlights</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-[#F4EFE6]/75">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5A059]" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-xl border border-[#C5A059]/30 bg-[#101822] px-5 py-4 text-xs leading-relaxed text-[#F4EFE6]/80">
            <strong className="text-[#C5A059]">Title & Verification Notice:</strong> {project.verificationNote} Registered with Ghana Lands Commission.
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {project.hasPlotExplorer ? (
              <Link href={`/lands/${project.slug}/explorer`} className="btn-gold">
                Open Vector Plot Explorer
              </Link>
            ) : null}
            {project.hasWalkthrough ? (
              <Link
                href={`/projects/${project.slug}/walkthrough`}
                className="btn-outline-gold"
              >
                Launch 360° Floor Plan Walkthrough
              </Link>
            ) : null}
            <Link href="/payment-plans" className="btn-outline-gold">
              60-Month 0% Calculator
            </Link>
          </div>
        </article>

        <div>
          <EnquiryForm
            projectSlug={project.slug}
            intent={project.status === "sold_out" ? "general" : "viewing"}
          />
        </div>
      </div>
    </div>
  );
}
