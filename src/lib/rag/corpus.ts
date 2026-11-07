import { faqItems } from "@/data/faq";
import { publishedProjects, type Project } from "@/data/projects";
import { plotlinePosts } from "@/data/plotline";
import { leadership, site } from "@/data/site";

export type CorpusDoc = {
  id: string;
  title: string;
  url: string;
  category: "project" | "company" | "payment" | "contact" | "site" | "faq" | "news";
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
    project.hasWalkthrough ? "Floor-plan walkthrough demo available on this site." : null,
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
        "Live plot explorer for Bella Vista titled plots (demo inventory until Supabase is linked).",
        "Floor-plan walkthrough demos for selected estates.",
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
