import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
      { source: "/new-homepage-draft", destination: "/", permanent: true },
      { source: "/new-homepage-draft/", destination: "/", permanent: true },
      { source: "/payment-plan", destination: "/payment-plans", permanent: true },
      { source: "/payment-plan/", destination: "/payment-plans", permanent: true },
      { source: "/about", destination: "/company", permanent: true },
      { source: "/about/", destination: "/company", permanent: true },
      { source: "/support", destination: "/contact", permanent: true },
      { source: "/support/", destination: "/contact", permanent: true },
      { source: "/blog", destination: "/plotline", permanent: true },
      { source: "/blog/", destination: "/plotline", permanent: true },
      { source: "/insights", destination: "/plotline", permanent: true },
      { source: "/insights/", destination: "/plotline", permanent: true },
      { source: "/insights/:slug", destination: "/plotline/:slug", permanent: true },
      { source: "/news", destination: "/plotline", permanent: true },
      { source: "/news/", destination: "/plotline", permanent: true },
      { source: "/lamins-court-obeyeyie-amasaman", destination: "/projects/lamins-court", permanent: true },
      { source: "/lamins-court", destination: "/projects/lamins-court", permanent: true },
      { source: "/cephas-court", destination: "/projects/cephas-court", permanent: true },
      { source: "/dexters-court", destination: "/projects/dexters-court", permanent: true },
      { source: "/hassy-homes", destination: "/projects/hassy-homes", permanent: true },
      { source: "/hawas-court", destination: "/projects/hawas-court", permanent: true },
      { source: "/hawas-court-old-ningo-prampram", destination: "/projects/hawas-court", permanent: true },
      { source: "/ibras-court", destination: "/projects/ibras-court", permanent: true },
      { source: "/paapas-court", destination: "/projects/paapas-court", permanent: true },
    ];
  },
  async headers() {
    const common = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    return [
      {
        // Every page refuses framing, except the plot explorer (below).
        source: "/((?!lands/[^/]+/explorer).*)",
        headers: [{ key: "X-Frame-Options", value: "DENY" }, ...common],
      },
      {
        // The plot explorer may be embedded by its builder's portfolio, and nothing else.
        source: "/lands/:slug/explorer",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://aadambuilds.dev https://www.aadambuilds.dev http://localhost:3001",
          },
          ...common,
        ],
      },
    ];
  },
};

export default nextConfig;
