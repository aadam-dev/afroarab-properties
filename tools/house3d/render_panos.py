"""Path-trace 360° views for the tour.

    blender -b <slug>.blend -P render_panos.py -- <house.json> <out_dir> [--only id,id] [--width 4096] [--samples 96]

Renders one equirectangular JPEG per entry in the spec's "tour" list, at eye
height. The image centre looks along plan +y (towards the back of the house).
"""
import bpy, json, math, os, sys, time

argv = sys.argv[sys.argv.index("--") + 1:]
SPEC = json.load(open(argv[0]))
OUT = os.path.abspath(argv[1])
os.makedirs(OUT, exist_ok=True)


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


ONLY = set(opt("--only", "").split(",")) - {""}
WIDTH = int(opt("--width", 4096))
SAMPLES = int(opt("--samples", 96))
LEVELS = {lv["id"]: lv for lv in SPEC["levels"]}

sc = bpy.context.scene
sc.render.engine = "CYCLES"
c = sc.cycles
c.device = "CPU"
c.samples = SAMPLES
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.03
c.use_denoising = True
c.max_bounces = 8
c.diffuse_bounces = 4
c.glossy_bounces = 4
c.transmission_bounces = 8
c.transparent_max_bounces = 16
c.sample_clamp_indirect = 8
c.caustics_reflective = False
c.caustics_refractive = False
sc.render.resolution_x = WIDTH
sc.render.resolution_y = WIDTH // 2
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = "JPEG"
sc.render.image_settings.quality = 88
sc.view_settings.view_transform = "AgX"
try:
    sc.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass
sc.view_settings.exposure = float(opt("--exposure", SPEC.get("sky", {}).get("exposure", 0.0)))

cd = bpy.data.cameras.new("pano")
cd.type = "PANO"
cd.panorama_type = "EQUIRECTANGULAR"
cd.clip_start = 0.02
cam = bpy.data.objects.new("pano", cd)
sc.collection.objects.link(cam)
sc.camera = cam

for t in SPEC.get("tour", []):
    if ONLY and t["id"] not in ONLY:
        continue
    z = LEVELS[t["level"]]["ffl"] + t.get("height", 1.6)
    cam.location = (t["pos"][0], t["pos"][1], z)
    cam.rotation_euler = (math.radians(90), 0, 0)
    sc.render.filepath = os.path.join(OUT, t["id"] + ".jpg")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    print(f"PANO {t['id']} {time.time() - t0:.0f}s")
