import { mapsEmbedUrl } from "@/data/site";
import { cn } from "@/lib/cn";

type Props = {
  query: string;
  zoom?: number;
  title: string;
  note?: string;
  className?: string;
};

export function LocationMap({
  query,
  zoom = 14,
  title,
  note = "Approximate pin from the public listing. Confirm access with sales before visiting.",
  className,
}: Props) {
  const src = mapsEmbedUrl(query, zoom);

  return (
    <figure className={cn("overflow-hidden border border-border bg-surface", className)}>
      <div className="relative aspect-[16/10] w-full bg-surface-muted sm:aspect-[21/9]">
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
      </div>
      <figcaption className="space-y-1 border-t border-border px-4 py-3 text-sm">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs leading-relaxed text-muted">{note}</p>
      </figcaption>
    </figure>
  );
}
