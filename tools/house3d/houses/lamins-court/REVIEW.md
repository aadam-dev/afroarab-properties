# Lamin's Court: model review

Built from four photographs on the Afro Arab site (`lamins-court.jpg` and `hero-lamins.jpg` are the same image). No drawings were available. Each round rendered the model from a camera matched to every photo, then compared the two side by side.

## Rounds

**Round 1**
- **Massing and camera match** were already close: the cladded first floor overhangs the recessed ground floor, there are two glazing bands, a side yard and compound walls.
- **Rendering faults:** headless Eevee ray tracing gave red and speckled surfaces. Ray tracing is now off in `render_views.py`.

**Round 2: measured from the front photo's own scale (door ≈ 2.2 m)**
- Entrance door 1.32 × 2.35 m; sidelight 0.5 m; cladded pier 0.85 m.
- Living window 0.8 × 1.9 m, with its sill at 0.95 m.
- Unit B's glazing band is clearly narrower than unit A's (about 3.2 m against 3.9 m), so the pair is about 8.2 m wide, not 9 m.
- Longer, quieter cladding planks (1.2 × 0.15 m).

**Round 3: interior photos**
- **Bedroom:** the band glass comes almost to the floor, so the first-floor slab is thicker (finished floor at 3.5 m). The side sliding window starts about 0.6 m from the corner.
- **Doors photo:** en-suite door on the left (timber-look floor, grey tiles, basin, mirror) and landing door on the right (bar balustrade visible through it). Both match.
- **Stair photo:** floating timber treads on one central steel stringer, black bar balustrade on the open side, kitchen run beyond. Both match.
- **Validator fix:** the entrance door ran 2 cm into the corner wall; it was moved.

## Still different from the photos

- Plants are simple blade shapes, not the real species.
- The neighbouring buildings are plain blocks standing in for context.
- Interior Blender renders use flat review lighting; the website viewer lights the model properly.

## Inferred (not visible in any photo)

- **Rooms and doors:** the rear half of both floors, the guest WC, bedroom 2, the shared bathroom, and the back door.
- **Exterior:** the rear facade windows, all of unit B except its front, and the front boundary wall position.
- **Furniture:** everything except the TV, kitchen run and dining set seen in the stair photo.

The on-site viewer labels every room "From photos" or "Indicative" from the `evidence` field in `house.json`.

## Rebuild

```bash
bash tools/house3d/run.sh lamins-court
```
