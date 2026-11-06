# Research references

Compiled 5 November 2026.

## Live references

| URL | Role |
| --- | --- |
| https://afroarabproperties.com | Current client site (audit baseline) |
| https://plot-explorer-demo.netlify.app | Plot explorer UX inspiration (R3F + GLB; static inventory) |
| https://www.ohneis652.com/resources | Gated floorplan workflow listing |
| Ohneis LinkedIn floorplan walkthrough method | Cinematic Blender → camera path → video drive |

## Plot / masterplan tech

| Project | License | Notes |
| --- | --- | --- |
| pmndrs/react-three-fiber + drei | MIT | Chosen 3D layer |
| three.js | MIT | Renderer |
| MapLibre GL JS | BSD-3 | Future multi-site GIS only |
| That Open engine_fragment | MIT | BIM Fragments |
| That Open web-ifc | MPL-2.0 | IFC parse; care if modifying |
| ankit1324/ArchIt | MIT | 3D map + designer inspiration |
| Plot Visualizer (nglif) | check | Shared 2D/3D polygon + status pattern |
| SunCalc | BSD-2 | Sun path calculations |

## Floor plan / walkthrough

| Project | License | Notes |
| --- | --- | --- |
| qant-au/axonometra | MIT/Apache | Embeddable planner + walk |
| laanlabs/openPlan3D | MIT | 2D/3D planner |
| Photo Sphere Viewer | MIT | 360 tours (active) |
| google/marzipano | Apache-2.0 | Archived — prefer PSV |
| sparkjsdev/spark | MIT | Gaussian splats in Three |
| playcanvas/supersplat-viewer | MIT | Splat viewer |
| Floorplan2Walkthru | check | SVG→3D PoC; not production truth |

## Trends to respect

- Gaussian splats excel for **built** spaces; off-plan still needs GLB/BIM
- IFC ↔ glTF interoperability improving (buildingSMART ↔ Khronos liaison)
- Dual output: visual GLB + semantic sidecar + accessible SVG

## Explicit non-choices for MVP

- Cesium (too heavy for single estate)
- Babylon (no clear win over R3F here)
- AGPL viewers in closed commercial path without approval
- Hard-coded inventory in the frontend
