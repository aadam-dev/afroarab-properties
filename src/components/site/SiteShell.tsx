"use client";

import { usePathname } from "next/navigation";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExplorer = pathname.includes("/explorer");
  const isWalkthrough = pathname.includes("/walkthrough");
  const hideAssistant = isExplorer || isWalkthrough || pathname.startsWith("/admin");

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Header />
      <main id="content" className="flex-1">
        {children}
      </main>
      {isExplorer ? null : <Footer />}
      {hideAssistant ? null : <AssistantWidget />}
    </>
  );
}
