import type { Metadata } from "next";
import { PlotlineIndex } from "@/components/plotline/PlotlineIndex";
import { plotlineFeatured, plotlineSorted } from "@/data/plotline";

export const metadata: Metadata = {
  title: "Plotline",
  description:
    "News, offers, and buyer notes from Afro Arab Properties — what’s moving across estates and titled land in Greater Accra.",
};

export default function PlotlinePage() {
  return (
    <PlotlineIndex featured={plotlineFeatured()} rest={plotlineSorted()} />
  );
}
