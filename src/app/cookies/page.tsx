import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Cookie policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie policy" updated="5 November 2026">
      <p>
        We use essential cookies required to operate the site securely. Analytics or marketing
        cookies, if introduced, will be disclosed here with a consent mechanism before activation.
      </p>
    </LegalPage>
  );
}
