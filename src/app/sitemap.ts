import type { MetadataRoute } from "next";
import { publishedProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPaths = [
    "",
    "/projects",
    "/lands",
    "/payment-plans",
    "/company",
    "/insights",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/payment-terms",
  ];

  const projectPaths = publishedProjects().flatMap((p) => {
    const urls = [`/projects/${p.slug}`];
    if (p.hasPlotExplorer) urls.push(`/lands/${p.slug}/explorer`);
    if (p.hasWalkthrough) urls.push(`/projects/${p.slug}/walkthrough`);
    return urls;
  });

  return [...staticPaths, ...projectPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-11-05"),
  }));
}
