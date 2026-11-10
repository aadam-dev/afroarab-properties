"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Estate, Plot } from "@/data/masterplan";
import { usePlotStore } from "@/store/usePlotStore";
import { headingBus, walkInput } from "../world/core";

const EYE = 1.7;
const WALK = 4.2;
const RUN = 9;

function plotAt(plots: Plot[], x: number, y: number) {
  for (const p of plots) {
    const xs = p.polygon.map((v) => v[0]);
    const ys = p.polygon.map((v) => v[1]);
    if (x >= Math.min(...xs) && x <= Math.max(...xs) && y >= Math.min(...ys) && y <= Math.max(...ys)) return p;
  }
  return null;
}

/** First-person walking: WASD/arrows, Shift to run, drag to look, click the ground to walk there. */
export function WalkController({ estate }: { estate: Estate }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const mode = usePlotStore((s) => s.mode);
  const request = usePlotStore((s) => s.cameraRequest);
  const setWalkPlotCode = usePlotStore((s) => s.setWalkPlotCode);

  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const keys = useRef(new Set<string>());
  const raycaster = useRef(new THREE.Raycaster());
  const ground = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const active = mode === "walk";
  const cx = estate.width / 2;

  // Entry pose.
  useEffect(() => {
    if (!active) return;
    // Default: just outside the gate on the right-hand carriageway, facing in.
    let x = cx + 3;
    let y = -10;
    let facing: [number, number] = [0, 1];
    if (request?.kind === "stand") {
      const plot = estate.plots.find((p) => p.code === request.code);
      if (plot) {
        const [a, b] = plot.frontEdge;
        x = (a[0] + b[0]) / 2 + plot.inward[0] * 3;
        y = (a[1] + b[1]) / 2 + plot.inward[1] * 3;
        facing = plot.inward;
      }
    }
    yaw.current = Math.atan2(-facing[0], facing[1]);
    pitch.current = -0.04;
    camera.position.set(x, EYE, -y);
    camera.fov = 62;
    camera.updateProjectionMatrix();
    walkInput.target = null;
    walkInput.teleport = null;
    // Re-run when a new stand request arrives while already walking.
  }, [active, request, estate, camera, cx]);

  // Keyboard.
  useEffect(() => {
    if (!active) return;
    const isTyping = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k)) {
        keys.current.add(k);
        walkInput.target = null;
        if (k.startsWith("arrow")) e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    const held = keys.current;
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      held.clear();
    };
  }, [active]);

  // Drag to look, click to walk.
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
      yaw.current += dx * 0.0042;
      pitch.current = THREE.MathUtils.clamp(pitch.current + dy * 0.0032, -1.1, 0.6);
    };
    const upH = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (moved < 6) {
        const rect = el.getBoundingClientRect();
        const ndc = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.current.setFromCamera(ndc, camera);
        const hit = new THREE.Vector3();
        if (raycaster.current.ray.intersectPlane(ground.current, hit)) {
          const d = hit.distanceTo(camera.position);
          if (d < 160) walkInput.target = [hit.x, -hit.z];
        }
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", upH);
    el.addEventListener("pointercancel", upH);
    el.style.cursor = "grab";
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", upH);
      el.removeEventListener("pointercancel", upH);
      el.style.cursor = "";
    };
  }, [active, gl, camera]);

  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  useFrame((_, dt) => {
    if (!active) return;
    const delta = Math.min(dt, 0.05);
    const k = keys.current;

    if (walkInput.teleport) {
      camera.position.set(walkInput.teleport[0], EYE, -walkInput.teleport[1]);
      walkInput.teleport = null;
      walkInput.target = null;
    }

    let fwd = (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0) + walkInput.y;
    let strafe = (k.has("d") || k.has("arrowright") ? 1 : 0) - (k.has("a") || k.has("arrowleft") ? 1 : 0) + walkInput.x;
    const speed = k.has("shift") ? RUN : WALK;

    let x = camera.position.x;
    let y = -camera.position.z;
    // Forward in plan space for the current yaw.
    const fx = -Math.sin(yaw.current);
    const fy = Math.cos(yaw.current);

    if (walkInput.target && Math.abs(fwd) + Math.abs(strafe) < 0.01) {
      const tx = walkInput.target[0] - x;
      const ty = walkInput.target[1] - y;
      const dist = Math.hypot(tx, ty);
      if (dist < 0.4) {
        walkInput.target = null;
      } else {
        const targetYaw = Math.atan2(-tx, ty);
        let diff = targetYaw - yaw.current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        yaw.current += diff * Math.min(1, delta * 4);
        fwd = Math.min(1, dist / 2);
        strafe = 0;
      }
    } else if (Math.abs(fwd) + Math.abs(strafe) > 0.01) {
      walkInput.target = null;
    }

    const len = Math.hypot(fwd, strafe);
    if (len > 1) {
      fwd /= len;
      strafe /= len;
    }
    x += (fx * fwd + fy * strafe) * speed * delta;
    y += (fy * fwd - fx * strafe) * speed * delta;

    // Stay inside the estate; the gate is the only way out to the approach road.
    const insideGate = Math.abs(x - cx) < estate.gate.widthM / 2 - 0.6;
    x = THREE.MathUtils.clamp(x, 0.8, estate.width - 0.8);
    y = Math.min(y, estate.height - 0.8);
    if (!insideGate) y = Math.max(y, 0.8);
    else y = Math.max(y, -44);

    camera.position.set(x, EYE, -y);
    euler.current.set(pitch.current, yaw.current, 0);
    camera.quaternion.setFromEuler(euler.current);

    const plot = plotAt(estate.plots, x, y);
    setWalkPlotCode(plot?.code ?? null);
    headingBus.emit((-yaw.current * 180) / Math.PI, [x, y]);
  });

  return null;
}
