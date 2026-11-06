"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { statusColor, type Plot } from "@/data/plots";

type Props = {
  plots: Plot[];
  allPlots: Plot[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
  sunAltitude: number;
  sunAzimuth: number;
};

function PlotMesh({
  plot,
  selected,
  dimmed,
  onSelect,
}: {
  plot: Plot;
  selected: boolean;
  dimmed: boolean;
  onSelect: (code: string) => void;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    plot.polygon.forEach(([x, y], i) => {
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
    s.closePath();
    return s;
  }, [plot.polygon]);

  const geom = useMemo(() => new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false }), [shape]);
  const cx = plot.polygon.reduce((n, p) => n + p[0], 0) / plot.polygon.length;
  const cy = plot.polygon.reduce((n, p) => n + p[1], 0) / plot.polygon.length;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (!dimmed) onSelect(plot.code);
      }}
    >
      <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <meshStandardMaterial
          color={statusColor[plot.status]}
          transparent
          opacity={dimmed ? 0.25 : selected ? 1 : 0.9}
          emissive={selected ? "#ffffff" : "#000000"}
          emissiveIntensity={selected ? 0.08 : 0}
        />
      </mesh>
      <mesh position={[cx, 0.55, cy]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function SunLight({ altitude, azimuth }: { altitude: number; azimuth: number }) {
  const dir = useMemo(() => {
    const alt = (altitude * Math.PI) / 180;
    const az = (azimuth * Math.PI) / 180;
    const x = Math.sin(az) * Math.cos(alt);
    const y = Math.sin(alt);
    const z = Math.cos(az) * Math.cos(alt);
    return new THREE.Vector3(x, Math.max(y, 0.05), z).normalize();
  }, [altitude, azimuth]);

  return (
    <directionalLight
      intensity={Math.max(0.25, altitude / 90) * 1.4}
      position={dir.clone().multiplyScalar(80).toArray()}
      castShadow
    />
  );
}

export function PlotScene({
  plots,
  allPlots,
  selectedCode,
  onSelect,
  sunAltitude,
  sunAzimuth,
}: Props) {
  const visibleIds = useMemo(() => new Set(plots.map((p) => p.id)), [plots]);
  const center = useMemo(() => {
    const pts = allPlots.flatMap((p) => p.polygon);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      z: (Math.min(...ys) + Math.max(...ys)) / 2,
    };
  }, [allPlots]);

  return (
    <Canvas
      camera={{ position: [center.x + 40, 55, center.z + 45], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-label="3D plot overview"
    >
      <color attach="background" args={["#0f1c16"]} />
      <ambientLight intensity={0.45} />
      <SunLight altitude={sunAltitude} azimuth={sunAzimuth} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center.x, 0, center.z]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#1b3022" />
      </mesh>
      {allPlots.map((plot) => (
        <PlotMesh
          key={plot.id}
          plot={plot}
          selected={selectedCode === plot.code}
          dimmed={!visibleIds.has(plot.id)}
          onSelect={onSelect}
        />
      ))}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={120} blur={2.2} />
      <OrbitControls
        makeDefault
        target={[center.x, 0, center.z]}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={20}
        maxDistance={120}
      />
    </Canvas>
  );
}
