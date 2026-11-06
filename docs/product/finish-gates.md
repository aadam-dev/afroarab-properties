# Finish gates — Afro Arab rebuild

Checklist status as of 5 November 2026.

## Trust / content

- [x] Placeholder thousands / repeated 95 sqft removed from marketing UI
- [x] Verification notes on project detail pages
- [x] Legal pages resolve (`/privacy`, `/terms`, `/cookies`, `/payment-terms`)
- [ ] Client-verified prices/sizes before production claims
- [ ] Counsel-approved legal final copy

## Marketing / conversion

- [x] One H1 pattern on primary pages
- [x] Project/plot-aware enquiry form + consent
- [x] Book a viewing CTA in header
- [x] WhatsApp hook ready via env
- [x] Motion with reduced-motion fallbacks (Framer Motion `useReducedMotion`)

## Plot explorer

- [x] SVG Plan mode keyboard selectable
- [x] Filters + legend + list + shareable `?plot=`
- [x] Lazy 3D mode with status-driven meshes
- [x] Sun path labelled indicative
- [ ] Replace demo polygons with surveyed masterplan
- [ ] Realtime Supabase subscription when project linked

## Floor-plan pipeline

- [x] Documented routes + accuracy levels
- [x] Accessible SVG walkthrough demo
- [ ] First client CAD/IFC ingest

## Backend / security

- [x] Supabase migration + RLS sketch + audit + optimistic lock function
- [x] Enquiry API Zod validation
- [x] Security headers in `next.config.ts`
- [x] `/admin` demo gate (replace with Auth)
- [ ] Live Supabase project linked

## SEO / redirects

- [x] Metadata + OG defaults
- [x] Organization / Article / listing JSON-LD
- [x] robots.txt + sitemap
- [x] Legacy `/home`, draft, project slug redirects

## Perf / QA evidence

- [x] Mobile capture at 390×844 (`docs/qa/home-390x844.png`)
- [x] Tablet 768×1024 + desktop 1440×900 screenshots (`docs/qa/`)
- [x] Unit tests for plot filters / transitions (`npm test`)
- [x] Playwright smoke for enquiry + explorer URL (`npm run test:e2e`)
- [ ] Lighthouse CI score tracking (optional next)
