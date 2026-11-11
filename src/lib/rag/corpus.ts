import { faqItems } from "@/data/faq";
import { publishedProjects, type Project } from "@/data/projects";
import { plotlinePosts } from "@/data/plotline";
import { leadership, site } from "@/data/site";
import { estateSlugs, formatGhs, getEstate, plotLegend, plotsForProject, sizeKey } from "@/data/masterplan";

export type CorpusDoc = {
  id: string;
  title: string;
  url: string;
  category: "project" | "plots" | "company" | "payment" | "contact" | "site" | "faq" | "news";
  text: string;
  keywords: string[];
};

function projectDoc(project: Project): CorpusDoc {
  const bits = [
    project.name,
    project.tagline,
    `Location: ${project.location}, ${project.city}`,
    project.propertyLabel ? `Type: ${project.propertyLabel}` : `Type: ${project.type}`,
    `Status: ${project.status}`,
    `Price: ${project.priceDisplay}`,
    project.priceUsdDisplay ? `USD band: ${project.priceUsdDisplay}` : null,
    project.beds ? `Beds: ${project.beds}` : null,
    project.baths ? `Baths: ${project.baths}` : null,
    project.areaDisplay ? `Area: ${project.areaDisplay}` : null,
    project.parking ? `Parking: ${project.parking}` : null,
    project.yearBuilt ? `Year built (listing): ${project.yearBuilt}` : null,
    project.unitCount ? `Units: ${project.unitCount}` : null,
    project.electricalPower ? `Electrical (listing claim): ${project.electricalPower}` : null,
    project.summary,
    project.highlights.length ? `Highlights: ${project.highlights.join("; ")}` : null,
    project.features?.length ? `Features: ${project.features.join("; ")}` : null,
    project.hasPlotExplorer ? "Interactive plot explorer available on this site." : null,
    project.hasWalkthrough ? `A 3D model of the house is on this site at /projects/${project.slug}/walkthrough: walk around it, lift off each floor and step inside the rooms. The layout is indicative, built from photographs.` : null,
    project.agent
      ? `Project contact: ${project.agent.name} (${project.agent.role}), ${project.agent.phoneDisplay}, ${project.agent.email}`
      : null,
    `Verification: ${project.verificationNote}`,
  ].filter(Boolean);

  return {
    id: `project:${project.slug}`,
    title: project.name,
    url: `/projects/${project.slug}`,
    category: "project",
    text: bits.join("\n"),
    keywords: [
      project.slug,
      project.name,
      project.location,
      project.city,
      project.type,
      project.propertyLabel ?? "",
      ...(project.highlights ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  };
}

/** Live plot inventory for an estate that has a 3D explorer. */
function plotsDoc(slug: string, name: string): CorpusDoc {
  const plots = plotsForProject(slug);
  const legend = plotLegend(plots);
  const open = plots.filter((p) => p.status === "available");
  const prices = open.map((p) => p.priceGhs);
  const sizes = [...new Set(open.toSorted((a, b) => a.frontageFt - b.frontageFt).map(sizeKey))].join(", ");
  const corners = open.filter((p) => p.isCorner).length;
  return {
    id: `plots:${slug}`,
    title: `${name} plots`,
    url: `/lands/${slug}/explorer`,
    category: "plots",
    text: [
      `${name} has ${plots.length} plots in the 3D explorer.`,
      `Available now: ${legend.available}. Reserved: ${legend.reserved}. On hold: ${legend.held}. Sold: ${legend.sold}. Phase 2 (not yet released): ${legend.unreleased}.`,
      prices.length
        ? `Available plots range from ${formatGhs(Math.min(...prices))} to ${formatGhs(Math.max(...prices))}, in sizes ${sizes} ft. ${corners} available plots are corner plots.`
        : "No plots are available right now.",
      "Each plot shows its size, price, road access, an example payment plan, a suggested home and its title documents.",
      "The layout and prices are indicative. Sales confirm live availability before any payment.",
    ].join("\n"),
    keywords: [
      "plot", "plots", "available", "availability", "explorer", "3d", "map", "corner",
      "size", "sizes", "land", "green", "valley", ...slug.split("-"),
    ],
  };
}

/** Flat knowledge base built only from published site content. */
export function buildCorpus(): CorpusDoc[] {
  const docs: CorpusDoc[] = [
    {
      id: "company:about",
      title: "About Afro Arab Properties",
      url: "/company",
      category: "company",
      text: [
        `${site.name} is a subsidiary of the ${site.group}.`,
        "Develops homes and titled land across Greater Accra, Ghana.",
        "Markets residential estates and titled land with clearer inventory presentation.",
        "Interest-free payment pathways are available on selected stock — confirm formal terms with sales.",
        "Large national housing-count claims are treated as marketing goals until verified programme documentation is provided.",
        `Leadership: ${leadership.map((p) => `${p.name} (${p.role})`).join("; ")}.`,
      ].join("\n"),
      keywords: [
        "about",
        "company",
        "afro",
        "arab",
        "group",
        "leadership",
        "chairman",
        "developer",
        "ghana",
        "accra",
        ...leadership.flatMap((p) => p.name.toLowerCase().split(/\s+/)),
      ],
    },
    {
      id: "contact:sales",
      title: "Sales contact",
      url: "/contact",
      category: "contact",
      text: [
        `Email: ${site.email}`,
        `Phones: ${site.phones.join(", ")}`,
        `WhatsApp sales line: +${site.whatsappE164}`,
        `Office: ${site.address.line1}, ${site.address.line2}, ${site.address.country}`,
        `Map note: ${site.officeMapNote}`,
        "Buyers can book a viewing via the contact form or WhatsApp sales.",
        "Project manager / agent on most estate pages: Hosni Mubarack Salih.",
      ].join("\n"),
      keywords: [
        "contact",
        "phone",
        "email",
        "whatsapp",
        "office",
        "address",
        "kokomlemle",
        "viewing",
        "sales",
        "hosni",
      ],
    },
    {
      id: "payment:plans",
      title: "Payment plans",
      url: "/payment-plans",
      category: "payment",
      text: [
        "Selected homes and plots can use a developer-backed interest-free payment pathway.",
        "Typical marketing path: choose inventory, pay an allocation deposit, then monthly instalments over a published tenor.",
        "Use the on-site payment calculator for illustrative schedules only.",
        "Formal terms must be confirmed with sales before any payment — see /payment-terms.",
        "Interest-free eligibility is inventory-specific and may change.",
      ].join("\n"),
      keywords: [
        "payment",
        "plan",
        "interest",
        "free",
        "instalment",
        "installment",
        "deposit",
        "allocation",
        "calculator",
        "mortgage",
        "financing",
        "tenor",
      ],
    },
    {
      id: "site:features",
      title: "What this website offers",
      url: "/",
      category: "site",
      text: [
        "This rebuild of afroarabproperties.com includes:",
        "Canonical estate pages with verified marketing facts and galleries.",
        "A 3D plot explorer for Green Valley Estate at /lands/titled-lands-green-valley/explorer, with numbered plots, filters, sun path, plan view and walk mode.",
        "A 3D house model you can walk through, starting with Lamin's Court.",
        "Payment plan calculator and enquiry forms attributed to project or plot.",
        "Legal pages: privacy, terms, cookies, and payment terms.",
        "FAQ answers common buyer questions.",
        "Plotline carries company news, offers, and buyer guides.",
        "An on-site guide helps with estates and payments, and connects visitors to sales when needed.",
      ].join("\n"),
      keywords: [
        "website",
        "plot",
        "explorer",
        "walkthrough",
        "floor",
        "plan",
        "assistant",
        "chat",
        "guide",
        "faq",
        "plotline",
        "news",
        "legal",
        "privacy",
      ],
    },
  ];

  for (const project of publishedProjects()) {
    docs.push(projectDoc(project));
  }

  for (const slug of estateSlugs) {
    const estate = getEstate(slug);
    if (estate) docs.push(plotsDoc(slug, estate.name));
  }

  for (const item of faqItems) {
    docs.push({
      id: `faq:${item.id}`,
      title: item.question,
      url: "/faq",
      category: "faq",
      text: [item.question, ...item.answer].join("\n"),
      keywords: item.question
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 2),
    });
  }

  for (const post of plotlinePosts) {
    docs.push({
      id: `news:${post.slug}`,
      title: post.title,
      url: `/plotline/${post.slug}`,
      category: "news",
      text: [post.title, post.excerpt, ...post.body].join("\n"),
      keywords: [
        post.slug,
        post.category,
        ...post.title.toLowerCase().split(/[^a-z0-9]+/),
      ].filter(Boolean),
    });
  }

  return docs;
}

let cached: CorpusDoc[] | null = null;

export function getCorpus(): CorpusDoc[] {
  if (!cached) cached = buildCorpus();
  return cached;
}
