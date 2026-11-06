# Floor-plan & walkthrough workflow

Reusable across Afro Arab and other real-estate clients.

## Accuracy declaration (required)

Every published experience must declare one of:

| Level | Meaning | Allowed uses |
| --- | --- | --- |
| `authoritative` | Traced to IFC/CAD/survey with human QA | Dimensions, sales claims |
| `reconstructed` | From plans with calibration + human topology QA | Guided tour; dimensions labelled approximate unless verified |
| `visual_only` | Marketing visualization / AI cinematic | Atmosphere only; no dimensional claims |

> Never infer structural accuracy from visual plausibility.

## Route A — Pre-construction (BIM / CAD)

1. Source: Revit / Archicad / SketchUp / IFC / DWG
2. Validate units (metres), origin near zero, storeys, openings
3. Retain IFC GUIDs where available
4. Blender cleanup: materials, LODs, collision proxies, hide MEP noise
5. Export GLB (Meshopt/Draco + KTX2)
6. Generate sidecar JSON (rooms, hotspots, cameras)
7. Generate SVG plan from storey cut
8. QA: browser round-trip, mobile budget, a11y list
9. Publish with `accuracy: authoritative` when verified

Runtime: React Three Fiber + optional That Open Fragments for BIM-heavy cases. Convert IFC **once** server-side; do not parse IFC on every page view.

## Route B — Plan-only

1. Deskew / calibrate raster or vector plan with one trusted length
2. Trace walls/rooms/doors/windows → reviewable SVG/JSON
3. Human topology + dimension QA
4. Extrude shell; add openings; optional furniture
5. Export GLB + sidecar + SVG
6. Publish as `reconstructed` until survey/BIM confirms

Tools worth evaluating (license check before embed): Axonometra (MIT/Apache), openPlan3D (MIT). Avoid AGPL in closed products unless approved.

## Route C — Built property capture

| Need | Medium |
| --- | --- |
| Cost-efficient photoreal tour | 360 panoramas (Photo Sphere Viewer MIT) |
| Free-view photoreal | Gaussian splats (Spark / SuperSplat MIT) |
| Semantics / measurements | Keep IFC/GLB companion |

Splats are not BIM. Always ship plan/list fallback + collision mesh if walk mode is offered.

## Cinematic derivative (OHNEIS-inspired)

Public Ohneis “Floorplan Workflow” is gated; public method from Ohneis/LinkedIn adaptation:

1. Accurate Blender blockout from plan (walls/doors/windows true)
2. Camera path at **1.5 m** eye height; slow in each room
3. Lock room stills with a **fixed material/lighting line**
4. Drive video model with camera animation + exact start/end frames

Use only for ads/reels. **Not** the interactive product geometry source.

## Sidecar schema (v1)

```json
{
  "version": 1,
  "units": "m",
  "accuracy": "reconstructed",
  "levels": [],
  "rooms": [
    {
      "id": "living",
      "name": "Living room",
      "level": 0,
      "polygon": [],
      "area_sqm": 0,
      "spawn": { "position": [0, 1.5, 0], "target": [0, 1.5, -1] }
    }
  ],
  "hotspots": [],
  "cameras": [],
  "tourEdges": [],
  "assets": []
}
```

## Quality budgets

- Mobile initial transfer 3–6 MB; desktop 5–10 MB for first interactive frame
- Mobile triangles 150k–300k visible; desktop ≤ ~1.2m
- Draw calls mobile ≤ 90; desktop ≤ 160
- Poster + SVG always available if WebGL fails

## Client intake checklist

- Source files + units
- North arrow / georeference
- Ceiling heights
- Room naming
- Furniture yes/no
- Brand materials line
- Accuracy target
- Hosting/CDN budget
