import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="on-dark grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-950 text-white">
      <div
        aria-hidden
        className="site-plan-grid absolute inset-0 -z-10 text-white opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]"
      />
      <div className="shell py-32">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-current opacity-60" />
          Error 404
        </p>
        <h1 className="t-display mt-6 max-w-3xl text-balance">
          This plot <em>isn&apos;t on the map.</em>
        </h1>
        <p className="t-lead mt-6 max-w-xl text-white/75">
          The page may have moved when the site was rebuilt. Try an estate, the plot explorer, or
          ask sales directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-gold btn-lg">
            <Icon name="home" size={18} /> Home
          </Link>
          <Link href="/projects" className="btn-ghost btn-lg">
            Estates
          </Link>
          <Link href="/lands/titled-lands-green-valley/explorer" className="btn-ghost btn-lg">
            <Icon name="cube" size={18} /> Plot explorer
          </Link>
        </div>
      </div>
    </section>
  );
}
