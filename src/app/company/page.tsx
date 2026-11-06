import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/site/PageBand";

export const metadata: Metadata = {
  title: "Company",
  description:
    "About Afro Arab Properties — development, construction, and the proof buyers should see.",
};

export default function CompanyPage() {
  return (
    <div className="bg-sand-50">
      <PageBand
        eyebrow="Company"
        title="Built to help Ghanaians own homes"
        description="Part of the Afro Arab Group — focused on development and construction that contributes to Ghana’s housing needs, with verified project data and titled-land clarity."
        imageSrc="/images/detail-entrance.jpg"
      />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl text-forest-900">Leadership</h2>
        <p className="mt-4 text-lg leading-relaxed text-stone-500">
          Named leadership from the legacy site will be migrated here after biography and photo
          confirmation. Until then, contact sales via the viewing form.
        </p>

        <h2 id="proof" className="mt-14 font-display text-3xl text-forest-900">
          Awards & proof
        </h2>
        <ul className="mt-5 space-y-3 text-stone-500">
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
            Award claims must link to certificates or press sources before public display.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
            Company registration and regulator references to be added with legal review.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
            Title/permit process copy will sit beside land and project pages.
          </li>
        </ul>

        <Link href="/contact" className="btn-primary mt-12 w-fit">
          Talk to sales
        </Link>
      </div>
    </div>
  );
}
