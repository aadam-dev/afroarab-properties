export type FaqItem = {
  id: string;
  question: string;
  answer: string[];
  links?: { href: string; label: string }[];
};

export const faqItems: FaqItem[] = [
  {
    id: "who",
    question: "Who is Afro Arab Properties?",
    answer: [
      "Afro Arab Properties is a subsidiary of the Afro Arab Group, developing homes and titled land across Greater Accra.",
      "Leadership published on our Company page includes Alhaji Salamu Amadu (Chairman / C.E.O), Mr. Abdul S. Mohammed (Managing Director), and Mr. Cephas Kwaku Forfoe (General Manager).",
    ],
    links: [{ href: "/company", label: "About the company" }],
  },
  {
    id: "where",
    question: "Where are your estates?",
    answer: [
      "Current estates and land offerings span corridors including Haatso, Spintex, East Legon Hills, Achiaman, Tema Community 25, Community 22 Annex (Zenu), Katamanso, Ningo Prampram, and Santoe — each with its own project page.",
    ],
    links: [{ href: "/projects", label: "Browse estates" }],
  },
  {
    id: "payment",
    question: "Do you offer interest-free payment plans?",
    answer: [
      "Selected homes and plots can use a developer-backed pathway with an allocation deposit and monthly instalments. Formal terms depend on the inventory and must be confirmed with sales before any payment.",
      "Use the payment calculator for an illustrative schedule, then speak with the team to lock terms.",
    ],
    links: [
      { href: "/payment-plans", label: "Payment plans" },
      { href: "/payment-terms", label: "Payment terms" },
    ],
  },
  {
    id: "blakk",
    question: "What is Blakk Rasta’s Court?",
    answer: [
      "Blakk Rasta’s Court is a 30-unit three-bedroom townhouse development at Community 22 Annex, Zenu. Public coverage in 2026 described a flexible build-up payment path and an electric-vehicle option on qualifying purchases — confirm live terms with sales.",
    ],
    links: [{ href: "/projects/blakk-rastas-court", label: "View the estate" }],
  },
  {
    id: "plots",
    question: "Can I see which plots are available?",
    answer: [
      "Yes. Bella Vista includes an interactive plot explorer where you can pan the plan, filter by facing and size, and enquire with plot context. Availability shown in demos should be confirmed with sales before commitment.",
    ],
    links: [{ href: "/lands/bella-vista/explorer", label: "Open plot explorer" }],
  },
  {
    id: "viewing",
    question: "How do I book a viewing?",
    answer: [
      "Call or WhatsApp the Accra sales lines, use the contact form, or ask our guide to point you to the right next step. Mention the estate or plot you care about so the team can prepare.",
    ],
    links: [{ href: "/contact", label: "Contact & viewing" }],
  },
  {
    id: "office",
    question: "Where is your office?",
    answer: [
      "26 Cotton Avenue, Kokomlemle, Accra, Ghana. Email info@afroarabproperties.com. Phones: +233 244 109 133 and +233 55 985 1280.",
    ],
    links: [{ href: "/contact", label: "Get directions & contact" }],
  },
  {
    id: "title",
    question: "Are the lands titled?",
    answer: [
      "Afro Arab markets titled land and residential estates. Title packs, survey, and indenture details for a specific plot should be confirmed with sales before payment — we treat that as a sales conversation, not a website claim alone.",
    ],
  },
  {
    id: "diaspora",
    question: "Can diaspora buyers purchase from abroad?",
    answer: [
      "Yes — many buyers engage remotely via WhatsApp, email, and documented payment pathways. Sales will guide you on verification, remittance, and viewing options when you cannot be in Accra.",
    ],
    links: [{ href: "/contact", label: "Talk to sales" }],
  },
  {
    id: "guide",
    question: "What can the on-site guide help with?",
    answer: [
      "Quick questions about estates, payment pathways, and how to reach the team. If something needs a human decision — live stock, negotiated pricing, title packs — the guide will hand you to sales.",
    ],
  },
];
