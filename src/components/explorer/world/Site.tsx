"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Estate, Rect } from "@/data/masterplan";
import { Label } from "./Label";
import { palette, yawForPlanDir } from "./core";
import { noiseTexture } from "./textures";

type Build = { roads?: number; site?: number };

const flat: [number, number, number] = [-Math.PI / 2, 0, 0];

function rectCenter(r: Rect): [number, number] {
  return [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2];
}

function Ground({ estate }: { estate: Estate }) {
  const grass = useMemo(() => noiseTexture("grass", 160), []);
  const lawn = useMemo(() => noiseTexture("grass", 22), []);
  const cx = estate.width / 2;
  const cy = estate.height / 2;
  return (
    <group>
      <mesh rotation={flat} position={[cx, -0.02, -cy]} receiveShadow>
        <planeGeometry args={[2600, 2600]} />
        <meshStandardMaterial color={palette.grassOuter} map={grass} roughness={1} />
      </mesh>
      <mesh rotation={flat} position={[cx, 0.005, -cy]} receiveShadow>
        <planeGeometry args={[estate.width, estate.height]} />
        <meshStandardMaterial color={palette.lawn} map={lawn} roughness={1} />
      </mesh>
    </group>
  );
}

/** Flat road surface that can "pave" outwards from the boulevard for the homepage story. */
function RoadSurface({
  rect,
  progress,
  anchor,
  y,
  material,
}: {
  rect: Rect;
  progress: number;
  anchor: "x-centre" | "y-start";
  y: number;
  material: THREE.Material;
}) {
  const w = rect.x1 - rect.x0;
  const h = rect.y1 - rect.y0;
  let x0 = rect.x0;
  let x1 = rect.x1;
  const y0 = rect.y0;
  let y1 = rect.y1;
  if (progress < 1) {
    if (anchor === "x-centre") {
      const mid = (rect.x0 + rect.x1) / 2;
      x0 = mid - (w / 2) * progress;
      x1 = mid + (w / 2) * progress;
    } else {
      y1 = rect.y0 + h * progress;
    }
  }
  if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return null;
  return (
    <mesh
      rotation={flat}
      position={[(x0 + x1) / 2, y, -(y0 + y1) / 2]}
      scale={[x1 - x0, y1 - y0, 1]}
      material={material}
      receiveShadow
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

type Dash = { x: number; y: number; len: number; w: number; vertical: boolean };

function Markings({ dashes, color, height }: { dashes: Dash[]; color: string; height: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    dashes.forEach((d, i) => {
      m.compose(
        new THREE.Vector3(d.x, height, -d.y),
        q,
        new THREE.Vector3(d.vertical ? d.w : d.len, d.vertical ? d.len : d.w, 1),
      );
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dashes, height]);
  if (!dashes.length) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, dashes.length]} raycast={() => null} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.8} polygonOffset polygonOffsetFactor={-2} />
    </instancedMesh>
  );
}

function Roads({ estate, progress }: { estate: Estate; progress: number }) {
  const asphaltTex = useMemo(() => noiseTexture("asphalt", 1), []);
  const materials = useMemo(() => {
    const make = (color: string, repeat: number) => {
      const map = asphaltTex.clone();
      map.repeat.set(repeat, repeat);
      map.needsUpdate = true;
      return new THREE.MeshStandardMaterial({
        color,
        map,
        roughness: 0.95,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });
    };
    return {
      street: make(palette.asphalt, 40),
      boulevard: make(palette.asphaltLight, 40),
    };
  }, [asphaltTex]);

  const boulevard = estate.roads.find((r) => r.id === "boulevard")!;
  const streets = estate.roads.filter((r) => r.kind === "street");
  const outside = estate.roads.filter((r) => r.id === "approach" || r.id === "trunk");
  const cx = estate.width / 2;
  const halfB = boulevard.widthM / 2;

  const { dashes, edgeLines, medians } = useMemo(() => {
    const d: Dash[] = [];
    const e: Dash[] = [];
    const med: Rect[] = [];
    for (const s of streets) {
      const y = (s.rect.y0 + s.rect.y1) / 2;
      for (let x = s.rect.x0 + 3; x < s.rect.x1 - 3; x += 6) {
        if (Math.abs(x - cx) < halfB + 3) continue;
        d.push({ x, y, len: 3, w: 0.18, vertical: false });
      }
    }
    // Median planters on the boulevard, broken at each junction.
    let start = 2;
    const stops = [...streets.map((s) => [s.rect.y0, s.rect.y1] as const), [boulevard.rect.y1 - 1, Infinity] as const];
    for (const [a, b] of stops) {
      if (a - 2 - start > 2) med.push({ x0: cx - 0.9, x1: cx + 0.9, y0: start, y1: a - 2 });
      start = b + 2;
    }
    for (const r of outside) {
      const vertical = r.rect.y1 - r.rect.y0 > r.rect.x1 - r.rect.x0;
      if (vertical) {
        const x = (r.rect.x0 + r.rect.x1) / 2;
        for (let y = r.rect.y0 + 2; y < r.rect.y1 - 1; y += 6) d.push({ x, y, len: 3, w: 0.18, vertical: true });
      } else {
        const y = (r.rect.y0 + r.rect.y1) / 2;
        for (let x = r.rect.x0 + 3; x < r.rect.x1 - 3; x += 7) {
          if (Math.abs(x - cx) < halfB + 2) continue;
          d.push({ x, y, len: 3.5, w: 0.2, vertical: false });
        }
        const len = r.rect.x1 - r.rect.x0;
        e.push({ x: (r.rect.x0 + r.rect.x1) / 2, y: r.rect.y0 + 0.6, len, w: 0.16, vertical: false });
        e.push({ x: (r.rect.x0 + r.rect.x1) / 2, y: r.rect.y1 - 0.6, len, w: 0.16, vertical: false });
      }
    }
    return { dashes: d, edgeLines: e, medians: med };
  }, [streets, outside, boulevard, cx, halfB]);

  const markingsVisible = progress > 0.97;

  return (
    <group>
      {outside.map((r) => (
        <RoadSurface key={r.id} rect={r.rect} progress={1} anchor="x-centre" y={0.025} material={materials.boulevard} />
      ))}
      <RoadSurface rect={boulevard.rect} progress={progress} anchor="y-start" y={0.035} material={materials.boulevard} />
      {streets.map((s) => (
        <RoadSurface
          key={s.id}
          rect={s.rect}
          progress={Math.max(0, Math.min(1, progress * 1.25 - 0.2))}
          anchor="x-centre"
          y={0.03}
          material={materials.street}
        />
      ))}

      {markingsVisible ? (
        <>
          <Markings dashes={dashes} color={palette.marking} height={0.05} />
          <Markings dashes={edgeLines} color={palette.marking} height={0.045} />
          {medians.map((m, i) => {
            const [mx, my] = rectCenter(m);
            return (
              <mesh key={i} position={[mx, 0.18, -my]} castShadow receiveShadow>
                <boxGeometry args={[m.x1 - m.x0, 0.32, m.y1 - m.y0]} />
                <meshStandardMaterial color={palette.median} roughness={1} />
              </mesh>
            );
          })}
          {streets.map((s) => {
            const y = (s.rect.y0 + s.rect.y1) / 2;
            return [0.22, 0.78].map((t) => (
              <Label
                key={`${s.id}-${t}`}
                text={`${s.name} · ${s.widthM} m`}
                style={{ weight: 700, size: 64, color: "#f6efdd", uppercase: true, letterSpacing: 6 }}
                position={[estate.width * t, 0.06, -(y + 2.2)]}
                height={1.9}
              />
            ));
          })}
          {streets.slice(0, -1).map((s, i) => {
            const next = streets[i + 1];
            const y = (s.rect.y1 + next.rect.y0) / 2;
            return (
              <Label
                key={`blvd-${i}`}
                text={`${boulevard.name} · ${boulevard.widthM} m`}
                style={{ weight: 700, size: 64, color: "#f6efdd", uppercase: true, letterSpacing: 6 }}
                position={[cx - 3.2, 0.06, -y]}
                height={1.9}
                yaw={yawForPlanDir(-1, 0)}
              />
            );
          })}
          {outside
            .filter((r) => r.id === "trunk")
            .map((r) => (
              <Label
                key={r.id}
                text={r.name}
                style={{ weight: 700, size: 64, color: "#f6efdd", uppercase: true, letterSpacing: 6 }}
                position={[cx + 70, 0.05, -((r.rect.y0 + r.rect.y1) / 2 + 3.2)]}
                height={2.2}
              />
            ))}
        </>
      ) : null}
    </group>
  );
}

function Wall({ from, to }: { from: [number, number]; to: [number, number] }) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  return (
    <group position={[mid[0], 0, -mid[1]]} rotation={[0, angle, 0]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, 2, 0.3]} />
        <meshStandardMaterial color={palette.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.06, 0]} castShadow>
        <boxGeometry args={[len, 0.12, 0.42]} />
        <meshStandardMaterial color={palette.wallCap} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Boundary({ estate }: { estate: Estate }) {
  const { width: W, height: H, gate } = estate;
  const g0 = gate.x - gate.widthM / 2 - 0.8;
  const g1 = gate.x + gate.widthM / 2 + 0.8;
  const gatehouse = estate.amenities.find((a) => a.kind === "gatehouse");
  return (
    <group>
      <Wall from={[0, 0]} to={[g0, 0]} />
      <Wall from={[g1, 0]} to={[W, 0]} />
      <Wall from={[W, 0]} to={[W, H]} />
      <Wall from={[W, H]} to={[0, H]} />
      <Wall from={[0, H]} to={[0, 0]} />

      {/* Gate pillars and arch sign */}
      {[g0, g1].map((x) => (
        <mesh key={x} position={[x, 2.9, 0]} castShadow>
          <boxGeometry args={[1.3, 5.8, 1.3]} />
          <meshStandardMaterial color={palette.wall} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[gate.x, 5.4, 0]} castShadow>
        <boxGeometry args={[g1 - g0 + 1.3, 1.5, 0.7]} />
        <meshStandardMaterial color={palette.goldDeep} roughness={0.55} metalness={0.25} />
      </mesh>
      <Label
        text={estate.name}
        style={{ weight: 800, size: 72, color: "#f7e7bf", uppercase: true, letterSpacing: 8 }}
        position={[gate.x, 5.4, 0.37]}
        height={0.9}
        upright
      />

      {gatehouse ? (
        <group position={[(gatehouse.rect.x0 + gatehouse.rect.x1) / 2, 0, -(gatehouse.rect.y0 + gatehouse.rect.y1) / 2]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[gatehouse.rect.x1 - gatehouse.rect.x0, 3, gatehouse.rect.y1 - gatehouse.rect.y0]} />
            <meshStandardMaterial color={palette.wall} roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.15, 0]} castShadow>
            <boxGeometry args={[gatehouse.rect.x1 - gatehouse.rect.x0 + 1.2, 0.3, gatehouse.rect.y1 - gatehouse.rect.y0 + 1.2]} />
            <meshStandardMaterial color={palette.roofRed} roughness={0.7} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function Amenities({ estate }: { estate: Estate }) {
  const lawn = useMemo(() => noiseTexture("grass", 8), []);
  return (
    <group>
      {estate.amenities.map((a) => {
        const [x, y] = rectCenter(a.rect);
        const w = a.rect.x1 - a.rect.x0;
        const d = a.rect.y1 - a.rect.y0;
        if (a.kind === "gatehouse") return null;
        return (
          <group key={a.id}>
            <mesh rotation={flat} position={[x, 0.012, -y]} receiveShadow>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial
                color={a.kind === "green" ? palette.grassOuterDark : palette.parkLawn}
                map={lawn}
                roughness={1}
              />
            </mesh>
            {a.kind === "park" ? (
              <group position={[x, 0, -y]}>
                <mesh rotation={flat} position={[0, 0.03, 0]} receiveShadow>
                  <ringGeometry args={[7, 9, 48]} />
                  <meshStandardMaterial color={palette.concrete} roughness={1} />
                </mesh>
                <mesh rotation={flat} position={[0, 0.025, 0]} receiveShadow>
                  <circleGeometry args={[7, 40]} />
                  <meshStandardMaterial color="#d9b98a" roughness={1} />
                </mesh>
                {/* Play frame */}
                <mesh position={[-2, 1.2, 0]} castShadow>
                  <boxGeometry args={[3.2, 0.15, 0.15]} />
                  <meshStandardMaterial color={palette.roofRed} />
                </mesh>
                {[-3.5, -0.5].map((px) => (
                  <mesh key={px} position={[px, 0.6, 0]} castShadow>
                    <boxGeometry args={[0.15, 1.2, 0.15]} />
                    <meshStandardMaterial color={palette.roofRed} />
                  </mesh>
                ))}
                <mesh position={[2.4, 0.55, 1]} rotation={[0, 0, -0.5]} castShadow>
                  <boxGeometry args={[3, 0.12, 0.9]} />
                  <meshStandardMaterial color={palette.gold} />
                </mesh>
                <mesh position={[3.6, 0.9, 1]} castShadow>
                  <boxGeometry args={[0.9, 1.8, 0.9]} />
                  <meshStandardMaterial color="#3f7c8c" />
                </mesh>
              </group>
            ) : null}
            {a.kind === "community" ? (
              <mesh position={[x, 2.5, -y]} castShadow>
                <boxGeometry args={[w * 0.5, 5, d * 0.55]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.38} roughness={0.4} />
              </mesh>
            ) : null}
            {a.kind !== "green" ? (
              <Label
                text={a.label}
                style={{ weight: 800, size: 64, color: "#ffffff", uppercase: true, letterSpacing: 6, stroke: "rgba(30,40,25,0.55)", strokeWidth: 8 }}
                position={[x, 0.08, -(a.kind === "park" ? a.rect.y0 + 4 : y - d * 0.36)]}
                height={2.1}
              />
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

export function Site({ estate, build }: { estate: Estate; build?: Build }) {
  const roads = build?.roads ?? 1;
  const site = build?.site ?? 1;
  return (
    <group>
      <Ground estate={estate} />
      <Roads estate={estate} progress={roads} />
      {site > 0.5 ? (
        <>
          <Boundary estate={estate} />
          <Amenities estate={estate} />
        </>
      ) : null}
    </group>
  );
}
