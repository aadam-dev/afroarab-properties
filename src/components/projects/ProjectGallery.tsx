"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function ProjectGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  if (!images.length) return null;
  const [lead, ...rest] = images;

  return (
    <section id="gallery" className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-2xl">
          <p className="eyebrow">Gallery</p>
          <h2 className="mt-3 font-display text-3xl font-light text-balance sm:text-4xl">
            Exterior views of {name}
          </h2>
          <p className="prose-lux mt-3 text-muted">
            Photography from the public listing. Interiors and 360 tours arrive when client
            assets are available.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <ScrollReveal variant="left" className="relative aspect-[4/5] overflow-hidden bg-surface-muted lg:col-span-7 lg:aspect-[4/3]">
            <Image
              src={lead}
              alt={`${name} primary exterior`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
            />
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.slice(0, 2).map((src, i) => (
              <ScrollReveal
                key={src}
                variant="right"
                delay={0.08 + i * 0.06}
                className="relative aspect-[4/3] overflow-hidden bg-surface-muted"
              >
                <Image
                  src={src}
                  alt={`${name} exterior ${i + 2}`}
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 50vw, 35vw"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {rest.length > 2 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {rest.slice(2).map((src, i) => (
              <li key={src}>
                <ScrollReveal delay={0.05 * i} className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  <Image
                    src={src}
                    alt={`${name} exterior ${i + 4}`}
                    fill
                    className="object-cover transition duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
