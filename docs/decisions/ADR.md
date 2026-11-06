# Architecture decision records

## ADR-001 — Next.js App Router on Vercel

**Decision:** Build the public site and admin UI with Next.js App Router (Node runtime / Fluid Compute).  
**Why:** SSR/SSG for SEO, API routes for leads, good Vercel fit, React ecosystem for R3F.  
**Status:** Accepted

## ADR-002 — Supabase for inventory + auth + storage

**Decision:** Supabase Postgres (+ PostGIS where needed), Auth, Storage, Realtime for plots/leads/admin.  
**Why:** Client chose Supabase-backed admin; RLS, realtime status, and storage cover MVP without WordPress coupling.  
**Status:** Accepted

## ADR-003 — SVG baseline + R3F enhancement for plots

**Decision:** Canonical plot polygons in DB; SVG/list always work; R3F loads lazily for 3D/walk/sun.  
**Why:** Demo is visually strong but inaccessible and static; Afro Arab needs mobile + a11y + live inventory.  
**Status:** Accepted

## ADR-004 — Availability never lives only in GLB

**Decision:** Plot status and commercial fields are database fields with optimistic locking and audit.  
**Why:** Concurrent sales, CRM sync, and legal accuracy require transactional truth.  
**Status:** Accepted

## ADR-005 — Motion on marketing site; WebGL reserved for spatial tools

**Decision:** Marketing pages use DOM/GSAP-or-Motion choreography; full WebGL only in Plot Explorer / Walkthrough.  
**Why:** SEO, CWV, and mobile reliability.  
**Status:** Accepted

## ADR-006 — Floor-plan accuracy levels

**Decision:** Every spatial asset declares `authoritative | reconstructed | visual_only`. AI cinematic is visual_only.  
**Why:** Prevent dimensional claims from generative media.  
**Status:** Accepted

## ADR-007 — Skill location

**Decision:** Author `.cursor/skills/real-estate-experience/` in-repo; mirror to `~/.cursor/skills/real-estate-experience/`.  
**Why:** Versioned with project + reusable across clients.  
**Status:** Accepted
