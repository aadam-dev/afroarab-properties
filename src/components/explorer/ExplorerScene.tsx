"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo } from "react";
import * as THREE from "three";
import type { Estate } from "@/data/masterplan";
import { usePlotStore } from "@/store/usePlotStore";
import { CameraRig, homeView } from "./rig/CameraRig";
import { SunRig } from "./rig/SunRig";
import { WalkController } from "./rig/WalkController";
import { walkInput } from "./world/core";
import { Plots } from "./world/Plots";
import { PlotFocus } from "./world/PlotFocus";
import { Site } from "./world/Site";
import { Lamps, Trees } from "./world/Vegetation";
import { useMatches } from "./useMatches";

function SceneContents({
  estate,
  panelOpen,
  selectedCode,
}: {
  estate: Estate;
  panelOpen: boolean;
  selectedCode: string | null;
}) {
  const hoveredCode = usePlotStore((s) => s.hoveredCode);
  const colourMode = usePlotStore((s) => s.colourMode);
  const housesVisible = usePlotStore((s) => s.housesVisible);
  const mode = usePlotStore((s) => s.mode);
  const selectPlot = usePlotStore((s) => s.selectPlot);
  const hoverPlot = usePlotStore((s) => s.hoverPlot);
  const { set: matches } = useMatches(estate.plots);

  const selected = useMemo(
    () => estate.plots.find((p) => p.code === selectedCode) ?? null,
    [estate, selectedCode],
  );

  const onSelect = useCallback(
    (code: string, point: THREE.Vector3) => {
      if (usePlotStore.getState().mode === "walk") {
        walkInput.target = [point.x, -point.z];
        return;
      }
      selectPlot(code);
    },
    [selectPlot],
  );

  return (
    <>
      <SunRig estate={estate} shadowSize={typeof window !== "undefined" && window.innerWidth < 768 ? 1024 : 2048} />
      <Site estate={estate} />
      <Trees trees={estate.trees} />
      <Lamps lamps={estate.lamps} />
      <Plots
        plots={estate.plots}
        colourMode={colourMode}
        selectedCode={selectedCode}
        hoveredCode={mode === "walk" ? null : hoveredCode}
        matches={matches}
        onSelect={onSelect}
        onHover={hoverPlot}
      />
      {selected ? <PlotFocus plot={selected} showHouse={housesVisible} /> : null}
      <CameraRig estate={estate} panelOpen={panelOpen} />
      <WalkController estate={estate} />
    </>
  );
}

export default function ExplorerScene({
  estate,
  panelOpen,
  selectedCode,
}: {
  estate: Estate;
  panelOpen: boolean;
  selectedCode: string | null;
}) {
  const mode = usePlotStore((s) => s.mode);
  const playing = usePlotStore((s) => s.sunPlaying);
  const initial = useMemo(() => {
    const aspect = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1.6;
    return homeView(estate, aspect).pos.toArray() as [number, number, number];
  }, [estate]);

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 2]}
      frameloop={mode === "walk" || playing ? "always" : "demand"}
      camera={{ fov: 40, near: 0.5, far: 4000, position: initial }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => usePlotStore.getState().hoverPlot(null)}
      className="!absolute inset-0 touch-none"
      aria-label={`3D site plan of ${estate.name}`}
    >
      <SceneContents estate={estate} panelOpen={panelOpen} selectedCode={selectedCode} />
    </Canvas>
  );
}
