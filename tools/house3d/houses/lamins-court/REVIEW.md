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

**Round 4: realism, after the client called the walkthrough "terrible"**
- **Light:** the old model was lit by flat real-time lights. The main experience is now a photoreal 360° tour: eight stops path-traced in Blender Cycles, with a real sky, one soft light per room and real glass. The en-suite stop was dropped because the view looked too bare.
- **Materials:** scanned plaster, marble, laminate, hex pavers, grass and laterite textures, re-tinted to the photo colours. The cladding stays a procedural plank texture, because scanned oak looked like yellow pine.
- **Furnishing:**
  - Real furniture (TV console, dining table and chairs, armchair, side tables, potted plants) plus modelled sofa, beds, rugs, curtains and wall TV.
  - Skirting boards, recessed downlights, door handles and rounded edges.
- **Surroundings:** a neighbourhood of houses with red, grey and green roofs, compound walls and trees, so every window looks onto a street.
- **Viewer fixes:**
  - Pale ceiling light instead of brown.
  - Chairs show their cream colour in the web model.
  - The outside view no longer starts inside a neighbouring roof.
  - Arrows behind you no longer show mirrored in front.

## Still different from the photos

- Plants are real scanned models, but not the exact species in the photos.
- The neighbouring buildings are plain blocks standing in for context.
- The upstairs and dining 360° views are 1536 px wide rather than 2560 px; this Mac ran out of memory at full size alongside Docker. Re-render them at 2560 px on a machine with more memory.
- Bathrooms are still simple; the en-suite is left out of the tour until it is fitted out properly.

## Inferred (not visible in any photo)

- **Rooms and doors:** the rear half of both floors, the guest WC, bedroom 2, the shared bathroom, and the back door.
- **Exterior:** the rear facade windows, all of unit B except its front, and the front boundary wall position.
- **Furniture:** everything except the TV, kitchen run and dining set seen in the stair photo.

The on-site viewer labels every room "From photos" or "Indicative" from the `evidence` field in `house.json`.

## Rebuild

```bash
bash tools/house3d/run.sh lamins-court
```
