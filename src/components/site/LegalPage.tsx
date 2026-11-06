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
    <div className="bg-sand-50 pt-28">
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl text-forest-900">{title}</h1>
        <p className="mt-3 text-sm text-stone-500">Last updated {updated}</p>
        <div className="prose-legal mt-8 space-y-4 text-base leading-relaxed text-stone-500">
          {children}
        </div>
      </article>
    </div>
  );
}
