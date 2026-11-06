---
name: real-estate-experience
description: Build exceptional, interactive real-estate marketing sites with verified inventory, live plot explorers, and accuracy-declared floor-plan walkthroughs. Use when creating or redesigning developer/agency property websites, plot selectors, masterplan explorers, BIM/GLB tours, 360/splat experiences, or Ghana/Africa housing lead funnels.
---

# Real Estate Experience

Ship premium real-estate sites where **facts, conversion, and spatial interaction** beat decorative redesigns.

## When to use

- Developer / estate agency marketing sites
- Land plot explorers and availability maps
- Floor-plan walkthroughs (IFC/CAD/plan/360/splat)
- Lead capture with project/plot attribution
- Reusable systems across multiple real-estate clients

## Non-negotiables

1. Canonical inventory — one record per project/plot; publication validation blocks conflicting facts
2. Legal pages are real URLs, never `#`
3. Plot availability lives in a database, never only in GLB materials
4. SVG/list Plan mode works without WebGL
5. Every spatial asset declares `authoritative | reconstructed | visual_only`
6. AI cinematic video is marketing only — not dimensional truth
7. Motion on marketing pages; heavy WebGL reserved for explorers/walkthroughs
8. Status never by colour alone; keyboard access required

## Process

1. **Audit** current site for trust, data conflicts, legal, a11y, SEO, perf
2. **Intake** verified spreadsheet, masterplans, CAD/IFC, WhatsApp/CRM, legal entity
3. **Brand** local credibility over generic luxury; distinctive type/colour/motion
4. **IA** Buy journeys: Homes / Lands / Payment / Company / Contact + Admin
5. **Build marketing site** semantic, motion-led, project-aware CTAs
6. **Inventory backend** Postgres/Supabase + RLS + audit + optimistic status locks
7. **Plot explorer** SVG baseline + lazy R3F; filters; sun study labelled indicative
8. **Walkthrough pipeline** per [references/floorplan-pipeline.md](references/floorplan-pipeline.md)
9. **Finish gates** per [references/finish-gates.md](references/finish-gates.md)

## Medium selection (cheapest truthful)

| Need | Medium |
| --- | --- |
| Availability + filters | SVG + list + DB |
| Estate atmosphere | Compressed GLB + R3F |
| BIM semantics | IFC → Fragments/GLB once server-side |
| Built photoreal, cheap | 360 (Photo Sphere Viewer) |
| Built free-view photoreal | Gaussian splats |
| Ad/reel | Blender camera path → video (visual_only) |

## Stack defaults

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth/DB/Storage/Realtime
- Framer Motion / GSAP for marketing choreography
- React Three Fiber + Drei for explorers
- Zod validation on enquiry APIs

## Prompt skeleton

```text
Build a real-estate experience for {client} in {market}.
Primary action: {book viewing / enquire plot}.
Inventory source: {spreadsheet / supabase}.
Spatial assets: {none / masterplan / IFC / plans / 360}.
Accuracy target: {authoritative / reconstructed / visual_only}.
Must include: verified facts, legal pages, accessible plan mode,
project-aware forms, reduced-motion support.
Do not invent prices, sizes, or availability.
```

## Additional resources

- [references/intake.md](references/intake.md)
- [references/plot-explorer.md](references/plot-explorer.md)
- [references/floorplan-pipeline.md](references/floorplan-pipeline.md)
- [references/finish-gates.md](references/finish-gates.md)
