"use client";

import { memo, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { statusColor, type Plot } from "@/data/masterplan";
import { Label } from "./Label";
import { palette } from "./core";

export type PlotsVisual = {
  colourMode: "status" | "natural";
  selectedCode: string | null;
  hoveredCode: string | null;
  /** Codes that pass the active filters. null = no filter active. */
  matches: Set<string> | null;
};

type Props = PlotsVisual & {
  plots: Plot[];
  interactive?: boolean;
  onSelect?: (code: string, point: THREE.Vector3) => void;
  onHover?: (code: string | null) => void;
  /** Homepage build progress 0–1. Plots rise in number order. */
  reveal?: number;
};

const INSET = 0.3;
const SLAB = 0.16;

const subLabel: Partial<Record<Plot["status"], string>> = {
  sold: "SOLD",
  reserved: "RESERVED",
  held: "ON HOLD",
  unreleased: "PHASE 2",
};

const dimmed = new THREE.Color(palette.dimmed);

function plotColour(plot: Plot, v: PlotsVisual) {
  const base = new THREE.Color(
    v.colourMode === "status"
      ? statusColor[plot.status]
      : plot.number % 3 === 0
        ? palette.plotNaturalAlt
        : palette.plotNatural,
  );
  if (v.matches && !v.matches.has(plot.code)) base.lerp(dimmed, 0.78);
  if (v.hoveredCode === plot.code && v.selectedCode !== plot.code) base.offsetHSL(0, 0.04, 0.08);
  return base;
}

const PlotSlab = memo(function PlotSlab({
  plot,
  colour,
  selected,
  rise,
  showLabel,
  labelYaw,
  interactive,
  onSelect,
  onHover,
}: {
  plot: Plot;
  colour: THREE.Color;
  selected: boolean;
  rise: number;
  showLabel: boolean;
  labelYaw: number;
  interactive: boolean;
  onSelect?: Props["onSelect"];
  onHover?: Props["onHover"];
}) {
  const xs = plot.polygon.map((p) => p[0]);
  const ys = plot.polygon.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs) - INSET * 2;
  const d = Math.max(...ys) - Math.min(...ys) - INSET * 2;
  const [cx, cy] = plot.centroid;

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  material.color.copy(colour);
  material.emissive.set(selected ? "#5a4210" : "#000000");
  material.emissiveIntensity = selected ? 0.35 : 0;

  const labelStyle = useMemo(
    () => ({
      weight: 800,
      size: 120,
      color: "#ffffff",
      stroke: "rgba(20,28,20,0.55)",
      strokeWidth: 12,
      sub: subLabel[plot.status],
    }),
    [plot.status],
  );

  if (rise <= 0.001) return null;
  const h = SLAB * rise;

  return (
    <group>
      <mesh
        position={[cx, h / 2 + 0.02 + (selected ? 0.1 : 0), -cy]}
        scale={[w, h, d]}
        material={material}
        receiveShadow
        castShadow={false}
        onClick={
          interactive
            ? (e: ThreeEvent<MouseEvent>) => {
                if (e.delta > 6) return;
                e.stopPropagation();
                onSelect?.(plot.code, e.point.clone());
              }
            : undefined
        }
        onPointerOver={
          interactive
            ? (e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                onHover?.(plot.code);
                document.body.style.cursor = "pointer";
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                onHover?.(null);
                document.body.style.cursor = "";
              }
            : undefined
        }
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {showLabel ? (
        <Label
          text={plot.code}
          style={labelStyle}
          position={[cx, h + 0.06 + (selected ? 0.1 : 0), -cy]}
          yaw={labelYaw}
          height={Math.min(9, Math.max(6.5, w * 0.36)) * (labelStyle.sub ? 1.35 : 1)}
        />
      ) : null}
    </group>
  );
});

/**
 * Yaw (multiple of 90°) that keeps flat labels upright for the current camera
 * heading, so numbers never read upside down. Updates only when the quadrant changes.
 */
export function useCameraQuarterYaw() {
  const [yaw, setYaw] = useState(0);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const upV = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    camera.getWorldDirection(dir);
    let v = dir;
    if (dir.y < -0.97) {
      upV.set(0, 1, 0).applyQuaternion(camera.quaternion);
      v = upV;
    }
    const heading = Math.atan2(v.x, -v.z);
    const q = Math.round(heading / (Math.PI / 2));
    const next = -q * (Math.PI / 2);
    if (Math.abs(next - yaw) > 1e-3) setYaw(next);
  });
  return yaw;
}

export function Plots({
  plots,
  colourMode,
  selectedCode,
  hoveredCode,
  matches,
  interactive = true,
  onSelect,
  onHover,
  reveal = 1,
}: Props) {
  const visual = { colourMode, selectedCode, hoveredCode, matches };
  const n = plots.length;
  const labelYaw = useCameraQuarterYaw();
  return (
    <group>
      {plots.map((plot, i) => {
        const start = (i / n) * 0.7;
        const rise = Math.max(0, Math.min(1, (reveal - start) / 0.3));
        return (
          <PlotSlab
            key={plot.id}
            plot={plot}
            colour={plotColour(plot, visual)}
            selected={selectedCode === plot.code}
            rise={rise}
            showLabel={rise > 0.95}
            labelYaw={labelYaw}
            interactive={interactive}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </group>
  );
}
