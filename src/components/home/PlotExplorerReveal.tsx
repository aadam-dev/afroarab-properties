"use client";

import { PlotExplorer } from "@/components/plot-explorer/PlotExplorer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function PlotExplorerReveal() {
  return (
    <ScrollReveal variant="scale" duration={0.8}>
      <PlotExplorer initialProjectSlug="bella-vista" />
    </ScrollReveal>
  );
}
