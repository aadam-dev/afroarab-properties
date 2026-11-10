"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Estate, Plot } from "@/data/masterplan";
import { SunRig } from "@/components/explorer/rig/SunRig";
import { Homes } from "@/components/explorer/world/Homes";
import { Plots } from "@/components/explorer/world/Plots";
import { PlotFocus } from "@/components/explorer/world/PlotFocus";
import { Site } from "@/components/explorer/world/Site";
import { Lamps, Trees } from "@/components/explorer/world/Vegetation";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

export type Build = { plots: number; roads: number; site: number; green: number; homes: number; focus: boolean };

export function buildAt(p: number): Build {
  return {
    site: span(p, 0.08, 0.16),
    plots: span(p, 0.12, 0.34),
    roads: span(p, 0.36, 0.52),
    green: span(p, 0.42, 0.6),
    homes: span(p, 0.6, 0.82),
    focus: p > 0.86,
  };
}

function useCameraPath(estate: Estate, focus: Plot) {
  return useMemo(() => {
    const cx = estate.width / 2;
    const cz = -estate.height / 2;
    const [px, py] = focus.centroid;
    const n = focus.inward;
    const u = [n[1], -n[0]];
    const fpos = new THREE.Vector3(px - n[0] * 46 + u[0] * 16, 38, -(py - n[1] * 46 + u[1] * 16));
    const keys = [
      { t: 0, pos: new THREE.Vector3(cx + 260, 430, cz + 360), target: new THREE.Vector3(cx, 0, cz) },
      { t: 0.24, pos: new THREE.Vector3(cx - 190, 250, cz + 300), target: new THREE.Vector3(cx, 0, cz - 10) },
      { t: 0.5, pos: new THREE.Vector3(cx + 14, 42, 62), target: new THREE.Vector3(cx, 4, cz + 10) },
      { t: 0.74, pos: new THREE.Vector3(cx + 210, 120, 40), target: new THREE.Vector3(cx, 0, cz) },
      { t: 1, pos: fpos, target: new THREE.Vector3(px, 0, -py) },
    ];
    const posCurve = new THREE.CatmullRomCurve3(keys.map((k) => k.pos), false, "centripetal");
    const tgtCurve = new THREE.CatmullRomCurve3(keys.map((k) => k.target), false, "centripetal");
    // Map scroll progress onto curve parameter so each key lands on its stage.
    const toU = (p: number) => {
      for (let i = 0; i < keys.length - 1; i++) {
        const a = keys[i];
        const b = keys[i + 1];
        if (p <= b.t) return (i + smooth(span(p, a.t, b.t))) / (keys.length - 1);
      }
      return 1;
    };
    return { posCurve, tgtCurve, toU };
  }, [estate, focus]);
}

function Story({ estate, focus, progress }: { estate: Estate; focus: Plot; progress: MotionValue<number> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  // Push the subject away from the copy: right on desktop, up on mobile.
  useEffect(() => {
    const desktop = size.width >= 768;
    camera.setViewOffset(
      size.width,
      size.height,
      desktop ? -size.width * 0.16 : 0,
      desktop ? 0 : size.height * 0.2,
      size.width,
      size.height,
    );
    return () => camera.clearViewOffset();
  }, [camera, size.width, size.height]);
  const [step, setStep] = useState(0);
  const { posCurve, tgtCurve, toU } = useCameraPath(estate, focus);
  const pos = useRef(new THREE.Vector3());
  const tgt = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3(estate.width / 2, 0, -estate.height / 2));
  const started = useRef(false);

  useFrame((_, dt) => {
    const p = progress.get();
    const quant = Math.round(p * 200);
    if (quant !== step) setStep(quant);
    const u = toU(p);
    posCurve.getPoint(u, pos.current);
    tgtCurve.getPoint(u, tgt.current);
    if (!started.current) {
      camera.position.copy(pos.current);
      look.current.copy(tgt.current);
      started.current = true;
    }
    const k = 1 - Math.exp(-dt * 5);
    camera.position.lerp(pos.current, k);
    look.current.lerp(tgt.current, k);
    // Gentle drift on the opening aerial.
    if (p < 0.08) camera.position.x += Math.sin(performance.now() / 4000) * 0.15;
    camera.lookAt(look.current);
  });

  const b = buildAt(step / 200);
  return (
    <>
      <Site estate={estate} build={{ roads: b.roads, site: b.site }} />
      <Trees trees={estate.trees} grow={b.green} />
      <Lamps lamps={estate.lamps} grow={b.green} />
      <Plots
        plots={estate.plots}
        colourMode={b.homes > 0.05 ? "natural" : "status"}
        selectedCode={b.focus ? focus.code : null}
        hoveredCode={null}
        matches={null}
        interactive={false}
        reveal={b.plots}
      />
      <Homes plots={estate.plots.filter((p) => p.id !== focus.id)} grow={b.homes} />
      {b.focus ? <PlotFocus plot={focus} showHouse /> : null}
    </>
  );
}

export default function StoryCanvas({
  estate,
  focus,
  progress,
  active,
}: {
  estate: Estate;
  focus: Plot;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      shadows={mobile ? false : { type: THREE.PCFShadowMap }}
      dpr={[1, mobile ? 1.25 : 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 1, far: 4000, position: [400, 430, 220] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden
      className="!absolute inset-0"
    >
      <SunRig estate={estate} hourOverride={16.4} shadowSize={2048} />
      <Story estate={estate} focus={focus} progress={progress} />
    </Canvas>
  );
}
