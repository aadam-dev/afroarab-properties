/** Public contact details observed on afroarabproperties.com (Nov 2026). */
export const site = {
  name: "Afro Arab Properties",
  group: "Afro Arab Group",
  email: "info@afroarabproperties.com",
  phones: ["+233 244 109 133", "+233 55 985 1280"],
  phoneTel: ["+233244109133", "+233559851280"],
  /** Sales line used as WhatsApp on property pages (tel:+233559851280). */
  whatsappE164: "233559851280",
  address: {
    line1: "26 Cotton Avenue",
    line2: "Kokomlemle, Accra",
    country: "Ghana",
  },
  /** Legacy support-page map query (office pin on current site). */
  officeMapQuery: "Afro Arab Properties, Alhaji Moro St. Nima, Accra",
  officeMapZoom: 14,
  officeMapNote:
    "Public listing pin from the current site. Confirm street entrance with sales before visiting.",
  legacyUrl: "https://afroarabproperties.com",
} as const;

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
};

/** Leadership published on afroarabproperties.com/about (Nov 2026). */
export const leadership: TeamMember[] = [
  {
    name: "Alhaji Salamu Amadu",
    role: "Chairman / C.E.O",
    image: "/images/team/alhaji-salamu-amadu.jpg",
    imageAlt: "Alhaji Salamu Amadu, Chairman and CEO of Afro Arab Group",
  },
  {
    name: "Mr. Abdul S. Mohammed",
    role: "Managing Director",
    image: "/images/team/abdul-s-mohammed.jpg",
    imageAlt: "Mr. Abdul S. Mohammed, Managing Director",
  },
  {
    name: "Mr. Cephas Kwaku Forfoe",
    role: "General Manager",
    image: "/images/team/cephas-kwaku-forfoe.jpg",
    imageAlt: "Mr. Cephas Kwaku Forfoe, General Manager",
  },
];

export function whatsappNumber() {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return fromEnv || site.whatsappE164;
}

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${whatsappNumber()}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mapsEmbedUrl(query: string, zoom = 14) {
  const params = new URLSearchParams({
    q: query,
    t: "m",
    z: String(zoom),
    output: "embed",
    iwloc: "near",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}
