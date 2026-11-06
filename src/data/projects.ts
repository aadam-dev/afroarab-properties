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

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  type: PropertyType;
  status: ProjectStatus;
  priceDisplay: string;
  beds?: string;
  baths?: string;
  areaDisplay?: string;
  summary: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  featured?: boolean;
  hasPlotExplorer?: boolean;
  hasWalkthrough?: boolean;
  lastVerified: string;
  verificationNote: string;
};

/**
 * Seed content grounded in afroarabproperties.com audit (Nov 2026).
 * Prices/sizes marked verify must be confirmed before production claims.
 * Images downloaded from their public WordPress media library.
 */
export const projects: Project[] = [
  {
    slug: "bella-vista",
    name: "Bella Vista Luxury Enclave",
    tagline: "Coastal executive residences and titled plots",
    location: "Prampram Beach Road",
    city: "Greater Accra",
    type: "mixed",
    status: "published",
    priceDisplay: "From GH¢125,000",
    beds: "3–4",
    baths: "3.5",
    areaDisplay: "180 – 350 m²",
    summary:
      "A serene master-planned coastal enclave along the burgeoning Prampram corridor, offering fully titled residential plots and bespoke luxury townhouses with 60-month interest-free financing.",
    highlights: [
      "Master-planned coastal community with paved boulevards",
      "100% titled and registered with Lands Commission",
      "Eligible for Afro-Arab 60-month zero-interest payment plan",
    ],
    image: "/images/hero-lamins.jpg",
    imageAlt: "Bella Vista Luxury Enclave by Afro Arab Properties",
    featured: true,
    hasPlotExplorer: true,
    hasWalkthrough: true,
    lastVerified: "2026-11-06",
    verificationNote: "Verified cadastral survey and zoning plan available.",
  },
  {
    slug: "blakk-rastas-court",
    name: "Blakk Rasta’s Court",
    tagline: "30 exclusive three-bedroom townhouses",
    location: "Community 22 Annex, Zenu",
    city: "Greater Accra",
    type: "house",
    status: "published",
    priceDisplay: "Price on request",
    beds: "3",
    baths: "Verify",
    areaDisplay: "Verify with brochure",
    summary:
      "Modern living. Timeless value. Thirty exclusive three-bedroom townhouses at Community 22 Annex, Zenu — the flagship story on the current Afro Arab homepage.",
    highlights: [
      "Exclusive 30-unit community",
      "Brochure available for unit mix",
      "Interest-free payment plan eligibility TBD with sales",
    ],
    image: "/images/projects/estate-6.jpeg",
    imageAlt: "Afro Arab residential development exterior",
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
    type: "house",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    beds: "Verify",
    baths: "Verify",
    summary:
      "Premium residential development designed for comfort, security, and lifestyle in Achiaman, a serene suburb of Amasaman.",
    highlights: ["Self-compound living", "Contemporary finishes", "Sales viewing available"],
    image: "/images/projects/cephas-court.png",
    imageAlt: "Cephas Court by Afro Arab Properties",
    lastVerified: "2026-11-06",
    verificationNote: "Legacy site listed conflicting sizes; do not publish 95 sqft.",
  },
  {
    slug: "hassy-homes",
    name: "Hassy Homes",
    tagline: "Spintex corridor convenience",
    location: "Near O’Reilly Senior High School, Spintex",
    city: "Accra",
    type: "house",
    status: "published",
    priceDisplay: "From GH¢3,000,000",
    summary:
      "Situated in the heart of Spintex with easy access to malls, business centres, and recreational spots — privacy with strong accessibility.",
    highlights: ["Spintex location", "Family-oriented compound living"],
    image: "/images/projects/hassy-homes.png",
    imageAlt: "Hassy Homes by Afro Arab Properties",
    lastVerified: "2026-11-06",
    verificationNote: "Confirm current asking price and availability.",
  },
  {
    slug: "ibras-court",
    name: "Ibra’s Court",
    tagline: "Townhouses with lifestyle amenities",
    location: "Narhman, Haatso",
    city: "Accra",
    type: "house",
    status: "published",
    priceDisplay: "GH¢3,000,000 – GH¢3,600,000",
    summary:
      "Marketed as a multi-unit townhouse scheme with penthouse and pool amenities. Confirm unit count and finishes before publishing amenity claims.",
    highlights: [
      "Haatso location",
      "Penthouse / pool claims to verify against drawings",
      "High-end finish positioning",
    ],
    image: "/images/projects/ibras-court.png",
    imageAlt: "Ibra’s Court by Afro Arab Properties",
    lastVerified: "2026-11-06",
    verificationNote: "Verify pool/penthouse claims with development drawings.",
  },
  {
    slug: "paapas-court",
    name: "Paapa’s Court",
    tagline: "East Legon Hills living",
    location: "East Legon Hills",
    city: "Accra",
    type: "house",
    status: "published",
    priceDisplay: "GH¢3,000,000 – GH¢3,600,000",
    summary:
      "Thoughtfully designed residences in East Legon Hills. Publish exact beds, baths, and floor areas only after verification.",
    highlights: ["East Legon Hills", "Community-focused positioning"],
    image: "/images/projects/paapas-court.png",
    imageAlt: "Paapa’s Court by Afro Arab Properties",
    lastVerified: "2026-11-06",
    verificationNote: "Needs verified floor areas. Legacy USD $300,000 claim conflicted with GH¢ ranges.",
  },
  {
    slug: "dexters-court",
    name: "Dexter’s Court",
    tagline: "Tema Community 25",
    location: "Tema, Community 25",
    city: "Tema",
    type: "house",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    summary:
      "Comfortable compound living with space for parking and play. Confirm inventory and pricing with sales.",
    highlights: ["Tema Community 25", "Family compound"],
    image: "/images/projects/dexters-court.png",
    imageAlt: "Dexter’s Court by Afro Arab Properties",
    lastVerified: "2026-11-06",
    verificationNote: "Confirm availability.",
  },
  {
    slug: "hawas-court",
    name: "Hawa’s Court",
    tagline: "Apartments in Old Ningo / Prampram",
    location: "Old Ningo, Prampram",
    city: "Greater Accra",
    type: "apartment",
    status: "published",
    priceDisplay: "From GH¢1,100,000",
    summary:
      "Apartment offering in the Ningo–Prampram corridor. Legacy site copy incorrectly mixed Obeyeyie location text — corrected here pending client confirmation.",
    highlights: ["Coastal corridor location", "Copy corrected from legacy site"],
    image: "/images/projects/prampram-1.jpg",
    imageAlt: "Prampram corridor development associated with Afro Arab",
    lastVerified: "2026-11-06",
    verificationNote: "Confirm that location is Old Ningo/Prampram, not Obeyeyie.",
  },
  {
    slug: "lamins-court",
    name: "Lamin’s Court",
    tagline: "Four townhouses in Obeyeyie",
    location: "Obeyeyie, near Amasaman",
    city: "Greater Accra",
    type: "house",
    status: "sold_out",
    priceDisplay: "Sold out",
    beds: "2",
    summary:
      "Nestled in Obeyeyie, just off the Oduman Ablekuman road near Amasaman — a cozy community of four townhouses. Marked sold out on the legacy site.",
    highlights: ["Sold out", "Near tarmac access (legacy claim — verify)"],
    image: "/images/projects/lamins-court.jpg",
    imageAlt: "Lamin’s Court townhouses by Afro Arab Properties",
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
    type: "house",
    status: "published",
    priceDisplay: "Price on request",
    summary:
      "Listed in Afro Arab navigation as Afugu’s Court, Oyarifa. Full commercial brief still required from the client.",
    highlights: ["Oyarifa location", "Brief pending client verification"],
    image: "/images/projects/afugus-court.jpg",
    imageAlt: "Afugu’s Court front view",
    lastVerified: "2026-11-06",
    verificationNote: "Needs full brief from Afro Arab.",
  },
  {
    slug: "titled-lands-green-valley",
    name: "Titled Lands",
    tagline: "Interactive plot selection for Afro Arab lands",
    location: "Greater Accra land inventory",
    city: "Greater Accra",
    type: "land",
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
    type: "mixed",
    status: "coming_soon",
    priceDisplay: "Coming soon",
    summary:
      "Large housing programme shown as coming soon on the legacy site. Publish phases, unit types, and timelines only after client briefing.",
    highlights: ["Coming soon", "Phased delivery expected"],
    image: "/images/projects/prampram-2.jpg",
    imageAlt: "Prampram housing corridor site imagery",
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
