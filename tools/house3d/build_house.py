"""Build a house model from a house.json spec, headless in Blender.

    blender -b --factory-startup -P build_house.py -- <house.json> <out_dir> [--glb <path>]

Writes <out_dir>/<slug>.blend, <out_dir>/<slug>.glb (or --glb path) and
<slug>.meta.json beside the GLB. Geometry is generated in world space with
box-projected UVs, then merged into one mesh per node so the web viewer has
few draw calls. Node names encode what the viewer can toggle:

    A_L0__walls   group A (walkable unit), ground floor, walls
    A_L1__glass   group A, first floor, glazing
    A_ROOF__roof  group A roof (hidden in dollhouse mode)
    B__shell      exterior-only neighbour unit (always shown)
    SITE__paving  compound and context
    ROOM__L0__living  floor of one room (pickable, carries extras)
"""

import bpy
import bmesh
import json
import math
import os
import sys

import numpy as np

# ------------------------------------------------------------------ args
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("usage: blender -b -P build_house.py -- house.json out_dir [--glb path]")
SPEC_PATH = os.path.abspath(argv[0])
OUT_DIR = os.path.abspath(argv[1])
GLB_PATH = None
if "--glb" in argv:
    GLB_PATH = os.path.abspath(argv[argv.index("--glb") + 1])
os.makedirs(OUT_DIR, exist_ok=True)

with open(SPEC_PATH) as f:
    S = json.load(f)
SLUG = S["slug"]
LEVELS = {lv["id"]: lv for lv in S["levels"]}
LEVELS.setdefault("SITE", {"id": "SITE", "ffl": 0.0, "ceiling": 3.0})
LEVELS.setdefault("ROOF", {"id": "ROOF", "ffl": 0.0, "ceiling": 0.0})

# ------------------------------------------------------------------ scene reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"

# ------------------------------------------------------------------ materials
TEX_DIR = os.path.join(OUT_DIR, "textures")
os.makedirs(TEX_DIR, exist_ok=True)
RNG = np.random.default_rng(7)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def to_linear(c):
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


def smooth_noise(n, cells):
    """Tileable value noise, n x n, with `cells` lattice cells."""
    g = RNG.random((cells, cells))
    x = np.linspace(0, cells, n, endpoint=False)
    i0 = np.floor(x).astype(int)
    t = x - i0
    t = t * t * (3 - 2 * t)
    i1 = (i0 + 1) % cells
    a = g[np.ix_(i0, i0)]
    b = g[np.ix_(i0, i1)]
    c = g[np.ix_(i1, i0)]
    d = g[np.ix_(i1, i1)]
    tx = t[None, :]
    ty = t[:, None]
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty


def fbm(n, octaves=(4, 8, 16, 32)):
    out = np.zeros((n, n))
    amp = 1.0
    tot = 0.0
    for c in octaves:
        out += smooth_noise(n, c) * amp
        tot += amp
        amp *= 0.5
    return out / tot


def make_texture(name, base, tex):
    """Returns a tileable RGB image (n x n x 3, sRGB 0..1) covering `size` metres."""
    n = 512
    kind = tex["kind"]
    size = tex.get("size", 1.0)
    amt = tex.get("amount", 0.1)
    base = np.array(base)
    img = np.ones((n, n, 3)) * base
    if kind == "noise":
        v = fbm(n) - 0.5
        img = img * (1 + v[..., None] * amt * 2)
    elif kind == "planks":
        pw, ph = tex.get("plank", [1.2, 0.2])
        px = n / size
        rows = int(round(size / ph))
        yy, xx = np.mgrid[0:n, 0:n]
        row = (yy / (ph * px)).astype(int)
        shift = (row % 3) * (pw * px / 3)
        col = ((xx + shift) / (pw * px)).astype(int)
        key = (row * 131 + col * 17) % 97
        tone = 1 + (np.sin(key * 12.9898) * 43758.5453 % 1 - 0.5) * amt * 2
        grain = smooth_noise(n, 64)[:, :] * 0.08 - 0.04
        img = img * (tone[..., None] + grain[..., None])
        jy = (yy % (ph * px)) < 1.6
        jx = ((xx + shift) % (pw * px)) < 1.6
        img[jy | jx] *= 0.72
        _ = rows
    elif kind == "hex":
        cell = tex.get("cell", 0.2)
        px = n / size
        r = cell * px / 2
        yy, xx = np.mgrid[0:n, 0:n].astype(float)
        # hexagon lattice distance field
        w = r * math.sqrt(3)
        q = xx / w
        rr = yy / (r * 1.5)
        best = np.full((n, n), 1e9)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ry = np.floor(rr) + dy
                cx = (np.floor(q - (ry % 2) * 0.5) + dx + (ry % 2) * 0.5 + 0.5) * w
                cy = (ry + 0.5) * r * 1.5
                d = np.hypot(xx - cx, yy - cy)
                best = np.minimum(best, d)
        tone = 1 + (fbm(n) - 0.5) * amt * 2
        img = img * tone[..., None]
        edge = best > r * 0.86
        img[edge] *= 0.78
    elif kind == "marble":
        cell = tex.get("cell", 0.6)
        px = n / size
        yy, xx = np.mgrid[0:n, 0:n].astype(float)
        v = fbm(n, (3, 6, 12, 24))
        veins = np.abs(np.sin((xx / n * 6 + yy / n * 3 + v * 5) * math.pi))
        veins = np.clip(1 - veins * 6, 0, 1) * amt
        if tex.get("dark"):
            img = img + veins[..., None] * 0.9
        else:
            img = img * (1 - veins[..., None] * 0.6)
        gx = (xx % (cell * px)) < 1.4
        gy = (yy % (cell * px)) < 1.4
        img[gx | gy] *= 0.93
    elif kind == "tiles":
        cell = tex.get("cell", 0.3)
        px = n / size
        yy, xx = np.mgrid[0:n, 0:n].astype(float)
        tone = 1 + (fbm(n) - 0.5) * amt * 2
        img = img * tone[..., None]
        gx = (xx % (cell * px)) < 1.6
        gy = (yy % (cell * px)) < 1.6
        img[gx | gy] *= 0.75
    img = np.clip(img, 0, 1)
    path = os.path.join(TEX_DIR, f"{name}.png")
    bimg = bpy.data.images.new(f"tex_{name}", n, n, alpha=False)
    rgba = np.concatenate([img, np.ones((n, n, 1))], axis=2)
    bimg.pixels.foreach_set(rgba[::-1].astype(np.float32).ravel())
    bimg.filepath_raw = path
    bimg.file_format = "PNG"
    bimg.save()
    return bimg


MATS = {}
TEX_SIZE = {}
ASSETS = os.environ.get("HOUSE3D_ASSETS") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "polyhaven")


def save_jpg(name, arr):
    """arr: h x w x 3 floats 0..1 (top row first). Returns a loaded bpy image saved as JPEG."""
    h, w = arr.shape[:2]
    path = os.path.join(TEX_DIR, f"{name}.jpg")
    img = bpy.data.images.new(f"tex_{name}", w, h, alpha=False)
    rgba = np.concatenate([np.clip(arr, 0, 1), np.ones((h, w, 1))], axis=2)
    img.pixels.foreach_set(rgba[::-1].astype(np.float32).ravel())
    img.filepath_raw = path
    img.file_format = "JPEG"
    scene.render.image_settings.quality = 88
    img.save()
    return img


def pbr_images(name, base, pbr):
    """Poly Haven texture set, re-tinted so its average colour is the spec colour.
    Keeps the real surface detail while the spec stays in charge of colour."""
    folder = os.path.join(ASSETS, "textures", pbr["id"])
    src = bpy.data.images.load(os.path.join(folder, "diff.jpg"))
    w, h = src.size
    px = np.empty(w * h * 4, dtype=np.float32)
    src.pixels.foreach_get(px)
    rgb = px.reshape(h, w, 4)[::-1, :, :3]
    mean = rgb.reshape(-1, 3).mean(axis=0)
    keep = pbr.get("keepColor", 0.0)  # 1 = use the texture's own colour
    tinted = rgb * (np.array(base) / np.maximum(mean, 1e-3))
    contrast = pbr.get("contrast", 1.0)
    tinted = np.array(base) + (tinted - np.array(base)) * contrast
    out = tinted * (1 - keep) + rgb * keep
    bpy.data.images.remove(src)
    diff = save_jpg(f"{name}_diff", out)
    extra = {}
    for key in ("rough", "nor"):
        f = os.path.join(folder, f"{key}.jpg")
        if os.path.exists(f):
            im = bpy.data.images.load(f)
            im.colorspace_settings.name = "Non-Color"
            extra[key] = im
    return diff, extra.get("rough"), extra.get("nor")


def get_mat(name):
    if name in MATS:
        return MATS[name]
    spec = S["materials"][name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    base = hex_rgb(spec["color"])
    bsdf.inputs["Base Color"].default_value = (*to_linear(base), 1)
    bsdf.inputs["Roughness"].default_value = spec.get("roughness", 0.7)
    bsdf.inputs["Metallic"].default_value = spec.get("metallic", 0.0)
    if "alpha" in spec:
        bsdf.inputs["Alpha"].default_value = spec["alpha"]
        m.blend_method = "BLEND" if hasattr(m, "blend_method") else None
        try:
            m.surface_render_method = "BLENDED"
        except Exception:
            pass
    tex = spec.get("texture")
    TEX_SIZE[name] = tex.get("size", 1.0) if tex else 1.0
    pbr = spec.get("pbr")
    if spec.get("emission"):
        bsdf.inputs["Emission Color"].default_value = (*to_linear(base), 1)
        bsdf.inputs["Emission Strength"].default_value = spec["emission"]
    if pbr and os.path.isdir(os.path.join(ASSETS, "textures", pbr["id"])):
        TEX_SIZE[name] = pbr.get("size", 1.0)
        diff, rough, nor = pbr_images(name, base, pbr)
        tn = nt.nodes.new("ShaderNodeTexImage")
        tn.image = diff
        nt.links.new(tn.outputs["Color"], bsdf.inputs["Base Color"])
        if rough is not None and pbr.get("useRough", True):
            rn = nt.nodes.new("ShaderNodeTexImage")
            rn.image = rough
            nt.links.new(rn.outputs["Color"], bsdf.inputs["Roughness"])
        if nor is not None:
            nn = nt.nodes.new("ShaderNodeTexImage")
            nn.image = nor
            nm = nt.nodes.new("ShaderNodeNormalMap")
            nm.inputs["Strength"].default_value = pbr.get("normal", 1.0)
            nt.links.new(nn.outputs["Color"], nm.inputs["Color"])
            nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    elif tex:
        img = make_texture(name, base, tex)
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = img
        nt.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])
    MATS[name] = m
    return m


# ------------------------------------------------------------------ geometry store
NODES = {}  # node name -> {"v": [], "f": [], "m": [], "extras": {}}


def node(name):
    return NODES.setdefault(name, {"v": [], "f": [], "m": [], "extras": {}})


def add_quad_mesh(nodename, verts, faces, mats):
    nd = node(nodename)
    off = len(nd["v"])
    nd["v"].extend(verts)
    for f, m in zip(faces, mats):
        nd["f"].append([i + off for i in f])
        nd["m"].append(m)


def box_world(nodename, corners, mats):
    """corners: 8 points in order (b0,b1,b2,b3,t0,t1,t2,t3) with b ccw seen from above.
    mats: dict with keys bottom, top, s0..s3 (side i between corner i and i+1)."""
    faces = [
        [3, 2, 1, 0],  # bottom
        [4, 5, 6, 7],  # top
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
    ]
    m = [mats["bottom"], mats["top"], mats["s0"], mats["s1"], mats["s2"], mats["s3"]]
    keep_f, keep_m = [], []
    for f, mm in zip(faces, m):
        if mm is None:
            continue
        keep_f.append(f)
        keep_m.append(mm)
    add_quad_mesh(nodename, corners, keep_f, keep_m)


def aabb(nodename, mn, mx, mat, faces=None):
    x0, y0, z0 = mn
    x1, y1, z1 = mx
    if x1 - x0 <= 1e-5 or y1 - y0 <= 1e-5 or z1 - z0 <= 1e-5:
        return
    c = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
         (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = faces or {}
    box_world(nodename, c, {
        "bottom": f.get("bottom", mat), "top": f.get("top", mat),
        "s0": f.get("front", mat), "s1": f.get("right", mat),
        "s2": f.get("back", mat), "s3": f.get("left", mat),
    })


def seg_box(nodename, p0, d, nrm, t0, t1, thick, z0, z1, mats, off=0.0):
    """Box along a wall segment. p0 = segment start (centreline), d = unit dir,
    nrm = right normal (the 'out' side). Covers t0..t1 along d, centred on the
    centreline shifted by `off` along nrm, thickness `thick`."""
    if t1 - t0 <= 1e-5 or z1 - z0 <= 1e-5:
        return
    h = thick / 2

    def P(t, s):
        return (p0[0] + d[0] * t + nrm[0] * (s + off), p0[1] + d[1] * t + nrm[1] * (s + off))

    a = P(t0, -h)  # start, inner (left)
    b = P(t1, -h)  # end, inner
    c = P(t1, h)   # end, outer
    e = P(t0, h)   # start, outer
    # ccw from above depends on orientation; order: a(start-in), e(start-out), c(end-out), b(end-in)
    pts = [a, e, c, b]
    # ensure ccw seen from above (positive area)
    area = 0
    for i in range(4):
        x1_, y1_ = pts[i]
        x2_, y2_ = pts[(i + 1) % 4]
        area += x1_ * y2_ - x2_ * y1_
    sides = ["start", "out", "end", "in"]
    if area < 0:
        pts = [pts[0], pts[3], pts[2], pts[1]]
        sides = ["in", "end", "out", "start"]
    corners = [(x, y, z0) for x, y in pts] + [(x, y, z1) for x, y in pts]
    box_world(nodename, corners, {
        "bottom": mats.get("bottom"), "top": mats.get("top"),
        "s0": mats.get(sides[0]), "s1": mats.get(sides[1]),
        "s2": mats.get(sides[2]), "s3": mats.get(sides[3]),
    })


def node_name(group, level, role):
    if group == "SITE":
        return f"SITE__{role}"
    if group == "B":
        return "B__shell" if role not in ("glass",) else "B__glass"
    if group == "AB":
        return f"A_{level}__{role}"
    return f"{group}_{level}__{role}"


# ------------------------------------------------------------------ walls + openings
WALLS = {w["id"]: w for w in S["walls"]}
OPENINGS_BY_WALL = {}
for o in S.get("openings", []):
    OPENINGS_BY_WALL.setdefault(o["wall"], []).append(o)


def segments(w):
    pts = w["path"]
    segs = []
    n = len(pts)
    count = n if w.get("closed") else n - 1
    for i in range(count):
        a = pts[i]
        b = pts[(i + 1) % n]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy)
        d = (dx / L, dy / L)
        nrm = (d[1], -d[0])  # right-hand normal = 'out'
        segs.append({"i": i, "a": a, "b": b, "L": L, "d": d, "n": nrm})
    return segs


def face_mats(w, seg_i, plinth_part=False):
    f = dict(w["faces"])
    f.update(w.get("segFaces", {}).get(str(seg_i), {}))
    cap = f.get("cap", f["out"])
    m = {"in": f["in"], "out": f["out"], "start": cap, "end": cap,
         "top": f.get("top", cap), "bottom": f.get("bottom", cap)}
    if plinth_part:
        pl = w["plinth"]
        side = pl.get("side", "out")
        if side in ("out", "both"):
            m["out"] = pl["material"]
        if side in ("in", "both"):
            m["in"] = pl["material"]
        m["start"] = m["end"] = pl["material"]
    return m


def skirting(w, seg, t0, t1):
    """Skirting board at floor level on the room side(s) of a wall piece."""
    sk = S.get("skirting")
    if not sk or w["level"] not in LEVELS or w["level"] in ("SITE", "ROOF") or w["group"] == "B" or w.get("skirting") is False:
        return
    ffl = LEVELS[w["level"]]["ffl"]
    if w["z0"] > ffl + 0.01 or w["z1"] < ffl + 0.5:
        return
    th = sk.get("thickness", 0.012)
    m = {k: sk["material"] for k in ("in", "out", "start", "end", "top")}
    nm = node_name(w["group"], w["level"], "skirting")
    sides = [-1] if w["id"].endswith("_shell") else [-1, 1]
    for sd in sides:
        seg_box(nm, seg["a"], seg["d"], seg["n"], t0, t1, th, ffl, ffl + sk.get("height", 0.08), m, sd * (w["thickness"] / 2 + th / 2))


def wall_piece(w, seg, nodename, t0, t1, z0, z1):
    pl = w.get("plinth")
    thick = w["thickness"]
    if z0 <= w["z0"] + 1e-6 and t1 - t0 > 0.05 and z1 > LEVELS.get(w["level"], {"ffl": 0})["ffl"] + 0.2:
        skirting(w, seg, t0, t1)
    if pl and z0 < pl["height"]:
        zp = min(pl["height"], z1)
        seg_box(nodename, seg["a"], seg["d"], seg["n"], t0, t1, thick, z0, zp, {**face_mats(w, seg["i"], True), "top": face_mats(w, seg["i"])["top"] if zp >= z1 else None})
        z0 = zp
    if z1 - z0 > 1e-5:
        seg_box(nodename, seg["a"], seg["d"], seg["n"], t0, t1, thick, z0, z1, face_mats(w, seg["i"]))


EVIDENCE = []  # (id, kind, evidence, note)


def build_wall(w):
    lv = LEVELS[w["level"]]
    ffl = lv["ffl"]
    segs = segments(w)
    closed = w.get("closed", False)
    thick = w["thickness"]
    nodename = node_name(w["group"], w["level"], "walls")
    EVIDENCE.append((w["id"], "wall", w.get("evidence", "inferred"), w.get("note", "")))
    for k, seg in enumerate(segs):
        # corner handling: shift start by t/2 and extend end by t/2 on joined corners
        s0 = thick / 2 if (closed or k > 0) else 0.0
        e1 = seg["L"] + (thick / 2 if (closed or k < len(segs) - 1) else 0.0)
        ops = []
        for o in OPENINGS_BY_WALL.get(w["id"], []):
            cx, cy = o["center"]
            t = (cx - seg["a"][0]) * seg["d"][0] + (cy - seg["a"][1]) * seg["d"][1]
            off = abs((cx - seg["a"][0]) * seg["n"][0] + (cy - seg["a"][1]) * seg["n"][1])
            if off > thick and off > 0.15:
                continue
            if t < -0.01 or t > seg["L"] + 0.01:
                continue
            ops.append((t - o["width"] / 2, t + o["width"] / 2, o))
        ops.sort(key=lambda x: x[0])
        cur = s0
        for t0, t1, o in ops:
            wall_piece(w, seg, nodename, cur, t0, w["z0"], w["z1"])
            if o["kind"] == "gate":
                sill = w["z0"]
            else:
                sill = ffl + o["sill"]
            head = sill + o["height"]
            # wall below the opening: the threshold for doors, the sill wall for windows
            if sill - w["z0"] > 1e-4:
                wall_piece(w, seg, nodename, t0, t1, w["z0"], sill)
            if head < w["z1"]:
                wall_piece(w, seg, nodename, t0, t1, head, w["z1"])
            build_opening(w, seg, o, t0, t1, sill, head)
            cur = t1
        wall_piece(w, seg, nodename, cur, e1, w["z0"], w["z1"])


def build_opening(w, seg, o, t0, t1, z0, z1):
    grp = w["group"]
    if grp == "AB":
        grp = "A" if o["id"].startswith("A_") else "B"
    lvl = w["level"]
    frame_node = node_name(grp, lvl, "frames")
    glass_node = node_name(grp, lvl, "glass")
    thick = w["thickness"]
    p0, d, n = seg["a"], seg["d"], seg["n"]
    EVIDENCE.append((o["id"], o["kind"], o.get("evidence", "inferred"), o.get("note", "")))
    if o["kind"] in ("window", "glazing"):
        fw = 0.06
        depth = 0.08
        off = thick / 2 - depth / 2 - 0.03  # sit near the outer face
        fm = {"in": "frame", "out": "frame", "start": "frame", "end": "frame", "top": "frame", "bottom": "frame"}
        # outer frame
        seg_box(frame_node, p0, d, n, t0, t0 + fw, depth, z0, z1, fm, off)
        seg_box(frame_node, p0, d, n, t1 - fw, t1, depth, z0, z1, fm, off)
        seg_box(frame_node, p0, d, n, t0, t1, depth, z0, z0 + fw, fm, off)
        seg_box(frame_node, p0, d, n, t0, t1, depth, z1 - fw, z1, fm, off)
        cols, rows = o.get("grid", [1, 1])
        cw = (t1 - t0) / cols
        for c in range(1, cols):
            tc = t0 + cw * c
            seg_box(frame_node, p0, d, n, tc - fw / 2, tc + fw / 2, depth, z0, z1, fm, off)
        zsplit = None
        if rows >= 2:
            zsplit = z1 - (z1 - z0) * o.get("rowSplit", 0.5)
            seg_box(frame_node, p0, d, n, t0, t1, depth, zsplit - fw / 2, zsplit + fw / 2, fm, off)
        for (c, r) in o.get("sashes", []):
            ta = t0 + cw * c + fw / 2 + 0.03
            tb = t0 + cw * (c + 1) - fw / 2 - 0.03
            if r == 0 and zsplit is not None:
                za, zb = zsplit + fw / 2 + 0.03, z1 - fw - 0.03
            else:
                za, zb = z0 + fw + 0.03, (zsplit - fw / 2 - 0.03) if zsplit else z1 - fw - 0.03
            sw = 0.035
            seg_box(frame_node, p0, d, n, ta, ta + sw, depth * 0.7, za, zb, fm, off - 0.01)
            seg_box(frame_node, p0, d, n, tb - sw, tb, depth * 0.7, za, zb, fm, off - 0.01)
            seg_box(frame_node, p0, d, n, ta, tb, depth * 0.7, za, za + sw, fm, off - 0.01)
            seg_box(frame_node, p0, d, n, ta, tb, depth * 0.7, zb - sw, zb, fm, off - 0.01)
        gm = {k: "glass" for k in ("in", "out")}
        seg_box(glass_node, p0, d, n, t0 + fw / 2, t1 - fw / 2, 0.012, z0 + fw / 2, z1 - fw / 2, gm, off)
        # interior sill board
        sm = {k: "render_in" for k in ("in", "out", "start", "end", "top", "bottom")}
        if o["kind"] == "window":
            seg_box(frame_node.replace("frames", "walls"), p0, d, n, t0, t1, 0.04, z0 - 0.02, z0, sm, -thick / 2 + 0.02)
    elif o["kind"] == "door":
        dm = {k: "door" for k in ("in", "out", "start", "end", "top", "bottom")}
        lw = 0.05
        # lining around the opening
        seg_box(frame_node, p0, d, n, t0 - lw, t0, thick + 0.03, z0, z1 + lw, dm)
        seg_box(frame_node, p0, d, n, t1, t1 + lw, thick + 0.03, z0, z1 + lw, dm)
        seg_box(frame_node, p0, d, n, t0, t1, thick + 0.03, z1, z1 + lw, dm)
        leaf = o.get("leaf", "single")
        width = t1 - t0
        lt = 0.045
        lnode = node_name(grp, lvl, "doors")
        if leaf == "closed":
            seg_box(lnode, p0, d, n, t0, t1, lt, z0, z1 - 0.01, dm)
            return
        leaves = [(t0, width)] if leaf == "single" else [(t0, width / 2), (t1, width / 2)]
        for hinge_t, lwid in leaves:
            # open leaf swung 90 degrees into the 'in' side
            sgn = 1 if hinge_t == t0 else -1
            ta = hinge_t if sgn > 0 else hinge_t - lt
            tb = ta + lt
            # leaf runs from inner face inward
            p_off = -thick / 2 - lwid / 2
            seg_box(lnode, p0, d, n, ta, tb, lwid, z0, z1 - 0.01, dm, p_off)
            # lever handles on both faces, near the free edge
            hm = {k: "steel" for k in ("in", "out", "start", "end", "top", "bottom")}
            h_off = -thick / 2 - lwid + 0.09
            for face in (ta - 0.05, tb):
                seg_box(lnode, p0, d, n, face, face + 0.05, 0.02, z0 + 1.0, z0 + 1.02, hm, h_off)
                seg_box(lnode, p0, d, n, face + (0.03 if face == tb else 0.0), face + (0.05 if face == tb else 0.02), 0.13, z0 + 1.0, z0 + 1.02, hm, h_off + 0.055)
    elif o["kind"] == "gate":
        gm = {k: "steel" for k in ("in", "out", "start", "end", "top", "bottom")}
        gnode = "SITE__gate"
        z = z0 + 0.12
        while z < z1 - 0.05:
            seg_box(gnode, p0, d, n, t0, t1, 0.05, z, z + 0.09, gm)
            z += 0.13
        for t in (t0, (t0 + t1) / 2, t1 - 0.06):
            seg_box(gnode, p0, d, n, t, t + 0.06, 0.07, z0, z1, gm)


for w in S["walls"]:
    build_wall(w)

# ------------------------------------------------------------------ slabs, rooms, boxes
for sl in S.get("slabs", []):
    grp, lvl = sl["group"], sl["level"]
    if lvl == "ROOF":
        nm = f"{grp}_ROOF__roof" if grp == "A" else ("B__shell" if grp == "B" else "SITE__slabs")
    else:
        nm = node_name(grp, lvl, "slabs")
    EVIDENCE.append((sl["id"], "slab", sl.get("evidence", "inferred"), sl.get("note", "")))
    for (x0, y0, x1, y1) in sl["rects"]:
        aabb(nm, (x0, y0, sl["z0"]), (x1, y1, sl["z1"]), sl["material"],
             {"bottom": "soffit" if lvl != "SITE" else sl["material"]})

ROOMS_META = []
for r in S.get("rooms", []):
    lv = LEVELS[r["level"]]
    x0, y0, x1, y1 = r["rect"]
    nm = f"ROOM__{r['level']}__{r['id']}"
    aabb(nm, (x0, y0, lv["ffl"]), (x1, y1, lv["ffl"] + 0.012), r["floor"])
    node(nm)["extras"] = {"room": r["id"], "name": r["name"], "level": r["level"], "evidence": r.get("evidence", "inferred")}
    area = (x1 - x0) * (y1 - y0)
    ROOMS_META.append({
        "id": r["id"], "name": r["name"], "level": r["level"],
        "rect": r["rect"], "areaSqm": round(area, 1), "areaSqft": round(area * 10.7639),
        "size": f"{x1 - x0:.1f} × {y1 - y0:.1f} m",
        "evidence": r.get("evidence", "inferred"), "note": r.get("note", ""),
        "ffl": lv["ffl"], "ceiling": lv["ceiling"],
    })
    EVIDENCE.append((r["id"], "room", r.get("evidence", "inferred"), r.get("note", "")))

for b in S.get("boxes", []):
    grp, lvl = b["group"], b["level"]
    role = b.get("role", "furniture")
    if grp == "SITE":
        nm = f"SITE__{role}"
    elif grp == "B":
        nm = "B__shell"
    else:
        nm = node_name(grp, lvl, "furniture" if role in ("furniture", "finish") else "facade")
    aabb(nm, b["min"], b["max"], b["material"])
    EVIDENCE.append((b["id"], role, b.get("evidence", "inferred"), b.get("note", "")))

# ------------------------------------------------------------------ stairs + balustrades


def bars(nodename, a, b, z_at, height, spacing, mat, rail=True):
    L = math.hypot(b[0] - a[0], b[1] - a[1])
    d = ((b[0] - a[0]) / L, (b[1] - a[1]) / L)
    n = (d[1], -d[0])
    cnt = max(2, int(L / spacing) + 1)
    m = {k: mat for k in ("in", "out", "start", "end", "top", "bottom")}
    for i in range(cnt):
        t = i * (L - 0.02) / (cnt - 1)
        zb = z_at(t)
        seg_box(nodename, a, d, n, t, t + 0.02, 0.02, zb, zb + height, m)
    if rail:
        # top rail as short slanted pieces
        steps = max(1, int(L / 0.25))
        for i in range(steps):
            ta, tb = L * i / steps, L * (i + 1) / steps
            za = z_at(ta) + height
            zb = z_at(tb) + height
            seg_box(nodename, a, d, n, ta, tb, 0.04, min(za, zb) - 0.01, max(za, zb) + 0.03, m)


for st in S.get("stairs", []):
    lv = LEVELS[st["level"]]
    nm = node_name(st["group"], st["level"], "stair")
    rise = (LEVELS["L1"]["ffl"] - lv["ffl"]) / st["risers"]
    g = st["going"]
    x0, x1, y0 = st["x0"], st["x1"], st["y0"]
    tt = st.get("treadThickness", 0.05)
    for i in range(st["risers"] - 1):
        zt = lv["ffl"] + (i + 1) * rise
        aabb(nm, (x0 + 0.02, y0 + i * g, zt - tt), (x1 - 0.02, y0 + (i + 1) * g + 0.03, zt), st["tread"])
    # central stringer as stepped segments
    xc = (x0 + x1) / 2
    for i in range(st["risers"] - 1):
        zt = lv["ffl"] + (i + 1) * rise
        aabb(nm, (xc - 0.06, y0 + i * g, zt - tt - 0.22), (xc + 0.06, y0 + (i + 1) * g, zt - tt), st["stringer"])
    rl = st.get("rail")
    if rl:
        xr = x0 + 0.03 if rl["side"] == "x0" else x1 - 0.03
        a = (xr, y0)
        b = (xr, y0 + (st["risers"] - 1) * g)

        def z_at(t, _ffl=lv["ffl"]):
            return _ffl + min(st["risers"] - 1, int(t / g) + 1) * rise
        bars(nm, a, b, z_at, rl["height"], rl["spacing"], rl["material"])
    EVIDENCE.append((st["id"], "stair", st.get("evidence", "inferred"), st.get("note", "")))

for bl in S.get("balustrades", []):
    lv = LEVELS[bl["level"]]
    nm = node_name(bl["group"], bl["level"], "stair")
    bars(nm, bl["from"], bl["to"], lambda t, z=lv["ffl"]: z, bl["height"], bl["spacing"], bl["material"])

# ------------------------------------------------------------------ site, plants, fence, context
site = S.get("site")
if site:
    gx0, gy0, gx1, gy1 = site["ground"]
    aabb("SITE__ground", (gx0, gy0, -0.05), (gx1, gy1, -0.001), site["groundMaterial"])
    for (x0, y0, x1, y1) in site.get("paving", []):
        aabb("SITE__paving", (x0, y0, 0), (x1, y1, 0.02), site["pavingMaterial"])

for p in S.get("plants", []):
    # Spiky ornamental plant: thin tapering blades fanning out from the base.
    cx, cy = p["at"]
    h, r = p["h"], p["r"]
    blades = 11
    verts, faces = [], []
    for i in range(blades):
        a = 2 * math.pi * i / blades + (i % 3) * 0.4
        lean = r * (0.45 + 0.55 * ((i * 7) % 5) / 4)
        bh = h * (0.6 + 0.4 * ((i * 3) % 4) / 3)
        w = 0.045
        bx, by = cx + math.cos(a + 1.57) * w, cy + math.sin(a + 1.57) * w
        ex, ey = cx - math.cos(a + 1.57) * w, cy - math.sin(a + 1.57) * w
        tx, ty = cx + math.cos(a) * lean, cy + math.sin(a) * lean
        o = len(verts)
        verts += [(bx, by, 0.1), (ex, ey, 0.1), (tx, ty, 0.1 + bh)]
        faces += [[o, o + 1, o + 2], [o + 2, o + 1, o]]
    add_quad_mesh("SITE__planting", verts, faces, ["plant"] * len(faces))

fence = S.get("fence")
if fence:
    w = WALLS[fence["wall"]]
    for seg in segments(w):
        cnt = int(seg["L"] / fence["spacing"]) + 1
        for i in range(cnt):
            t = min(seg["L"] - 0.03, i * fence["spacing"])
            seg_box("SITE__fence", seg["a"], seg["d"], seg["n"], t, t + 0.03, 0.03, w["z1"], w["z1"] + fence["height"],
                    {k: "steel" for k in ("in", "out", "start", "end", "top", "bottom")})
        for zz in (0.2, 0.4, 0.58):
            seg_box("SITE__fence", seg["a"], seg["d"], seg["n"], 0, seg["L"], 0.006, w["z1"] + zz, w["z1"] + zz + 0.006,
                    {k: "steel" for k in ("in", "out", "start", "end", "top", "bottom")})

nb = S.get("neighbourhood")
if nb:
    # Simple surrounding houses so windows look onto a street, not an empty plain.
    rnd = np.random.default_rng(nb.get("seed", 3))
    keep = nb.get("keepClear", [-6, -12, 15, 18])
    cell = nb.get("lot", 17.0)
    span = nb.get("rings", 4)
    walls_p = nb["wallMaterials"]
    roofs_p = nb["roofMaterials"]
    for gx in range(-span, span + 1):
        for gy in range(-span, span + 1):
            cx = 4 + gx * cell + rnd.uniform(-2, 2)
            cy = 4 + gy * cell + rnd.uniform(-2, 2)
            w, d = rnd.uniform(7, 11), rnd.uniform(7, 11)
            x0, y0, x1, y1 = cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2
            if x1 > keep[0] and x0 < keep[2] and y1 > keep[1] and y0 < keep[3]:
                continue
            if any(x1 > c["min"][0] - 1 and x0 < c["max"][0] + 1 and y1 > c["min"][1] - 1 and y0 < c["max"][1] + 1 for c in S.get("context", [])):
                continue
            if rnd.random() < 0.18:
                continue
            h = 3.1 if rnd.random() < 0.6 else 6.2
            S.setdefault("context", []).append({
                "id": f"nb_{gx}_{gy}", "min": [x0, y0, 0], "max": [x1, y1, h],
                "material": str(rnd.choice(walls_p)),
                "roof": {"height": rnd.uniform(1.2, 2.0), "material": str(rnd.choice(roofs_p)), "ridge": "x" if rnd.random() < 0.5 else "y"},
                "evidence": "inferred",
            })
            # low compound wall around the lot
            m = 2.2
            for (a0, b0, a1, b1) in ((x0 - m, y0 - m, x1 + m, y0 - m + 0.2), (x0 - m, y1 + m - 0.2, x1 + m, y1 + m), (x0 - m, y0 - m, x0 - m + 0.2, y1 + m), (x1 + m - 0.2, y0 - m, x1 + m, y1 + m)):
                aabb("SITE__context", (a0, b0, 0), (a1, b1, 1.9), str(rnd.choice(walls_p)))
    for i in range(nb.get("trees", 0)):
        for _ in range(30):
            tx, ty = rnd.uniform(-55, 60), rnd.uniform(-50, 60)
            if not (keep[0] - 2 < tx < keep[2] + 2 and keep[1] - 2 < ty < keep[3] + 2):
                break
        S.setdefault("props", []).append({"id": f"tree{i}", "model": nb.get("treeModel", "island_tree_02"), "group": "SITE", "at": [tx, ty], "rot": float(rnd.uniform(0, 360)), "scale": float(rnd.uniform(0.8, 1.5)), "evidence": "inferred"})

for c in S.get("context", []):
    aabb("SITE__context", c["min"], c["max"], c["material"])
    rf = c.get("roof")
    if rf:
        x0, y0, z0 = c["min"]
        x1, y1, z1 = c["max"]
        ov = 0.4
        zr = z1 + rf["height"]
        if rf.get("ridge", "x") == "x":
            ym = (y0 + y1) / 2
            v = [(x0 - ov, y0 - ov, z1), (x1 + ov, y0 - ov, z1), (x1 + ov, ym, zr), (x0 - ov, ym, zr),
                 (x0 - ov, y1 + ov, z1), (x1 + ov, y1 + ov, z1)]
            f = [[0, 1, 2, 3], [5, 4, 3, 2], [0, 3, 4], [1, 5, 2]]
        else:
            xm = (x0 + x1) / 2
            v = [(x0 - ov, y0 - ov, z1), (xm, y0 - ov, zr), (xm, y1 + ov, zr), (x0 - ov, y1 + ov, z1),
                 (x1 + ov, y0 - ov, z1), (x1 + ov, y1 + ov, z1)]
            f = [[0, 1, 2, 3], [4, 5, 2, 1], [0, 4, 1], [3, 2, 5]]
        add_quad_mesh("SITE__context", v, f, [rf["material"]] * len(f))

# ------------------------------------------------------------------ meshes


def face_uv(co, nrm, size):
    ax = max(range(3), key=lambda i: abs(nrm[i]))
    if ax == 2:
        u, v = co[0], co[1]
    elif ax == 0:
        u, v = co[1], co[2]
        if nrm[0] < 0:
            u = -u
    else:
        u, v = co[0], co[2]
        if nrm[1] > 0:
            u = -u
    return (u / size, v / size)


coll = scene.collection
OBJS = []
for name, nd in NODES.items():
    if not nd["f"]:
        continue
    me = bpy.data.meshes.new(name)
    mat_names = sorted(set(nd["m"]))
    me.from_pydata(nd["v"], [], nd["f"])
    me.update()
    for mn in mat_names:
        me.materials.append(get_mat(mn))
    idx = {mn: i for i, mn in enumerate(mat_names)}
    for poly, mn in zip(me.polygons, nd["m"]):
        poly.material_index = idx[mn]
    uv = me.uv_layers.new(name="UVMap")
    for poly, mn in zip(me.polygons, nd["m"]):
        size = TEX_SIZE.get(mn, 1.0)
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            uv.data[li].uv = face_uv(me.vertices[vi].co, poly.normal, size)
    # fix winding so normals face out: recalc via bmesh
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    for poly in me.polygons:
        poly.use_smooth = False
    ob = bpy.data.objects.new(name, me)
    for k, v in nd["extras"].items():
        ob[k] = v
    coll.objects.link(ob)
    OBJS.append(ob)

# ------------------------------------------------------------------ soft furniture, props, lights


def link_under(parent_name, ob):
    """Parent an object under an empty named like a node, so the viewer can hide it by prefix."""
    par = bpy.data.objects.get(parent_name)
    if par is None:
        par = bpy.data.objects.new(parent_name, None)
        coll.objects.link(par)
    ob.parent = par
    return par


def soft_box(parent_name, name, mn, mx, mat, bevel=0.03, rot_deg=0.0, pivot=None):
    """A rounded box as its own object (bevel modifier), for upholstery and bedding."""
    sx, sy, sz = (mx[i] - mn[i] for i in range(3))
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    material = get_mat(mat)
    size = TEX_SIZE.get(mat, 1.0)
    uv = me.uv_layers.new(name="UVMap")
    for poly in me.polygons:
        for li in poly.loop_indices:
            uv.data[li].uv = face_uv(me.vertices[me.loops[li].vertex_index].co, poly.normal, size)
        poly.use_smooth = True
    me.materials.append(material)
    ob = bpy.data.objects.new(name, me)
    cx, cy, cz = ((mn[i] + mx[i]) / 2 for i in range(3))
    if pivot and rot_deg:
        a = math.radians(rot_deg)
        dx, dy = cx - pivot[0], cy - pivot[1]
        cx = pivot[0] + dx * math.cos(a) - dy * math.sin(a)
        cy = pivot[1] + dx * math.sin(a) + dy * math.cos(a)
    ob.location = (cx, cy, cz)
    ob.rotation_euler = (0, 0, math.radians(rot_deg))
    coll.objects.link(ob)
    if bevel > 0:
        md = ob.modifiers.new("bevel", "BEVEL")
        md.width = min(bevel, sx / 2.2, sy / 2.2, sz / 2.2)
        md.segments = 4
        md.limit_method = "NONE"
    link_under(parent_name, ob)
    return ob


def build_furniture(f):
    grp, lvl = f.get("group", "A"), f["level"]
    par = node_name(grp, lvl, "soft")
    z = LEVELS[lvl]["ffl"]
    x, y = f["at"]  # centre of the footprint
    w, dpt = f["size"]  # width (local x) and depth (local y) before rotation
    rot = f.get("rot", 0)
    kind = f["kind"]
    fab = f.get("material", "fabric")
    pv = (x, y)

    def B(name, mn, mx, mat, bevel=0.03):
        return soft_box(par, f"{par}__{f['id']}_{name}", (x + mn[0], y + mn[1], z + mn[2]), (x + mx[0], y + mx[1], z + mx[2]), mat, bevel, rot, pv)

    hw, hd = w / 2, dpt / 2
    if kind == "sofa":
        # back along local +y
        B("base", (-hw, -hd, 0.08), (hw, hd, 0.3), fab, 0.03)
        B("back", (-hw, hd - 0.2, 0.3), (hw, hd, 0.82), fab, 0.06)
        B("arm_l", (-hw, -hd, 0.3), (-hw + 0.18, hd - 0.2, 0.62), fab, 0.06)
        B("arm_r", (hw - 0.18, -hd, 0.3), (hw, hd - 0.2, 0.62), fab, 0.06)
        seats = max(2, round((w - 0.36) / 0.7))
        sw = (w - 0.36) / seats
        for i in range(seats):
            x0 = -hw + 0.18 + i * sw
            B(f"seat{i}", (x0 + 0.01, -hd + 0.02, 0.3), (x0 + sw - 0.01, hd - 0.2, 0.47), fab, 0.07)
            B(f"cush{i}", (x0 + 0.03, hd - 0.36, 0.45), (x0 + sw - 0.03, hd - 0.18, 0.86), f.get("cushion", fab), 0.09)
        for i, sx_ in enumerate((-hw + 0.03, hw - 0.09)):
            for j, sy_ in enumerate((-hd + 0.03, hd - 0.09)):
                B(f"leg{i}{j}", (sx_, sy_, 0.0), (sx_ + 0.06, sy_ + 0.06, 0.08), "steel", 0.0)
    elif kind == "bed":
        # headboard along local +y
        B("base", (-hw, -hd, 0.1), (hw, hd - 0.06, 0.34), f.get("frame", "wood_furniture"), 0.02)
        B("mattress", (-hw + 0.03, -hd + 0.03, 0.34), (hw - 0.03, hd - 0.08, 0.56), "linen", 0.07)
        B("duvet", (-hw - 0.02, -hd - 0.01, 0.42), (hw + 0.02, hd - 0.75, 0.6), f.get("duvet", "linen"), 0.08)
        B("head", (-hw - 0.05, hd - 0.07, 0.0), (hw + 0.05, hd, 1.15), f.get("headboard", fab), 0.04)
        n = 2 if w >= 1.3 else 1
        pw = (w - 0.16) / n
        for i in range(n):
            x0 = -hw + 0.08 + i * pw
            B(f"pillow{i}", (x0 + 0.03, hd - 0.52, 0.56), (x0 + pw - 0.03, hd - 0.14, 0.7), "linen", 0.07)
        B("throw", (-hw - 0.03, -hd + 0.25, 0.595), (hw + 0.03, -hd + 0.8, 0.615), f.get("throw", fab), 0.01)
    elif kind == "tv":
        # wall-mounted, screen facing local -y
        z0 = f.get("z", 1.0)
        B("panel", (-hw, -0.02, z0), (hw, 0.02, z0 + w * 0.5625), "tv_body", 0.006)
        B("screen", (-hw + 0.012, -0.024, z0 + 0.012), (hw - 0.012, -0.018, z0 + w * 0.5625 - 0.012), "tv_screen", 0.0)
    elif kind == "rug":
        B("rug", (-hw, -hd, 0.0), (hw, hd, 0.014), fab, 0.006)
    elif kind == "curtain":
        # hangs along local x; folds made of rounded strips
        h = f.get("height", 2.6)
        folds = max(4, int(w / 0.11))
        for i in range(folds):
            x0 = -hw + i * w / folds
            off = 0.025 if i % 2 else 0.0
            B(f"fold{i}", (x0, -0.03 + off, 0.03), (x0 + w / folds + 0.01, 0.03 + off, h), fab, 0.028)
    EVIDENCE.append((f["id"], "furniture", f.get("evidence", "inferred"), f.get("note", "")))


for f in S.get("furniture", []):
    build_furniture(f)


MODEL_CACHE = {}


def import_prop(pr):
    """Place a downloaded glTF model. `at` is the plan position of the model origin."""
    path = os.path.join(ASSETS, "models", pr["model"], pr["model"] + ".gltf")
    if not os.path.exists(path):
        print("MISSING PROP", pr["model"])
        return
    key = (pr["model"], pr.get("tint"))
    cached = MODEL_CACHE.get(key)
    if cached:
        new = []
        mapping = {}
        for o in cached:
            c2 = o.copy()  # shares mesh data
            coll.objects.link(c2)
            mapping[o] = c2
            new.append(c2)
        for o in cached:
            mapping[o].parent = mapping.get(o.parent)
    else:
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=path)
        new = [o for o in bpy.data.objects if o not in before]
        MODEL_CACHE[key] = list(new)
    grp, lvl = pr.get("group", "A"), pr.get("level", "SITE")
    par_name = "SITE__props" if grp == "SITE" else node_name(grp, lvl, "props")
    holder = bpy.data.objects.new(f"{par_name}__{pr['id']}", None)
    coll.objects.link(holder)
    for o in new:
        if o.parent is None:
            o.parent = holder
    z = pr.get("z", LEVELS[lvl]["ffl"] if (lvl in LEVELS and grp != "SITE") else 0.0)
    holder.location = (pr["at"][0], pr["at"][1], z)
    holder.rotation_euler = (0, 0, math.radians(pr.get("rot", 0)))
    sc = pr.get("scale", 1.0)
    holder.scale = (sc, sc, sc)
    tint = pr.get("tint") if not cached else None
    if tint:
        # Recolour the model's base colour (e.g. dark leather to cream fabric).
        for o in new:
            for slot in getattr(o, "material_slots", []):
                m = slot.material
                if not m or not m.use_nodes or m.get("tinted"):
                    continue
                b = m.node_tree.nodes.get("Principled BSDF")
                if not b or not b.inputs["Base Color"].is_linked:
                    continue
                src = b.inputs["Base Color"].links[0].from_socket
                mix = m.node_tree.nodes.new("ShaderNodeMix")
                mix.data_type = "RGBA"
                mix.blend_type = "MIX"
                mix.inputs[0].default_value = pr.get("tintAmount", 0.85)
                m.node_tree.links.new(src, mix.inputs[6])
                mix.inputs[7].default_value = (*to_linear(hex_rgb(tint)), 1)
                m.node_tree.links.new(mix.outputs[2], b.inputs["Base Color"])
                m["tinted"] = True
    link_under(par_name, holder)
    EVIDENCE.append((pr["id"], "prop", pr.get("evidence", "inferred"), pr.get("note", "")))


for pr in S.get("props", []):
    import_prop(pr)

# Recessed downlights: a small glowing disc in the ceiling plus an area light for Cycles.
LIGHTS = bpy.data.collections.new("lights")
scene.collection.children.link(LIGHTS)
dl = S.get("downlights")
if dl:
    for r in S.get("rooms", []):
        if r.get("downlights") is False:
            continue
        lv = LEVELS[r["level"]]
        x0, y0, x1, y1 = r["rect"]
        sp = dl.get("spacing", 1.5)
        nx = max(1, round((x1 - x0) / sp))
        ny = max(1, round((y1 - y0) / sp))
        skip = [e["rect"] for e in S.get("walk", {}).get("exclude", []) if e["level"] == r["level"]]
        for i in range(nx):
            for j in range(ny):
                cx = x0 + (i + 0.5) * (x1 - x0) / nx
                cy = y0 + (j + 0.5) * (y1 - y0) / ny
                if any(e[0] <= cx <= e[2] and e[1] <= cy <= e[3] for e in skip):
                    continue
                bm = bmesh.new()
                bmesh.ops.create_circle(bm, cap_ends=True, radius=0.045, segments=20)
                me = bpy.data.meshes.new("downlight")
                bm.to_mesh(me)
                bm.free()
                me.materials.append(get_mat(dl["material"]))
                ob = bpy.data.objects.new(f"dl_{r['id']}_{i}_{j}", me)
                ob.location = (cx, cy, lv["ceiling"] - 0.004)
                ob.rotation_euler = (math.pi, 0, 0)
                coll.objects.link(ob)
                link_under(node_name("A", r["level"], "lights"), ob)
        # One soft light per room stands in for all its downlights: dozens of small
        # lights make Cycles several times slower for no visible gain.
        ld = bpy.data.lights.new("room", "AREA")
        ld.shape = "RECTANGLE"
        ld.size = max(0.4, (x1 - x0) * 0.6)
        ld.size_y = max(0.4, (y1 - y0) * 0.6)
        ld.energy = dl.get("watts", 9) * nx * ny
        ld.color = to_linear(hex_rgb(dl.get("color", "#fff1e0")))
        lo = bpy.data.objects.new(f"roomlight_{r['id']}", ld)
        lo.location = ((x0 + x1) / 2, (y0 + y1) / 2, lv["ceiling"] - 0.03)
        LIGHTS.objects.link(lo)
    dm = MATS.get(dl["material"])
    if dm:
        try:
            dm.cycles.emission_sampling = "NONE"
        except Exception:
            pass

# ------------------------------------------------------------------ draft GLB (before render-only material changes)
glb = GLB_PATH or os.path.join(OUT_DIR, f"{SLUG}.glb")
os.makedirs(os.path.dirname(glb), exist_ok=True)
if "--web-tex" in argv:
    # Web build: shrink every texture so the GLB loads quickly on phones.
    # Use a separate output folder, because the saved .blend keeps these small textures.
    cap = int(argv[argv.index("--web-tex") + 1])
    for im in bpy.data.images:
        if im.size[0] > cap or im.size[1] > cap:
            w, h = im.size
            k = cap / max(w, h)
            im.scale(max(1, int(w * k)), max(1, int(h * k)))
    # glTF can't carry the tint mix node, so bake tinted materials to a flat colour.
    for m in bpy.data.materials:
        if m.get("tinted") and m.use_nodes:
            b = m.node_tree.nodes.get("Principled BSDF")
            mix = next((n for n in m.node_tree.nodes if n.type == "MIX"), None)
            if b and mix:
                col = tuple(mix.inputs[7].default_value)
                for l in list(b.inputs["Base Color"].links):
                    m.node_tree.links.remove(l)
                b.inputs["Base Color"].default_value = col
    # Thin out dense imported meshes; shared meshes are decimated once.
    budget = int(argv[argv.index("--web-faces") + 1]) if "--web-faces" in argv else 4000
    done = set()
    for o in bpy.data.objects:
        if o.type != "MESH" or o.data.name in done:
            continue
        q, inside = o, False
        while q:
            if "__props" in q.name:
                inside = True
            q = q.parent
        n = len(o.data.polygons)
        if inside and n > budget:
            # Decimate the mesh data in place with bmesh, so every object sharing it updates.
            bm = bmesh.new()
            bm.from_mesh(o.data)
            bmesh.ops.triangulate(bm, faces=bm.faces)
            ratio = budget / max(1, len(bm.faces))
            bm.to_mesh(o.data)
            bm.free()
            tmp = bpy.data.objects.new("tmp_dec", o.data)
            coll.objects.link(tmp)
            md = tmp.modifiers.new("web_decimate", "DECIMATE")
            md.ratio = max(0.05, ratio)
            dg = bpy.context.evaluated_depsgraph_get()
            ev = tmp.evaluated_get(dg)
            newme = bpy.data.meshes.new_from_object(ev)
            old = o.data
            for u in [x for x in bpy.data.objects if x.data == old]:
                u.data = newme
            bpy.data.objects.remove(tmp)
            done.add(newme.name)
if "--no-glb" not in argv:
    bpy.ops.object.select_all(action="DESELECT")
    for o in scene.objects:
        # Interior props go to the web model; site props (trees, big plants) are render-only.
        heavy = False
        q = o
        while q:
            if q.name.startswith("SITE__props"):
                heavy = True
            q = q.parent
        o.select_set(not heavy and o.type in ("MESH", "EMPTY"))
    bpy.ops.export_scene.gltf(
        filepath=glb,
        export_format="GLB",
        export_image_format="JPEG",
        export_jpeg_quality=78,
        export_extras=True,
        export_cameras=False,
        export_lights=False,
        export_apply=True,
        export_yup=True,
        use_selection=True,
    )

# ------------------------------------------------------------------ world and render-only materials
world = bpy.data.worlds.new("world")
world.use_nodes = True
scene.world = world
wn = world.node_tree
bg = wn.nodes.get("Background")
sky = S.get("sky", {})
hdr = os.path.join(ASSETS, "hdris", sky.get("hdri", "") + ".hdr")
if sky.get("hdri") and os.path.exists(hdr):
    env = wn.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(hdr)
    mp = wn.nodes.new("ShaderNodeMapping")
    tc = wn.nodes.new("ShaderNodeTexCoord")
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(sky.get("rotation", 0)))
    wn.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
    wn.links.new(mp.outputs["Vector"], env.inputs["Vector"])
    wn.links.new(env.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = sky.get("strength", 1.0)
else:
    nish = wn.nodes.new("ShaderNodeTexSky")
    nish.sun_elevation = math.radians(sky.get("sunElevation", 50))
    nish.sun_rotation = math.radians(sky.get("sunRotation", 200))
    wn.links.new(nish.outputs[0], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = sky.get("strength", 0.25)

# Architectural glass for Cycles: light passes straight through, with a clear reflection.
gm = MATS.get("glass")
if gm:
    nt = gm.node_tree
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*to_linear(hex_rgb(S["materials"]["glass"].get("tint", "#c9d6d8"))), 1)
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.02
    fr = nt.nodes.new("ShaderNodeFresnel")
    fr.inputs["IOR"].default_value = 1.5
    mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(fr.outputs[0], mx.inputs[0])
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(gl.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"])

# Rounded edges at render time: sharp CG corners are a giveaway.
for m in bpy.data.materials:
    if not m.use_nodes or m.name == "glass":
        continue
    b = m.node_tree.nodes.get("Principled BSDF")
    if not b:
        continue
    bev = m.node_tree.nodes.new("ShaderNodeBevel")
    bev.inputs["Radius"].default_value = 0.004
    bev.samples = 4
    if b.inputs["Normal"].is_linked:
        m.node_tree.links.new(b.inputs["Normal"].links[0].from_socket, bev.inputs["Normal"])
    m.node_tree.links.new(bev.outputs["Normal"], b.inputs["Normal"])

blend_path = os.path.join(OUT_DIR, f"{SLUG}.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)


def to_three(p):
    return [round(p[0], 3), round(p[2], 3), round(-p[1], 3)]


def plan_rect_to_three(r):
    """Plan rect [x0, y0, x1, y1] -> three.js [minX, minZ, maxX, maxZ] (three z = -plan y)."""
    return [round(r[0], 3), round(-r[3], 3), round(r[2], 3), round(-r[1], 3)]


def walk_meta():
    """Walkable rectangles per level for first-person mode, in three.js coordinates."""
    wk = S.get("walk", {})
    areas = {lv["id"]: [plan_rect_to_three(r["rect"]) for r in S.get("rooms", []) if r["level"] == lv["id"]] for lv in S["levels"]}
    # Door openings join rooms through walls.
    for o in S.get("openings", []):
        if o["kind"] != "door":
            continue
        w = WALLS[o["wall"]]
        if w["level"] not in areas:
            continue
        for seg in segments(w):
            cx, cy = o["center"]
            t = (cx - seg["a"][0]) * seg["d"][0] + (cy - seg["a"][1]) * seg["d"][1]
            off = abs((cx - seg["a"][0]) * seg["n"][0] + (cy - seg["a"][1]) * seg["n"][1])
            if off > w["thickness"] or t < 0 or t > seg["L"]:
                continue
            half_w = o["width"] / 2 - 0.08
            half_t = w["thickness"] / 2 + 0.25
            xs = [cx + seg["d"][0] * s1 + seg["n"][0] * s2 for s1 in (-half_w, half_w) for s2 in (-half_t, half_t)]
            ys = [cy + seg["d"][1] * s1 + seg["n"][1] * s2 for s1 in (-half_w, half_w) for s2 in (-half_t, half_t)]
            areas[w["level"]].append(plan_rect_to_three([min(xs), min(ys), max(xs), max(ys)]))
            break
    first = S["levels"][0]["id"]
    areas[first] += [plan_rect_to_three(r) for r in wk.get("outdoor", [])]
    st = wk.get("stair", {})

    def pose(p):
        return {"pos": [p["pos"][0], round(-p["pos"][1], 3)], "facing": [p["facing"][0], -p["facing"][1]]}

    out = {
        "levels": areas,
        "exclude": [{"level": e["level"], "rect": plan_rect_to_three(e["rect"])} for e in wk.get("exclude", [])],
        "eye": 1.6,
    }
    if "start" in wk:
        out["start"] = pose(wk["start"])
    if st:
        out["stair"] = {
            "bottomZone": plan_rect_to_three(st["bottomZone"]),
            "topZone": plan_rect_to_three(st["topZone"]),
            "bottomPose": pose(st["bottomPose"]),
            "topPose": pose(st["topPose"]),
        }
    return out


photos = {p["id"]: p for p in S.get("photos", [])}
meta = {
    "slug": SLUG,
    "name": S["name"],
    "summary": S.get("summary", ""),
    "levels": [{"id": lv["id"], "name": lv["name"], "ffl": lv["ffl"], "ceiling": lv["ceiling"]} for lv in S["levels"]],
    "rooms": [{**r, "center": to_three((((r["rect"][0] + r["rect"][2]) / 2), ((r["rect"][1] + r["rect"][3]) / 2), r["ffl"]))} for r in ROOMS_META],
    "photos": [
        {
            "id": c["photo"],
            "file": "/" + photos[c["photo"]]["file"].removeprefix("public/"),
            "shows": photos[c["photo"]]["shows"],
            "pos": to_three(c["pos"]),
            "target": to_three(c["target"]),
            "lensMm": c.get("lensMm", 24),
        }
        for c in S.get("cameras", []) if c.get("photo") in photos
    ],
    "anchors": S.get("anchors", []),
    "evidence": {
        "fromPhotos": sorted({e[0] for e in EVIDENCE if str(e[2]).startswith("photo")}),
        "inferred": sorted({e[0] for e in EVIDENCE if e[2] == "inferred"}),
    },
    "walk": walk_meta(),
    "tour": [
        {
            "id": t["id"],
            "name": t["name"],
            "level": t["level"],
            "pos": to_three((t["pos"][0], t["pos"][1], (LEVELS[t["level"]]["ffl"] if t["level"] in LEVELS else 0.0) + t.get("height", 1.6))),
            "links": t.get("links", []),
            "start": t.get("start", False),
            "look": t.get("look", 0),
        }
        for t in S.get("tour", [])
    ],
    "stairs": [
        {
            "from": st["level"],
            "bottom": to_three(((st["x0"] + st["x1"]) / 2, st["y0"] - 0.3, LEVELS[st["level"]]["ffl"])),
            "top": to_three(((st["x0"] + st["x1"]) / 2, st["y0"] + (st["risers"] - 1) * st["going"] + 0.4, LEVELS["L1"]["ffl"])),
        }
        for st in S.get("stairs", [])
    ],
}
META_PATH = os.path.abspath(argv[argv.index("--meta") + 1]) if "--meta" in argv else os.path.splitext(glb)[0] + ".meta.json"
os.makedirs(os.path.dirname(META_PATH), exist_ok=True)
with open(META_PATH, "w") as f:
    json.dump(meta, f, indent=2, ensure_ascii=False)

print(f"BUILT {glb} ({os.path.getsize(glb) / 1e6:.2f} MB), nodes={len(OBJS)}")
