# Afro Arab Properties — Project Docs

Evidence, brand, product specs, sales materials, and delivery logs for the Afro Arab interactive real-estate platform rebuild.

## Index

| Doc | Purpose |
| --- | --- |
| [audit/current-site.md](audit/current-site.md) | Observed issues on afroarabproperties.com |
| [brand/brand-foundation.md](brand/brand-foundation.md) | Positioning, audience, voice, proof |
| [brand/design-system.md](brand/design-system.md) | Tokens, type, motion, accessibility |
| [strategy/site-architecture.md](strategy/site-architecture.md) | IA, URLs, redirects, conversion paths |
| [strategy/content-inventory.md](strategy/content-inventory.md) | Projects, claims, assets to verify |
| [product/data-model.md](product/data-model.md) | Supabase schema and inventory rules |
| [product/plot-explorer.md](product/plot-explorer.md) | Live plot interaction product spec |
| [product/floorplan-workflow.md](product/floorplan-workflow.md) | Reusable walkthrough production pipeline |
| [product/finish-gates.md](product/finish-gates.md) | Cross-phase QA checklist status |
| [sales/pitch.md](sales/pitch.md) | Client pitch and phased offer |
| [sales/outreach-emails.md](sales/outreach-emails.md) | Outreach sequences |
| [research/references.md](research/references.md) | GitHub, demos, licenses, tech choices |
| [decisions/ADR.md](decisions/ADR.md) | Architecture decision records |
| [project-log.md](project-log.md) | Append-only delivery log |

## Product goal

Replace the current WordPress/Elementor site with a modern, motion-led marketing experience plus:

1. Live plot explorer for land inventory interaction
2. Floor-plan walkthrough pipeline reusable across real-estate clients
3. Supabase-backed inventory, leads, and lightweight admin

## Non-negotiables

- Property facts must be canonical and validated before publish
- Legal/privacy pages must be real, not `#`
- Plot availability lives in the database, never only in GLB materials
- 3D is an enhancement; SVG/list/plan remains fully usable
- AI video is cinematic only; geometry accuracy requires human QA
