# Project log

Append-only. Newest entries at the top.

## 2026-11-06 — Public GitHub + Vercel share link

- Pulled public Afro Arab logo, favicon, and project photography into `public/`
- Wired real contact details (Cotton Avenue, phones, email)
- Public repo: https://github.com/aadam-dev/afroarab-properties
- Production preview: https://afroarab-properties.vercel.app
- No Supabase secrets or `.env.local` committed

## 2026-11-06 — Luxury visual polish + finish QA

- Elevated Ghanaian modernism: full-bleed hero photography, gold/forest materials, page bands, provenance strip
- Fixed light-page header (sticky adaptive) and first-paint brand visibility
- Playwright smoke + viewport evidence in `docs/qa/`
- Remaining blockers unchanged: client-verified inventory, surveyed polygons, live Supabase, counsel legal final

## 2026-11-05 — Marketing site, explorer, admin, skill shipped

- Next.js 16 + Tailwind 4 app with Fraunces / Manrope / IBM Plex Mono
- Marketing pages: Home, Projects, Lands, Payment, Company, Insights, Contact, Legal
- Legacy redirects + security headers + robots/sitemap + Organization schema
- Enquiry API with Zod + optional Supabase insert + consent language
- Plot explorer MVP: SVG Plan + lazy R3F 3D, filters, sun path, shareable `?plot=`
- Floor-plan walkthrough demo with reconstructed accuracy label
- Supabase migration with RLS, optimistic `transition_plot_status`, audit table
- Demo `/admin` inventory editor
- Real-estate-experience skill authored in-repo and mirrored to `~/.cursor/skills/`
- Vitest coverage for plot filters / status transitions
- Finish-gate checklist recorded in docs + skill references

## 2026-11-05 — Foundation kickoff

- Audited afroarabproperties.com (trust, data, legal, a11y, perf, SEO)
- Studied plot-explorer-demo (Three.js r186, ~2.6 MB site.glb, static inventory)
- Reviewed Ohneis resources (Floorplan Workflow gated); adapted public cinematic method
- Researched OSS: R3F, That Open, Axonometra, openPlan3D, PSV, Spark/SuperSplat
- Chose phased delivery + Supabase admin + dual skill location
- Bootstrapped Next.js 16 App Router + docs tree
- Open risks: unverified client inventory data; no real survey/GLB assets yet; Supabase project not linked

## Asset blockers

- [ ] Verified project spreadsheet from Afro Arab
- [ ] Masterplan / plot polygons for first land project
- [ ] Floor plans for first walkthrough candidate
- [ ] WhatsApp / CRM routing
- [ ] Legal entity copy for privacy/terms
- [ ] Link live Supabase project + replace demo admin password gate

