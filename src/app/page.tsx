import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { PaymentPathStrip } from "@/components/home/PaymentPathStrip";
import { HomeContact } from "@/components/home/HomeContact";
import { PlotExplorerReveal } from "@/components/home/PlotExplorerReveal";
import { publishedProjects } from "@/data/projects";

export default function HomePage() {
  const featured = publishedProjects()
    .filter(
      (p) =>
        p.featured ||
        ["bella-vista", "blakk-rastas-court", "cephas-court", "lamins-court", "hassy-homes"].includes(
          p.slug,
        ),
    )
    .slice(0, 4);

  return (
    <>
      <CinematicHero />
      <FeaturedProjects projects={featured} />
      <PlotExplorerReveal />
      <PaymentPathStrip />
      <HomeContact />
    </>
  );
}
