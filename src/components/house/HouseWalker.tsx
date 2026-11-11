"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { HouseModel, Pose, Rect3 } from "@/data/houses";
import { houseWalkInput, useHouseStore } from "@/store/useHouseStore";

const WALK = 1.7;
const RUN = 3.4;
const GLIDE_S = 1.8;

const inRect = (r: Rect3, x: number, z: number) => x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];

type Glide = { from: THREE.Vector3; to: THREE.Vector3; yawFrom: number; yawTo: number; t: number; level: string };

/** Yaw (around +Y) that looks along a facing vector in three.js x/z. */
const yawFor = (f: [number, number]) => Math.atan2(-f[0], -f[1]);

/**
 * First-person walking inside the house: WASD/arrows, Shift to run, drag to
 * look, click a floor to walk there. Movement is limited to the rooms, door
 * openings and outdoor paving listed in the model's walk data. Walking onto
 * the foot or head of the stair glides to the other floor.
 */
export function HouseWalker({ house }: { house: HouseModel }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const mode = useHouseStore((s) => s.mode);
  const active = mode === "walk";
  const walk = house.meta.walk;
  const levels = house.meta.levels;

  const pos = useRef(new THREE.Vector2());
  const level = useRef(levels[0].id);
  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const keys = useRef(new Set<string>());
  const target = useRef<THREE.Vector2 | null>(null);
  const glide = useRef<Glide | null>(null);
  const stairArmed = useRef(true);
  const lastRoom = useRef<string | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const ffl = (id: string) => levels.find((l) => l.id === id)?.ffl ?? 0;
  const roomRects = useMemo(
    () =>
      house.meta.rooms.map((r) => {
        const [cx, , cz] = r.center;
        const [w, d] = r.size.split("×").map((v) => parseFloat(v));
        return { id: r.id, level: r.level, rect: [cx - w / 2, cz - d / 2, cx + w / 2, cz + d / 2] as Rect3 };
      }),
    [house],
  );

  const canStand = (lv: string, x: number, z: number) =>
    (walk.levels[lv] ?? []).some((r) => inRect(r, x, z)) &&
    !walk.exclude.some((e) => e.level === lv && inRect(e.rect, x, z));

  function place(p: Pose, lv: string) {
    pos.current.set(p.pos[0], p.pos[1]);
    level.current = lv;
    yaw.current = yawFor(p.facing);
    pitch.current = -0.05;
  }

  // Entry pose: the front yard, facing the entrance.
  useEffect(() => {
    if (!active) return;
    const start = walk.start ?? { pos: [2, 4], facing: [0, -1] };
    place(start, levels[0].id);
    useHouseStore.getState().setLevel(levels[0].id);
    camera.fov = 70;
    camera.updateProjectionMatrix();
    target.current = null;
    glide.current = null;
    houseWalkInput.stair = null;
    lastRoom.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Keyboard.
  useEffect(() => {
    if (!active) return;
    const typing = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (typing(e)) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k)) {
        keys.current.add(k);
        target.current = null;
        if (k.startsWith("arrow")) e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => keys.current.clear();
    const held = keys.current;
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      held.clear();
    };
  }, [active]);

  // Drag to look, click a floor to walk there.
  useEffect(() => {
    if (!active) return;
    const el = gl.domElement;
    let dragging = false;
    let moved = 0;
    let lx = 0;
    let ly = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lx = e.clientX;
      ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw.current += dx * 0.0045;
      pitch.current = THREE.MathUtils.clamp(pitch.current + dy * 0.0035, -1.2, 0.9);
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (moved > 6) return;
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), -ffl(level.current));
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(floor, hit) && hit.distanceTo(camera.position) < 25) {
        target.current = new THREE.Vector2(hit.x, hit.z);
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.style.cursor = "grab";
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, gl, camera, raycaster]);

  function startGlide(toPose: Pose, toLevel: string) {
    const eye = walk.eye;
    glide.current = {
      from: new THREE.Vector3(pos.current.x, ffl(level.current) + eye, pos.current.y),
      to: new THREE.Vector3(toPose.pos[0], ffl(toLevel) + eye, toPose.pos[1]),
      yawFrom: yaw.current,
      yawTo: yawFor(toPose.facing),
      t: 0,
      level: toLevel,
    };
    target.current = null;
    stairArmed.current = false;
  }

  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  useFrame((_, dt) => {
    if (!active) return;
    const delta = Math.min(dt, 0.05);
    const st = walk.stair;
    const lower = levels[0].id;
    const upper = levels[1]?.id ?? lower;

    // Stair buttons in the HUD.
    if (houseWalkInput.stair && st && !glide.current) {
      if (houseWalkInput.stair === "up" && level.current === lower) startGlide(st.topPose, upper);
      if (houseWalkInput.stair === "down" && level.current === upper) startGlide(st.bottomPose, lower);
      houseWalkInput.stair = null;
    }

    const g = glide.current;
    if (g) {
      g.t = Math.min(1, g.t + delta / GLIDE_S);
      const e = g.t < 0.5 ? 2 * g.t * g.t : 1 - (-2 * g.t + 2) ** 2 / 2;
      camera.position.lerpVectors(g.from, g.to, e);
      let dy = g.yawTo - g.yawFrom;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      yaw.current = g.yawFrom + dy * e;
      euler.set(pitch.current, yaw.current, 0);
      camera.quaternion.setFromEuler(euler);
      if (g.t >= 1) {
        pos.current.set(g.to.x, g.to.z);
        level.current = g.level;
        glide.current = null;
        useHouseStore.getState().setLevel(g.level);
      }
      return;
    }

    const k = keys.current;
    let fwd = (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0) + houseWalkInput.y;
    let strafe = (k.has("d") || k.has("arrowright") ? 1 : 0) - (k.has("a") || k.has("arrowleft") ? 1 : 0) + houseWalkInput.x;
    const speed = k.has("shift") ? RUN : WALK;
    // Forward on the ground for the current yaw (camera looks down -Z at yaw 0).
    const fx = -Math.sin(yaw.current);
    const fz = -Math.cos(yaw.current);

    if (target.current && Math.abs(fwd) + Math.abs(strafe) < 0.01) {
      const tx = target.current.x - pos.current.x;
      const tz = target.current.y - pos.current.y;
      const dist = Math.hypot(tx, tz);
      if (dist < 0.25) target.current = null;
      else {
        let diff = Math.atan2(-tx, -tz) - yaw.current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        yaw.current += diff * Math.min(1, delta * 5);
        fwd = Math.min(1, dist / 1.2);
        strafe = 0;
      }
    } else if (Math.abs(fwd) + Math.abs(strafe) > 0.01) target.current = null;

    const len = Math.hypot(fwd, strafe);
    if (len > 1) {
      fwd /= len;
      strafe /= len;
    }
    const dx = (fx * fwd - fz * strafe) * speed * delta;
    const dz = (fz * fwd + fx * strafe) * speed * delta;
    const lv = level.current;
    const { x, y: z } = pos.current;
    // Slide along walls: try the full move, then each axis.
    if (canStand(lv, x + dx, z + dz)) pos.current.set(x + dx, z + dz);
    else if (canStand(lv, x + dx, z)) pos.current.set(x + dx, z);
    else if (canStand(lv, x, z + dz)) pos.current.set(x, z + dz);
    else target.current = null;

    // Walking into the foot or head of the stair takes you to the other floor.
    if (st) {
      const px = pos.current.x;
      const pz = pos.current.y;
      const inBottom = lv === lower && inRect(st.bottomZone, px, pz);
      const inTop = lv === upper && inRect(st.topZone, px, pz);
      if (!inBottom && !inTop) stairArmed.current = true;
      else if (stairArmed.current && len > 0.01) {
        if (inBottom) startGlide(st.topPose, upper);
        else startGlide(st.bottomPose, lower);
      }
    }

    camera.position.set(pos.current.x, ffl(lv) + walk.eye, pos.current.y);
    euler.set(pitch.current, yaw.current, 0);
    camera.quaternion.setFromEuler(euler);

    const room = roomRects.find((r) => r.level === lv && inRect(r.rect, pos.current.x, pos.current.y));
    const id = room?.id ?? null;
    if (id !== lastRoom.current) {
      lastRoom.current = id;
      useHouseStore.setState({ roomId: id });
    }
  });

  return null;
}
