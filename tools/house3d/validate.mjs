// Checks a house.json spec before it goes to Blender.
// Usage: node tools/house3d/validate.mjs path/to/house.json
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const EVIDENCE = /^(photo|plan):[\w-]+$|^inferred$/;

/** Returns a list of problems; empty means the spec is usable. */
export function validateHouse(spec) {
  const errors = [];
  const err = (msg) => errors.push(msg);
  const levels = new Set([...(spec.levels ?? []).map((l) => l.id), "SITE", "ROOF"]);
  const mats = new Set(Object.keys(spec.materials ?? {}));
  const photos = new Set((spec.photos ?? []).map((p) => p.id));
  const walls = new Map((spec.walls ?? []).map((w) => [w.id, w]));

  for (const k of ["slug", "name", "levels", "materials", "walls", "rooms"]) if (!spec[k]) err(`missing "${k}"`);

  const checkEvidence = (id, ev) => {
    if (!ev) return err(`${id}: no evidence (use "photo:<id>", "plan:<id>" or "inferred")`);
    if (!EVIDENCE.test(ev)) return err(`${id}: evidence "${ev}" is not photo:<id>, plan:<id> or inferred`);
    const [kind, ref] = ev.split(":");
    if (kind === "photo" && !photos.has(ref)) err(`${id}: evidence refers to unknown photo "${ref}"`);
  };
  const checkMat = (id, m) => {
    if (m && !mats.has(m)) err(`${id}: unknown material "${m}"`);
  };

  for (const w of spec.walls ?? []) {
    checkEvidence(w.id, w.evidence);
    if (!levels.has(w.level)) err(`${w.id}: unknown level "${w.level}"`);
    if (!(w.thickness > 0)) err(`${w.id}: thickness must be positive`);
    if (!(w.z1 > w.z0)) err(`${w.id}: z1 must be above z0`);
    if (!Array.isArray(w.path) || w.path.length < 2) err(`${w.id}: path needs at least two points`);
    for (const m of Object.values(w.faces ?? {})) checkMat(w.id, m);
    for (const f of Object.values(w.segFaces ?? {})) for (const m of Object.values(f)) checkMat(w.id, m);
    if (w.plinth) checkMat(w.id, w.plinth.material);
  }

  for (const o of spec.openings ?? []) {
    checkEvidence(o.id, o.evidence);
    const w = walls.get(o.wall);
    if (!w) {
      err(`${o.id}: unknown wall "${o.wall}"`);
      continue;
    }
    // The centre must sit on one of the wall's segments, with the full width inside it.
    const pts = w.path;
    const n = w.closed ? pts.length : pts.length - 1;
    let fits = false;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      const t = (o.center[0] - a[0]) * d[0] + (o.center[1] - a[1]) * d[1];
      const off = Math.abs((o.center[0] - a[0]) * d[1] - (o.center[1] - a[1]) * d[0]);
      if (off <= w.thickness && t - o.width / 2 >= -0.01 && t + o.width / 2 <= L + 0.01) fits = true;
    }
    if (!fits) err(`${o.id}: does not fit on wall "${o.wall}" (check centre and width)`);
    if (o.kind !== "gate") {
      const lv = spec.levels.find((l) => l.id === w.level);
      const ffl = lv ? lv.ffl : 0;
      if (ffl + o.sill + o.height > w.z1 + 1e-6) err(`${o.id}: head is above the top of wall "${o.wall}"`);
    }
  }

  for (const r of spec.rooms ?? []) {
    checkEvidence(r.id, r.evidence);
    checkMat(r.id, r.floor);
    if (!levels.has(r.level)) err(`${r.id}: unknown level "${r.level}"`);
    const [x0, y0, x1, y1] = r.rect ?? [];
    if (!(x1 > x0 && y1 > y0)) err(`${r.id}: rect must be [x0, y0, x1, y1] with x1 > x0 and y1 > y0`);
  }
  // Rooms on one level must not overlap.
  const rooms = spec.rooms ?? [];
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const a = rooms[i];
      const b = rooms[j];
      if (a.level !== b.level) continue;
      const ox = Math.min(a.rect[2], b.rect[2]) - Math.max(a.rect[0], b.rect[0]);
      const oy = Math.min(a.rect[3], b.rect[3]) - Math.max(a.rect[1], b.rect[1]);
      if (ox > 0.01 && oy > 0.01) err(`rooms ${a.id} and ${b.id} overlap`);
    }
  }

  for (const b of spec.boxes ?? []) {
    checkEvidence(b.id, b.evidence);
    checkMat(b.id, b.material);
    if (!b.min.every((v, i) => b.max[i] > v)) err(`${b.id}: max must be above min on every axis`);
  }
  for (const s of spec.slabs ?? []) {
    checkEvidence(s.id, s.evidence);
    checkMat(s.id, s.material);
  }
  for (const c of spec.cameras ?? []) if (c.photo && !photos.has(c.photo)) err(`camera ${c.id}: unknown photo "${c.photo}"`);
  for (const p of spec.photos ?? []) if (!p.file) err(`photo ${p.id}: missing file`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node validate.mjs house.json");
    process.exit(2);
  }
  const errors = validateHouse(JSON.parse(fs.readFileSync(file, "utf8")));
  if (errors.length) {
    console.error(`${errors.length} problem(s) in ${file}:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`${file} is valid.`);
}
