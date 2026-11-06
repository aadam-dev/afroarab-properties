import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageBand } from "@/components/site/PageBand";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a viewing or talk to Afro Arab Properties sales.",
};

export default function ContactPage() {
  return (
    <div className="bg-sand-50">
      <PageBand
        eyebrow="Contact"
        title="Book a viewing"
        description="Tell us which project you care about. We respond with availability, payment options, and next steps."
        imageSrc="/images/projects/front-view.jpg"
        imageAlt="Afro Arab residential front view"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="lg:pt-4">
          <dl className="space-y-6 text-base text-stone-500">
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-forest-800">Location</dt>
              <dd className="mt-2 text-lg text-forest-900">
                {site.address.line1}
                <br />
                {site.address.line2}, {site.address.country}
              </dd>
            </div>
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-forest-800">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${site.email}`} className="text-lg text-forest-900 underline underline-offset-4">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-forest-800">Call</dt>
              <dd className="mt-2 space-y-1 text-lg text-forest-900">
                {site.phones.map((phone, i) => (
                  <a key={phone} href={`tel:${site.phoneTel[i]}`} className="block hover:text-brand-red">
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <EnquiryForm intent="viewing" />
      </div>
    </div>
  );
}
