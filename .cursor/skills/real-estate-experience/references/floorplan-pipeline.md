# Floor-plan pipeline

## Routes

1. **Pre-construction:** IFC/CAD → validate → Blender → GLB + sidecar + SVG (`authoritative` when QA’d)
2. **Plan-only:** calibrate → trace → human topology QA → extrude → GLB (`reconstructed`)
3. **Built:** 360 or splats for photoreal; keep plan/list fallback (`visual_only` unless measured)

## Sidecar

Rooms, hotspots, cameras, tour edges, units=m, accuracy declaration.

## Cinematic (OHNEIS-inspired)

Accurate Blender blockout → 1.5 m camera path → locked material line → start/end frames drive video. Never sell from AI dimensions.

## License caution

Prefer MIT/Apache. `web-ifc` is MPL-2.0. Avoid AGPL in closed products unless approved.
