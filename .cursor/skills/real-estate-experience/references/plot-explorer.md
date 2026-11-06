# Plot explorer rules

## Canonical model

One plot record → SVG, list, R3F meshes, admin, CRM payload.

Required fields: code, status, dimensions, area, facing, price, polygon, status_version.

## UX

- Search by plot number
- Filters: facing, size, available, corner
- Legend with counts + text labels
- Shareable `?plot=`
- Enquire with plot attribution
- Mobile defaults to Plan mode
- No forced landscape

## Sun study

Use surveyed lat/long + true north + maintained solar library. Label **indicative** unless professionally validated.

## Perf

- Plan interactive before GLB
- Meshopt/Draco/KTX2
- On-demand frameloop when idle
- DPR cap on mobile
