import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="5 November 2026">
      <p>
        Afro Arab Properties (“we”) process personal data from enquiry forms, viewing requests, and
        plot reservations in line with Ghana’s Data Protection Act 2012 (Act 843). This page is a
        working draft for the rebuild and must be finalised with Afro Arab’s legal counsel before
        production cutover.
      </p>
      <h2>Data we collect</h2>
      <p>Name, phone, email, message content, project/plot interest, source URL, and consent time.</p>
      <h2>Purpose</h2>
      <p>
        Responding to enquiries, scheduling viewings, sharing payment-plan information, and improving
        our services. We do not sell personal data.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion where lawful, and lodge complaints with the
        Data Protection Commission of Ghana. Contact details for the data controller will be published
        here once confirmed by Afro Arab.
      </p>
    </LegalPage>
  );
}
