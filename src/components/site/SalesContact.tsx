import Link from "next/link";
import { site, whatsappHref } from "@/data/site";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  projectName?: string;
  compact?: boolean;
};

export function SalesContact({ className, projectName, compact }: Props) {
  const waMessage = projectName
    ? `Hello Afro Arab sales — I’m interested in ${projectName}.`
    : "Hello Afro Arab sales — I’d like to arrange a viewing.";

  return (
    <aside
      className={cn(
        "border border-border bg-surface",
        compact ? "p-5" : "p-6 sm:p-7",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Sales support
      </p>
      <h3
        className={cn(
          "mt-2 font-display font-light text-foreground",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        Speak with the team
      </h3>
      {!compact ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Same sales lines published on afroarabproperties.com. Call, email, or WhatsApp
          with your estate of interest.
        </p>
      ) : null}

      <dl className={cn("text-sm", compact ? "mt-4 space-y-3" : "mt-5 space-y-4")}>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">Phone</dt>
          <dd className="mt-1 space-y-1">
            {site.phones.map((phone, i) => (
              <a
                key={phone}
                href={`tel:${site.phoneTel[i]}`}
                className="block text-base text-foreground underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">Email</dt>
          <dd className="mt-1">
            <a
              href={`mailto:${site.email}`}
              className="text-base text-foreground underline underline-offset-4"
            >
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">Office</dt>
          <dd className="mt-1 text-foreground">
            {site.address.line1}
            <br />
            {site.address.line2}, {site.address.country}
          </dd>
        </div>
      </dl>

      <div className={cn("flex flex-wrap gap-2", compact ? "mt-5" : "mt-6")}>
        <a
          href={whatsappHref(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          WhatsApp sales
        </a>
        <Link href="/contact" className="btn-outline-gold">
          Enquiry form
        </Link>
      </div>
    </aside>
  );
}
