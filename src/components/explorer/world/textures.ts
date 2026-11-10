import * as THREE from "three";
import { mulberry32 } from "@/data/masterplan/generate";

const cache = new Map<string, THREE.Texture>();

/**
 * Small tiling noise texture (speckle + soft blotches). Multiplied over a base
 * colour it breaks up flat CG surfaces without loading image files.
 */
export function noiseTexture(key: "grass" | "asphalt" | "earth", repeat: number) {
  const id = `${key}:${repeat}`;
  const hit = cache.get(id);
  if (hit) return hit;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(key === "grass" ? 11 : key === "asphalt" ? 23 : 37);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Soft blotches
  const blotches = key === "asphalt" ? 18 : 40;
  for (let i = 0; i < blotches; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 12 + rand() * (key === "asphalt" ? 40 : 30);
    const shade = key === "asphalt" ? 0.86 + rand() * 0.14 : 0.88 + rand() * 0.12;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const c = Math.round(255 * shade);
    g.addColorStop(0, `rgba(${c},${c},${c},${key === "grass" ? 0.4 : 0.55})`);
    g.addColorStop(1, `rgba(${c},${c},${c},0)`);
    ctx.fillStyle = g;
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.restore();
      }
    }
  }

  // Speckle
  const specks = key === "asphalt" ? 2600 : 1800;
  for (let i = 0; i < specks; i++) {
    const shade = key === "asphalt" ? 0.7 + rand() * 0.45 : 0.78 + rand() * 0.3;
    const c = Math.min(255, Math.round(255 * shade));
    ctx.fillStyle = `rgb(${c},${c},${c})`;
    const s = key === "asphalt" ? 1 : 1 + Math.round(rand());
    ctx.fillRect(rand() * size, rand() * size, s, s);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(id, tex);
  return tex;
}
