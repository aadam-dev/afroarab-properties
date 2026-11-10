import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { LocationMap } from "@/components/site/LocationMap";
import { PageBand } from "@/components/site/PageBand";
import { SalesContact } from "@/components/site/SalesContact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact & viewings",
  description: "Book a site viewing or speak with Afro Arab Properties sales in Accra by phone, WhatsApp or email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageBand
        eyebrow="Contact"
        title={
          <>
            Arrange a <em>viewing.</em>
          </>
        }
        description="Tell us the estate or plot you're interested in. Sales replies with availability, prices and viewing times."
        imageSrc="/images/projects/front-view.jpg"
        imageAlt="Front view of an Afro Arab residential development"
        current="Contact"
        size="compact"
      />
      <section className="section-y bg-background">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-8">
            <SalesContact />
            <LocationMap
              query={site.officeMapQuery}
              zoom={site.officeMapZoom}
              title={`${site.address.line1}, ${site.address.line2}`}
              note={site.officeMapNote}
            />
          </div>
          <EnquiryForm intent="viewing" />
        </div>
      </section>
    </>
  );
}
