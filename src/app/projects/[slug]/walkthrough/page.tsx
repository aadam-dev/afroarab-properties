import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HouseExplorer } from "@/components/house/HouseExplorer";
import { PageBand } from "@/components/site/PageBand";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Icon } from "@/components/ui/Icon";
import { getHouse } from "@/data/houses";
import { getProject, publishedProjects } from "@/data/projects";
import { whatsappHref } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedProjects()
    .filter((p) => p.hasWalkthrough && getHouse(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.name} in 3D` : "Explore in 3D",
    description: project
      ? `Walk through ${project.name} in 3D: the outside, each floor and every room, built from photographs of the finished house.`
      : undefined,
  };
}

export default async function WalkthroughPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const house = getHouse(slug);
  if (!project?.hasWalkthrough || !house) notFound();
  const { meta } = house;

  return (
    <>
      <PageBand
        eyebrow="Explore in 3D"
        title={
          <>
            {project.name}, <em>inside and out.</em>
          </>
        }
        description="Walk around the house, lift off each floor, and step inside the rooms. The camera pins show where the real photographs were taken."
        crumbs={[
          { href: "/projects", label: "Estates" },
          { href: `/projects/${project.slug}`, label: project.name },
        ]}
        current="3D model"
        size="compact"
        actions={
          <Link href={`/projects/${project.slug}`} className="btn-ghost">
            <Icon name="arrowLeft" size={16} /> Back to {project.name}
          </Link>
        }
      />

      <section className="bg-background py-8 sm:py-12">
        <div className="shell">
          <HouseExplorer house={house} projectName={project.name} />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            <strong className="text-foreground">Indicative layout.</strong> This model was built from {meta.photos.length} photographs of the
            finished house. Parts the photos show are modelled to match them; rooms and sizes the photos don&apos;t show are
            our best estimate. It will be updated when Afro Arab publishes the architectural drawings.
          </p>
        </div>
      </section>

      <section className="bg-background pb-16 sm:pb-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">Rooms</p>
            <h2 className="t-h2 mt-3">
              Room by room, <em>approximately.</em>
            </h2>
            {meta.levels.map((lv) => (
              <div key={lv.id} className="mt-8">
                <h3 className="t-meta text-muted">{lv.name}</h3>
                <table className="mt-3 w-full text-left text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Room</th>
                      <th scope="col">Size</th>
                      <th scope="col">Area</th>
                      <th scope="col">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border border-y border-border">
                    {meta.rooms
                      .filter((r) => r.level === lv.id)
                      .map((r) => (
                        <tr key={r.id}>
                          <th scope="row" className="py-3 pr-3 font-semibold">
                            {r.name}
                          </th>
                          <td className="font-figure py-3 pr-3 text-muted">{r.size}</td>
                          <td className="font-figure py-3 pr-3 text-muted">
                            {r.areaSqm} m² · {r.areaSqft} sq ft
                          </td>
                          <td className="py-3 text-right text-xs font-semibold uppercase tracking-[0.1em]">
                            {r.evidence.startsWith("photo") ? (
                              <span className="text-available">From photos</span>
                            ) : (
                              <span className="text-muted">Indicative</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="card-lux p-6">
              <p className="eyebrow">What the model is based on</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {meta.photos.map((p) => (
                  <figure key={p.id} className="relative aspect-[3/2] overflow-hidden rounded-xl">
                    <Image src={p.file} alt={p.shows} fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover" />
                  </figure>
                ))}
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {meta.anchors.map((a) => (
                  <li key={a.what} className="flex gap-2.5">
                    <Icon name="ruler" size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold">{a.what}:</strong> <span className="text-muted">{a.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-lux p-6">
              <p className="eyebrow">Interested?</p>
              <p className="mt-2 text-sm text-muted">
                {project.status === "sold_out"
                  ? `${project.name} is sold out. Ask sales about similar homes or the next release.`
                  : `Ask sales for the drawings, the price and a viewing.`}
              </p>
              <a
                href={whatsappHref(`Hello Afro Arab, I've seen the 3D model of ${project.name} and would like to know more.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                <Icon name="whatsapp" size={16} /> WhatsApp sales
              </a>
              <div className="mt-5">
                <EnquiryForm projectSlug={project.slug} intent="viewing" compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
