import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Payment terms" };

export default function PaymentTermsPage() {
  return (
    <LegalPage title="Payment terms" updated="5 November 2026">
      <p>
        Interest-free payment plans are offered on selected inventory subject to eligibility,
        documentation, and project-specific schedules provided by Afro Arab sales. Marketing pages
        summarise the pathway; this document will carry the formal terms once counsel and Afro Arab
        approve the final language.
      </p>
      <p>
        Buyers should obtain written schedules, fee disclosures, and default remedies before making
        payments.
      </p>
    </LegalPage>
  );
}
