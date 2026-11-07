export type ProjectStatus =
  | "published"
  | "coming_soon"
  | "sold_out"
  | "draft";

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "mixed";

export type ProjectAgent = {
  name: string;
  role: string;
  image: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  whatsappE164: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  /** Google Maps query from the live WordPress embed (approximate). */
  mapQuery?: string;
  mapZoom?: number;
  type: PropertyType;
  /** Marketing subtype from the live listing, e.g. Family Town House */
  propertyLabel?: string;
  status: ProjectStatus;
  priceDisplay: string;
  /** Optional USD band shown alongside GHS on the live site */
  priceUsdDisplay?: string;
  beds?: string;
  baths?: string;
  /** Omit template junk like "95 sqft" until verified */
  areaDisplay?: string;
  parking?: string;
  yearBuilt?: string;
  /** Live-site claim; treat as marketing until verified */
  electricalPower?: string;
  unitCount?: string;
  summary: string;
  highlights: string[];
  features?: string[];
  image: string;
  imageAlt: string;
  /** Additional exterior photos on disk (no interiors available yet) */
  gallery?: string[];
  /** Slugs shown in the live "Listed latest properties" recommendations */
  relatedSlugs?: string[];
  agent?: ProjectAgent;
  featured?: boolean;
  hasPlotExplorer?: boolean;
  hasWalkthrough?: boolean;
  lastVerified: string;
  verificationNote: string;
};

/** Project manager / agent published on most live estate pages. */
export const defaultProjectAgent: ProjectAgent = {
  name: "Hosni Mubarack Salih",
  role: "Project Manager / Agent",
  image: "/images/team/hosni-mubarack-salih.jpeg",
  phoneDisplay: "+233 55 985 1280",
  phoneTel: "+233559851280",
  email: "info@afroarabproperties.com",
  whatsappE164: "233559851280",
};

/**
 * Seed content grounded in afroarabproperties.com audit (Nov 2026).
 * Prices/sizes marked verify must be confirmed before production claims.
 * Images downloaded from their public WordPress media library.
 * Do not republish the template "95 sqft" figure from the live cards.
 */
export const projects: Project[] = [
  {
    slug: "bella-vista",
    name: "Bella Vista Luxury Enclave",
    tagline: "Residences and titled plots in Katamanso",
    location: "Katamanso",
    city: "Greater Accra",
    mapQuery: "Katamanso",
    mapZoom: 12,
    type: "mixed",
    propertyLabel: "Residences & titled plots",
    status: "published",
    priceDisplay: "From GH¢125,000",
    beds: "3–4",
    baths: "3.5",
    areaDisplay: "180 – 350 m²",
    summary:
      "Master-planned residences and titled plots at Katamanso — published on the current Afro Arab site with interactive plot selection and interest-free payment pathways on selected stock.",
    highlights: [
      "Katamanso corridor positioning from the live listing",
      "Interactive plot explorer available on this rebuild",
      "Interest-free payment plan eligibility TBD with sales",
    ],
    image: "/images/projects/bella-vista-2.jpg",
    imageAlt: "Bella Vista Luxury Enclave by Afro Arab Properties",
    gallery: [
      "/images/projects/bella-vista-2.jpg",
      "/images/projects/bella-vista-3.jpg",
      "/images/hero-lamins.jpg",
    ],
    relatedSlugs: ["ibras-court", "paapas-court", "hawas-court"],
    agent: defaultProjectAgent,
    featured: true,
    hasPlotExplorer: true,
    hasWalkthrough: true,
    lastVerified: "2026-11-06",
    verificationNote:
      "Location restored from live WP map (Katamanso). Confirm survey, title, and pricing before production claims.",
  },
  {
    slug: "blakk-rastas-court",
    name: "Blakk Rasta’s Court",
    tagline: "30 exclusive three-bedroom townhouses",
    location: "Community 22 Annex, Zenu",
    city: "Greater Accra",
    mapQuery: "Community 22 Annex, Zenu, Accra",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "Price on request",
    beds: "3",
    unitCount: "30",
    summary:
      "Modern living. Timeless value. Thirty exclusive three-bedroom townhouses at Community 22 Annex, Zenu — the flagship story on the current Afro Arab homepage.",
    highlights: [
      "Exclusive 30-unit community",
      "Brochure available for unit mix",
      "Interest-free payment plan eligibility TBD with sales",
    ],
    image: "/images/projects/estate-6.jpeg",
    imageAlt: "Afro Arab residential development exterior",
    relatedSlugs: ["cephas-court", "lamins-court", "hassy-homes"],
    agent: defaultProjectAgent,
    featured: true,
    hasWalkthrough: true,
    lastVerified: "2026-11-06",
    verificationNote: "Confirm unit count, prices, and title status with Afro Arab.",
  },
  {
    slug: "cephas-court",
    name: "Cephas Court",
    tagline: "Premium living in Achiaman",
    location: "Achiaman, Amasaman",
    city: "Greater Accra",
    mapQuery: "Achiaman",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    beds: "2–4",
    baths: "2–6",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Premium residential development designed for comfort, security, and lifestyle in Achiaman, a serene suburb of Amasaman.",
    highlights: ["Self-compound living", "Contemporary finishes", "Sales viewing available"],
    features: ["Family town house typology", "Self compound parking", "Year build listed 2023/2024"],
    image: "/images/projects/cephas-court.png",
    imageAlt: "Cephas Court by Afro Arab Properties",
    gallery: [
      "/images/projects/cephas-court.png",
      "/images/projects/cephas-court-2.png",
      "/images/projects/cephas-court-3.png",
    ],
    relatedSlugs: ["hawas-court", "afugus-court", "paapas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Legacy site listed conflicting sizes; do not publish 95 sqft.",
  },
  {
    slug: "hassy-homes",
    name: "Hassy Homes",
    tagline: "Spintex corridor convenience",
    location: "Near O’Reilly Senior High School, Spintex",
    city: "Accra",
    mapQuery: "O'Reilly Senior High School",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "From GH¢3,000,000",
    priceUsdDisplay: "$250,000 – $300,000",
    beds: "4",
    baths: "2–4",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Situated in the heart of Spintex with easy access to malls, business centres, and recreational spots — privacy with strong accessibility.",
    highlights: ["Spintex location", "Family-oriented compound living", "4-bedroom townhouse positioning"],
    features: ["Family town house", "Self compound", "Year build listed 2023/2024"],
    image: "/images/projects/hassy-homes.png",
    imageAlt: "Hassy Homes by Afro Arab Properties",
    gallery: [
      "/images/projects/hassy-homes.png",
      "/images/projects/hassy-homes-2.png",
      "/images/projects/hassy-homes-3.png",
    ],
    relatedSlugs: ["paapas-court", "dexters-court", "hawas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Confirm current asking price and availability. Do not publish 95 sqft.",
  },
  {
    slug: "ibras-court",
    name: "Ibra’s Court",
    tagline: "Six-unit townhouses with penthouse and pool",
    location: "Narhman, Haatso",
    city: "Accra",
    mapQuery: "DVLA Botwe",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "GH¢3,000,000 – GH¢3,600,000",
    priceUsdDisplay: "$250,000 – $350,000",
    beds: "2–4",
    baths: "2–6",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    unitCount: "6",
    summary:
      "Ibra’s Court is marketed as a six-unit flat of townhouses with a penthouse and swimming pool in Narhman–Haatso — value positioning from the live Afro Arab listing.",
    highlights: [
      "Six-unit townhouse scheme",
      "Penthouse suite with pool (verify against drawings)",
      "Haatso / DVLA Botwe corridor",
    ],
    features: [
      "4 bedrooms including penthouse",
      "Top-floor penthouse suite with a pool",
      "Floor-to-ceiling windows",
      "Fitted kitchen with gadgets",
      "Private rooftop balcony",
      "High-end finish",
      "Fitted air conditioning",
      "Attached garage",
      "Electric SUV incentive listed on live site — confirm with sales",
    ],
    image: "/images/projects/ibras-court.png",
    imageAlt: "Ibra’s Court by Afro Arab Properties",
    gallery: [
      "/images/projects/ibras-court.png",
      "/images/projects/ibras-court-2.png",
      "/images/projects/ibras-court-3.png",
      "/images/projects/ibras-court-4.png",
      "/images/projects/ibras-court-5.png",
    ],
    relatedSlugs: ["paapas-court", "dexters-court", "hawas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote:
      "Verify pool/penthouse claims and unit mix with drawings. Do not publish template 95 sqft.",
  },
  {
    slug: "paapas-court",
    name: "Paapa’s Court",
    tagline: "East Legon Hills living",
    location: "East Legon Hills",
    city: "Accra",
    mapQuery: "East Legon Hills",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "GH¢3,000,000 – GH¢3,600,000",
    priceUsdDisplay: "$250,000 – $300,000",
    beds: "4",
    baths: "2–4",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Thoughtfully designed residences in East Legon Hills. Publish exact floor areas only after verification.",
    highlights: ["East Legon Hills", "4-bedroom townhouse positioning", "Community-focused living"],
    features: ["Family town house", "Self compound", "Year build listed 2023/2024"],
    image: "/images/projects/paapas-court.png",
    imageAlt: "Paapa’s Court by Afro Arab Properties",
    gallery: [
      "/images/projects/paapas-court.png",
      "/images/projects/paapas-court-2.png",
      "/images/projects/paapas-court-3.png",
      "/images/projects/paapas-alt.jpeg",
    ],
    relatedSlugs: ["dexters-court", "hawas-court", "afugus-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Needs verified floor areas. Do not publish 95 sqft.",
  },
  {
    slug: "dexters-court",
    name: "Dexter’s Court",
    tagline: "Tema Community 25",
    location: "Tema, Community 25",
    city: "Tema",
    mapQuery: "Tema, Community 25",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    beds: "2",
    baths: "2–4",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Comfortable compound living with space for parking and a kids’ play area at Tema Community 25. Live listing also references apartment stock from GH¢1.1m — confirm unit mix with sales.",
    highlights: ["Tema Community 25", "Family compound", "Kids play area (listing claim)"],
    features: ["Family town house", "Self compound parking", "Year build listed 2023/2024"],
    image: "/images/projects/dexters-court.png",
    imageAlt: "Dexter’s Court by Afro Arab Properties",
    gallery: [
      "/images/projects/dexters-court.png",
      "/images/projects/dexters-court-2.jpeg",
      "/images/projects/dexters-court-3.jpeg",
    ],
    relatedSlugs: ["paapas-court", "hawas-court", "ibras-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Confirm availability and whether apartment units are also offered here.",
  },
  {
    slug: "hawas-court",
    name: "Hawa’s Court",
    tagline: "Apartments in Old Ningo / Prampram",
    location: "Old Ningo, Prampram",
    city: "Greater Accra",
    mapQuery: "Ningo Prampram",
    mapZoom: 13,
    type: "apartment",
    propertyLabel: "Apartments",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    beds: "2–4",
    baths: "2",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Apartment offering in the Ningo–Prampram corridor. Legacy site copy incorrectly mixed Obeyeyie location text — corrected here pending client confirmation.",
    highlights: [
      "Coastal corridor apartments",
      "From GH¢1.1m on the live listing",
      "Self-compound living",
    ],
    features: ["Apartment typology", "Self compound", "Year build listed 2023/2024"],
    image: "/images/projects/prampram-1.jpg",
    imageAlt: "Prampram corridor development associated with Afro Arab",
    gallery: [
      "/images/projects/prampram-1.jpg",
      "/images/projects/hawas-court-2.jpg",
      "/images/projects/hawas-court-3.jpg",
      "/images/projects/hawas-court-4.jpg",
    ],
    relatedSlugs: ["paapas-court", "dexters-court", "ibras-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote:
      "Confirm that location is Old Ningo/Prampram, not Obeyeyie. Do not publish 95 sqft.",
  },
  {
    slug: "lamins-court",
    name: "Lamin’s Court",
    tagline: "Four townhouses in Obeyeyie",
    location: "Obeyeyie, near Amasaman",
    city: "Greater Accra",
    mapQuery: "Obeyeyie Amasaman",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "sold_out",
    priceDisplay: "Sold out",
    beds: "2–3",
    baths: "2",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    unitCount: "4",
    summary:
      "Nestled in Obeyeyie, just off the Oduman Ablekuman road near Amasaman — a cozy community of four townhouses. Marked sold out on the legacy site.",
    highlights: ["Sold out", "Four townhouses", "Near tarmac access (legacy claim — verify)"],
    features: ["2–3 bedrooms over two floors (listing)", "Back garden", "Parking for 2–3 cars"],
    image: "/images/projects/lamins-court.jpg",
    imageAlt: "Lamin’s Court townhouses by Afro Arab Properties",
    gallery: [
      "/images/projects/lamins-court.jpg",
      "/images/projects/lamins-court-2.jpg",
      "/images/projects/lamins-court-3.jpg",
      "/images/projects/lamins-court-4.jpg",
      "/images/hero-lamins.jpg",
    ],
    relatedSlugs: ["cephas-court", "hassy-homes", "ibras-court"],
    agent: defaultProjectAgent,
    hasWalkthrough: true,
    lastVerified: "2026-11-06",
    verificationNote: "Confirm sold-out status and whether waitlist is allowed.",
  },
  {
    slug: "afugus-court",
    name: "Afugu’s Court",
    tagline: "Oyarifa residence",
    location: "Oyarifa",
    city: "Greater Accra",
    mapQuery: "Oyarifa Rd",
    mapZoom: 16,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "Price on request",
    beds: "2–3",
    baths: "2",
    parking: "Self compound / gated community (listing)",
    summary:
      "Listed in Afro Arab navigation as Afugu’s Court, Oyarifa. Full commercial brief still required from the client.",
    highlights: ["Oyarifa location", "Family town house", "Gated community claim — verify"],
    features: ["Family town house", "Self compound / security gated community (listing)"],
    image: "/images/projects/afugus-court.jpg",
    imageAlt: "Afugu’s Court front view",
    gallery: [
      "/images/projects/afugus-court.jpg",
      "/images/projects/afugus-court-2.jpg",
      "/images/projects/afugus-court-3.jpg",
      "/images/projects/afugus-court-4.jpg",
    ],
    relatedSlugs: ["paapas-court", "cephas-court", "hawas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Needs full commercial brief from Afro Arab. Do not publish 95 sqft.",
  },
  {
    slug: "zaras-court",
    name: "Zara’s Court",
    tagline: "Santoe, Accra",
    location: "Santoe, Accra",
    city: "Accra",
    mapQuery: "Santoe, Accra",
    mapZoom: 14,
    type: "house",
    propertyLabel: "Family Town House",
    status: "published",
    priceDisplay: "Price on request",
    beds: "2–3",
    baths: "2–4",
    parking: "Self compound",
    yearBuilt: "2023/2024",
    electricalPower: "4,000 KWh (listing claim)",
    summary:
      "Listed on the current Afro Arab site at Santoe, Accra. Full commercial brief and dedicated photography still required from the client.",
    highlights: ["Santoe location from live listing map", "Family town house typology"],
    features: ["Family town house", "Self compound", "Year build listed 2023/2024"],
    image: "/images/projects/front-view.jpg",
    imageAlt: "Afro Arab residential front view",
    relatedSlugs: ["paapas-court", "dexters-court", "hawas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Confirm inventory, pricing, and project-specific photography.",
  },
  {
    slug: "mamobi-pride",
    name: "Mamobi Pride",
    tagline: "Apartments in Mamobi",
    location: "Mamobi",
    city: "Accra",
    mapQuery: "Mamobi",
    mapZoom: 14,
    type: "apartment",
    propertyLabel: "Apartments",
    status: "published",
    priceDisplay: "Price on request",
    beds: "2–3",
    parking: "Parking lot (listing)",
    yearBuilt: "2023/2024",
    summary:
      "Apartment scheme listed on the current Afro Arab site in Mamobi. Live overview also mentions swimming pool — confirm amenities and brochure details with sales.",
    highlights: [
      "Apartment typology from live listing",
      "Mamobi location",
      "Pool claim on live overview — verify",
    ],
    features: ["Apartments", "Parking lot", "Swimming pool listed — verify", "Year build 2023/2024"],
    image: "/images/projects/front-view.jpg",
    imageAlt: "Afro Arab residential front view",
    relatedSlugs: ["hawas-court", "ibras-court", "paapas-court"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote:
      "Brochure PDF exists on live site; confirm inventory, pricing, and photography before stronger claims.",
  },
  {
    slug: "titled-lands-green-valley",
    name: "Titled Lands",
    tagline: "Interactive plot selection for Afro Arab lands",
    location: "Greater Accra land inventory",
    city: "Greater Accra",
    mapQuery: "Greater Accra",
    mapZoom: 10,
    type: "land",
    propertyLabel: "Titled land",
    status: "published",
    priceDisplay: "From GH¢85,000 (demo pricing)",
    summary:
      "Live plot explorer powered by inventory records. Geometry and pricing are demo until Afro Arab’s surveyed masterplan is ingested; imagery from their public lands marketing.",
    highlights: [
      "Live availability states",
      "Plan + 3D explorer",
      "Sun orientation study (indicative)",
    ],
    image: "/images/projects/lands-for-sale.jpg",
    imageAlt: "Afro Arab lands for sale marketing visual",
    relatedSlugs: ["bella-vista", "hawas-court", "1100-housing-development"],
    agent: defaultProjectAgent,
    featured: true,
    hasPlotExplorer: true,
    lastVerified: "2026-11-06",
    verificationNote: "Demo plot data only until client masterplan is ingested.",
  },
  {
    slug: "1100-housing-development",
    name: "1100 Housing Development",
    tagline: "Large-scale housing at Old Ningo, Prampram",
    location: "Old Ningo, Prampram",
    city: "Greater Accra",
    mapQuery: "Ningo Prampram",
    mapZoom: 12,
    type: "mixed",
    propertyLabel: "Mixed housing programme",
    status: "coming_soon",
    priceDisplay: "Coming soon",
    summary:
      "Large housing programme shown as coming soon on the legacy site. Publish phases, unit types, and timelines only after client briefing.",
    highlights: ["Coming soon", "Phased delivery expected"],
    image: "/images/projects/prampram-2.jpg",
    imageAlt: "Prampram housing corridor site imagery",
    relatedSlugs: ["hawas-court", "bella-vista", "titled-lands-green-valley"],
    agent: defaultProjectAgent,
    lastVerified: "2026-11-06",
    verificationNote: "Needs phase plan and official unit count confirmation.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function publishedProjects() {
  return projects.filter((p) => p.status !== "draft");
}

export function relatedProjects(project: Project, limit = 3) {
  const fromSlugs = (project.relatedSlugs ?? [])
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p))
    .filter((p) => p.status !== "draft" && p.slug !== project.slug);

  if (fromSlugs.length >= limit) return fromSlugs.slice(0, limit);

  const filler = publishedProjects().filter(
    (p) =>
      p.slug !== project.slug &&
      p.type !== "land" &&
      !fromSlugs.some((r) => r.slug === p.slug),
  );

  return [...fromSlugs, ...filler].slice(0, limit);
}
