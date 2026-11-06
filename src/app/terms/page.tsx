import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="5 November 2026">
      <p>
        This website provides information about Afro Arab Properties developments. Listings,
        prices, and availability may change. Nothing on this site constitutes a binding offer until
        documented in a signed agreement.
      </p>
      <p>
        Interactive plot explorers and walkthroughs may be labelled authoritative, reconstructed, or
        visual-only. Dimensional claims require the authoritative label and human QA.
      </p>
    </LegalPage>
  );
}
