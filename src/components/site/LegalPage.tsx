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
    <div className="min-h-screen bg-background pt-28 text-foreground">
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <div className="divider-gold mt-8 max-w-xs" />
        <div className="prose-legal mt-8 space-y-4 text-base leading-relaxed text-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </article>
    </div>
  );
}
