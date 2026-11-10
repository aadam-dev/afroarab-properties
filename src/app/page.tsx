import { EstateStory } from "@/components/home/estate-story/EstateStory";
import { EstatesCoverflow } from "@/components/home/EstatesCoverflow";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeHero } from "@/components/home/HomeHero";
import { PaymentPathStrip } from "@/components/home/PaymentPathStrip";
import { PlotlineTeasers } from "@/components/home/PlotlineTeasers";
import { WhyAfroArab } from "@/components/home/WhyAfroArab";
import { allPlots } from "@/data/masterplan";
import { publishedProjects } from "@/data/projects";

export default function HomePage() {
  const projects = publishedProjects();
  const order = ["titled-lands-green-valley", "bella-vista", "lamins-court", "hassy-homes", "ibras-court", "cephas-court"];
  const showcase = [...projects].sort((a, b) => {
    const ia = order.indexOf(a.slug);
    const ib = order.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <>
      <HomeHero estateCount={projects.length} plotCount={allPlots.length} />
      <EstateStory />
      <EstatesCoverflow projects={showcase} />
      <WhyAfroArab />
      <PaymentPathStrip />
      <PlotlineTeasers />
      <HomeContact />
    </>
  );
}
