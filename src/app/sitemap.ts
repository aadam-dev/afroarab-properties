import type { MetadataRoute } from "next";
import { publishedProjects } from "@/data/projects";
import { plotlinePosts } from "@/data/plotline";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPaths = [
    "",
    "/projects",
    "/lands",
    "/payment-plans",
    "/company",
    "/plotline",
    "/faq",
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

  const plotlinePaths = plotlinePosts.map((p) => `/plotline/${p.slug}`);

  return [...staticPaths, ...projectPaths, ...plotlinePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-11-07"),
  }));
}
