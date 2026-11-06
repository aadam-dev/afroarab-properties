# Afro Arab Properties — interactive platform

Modern rebuild of [afroarabproperties.com](https://afroarabproperties.com): motion-led marketing site, live plot explorer, floor-plan walkthrough pipeline, and Supabase-ready inventory/admin.

## Live preview

- **Site:** [https://afroarab-properties.vercel.app](https://afroarab-properties.vercel.app)
- **Repo:** [https://github.com/aadam-dev/afroarab-properties](https://github.com/aadam-dev/afroarab-properties)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What’s included from the current site

- Full audit of afroarabproperties.com (trust, SEO, a11y, data conflicts)
- Project names, locations, and marketing claims mapped into `src/data/projects.ts` with verification notes
- Public contact block (Kokomlemle address, email, phones)
- Public WordPress media downloaded into `public/images/projects/` and `public/brand/`
- See `docs/research/asset-sources.md`

Sensitive credentials are **not** in the repo. Only `.env.example` is committed.

## Key routes

| Path | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/projects` | Project index |
| `/lands/.../explorer` | Interactive plot explorer |
| `/projects/.../walkthrough` | Floor-plan walkthrough demo |
| `/admin` | Demo inventory admin (`change-me`) |
| `/privacy` `/terms` `/cookies` `/payment-terms` | Legal |

## Docs

See [`docs/README.md`](docs/README.md) for audit, brand, architecture, product specs, pitch, and project log.

## Skill

Project skill: [`.cursor/skills/real-estate-experience/`](.cursor/skills/real-estate-experience/)

## Supabase

1. Create/link a Supabase project
2. Apply [`supabase/migrations/20261105_init.sql`](supabase/migrations/20261105_init.sql)
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` / Vercel

Until env is linked, enquiries log in the server console and the plot explorer uses local demo inventory.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:e2e
```
