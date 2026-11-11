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
    if tex:
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


def wall_piece(w, seg, nodename, t0, t1, z0, z1):
    pl = w.get("plinth")
    thick = w["thickness"]
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

# ------------------------------------------------------------------ lights for renders
sun_data = bpy.data.lights.new("sun", "SUN")
sun_data.energy = 4.0
sun_data.angle = math.radians(1.5)
sun = bpy.data.objects.new("sun", sun_data)
sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(210))
coll.objects.link(sun)
world = bpy.data.worlds.new("world")
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
bg.inputs["Color"].default_value = (*to_linear(hex_rgb("#a9c3dc")), 1)
bg.inputs["Strength"].default_value = 0.9
scene.world = world

blend_path = os.path.join(OUT_DIR, f"{SLUG}.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

# ------------------------------------------------------------------ export
glb = GLB_PATH or os.path.join(OUT_DIR, f"{SLUG}.glb")
os.makedirs(os.path.dirname(glb), exist_ok=True)
sun.hide_set(True)
bpy.ops.export_scene.gltf(
    filepath=glb,
    export_format="GLB",
    export_image_format="JPEG",
    export_extras=True,
    export_cameras=False,
    export_lights=False,
    export_apply=True,
    export_yup=True,
    use_selection=False,
)


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
