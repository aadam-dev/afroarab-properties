import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageBand } from "@/components/site/PageBand";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "VIP Viewing & Diaspora Concierge",
  description: "Book an executive site viewing or consult with Afro-Arab Properties sales advisory.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#080E14] text-[#F4EFE6] min-h-screen">
      <PageBand
        eyebrow="VIP Concierge"
        title="Arrange an Executive Site Viewing"
        description="Connect directly with our investment advisory team. We provide real-time cadastral coordinates, title deed verification, and customized 60-month schedules."
        imageSrc="/images/projects/front-view.jpg"
        imageAlt="Afro Arab residential front view"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="lg:pt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#101822] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            Headquarters & Advisory
          </span>

          <h2 className="mt-4 font-display text-3xl font-light text-white sm:text-4xl">
            Direct Developer Access
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#F4EFE6]/75">
            Whether visiting our Accra corporate offices or scheduling a virtual walkthrough from
            London, New York, or Dubai, our private viewing team coordinates all aspects of your investment.
          </p>

          <dl className="mt-8 space-y-6 text-sm text-[#F4EFE6]/70">
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Executive Offices</dt>
              <dd className="mt-2 text-base text-white">
                {site.address.line1}
                <br />
                {site.address.line2}, {site.address.country}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">Direct Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${site.email}`} className="text-base text-white underline underline-offset-4 hover:text-[#DFC283]">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#101822] p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[#C5A059]">VIP Telephone / WhatsApp</dt>
              <dd className="mt-2 space-y-1 text-base text-white">
                {site.phones.map((phone, i) => (
                  <a key={phone} href={`tel:${site.phoneTel[i]}`} className="block hover:text-[#DFC283]">
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <EnquiryForm intent="viewing" />
        </div>
      </div>
    </div>
  );
}
