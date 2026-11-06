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
    <div className="min-h-screen bg-[#080E14] pt-28 text-[#F4EFE6]">
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A059]">
          Legal
        </p>
        <h1 className="mt-3 font-display text-4xl font-light text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#F4EFE6]/55">Last updated {updated}</p>
        <div className="divider-gold mt-8 max-w-xs" />
        <div className="prose-legal mt-8 space-y-4 text-base leading-relaxed text-[#F4EFE6]/75 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-white [&_a]:text-[#C5A059] [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </article>
    </div>
  );
}
