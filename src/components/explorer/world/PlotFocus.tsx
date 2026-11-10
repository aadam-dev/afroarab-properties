"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import {
  doorsFor,
  houseFrame,
  houseTypeForPlot,
  roomWalls,
  type HouseType,
  type Plot,
} from "@/data/masterplan";
import { Label } from "./Label";
import { palette, roomFloor, toWorld, yawForPlanDir } from "./core";

const WALL_T = 0.16;
const WALL_H = 1.45;

/** House cut-away: slab, tinted room floors, half-height walls with door openings, room names. */
export function HouseCutaway({ plot, type }: { plot: Plot; type: HouseType }) {
  const { origin, u } = useMemo(() => houseFrame(plot, type), [plot, type]);
  const doors = useMemo(() => doorsFor(type), [type]);
  const walls = useMemo(
    () => type.rooms.flatMap((r) => roomWalls(r, doors, type, WALL_T)),
    [type, doors],
  );
  const yaw = Math.atan2(u[1], u[0]);
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: palette.house, roughness: 0.85 }),
    [],
  );

  return (
    <group position={toWorld(origin, 0)} rotation={[0, yaw, 0]}>
      {/* Plinth */}
      <mesh position={[type.widthM / 2, 0.22, -type.depthM / 2]} castShadow receiveShadow>
        <boxGeometry args={[type.widthM + 0.4, 0.44, type.depthM + 0.4]} />
        <meshStandardMaterial color={palette.concrete} roughness={0.9} />
      </mesh>
      {/* Front step and path to the road */}
      <mesh position={[type.entranceX, 0.12, 0.6]} receiveShadow>
        <boxGeometry args={[1.6, 0.24, 1.2]} />
        <meshStandardMaterial color={palette.concrete} roughness={0.9} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[type.entranceX, 0.2, type.frontSetbackM / 2 + 0.6]}
        receiveShadow
      >
        <planeGeometry args={[1.4, type.frontSetbackM - 1.2]} />
        <meshStandardMaterial color="#cdbfa8" roughness={1} polygonOffset polygonOffsetFactor={-2} />
      </mesh>

      {type.rooms.map((r) => (
        <group key={r.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[r.x + r.w / 2, 0.455, -(r.y + r.d / 2)]} receiveShadow>
            <planeGeometry args={[r.w, r.d]} />
            <meshStandardMaterial color={roomFloor[r.kind]} roughness={0.8} />
          </mesh>
          {r.w * r.d >= 4 ? (
            <Label
              text={r.label}
              style={{ weight: 700, size: 56, color: "#4a3d2c", uppercase: true, letterSpacing: 3 }}
              position={[r.x + r.w / 2, 0.47, -(r.y + r.d / 2)]}
              yaw={0}
              height={Math.min(0.62, r.w * 0.11)}
            />
          ) : null}
        </group>
      ))}

      {walls.map((s, i) => {
        const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
        const horizontal = Math.abs(s.y1 - s.y0) < 1e-6;
        return (
          <mesh
            key={i}
            material={wallMat}
            position={[(s.x0 + s.x1) / 2, 0.44 + WALL_H / 2, -((s.y0 + s.y1) / 2)]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={horizontal ? [len + WALL_T, WALL_H, WALL_T] : [WALL_T, WALL_H, len + WALL_T]} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Outline, corner pillars, frontage/depth tags and the entrance arrow for the selected plot. */
export function PlotFocus({ plot, showHouse }: { plot: Plot; showHouse: boolean }) {
  const type = useMemo(() => houseTypeForPlot(plot), [plot]);
  const { n, u, frontMid, outline, doorFront } = useMemo(() => {
    const n = plot.inward;
    const u: [number, number] = [n[1], -n[0]];
    const [a, b] = plot.frontEdge;
    const frontMid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const outline = [...plot.polygon, plot.polygon[0]].map((p) => new THREE.Vector3(...toWorld(p, 0.36)));
    const { toPlan } = houseFrame(plot, type);
    const door = toPlan(type.entranceX, 0);
    // Project the door onto the frontage line.
    const along = (door[0] - frontMid[0]) * u[0] + (door[1] - frontMid[1]) * u[1];
    const doorFront: [number, number] = [frontMid[0] + u[0] * along, frontMid[1] + u[1] * along];
    return { n, u, frontMid, outline, doorFront };
  }, [plot, type]);

  const frontYaw = yawForPlanDir(n[0], n[1]);
  const left = plot.polygon.reduce(
    (best, p) => {
      const s = (p[0] - plot.centroid[0]) * u[0] + (p[1] - plot.centroid[1]) * u[1];
      return s < best.s ? { s, p } : best;
    },
    { s: Infinity, p: plot.polygon[0] },
  );
  const depthAnchor: [number, number] = [
    plot.centroid[0] + u[0] * (left.s + 1.8),
    plot.centroid[1] + u[1] * (left.s + 1.8),
  ];

  const arrow = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.7, 0);
    s.lineTo(0.7, 0);
    s.lineTo(0.7, 2.4);
    s.lineTo(1.6, 2.4);
    s.lineTo(0, 4.2);
    s.lineTo(-1.6, 2.4);
    s.lineTo(-0.7, 2.4);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  const tagStyle = { weight: 800, size: 72, color: "#ffffff", stroke: "rgba(20,28,20,0.6)", strokeWidth: 10 };
  const arrowBase: [number, number] = [doorFront[0] - n[0] * 5.6, doorFront[1] - n[1] * 5.6];

  return (
    <group>
      <Line points={outline} color={palette.gold} lineWidth={3.2} />
      {plot.polygon.map((p, i) => (
        <mesh key={i} position={toWorld(p, 0.45)} castShadow>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.7} />
        </mesh>
      ))}

      <Label
        text={`${plot.frontageFt} ft`}
        style={tagStyle}
        position={toWorld([frontMid[0] + n[0] * 2.2, frontMid[1] + n[1] * 2.2], 0.42)}
        yaw={frontYaw}
        height={1.6}
        renderOrder={4}
      />
      <Label
        text={`${plot.depthFt} ft`}
        style={tagStyle}
        position={toWorld(depthAnchor, 0.42)}
        yaw={yawForPlanDir(-u[0], -u[1])}
        height={1.6}
        renderOrder={4}
      />

      <group position={toWorld(arrowBase, 0.09)} rotation={[0, frontYaw, 0]}>
        <mesh geometry={arrow} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
          <meshBasicMaterial color={palette.gold} toneMapped={false} polygonOffset polygonOffsetFactor={-6} />
        </mesh>
      </group>
      <Label
        text="Main entrance"
        style={{ weight: 800, size: 64, color: "#f7e7bf", uppercase: true, letterSpacing: 6, stroke: "rgba(20,20,20,0.45)", strokeWidth: 8 }}
        position={toWorld([arrowBase[0] - n[0] * 1.8, arrowBase[1] - n[1] * 1.8], 0.1)}
        yaw={frontYaw}
        height={1.25}
        renderOrder={4}
      />

      {showHouse ? <HouseCutaway plot={plot} type={type} /> : null}
    </group>
  );
}
