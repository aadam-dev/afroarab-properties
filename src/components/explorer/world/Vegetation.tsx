"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { TreeInstance, Vec2 } from "@/data/masterplan";
import { palette } from "./core";

function palmCrown() {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 7; i++) {
    const frond = new THREE.BoxGeometry(3.4, 0.08, 0.7);
    frond.translate(1.6, 0, 0);
    frond.rotateZ(-0.38);
    frond.rotateY((i / 7) * Math.PI * 2);
    parts.push(frond);
  }
  const g = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return g;
}

type Kind = TreeInstance["kind"];

function useInstances(
  ref: React.RefObject<THREE.InstancedMesh | null>,
  items: TreeInstance[],
  y: (t: TreeInstance) => number,
  scale: (t: TreeInstance) => [number, number, number],
  grow: number,
  color?: (t: TreeInstance, i: number) => THREE.Color,
) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    items.forEach((t, i) => {
      const [sx, sy, sz] = scale(t);
      const g = Math.max(0.001, grow);
      e.set(0, (t.position[0] * 13.37 + t.position[1] * 7.1) % (Math.PI * 2), 0);
      q.setFromEuler(e);
      m.compose(
        new THREE.Vector3(t.position[0], y(t) * g, -t.position[1]),
        q,
        new THREE.Vector3(sx * g, sy * g, sz * g),
      );
      mesh.setMatrixAt(i, m);
      if (color) mesh.setColorAt(i, color(t, i));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [ref, items, y, scale, grow, color]);
}

const leafA = new THREE.Color(palette.leaf);
const leafB = new THREE.Color(palette.leafLight);

export function Trees({ trees, grow = 1 }: { trees: TreeInstance[]; grow?: number }) {
  const byKind = useMemo(() => {
    const out: Record<Kind, TreeInstance[]> = { broadleaf: [], palm: [], shrub: [] };
    trees.forEach((t) => out[t.kind].push(t));
    return out;
  }, [trees]);

  const geoms = useMemo(() => {
    const canopy = new THREE.IcosahedronGeometry(1, 1);
    const trunk = new THREE.CylinderGeometry(0.18, 0.28, 1, 6);
    trunk.translate(0, 0.5, 0);
    const palmTrunk = new THREE.CylinderGeometry(0.16, 0.24, 1, 6);
    palmTrunk.translate(0, 0.5, 0);
    return { canopy, trunk, palmTrunk, crown: palmCrown() };
  }, []);

  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const palmTrunkRef = useRef<THREE.InstancedMesh>(null);
  const crownRef = useRef<THREE.InstancedMesh>(null);
  const shrubRef = useRef<THREE.InstancedMesh>(null);

  const tint = useMemo(
    () => (t: TreeInstance, i: number) => leafA.clone().lerp(leafB, ((i * 37) % 10) / 12),
    [],
  );

  useInstances(trunkRef, byKind.broadleaf, () => 0, (t) => [t.scale, 3.2 * t.scale, t.scale], grow);
  useInstances(canopyRef, byKind.broadleaf, (t) => 4.6 * t.scale, (t) => [2.9 * t.scale, 2.4 * t.scale, 2.9 * t.scale], grow, tint);
  useInstances(palmTrunkRef, byKind.palm, () => 0, (t) => [t.scale, 7.5 * t.scale, t.scale], grow);
  useInstances(crownRef, byKind.palm, (t) => 7.4 * t.scale, (t) => [t.scale, t.scale, t.scale], grow);
  useInstances(shrubRef, byKind.shrub, (t) => 0.7 * t.scale, (t) => [1.6 * t.scale, 1 * t.scale, 1.6 * t.scale], grow, tint);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[geoms.trunk, undefined, byKind.broadleaf.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color={palette.trunk} roughness={1} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[geoms.canopy, undefined, byKind.broadleaf.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>
      <instancedMesh ref={palmTrunkRef} args={[geoms.palmTrunk, undefined, byKind.palm.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color="#8a6a4a" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[geoms.crown, undefined, byKind.palm.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color={palette.palmLeaf} roughness={0.95} flatShading side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={shrubRef} args={[geoms.canopy, undefined, byKind.shrub.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color="#ffffff" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}

export function Lamps({ lamps, grow = 1 }: { lamps: Vec2[]; grow?: number }) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const items = useMemo<TreeInstance[]>(() => lamps.map((p) => ({ position: p, scale: 1, kind: "shrub" })), [lamps]);
  const geoms = useMemo(() => {
    const pole = new THREE.CylinderGeometry(0.07, 0.1, 6, 6);
    pole.translate(0, 3, 0);
    const head = new THREE.BoxGeometry(0.9, 0.18, 0.4);
    return { pole, head };
  }, []);
  useInstances(poleRef, items, () => 0, () => [1, 1, 1], grow);
  useInstances(headRef, items, () => 6, () => [1, 1, 1], grow);
  return (
    <group>
      <instancedMesh ref={poleRef} args={[geoms.pole, undefined, items.length]} castShadow raycast={() => null}>
        <meshStandardMaterial color="#5a5e63" metalness={0.4} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[geoms.head, undefined, items.length]} raycast={() => null}>
        <meshStandardMaterial color="#fff6dc" emissive="#ffe7a8" emissiveIntensity={0.4} />
      </instancedMesh>
    </group>
  );
}
