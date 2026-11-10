import { PageBand } from "./PageBand";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBand eyebrow="Legal" title={title} description={`Last updated ${updated}`} current={title} size="compact" />
      <section className="section-y bg-background">
        <article className="shell max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-muted [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
            {children}
          </div>
        </article>
      </section>
    </>
  );
}
