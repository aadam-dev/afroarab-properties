import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";
import { publishedProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Lands",
  description: "Explore Afro Arab titled land projects with live plot availability.",
};

export default function LandsPage() {
  const lands = publishedProjects().filter((p) => p.type === "land" || p.hasPlotExplorer);

  return (
    <div className="bg-sand-50">
      <PageBand
        eyebrow="Lands"
        title="Titled land you can explore live"
        description="Pick a development, filter plots by size and facing, and enquire with the exact plot number — availability comes from inventory records, not a static image."
        imageSrc="/images/lands-prampram.jpg"
        imageAlt="Afro Arab land corridor imagery"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-5">
          {lands.map((land) => (
            <li key={land.slug}>
              <Link
                href={`/lands/${land.slug}/explorer`}
                className="group grid overflow-hidden rounded-[1.15rem] border border-sand-200/80 bg-white transition hover:shadow-[var(--shadow-soft)] md:grid-cols-[0.85fr_1.15fr]"
              >
                <div className="relative min-h-[200px]">
                  <Image
                    src={land.image}
                    alt={land.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <h2 className="font-display text-3xl text-forest-900 sm:text-4xl">{land.name}</h2>
                  <p className="mt-3 max-w-xl text-stone-500">{land.summary}</p>
                  <span className="btn-primary mt-8 w-fit">Open explorer</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
