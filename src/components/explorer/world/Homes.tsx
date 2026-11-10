"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { houseFrame, houseTypeForPlot, type Plot } from "@/data/masterplan";

const WALL_H = 3.4;
const ROOF_H = 2.6;

const bodies = ["#f3eee6", "#ece3d3", "#f6f1ea", "#e6d6bf"].map((c) => new THREE.Color(c));
const roofs = ["#5b4a42", "#7d4a3a", "#4a4f55", "#8a5a3c"].map((c) => new THREE.Color(c));

/**
 * Massing houses on each plot (suggested type, true footprint and setback),
 * rising in a stagger as `grow` goes 0 → 1. Used by the homepage story.
 */
export function Homes({ plots, grow }: { plots: Plot[]; grow: number }) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);

  const geoms = useMemo(() => {
    const body = new THREE.BoxGeometry(1, 1, 1);
    body.translate(0, 0.5, 0);
    const roof = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1);
    roof.rotateY(Math.PI / 4);
    roof.translate(0, 0.5, 0);
    return { body, roof };
  }, []);

  const placements = useMemo(
    () =>
      plots.map((p, i) => {
        const type = houseTypeForPlot(p);
        const { toPlan, u } = houseFrame(p, type);
        const c = toPlan(type.widthM / 2, type.depthM / 2);
        return {
          x: c[0],
          z: -c[1],
          yaw: Math.atan2(u[1], u[0]),
          w: type.widthM,
          d: type.depthM,
          order: ((i * 37) % plots.length) / plots.length,
          tone: i % bodies.length,
          roofTone: (i * 3) % roofs.length,
        };
      }),
    [plots],
  );

  useLayoutEffect(() => {
    const b = bodyRef.current;
    const r = roofRef.current;
    if (!b || !r) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    placements.forEach((h, i) => {
      const t = THREE.MathUtils.clamp((grow - h.order * 0.6) / 0.4, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      q.setFromAxisAngle(up, h.yaw);
      const wallH = Math.max(0.001, WALL_H * e);
      m.compose(new THREE.Vector3(h.x, 0.2, h.z), q, new THREE.Vector3(h.w, wallH, h.d));
      b.setMatrixAt(i, m);
      const roofS = Math.max(0.001, THREE.MathUtils.clamp((t - 0.7) / 0.3, 0, 1));
      m.compose(
        new THREE.Vector3(h.x, 0.2 + wallH, h.z),
        q,
        new THREE.Vector3((h.w + 0.8) * roofS, ROOF_H * roofS, (h.d + 0.8) * roofS),
      );
      r.setMatrixAt(i, m);
      b.setColorAt(i, bodies[h.tone]);
      r.setColorAt(i, roofs[h.roofTone]);
    });
    b.instanceMatrix.needsUpdate = true;
    r.instanceMatrix.needsUpdate = true;
    if (b.instanceColor) b.instanceColor.needsUpdate = true;
    if (r.instanceColor) r.instanceColor.needsUpdate = true;
    b.computeBoundingSphere();
    r.computeBoundingSphere();
  }, [placements, grow]);

  return (
    <group visible={grow > 0.001}>
      <instancedMesh ref={bodyRef} args={[geoms.body, undefined, placements.length]} castShadow receiveShadow raycast={() => null}>
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[geoms.roof, undefined, placements.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color="#ffffff" roughness={0.7} flatShading />
      </instancedMesh>
    </group>
  );
}
