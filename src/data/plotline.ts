export type PlotlineCategory = "news" | "offer" | "guide" | "vision";

export type PlotlinePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: PlotlineCategory;
  /** Optional hero from existing public assets */
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  body: string[];
  /** Public press / source attribution when grounded in coverage */
  sources?: { label: string; url: string }[];
};

export const plotlineCategoryLabel: Record<PlotlineCategory, string> = {
  news: "News",
  offer: "Offer",
  guide: "Guide",
  vision: "Vision",
};

/**
 * Editorial feed for /plotline — 2026 public coverage plus buyer guides.
 * Commercial terms in news pieces are marketing claims; sales confirms before payment.
 */
export const plotlinePosts: PlotlinePost[] = [
  {
    slug: "200000-homes-national-homeownership-conference",
    title: "200,000 homes by 2050 — Afro Arab’s pledge at the National Homeownership Conference",
    excerpt:
      "At the National Homeownership Conference, Alhaji Salamu Amadu outlined a long-term affordable housing vision and private-sector partnership with Ghana’s district housing agenda.",
    date: "2026-10-09",
    category: "vision",
    image: "/images/detail-entrance.jpg",
    imageAlt: "Afro Arab corporate entrance",
    featured: true,
    body: [
      "Afro Arab Properties has put a clear number on its long-term housing ambition: 200,000 affordable and sustainable homes across Ghana by 2050.",
      "Speaking during the National Homeownership Conference, Chairman and C.E.O Alhaji Salamu Amadu framed the target as a private-sector contribution to national housing delivery — including collaboration with district housing programmes.",
      "The company continues to emphasise structured payment pathways on selected stock: a qualifying down payment, then the balance spread over multi-year instalments without interest, subject to each project’s formal terms.",
      "For buyers, the takeaway is direction: Afro Arab is positioning itself not only as an Accra estate developer, but as a long-horizon partner in Ghana’s housing deficit response. Confirm any programme details with sales before relying on them for a purchase decision.",
    ],
    sources: [
      {
        label: "YEN.com.gh — Afro-Arab CEO 200,000-home vision",
        url: "https://yen.com.gh/real-estate/313503-afro-arab-ceo-pledges-mahama-john-builder-200000-home-vision/",
      },
    ],
  },
  {
    slug: "free-construction-package-east-legon-hills",
    title: "Free construction package for titled-land buyers at East Legon Hills, Santoe",
    excerpt:
      "Eligible plot buyers were offered starter materials and services — blocks, sand, chippings, digging, indenture, and drawings — to shorten the path from land to build.",
    date: "2026-10-01",
    category: "offer",
    image: "/images/projects/hawas-court-2.jpg",
    imageAlt: "Afro Arab residential corridor",
    featured: true,
    body: [
      "In October 2026, Afro Arab Properties introduced a construction-support package for customers purchasing titled land at East Legon Hills, Santoe.",
      "Public reporting described the package as including 1,000 blocks, free digging, a free indenture, two trips of sand, two trips of chippings, and architectural drawings — a practical head-start for buyers who want to begin building sooner.",
      "Offers like this change the conversation from “land only” to “land plus a first push on site.” Eligibility, plot inventory, and exact inclusions should be confirmed with Afro Arab sales before payment.",
      "If you are comparing land corridors, start with our titled-land pages, then ask sales which plots currently carry construction support.",
    ],
    sources: [
      {
        label: "Accra News Online — free construction package",
        url: "https://accranewsonline.com/2026/10/01/afro-arab-properties-offers-free-construction-package-to-prospective-homeowners/",
      },
      {
        label: "YEN.com.gh — free building materials for land buyers",
        url: "https://yen.com.gh/real-estate/312996-ghanaian-businessman-afro-arab-offers-free-building-materials-land-buyers/",
      },
    ],
  },
  {
    slug: "blakk-rastas-court-sod-cutting",
    title: "Sod cut for Blakk Rasta’s Court — 30 homes at Community 22 Annex",
    excerpt:
      "Afro Arab broke ground on a 30-unit three-bedroom community named for Blakk Rasta, with a flexible payment path and an EV option on qualifying purchases.",
    date: "2026-09-01",
    category: "news",
    image: "/images/projects/estate-6.jpeg",
    imageAlt: "Afro Arab residential development",
    featured: true,
    body: [
      "On 31 August 2026, Afro Arab Properties cut the sod for Blakk Rasta’s Court at Community 22 Annex, Zenu — a 30-unit scheme of three-bedroom townhouses named in honour of Ghanaian broadcaster and musician Blakk Rasta.",
      "Coverage of the launch highlighted a build-up payment model: buyers can start with GH₵10,000 and progress toward a 40% allocation, then move in while settling the balance over five years without interest — subject to formal project terms.",
      "An electric vehicle option was also reported as part of the package for qualifying homeowners, pairing housing delivery with a distinctive mobility incentive.",
      "Explore the estate page for current marketing facts, then confirm pricing, EV conditions, and availability directly with sales.",
    ],
    sources: [
      {
        label: "Accra News Online — Community 22 Annex sod cutting",
        url: "https://accranewsonline.com/2026/09/01/community-22-annex-afro-arab-president-cuts-sod-for-blakk-rasta-30-unit-housing-project/",
      },
      {
        label: "Housing In Ghana — Blakk Rasta housing project",
        url: "https://housinginghana.com/articles/afro-arab-properties-cuts-sod-for-30-unit-blakk-rasta-housing-project-at-community-22-annex-in-accra",
      },
    ],
  },
  {
    slug: "affordable-container-homes-launch",
    title: "Affordable container homes launched — from GH₵75,000",
    excerpt:
      "Afro Arab opened a container-home pathway for 1–4 bedroom units, with interest-free balance options after a qualifying down payment.",
    date: "2026-08-25",
    category: "offer",
    image: "/images/projects/cephas-court.png",
    imageAlt: "Afro Arab housing exteriors",
    body: [
      "In August 2026, Afro Arab Properties launched affordable container homes aimed at buyers who want a faster, lower-entry path into homeownership.",
      "The range covers one- to four-bedroom configurations, with public pricing starting from GH₵75,000. Payment pathways described in coverage include full payment, a 50% down payment with the balance over 24 months interest-free, and a gradual build-up to the 50% threshold before delivery.",
      "Some customers may also qualify for an EV package with their home purchase — again subject to sales confirmation.",
      "Container homes sit alongside Afro Arab’s court estates and titled land. Ask the team which product line fits your budget and timeline.",
    ],
    sources: [
      {
        label: "Accra News Online — container homes launch",
        url: "https://accranewsonline.com/2026/08/25/afro-arab-properties-launches-affordable-container-homes/",
      },
    ],
  },
  {
    slug: "aceacres-2025-eco-friendly-affordable-developer",
    title: "Afro Arab named Best Eco-Friendly Affordable Real Estate Company at ACEACRES 2025",
    excerpt:
      "Recognised at the ACEACRES 2025 Summit in Accra for sustainable, affordable housing and interest-free payment plans.",
    date: "2025-10-08",
    category: "news",
    image: "/images/detail-entrance.jpg",
    imageAlt: "Afro Arab corporate entrance",
    body: [
      "Afro Arab Properties and Construction was named Best Eco-Friendly Affordable Real Estate Company in Ghana at the ACEACRES 2025 Summit, held on 29 and 30 September 2025 at the De Icon Conference Centre in Accra.",
      "Mr Dickson Boadi received the award on behalf of the President and Founder, Ambassador Alhaji Salamu Amadu, and dedicated it to every Ghanaian who wants a home that is both affordable and environmentally responsible.",
      "The citation pointed to the company's interest-free payment plans, which let buyers pay for a home over up to five years, and its target of 200,000 homes by 2050 designed around solar power, rainwater harvesting and energy-efficient materials.",
    ],
    sources: [
      {
        label: "Afro Arab Properties — ACEACRES 2025 announcement",
        url: "https://afroarabproperties.com/afro-arab-properties-wins-best-eco-friendly-affordable-real-estate-company-at-aceacres-2025/",
      },
    ],
  },
  {
    slug: "how-we-verify-project-facts",
    title: "How we verify project facts before publishing",
    excerpt:
      "Why conflicting sizes and inventory counts destroy trust — and the publication checklist this platform now enforces.",
    date: "2026-11-05",
    category: "guide",
    body: [
      "The previous Afro Arab website showed conflicting property sizes, locations, and inventory counts. In real estate, that is not a copy issue — it is a trust issue.",
      "This rebuild introduces a publication checklist: status, price display, location, unit facts, last-verified date, and a verification note. Conflicting required fields cannot go live.",
      "Buyers should still confirm final commercial terms with Afro Arab sales before payment.",
    ],
  },
  {
    slug: "reading-a-plot-explorer",
    title: "How to use the 3D plot explorer",
    excerpt:
      "Find a plot by number, filter by facing and size, walk the roads, and enquire about the exact plot.",
    date: "2026-11-05",
    category: "guide",
    body: [
      "Open the explorer from Green Valley Estate. Drag to rotate, right-drag to pan and scroll to zoom. Type a plot number in Go to plot to fly straight to it.",
      "Tap any plot to see its size, price, road access, an example payment plan, a suggested home and its title documents. Plan gives a top-down view, and Walk lets you stand on the plot and look around.",
      "Status is shown with colour and a text label. The layout, prices and sun path are indicative until the surveyed site plan is published, so confirm with sales before you pay.",
    ],
  },
];

export function getPlotlinePost(slug: string) {
  return plotlinePosts.find((p) => p.slug === slug);
}

export function plotlineSorted() {
  return [...plotlinePosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function plotlineFeatured() {
  return plotlineSorted().filter((p) => p.featured);
}

export function formatPlotlineDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}
