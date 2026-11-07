# Afro Arab Properties

This is the working rebuild of [afroarabproperties.com](https://afroarabproperties.com) — not a generic Next.js starter, and not a glossy brochure that invents inventory.

Afro Arab sells homes and titled land across Greater Accra. Their live WordPress site already has the estates, the sales numbers, and the photography. What it doesn’t have is trustworthy project facts in one place, a way to explore plots, or a path for diaspora buyers who want to understand stock before they call. This repo is that path.

## What’s live on the preview

- **Site:** [https://afroarab-properties.vercel.app](https://afroarab-properties.vercel.app)
- **Repo:** [https://github.com/aadam-dev/afroarab-properties](https://github.com/aadam-dev/afroarab-properties)

You’ll find estate pages grounded in the Nov 2026 WordPress audit, a Bella Vista plot explorer, floor-plan walkthrough demos, an interest-free payment calculator, enquiry + WhatsApp handoff to the real Accra sales lines, and a site guide that answers only from published content.

## How to run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, enquiries log to the server console and the plot explorer uses local demo inventory — fine for demos, not for production cutover.

Optional: set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) if you want the site guide to phrase answers with a model. With no key it still works — it pulls the best matching website excerpts and offers WhatsApp/contact when the corpus doesn’t cover the question.

## What’s intentionally strict

- Prices, sizes, and unit counts come from `src/data/projects.ts` with verification notes. Template junk like “95 sqft” stays out.
- The site guide (`Ask the site`) is RAG over that same corpus plus company, payment, and contact pages. Outside knowledge → sales team, not improvisation.
- Legal pages are real routes, not `#` placeholders.
- Public WordPress media lives under `public/images/` — see `docs/research/asset-sources.md`. Secrets never do.

## Useful routes

| Path | What it’s for |
| --- | --- |
| `/` | Motion-led homepage |
| `/projects` · `/projects/[slug]` | Estate index and editorial detail |
| `/lands/.../explorer` | Interactive plot selection |
| `/projects/.../walkthrough` | Floor-plan walkthrough demo |
| `/payment-plans` | Interest-free calculator + enquiry |
| `/company` · `/contact` | Leadership + sales |
| `/admin` | Demo inventory admin (`ADMIN_PASSWORD`) |

## Docs worth reading

Start at [`docs/README.md`](docs/README.md). The sales pitch lives in [`docs/sales/pitch.md`](docs/sales/pitch.md). Product specs for the plot explorer and walkthrough pipeline are under `docs/product/`.

Cursor skill for this workstream: [`.cursor/skills/real-estate-experience/`](.cursor/skills/real-estate-experience/).

## Supabase (when you’re ready)

1. Create or link a Supabase project
2. Apply [`supabase/migrations/20261105_init.sql`](supabase/migrations/20261105_init.sql)
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:e2e
```
