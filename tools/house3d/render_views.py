"""Render review stills of a built house.

    blender -b <slug>.blend -P render_views.py -- <house.json> <out_dir> [--only id,id] [--engine eevee|workbench]

Renders every camera in the spec (matched to a source photo) plus standard
views: front, rear, and a top-down cut of each level. Output JPEGs are named
after the camera id so they can be placed beside their photo for review.
"""

import bpy
import json
import math
import os
import sys

from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
SPEC = json.load(open(argv[0]))
OUT = os.path.abspath(argv[1])
ONLY = None
if "--only" in argv:
    ONLY = set(argv[argv.index("--only") + 1].split(","))
ENGINE = argv[argv.index("--engine") + 1] if "--engine" in argv else "eevee"
os.makedirs(OUT, exist_ok=True)

scene = bpy.context.scene
scene.render.resolution_x = 1200
scene.render.resolution_y = 800
scene.render.film_transparent = False
# JPEG keeps the committed review renders small.
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 84
if ENGINE == "workbench":
    scene.render.engine = "BLENDER_WORKBENCH"
else:
    for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            scene.render.engine = eng
            break
        except TypeError:
            continue
    ee = scene.eevee
    # Ray tracing in headless Eevee produced red and speckled surfaces; plain Eevee is clean and fast.
    for attr, val in (("taa_render_samples", 16), ("use_shadows", True), ("use_gtao", True), ("use_raytracing", False), ("use_fast_gi", True)):
        if hasattr(ee, attr):
            try:
                setattr(ee, attr, val)
            except Exception:
                pass
scene.view_settings.view_transform = "AgX" if "AgX" in [t.identifier for t in bpy.types.ColorManagedViewSettings.bl_rna.properties["view_transform"].enum_items] else "Filmic"


def camera(name, pos, target, lens=24, ortho=None):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    cd.clip_start = 0.05
    cd.clip_end = 300
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    ob = bpy.data.objects.new(name, cd)
    scene.collection.objects.link(ob)
    ob.location = Vector(pos)
    direction = Vector(target) - Vector(pos)
    ob.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return ob


def hide_prefixes(prefixes):
    for ob in scene.objects:
        if ob.type != "MESH":
            continue
        hidden = any(ob.name.startswith(p) for p in prefixes)
        ob.hide_render = hidden


def render(cam, name, hide=()):
    if ONLY and name not in ONLY:
        return
    hide_prefixes(hide)
    scene.camera = cam
    scene.render.filepath = os.path.join(OUT, f"{name}.jpg")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", name)


for c in SPEC.get("cameras", []):
    cam = camera("cam_" + c["id"], c["pos"], c["target"], c.get("lensMm", 24))
    render(cam, c["id"])

render(camera("std_front", (4.5, -24, 6), (4.5, 4, 3.2), 40), "std_front")
render(camera("std_aerial", (-14, -18, 16), (4.5, 5, 2), 30), "std_aerial")
render(camera("std_rear", (10, 26, 7), (4.5, 6, 3), 35), "std_rear")
top = camera("std_plan_L0", (2.3, 6, 30), (2.3, 6.0001, 0), ortho=13)
render(top, "std_plan_L0", hide=("A_L1", "A_ROOF", "B__", "ROOM__L1"))
render(top, "std_plan_L1", hide=("A_ROOF", "B__"))
render(camera("std_dollhouse", (-9, -9, 13), (2.3, 5.5, 1.5), 32), "std_dollhouse_L0", hide=("A_L1", "A_ROOF", "ROOM__L1"))
render(camera("std_dollhouse1", (-9, -9, 15), (2.3, 5.5, 3.5), 32), "std_dollhouse_L1", hide=("A_ROOF",))
