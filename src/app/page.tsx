import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ProvenanceStrip } from "@/components/home/ProvenanceStrip";
import { TaglineReveal } from "@/components/home/TaglineReveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { publishedProjects } from "@/data/projects";

export default function HomePage() {
  const featured = publishedProjects()
    .filter((p) => p.featured || ["cephas-court", "hassy-homes", "lamins-court"].includes(p.slug))
    .slice(0, 5);

  return (
    <>
      <Hero />
      <FeaturedProjects projects={featured} />
      <TaglineReveal />
      <ProvenanceStrip />

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <div className="lg:pt-6">
            <p className="eyebrow">Private viewing</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl text-forest-900 text-balance sm:text-5xl">
              Speak with sales about the project that fits
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-500 text-pretty">
              Tell us where you are looking — Spintex, East Legon Hills, Prampram land, or a
              townhouse community — and we will return with availability and payment options.
            </p>
            <div className="divider-gold mt-10 max-w-[12rem]" />
          </div>
          <EnquiryForm intent="viewing" />
        </div>
      </section>
    </>
  );
}
