# Site architecture

## Primary goals

1. Convert high-intent buyers (viewing / WhatsApp / enquiry)
2. Clarify inventory by project and plot
3. Build trust with evidence and legal clarity
4. Support SEO for projects and locations

## Page hierarchy

```
Homepage (/)
├── Projects (/projects)
│   └── Project detail (/projects/[slug])
│       ├── Gallery
│       ├── Floor plans / Walkthrough
│       ├── Payment options
│       └── Enquire (project-aware)
├── Lands (/lands)
│   └── Plot Explorer (/lands/[slug]/explorer)
├── Payment Plans (/payment-plans)
├── Company (/company)
│   ├── About
│   ├── Leadership
│   └── Awards & proof
├── Insights (/insights)
│   └── Article (/insights/[slug])
├── Contact (/contact)
├── Legal
│   ├── Privacy (/privacy)
│   ├── Terms (/terms)
│   ├── Cookies (/cookies)
│   └── Payment terms (/payment-terms)
└── Admin (/admin) [protected]
    ├── Projects
    ├── Plots / inventory
    ├── Enquiries
    └── Media
```

## Header navigation (max 6 + CTA)

1. Projects
2. Lands
3. Payment Plans
4. Company
5. Insights
6. **Book a viewing** (CTA)

## Conversion paths

| Intent | Entry | Primary action |
| --- | --- | --- |
| Browse homes | /projects | Open project → Book viewing |
| Buy land / pick plot | /lands → explorer | Select plot → Enquire / WhatsApp |
| Understand payment | /payment-plans | Talk to sales |
| Trust / company | /company | Contact |

Every form captures: project/plot ID, source URL, UTM, consent timestamp.

## Redirect map (legacy WordPress)

| Legacy | Target | Notes |
| --- | --- | --- |
| `/home/` | `/` | 301 |
| `/new-homepage-draft/` | `/` | 301 or gone |
| `/projects/` | `/projects` | preserve |
| `/lamins-court-obeyeyie-amasaman/` | `/projects/lamins-court` | 301 |
| `/cephas-court/` | `/projects/cephas-court` | 301 |
| `/dexters-court/` | `/projects/dexters-court` | 301 |
| `/hassy-homes/` | `/projects/hassy-homes` | 301 |
| `/hawas-court*` | `/projects/hawas-court` | 301 |
| `/ibras-court/` | `/projects/ibras-court` | 301 |
| `/paapas-court/` | `/projects/paapas-court` | 301 |
| `/zaras-court*` | `/projects/zaras-court` | 301 |
| `/lands/` | `/lands` | preserve |
| `/payment-plan/` | `/payment-plans` | 301 |
| `/about/` | `/company` | 301 |
| `/support/` | `/contact` | 301 |
| `/blog/` | `/insights` | 301 |

Exact slug inventory to be confirmed against live sitemap before cutover.
