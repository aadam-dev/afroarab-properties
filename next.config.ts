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
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/", destination: "/insights", permanent: true },
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
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
