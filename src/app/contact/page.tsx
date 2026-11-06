import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { LocationMap } from "@/components/site/LocationMap";
import { PageBand } from "@/components/site/PageBand";
import { SalesContact } from "@/components/site/SalesContact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a site viewing or speak with Afro Arab Properties sales.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageBand
        eyebrow="Contact"
        title="Arrange a viewing"
        description="Share your estate or plot interest. We respond with availability and viewing options."
        imageSrc="/images/projects/front-view.jpg"
        imageAlt="Afro Arab residential front view"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
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
    </div>
  );
}
