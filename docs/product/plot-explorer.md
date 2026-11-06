# Plot Explorer product spec

Reference inspiration: https://plot-explorer-demo.netlify.app/  
Stack choice: accessible SVG/list baseline + lazy React Three Fiber enhancement; inventory from Supabase.

## Goals

Let buyers explore a development’s plots live: find by number, filter, inspect details, understand sun/orientation, and enquire with plot context.

## Modes

| Mode | Description | Default device |
| --- | --- | --- |
| Plan (SVG) | Top-down interactive plan, keyboard selectable | Mobile default |
| 3D | Orbit/pan/zoom GLB environment + extruded/selectable plots | Desktop enhancement |
| Walk | First-person ground-level navigation (gated if perf low) | Opt-in |
| Natural / Status | Toggle realistic materials vs availability colors | All |

## Features (MVP)

1. Search by plot number → focus + detail sheet
2. Filters: facing, size, available only, corner
3. Legend counts: available / held / reserved / sold
4. Plot detail: dimensions, area, price, facing, roads, CTA
5. Sun path: time slider + play; surveyed lat/long + true north; **labelled indicative**
6. Compass
7. Shareable URL `?plot=12`
8. Enquire / WhatsApp with plot attribution
9. Progressive GLB load with poster fallback
10. Realtime status updates from Supabase

## Architecture

```
Supabase plots (canonical)
        │
        ├── SVG / list renderer (a11y baseline)
        └── R3F scene (lazy)
              ├── environment GLB (visual only)
              └── plot meshes from polygon data (status-driven)
```

Do **not** hide availability inside GLB materials as the source of truth. Demo extracts Plot_N meshes; we keep polygons in DB and generate selectable meshes.

## Accessibility

- Every plot in a searchable list and SVG with focusable nodes
- `aria-pressed` on mode toggles
- Status via text + pattern, not color alone
- Reduced motion: disable walk bobbing and auto sun play
- Portrait supported; no forced landscape
- If WebGL fails → Plan mode only

## Performance budgets

- Initial Plan mode JS/CSS < 200 KB gzipped target
- Environment GLB compressed ≤ 3–5 MB for MVP; stream LOD later
- DPR cap 1.25–1.5 mobile; on-demand frameloop when idle
- Prefetch GLB only after Plan is interactive

## Out of scope for MVP

- Multi-development GIS (MapLibre later)
- Cesium city twin
- In-GLB CRM
- Vastu guidance (optional later if client requests)

## Acceptance

- Filter + search works without WebGL
- Selecting plot updates URL and enquiry payload
- Status change in admin reflects within seconds
- Keyboard can select and open plot details
- Lighthouse a11y ≥ 90 on Plan mode page
