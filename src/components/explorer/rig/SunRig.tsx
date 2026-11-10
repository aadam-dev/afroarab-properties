"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Estate } from "@/data/masterplan";
import { usePlotStore } from "@/store/usePlotStore";
import { palette, sunState } from "../world/core";

const skyDay = new THREE.Color(palette.sky);
const skyDusk = new THREE.Color(palette.skyDusk);
const warm = new THREE.Color("#ffc58a");
const white = new THREE.Color("#fff7ea");

/**
 * Directional sun from suncalc at the estate's coordinates, today, at the
 * chosen hour (Accra is UTC+0). Indicative only: uses approximate coordinates.
 */
export function SunRig({ estate, shadowSize = 2048, hourOverride }: { estate: Estate; shadowSize?: number; hourOverride?: number }) {
  const storeHour = usePlotStore((s) => s.sunHour);
  const playing = usePlotStore((s) => s.sunPlaying);
  const hour = hourOverride ?? storeHour;
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const light = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const centre = useMemo(
    () => new THREE.Vector3(estate.width / 2, 0, -estate.height / 2),
    [estate],
  );
  const bg = useMemo(() => new THREE.Color(palette.sky), []);
  const skyMat = useRef<THREE.ShaderMaterial>(null);
  const skyUniforms = useMemo(
    () => ({
      top: { value: new THREE.Color("#7fa7c9") },
      horizon: { value: new THREE.Color(palette.sky) },
      glow: { value: new THREE.Color("#ffd9a0") },
      sunDir: { value: new THREE.Vector3(0, 1, 0) },
    }),
    [],
  );
  const fogColor = useMemo(() => new THREE.Color(palette.fog), []);

  useEffect(() => {
    target.position.copy(centre);
    scene.add(target);
    scene.background = bg;
    scene.fog = new THREE.Fog(fogColor, 520, 1500);
    return () => {
      scene.remove(target);
      scene.fog = null;
    };
  }, [scene, target, centre, bg, fogColor]);

  useEffect(() => {
    const s = sunState(hour, estate.lat, estate.lng, estate.trueNorthDeg);
    const altitude = Math.max(s.altitudeDeg, 4);
    const dir = s.dir.clone();
    if (s.altitudeDeg < 4) dir.y = Math.sin((4 * Math.PI) / 180);
    dir.normalize();

    const low = THREE.MathUtils.clamp(1 - (altitude - 4) / 36, 0, 1);
    const l = light.current;
    if (l) {
      l.position.copy(centre).addScaledVector(dir, 420);
      l.target = target;
      l.intensity = 1.8 + 2.4 * Math.min(1, altitude / 40);
      l.color.copy(white).lerp(warm, low * 0.85);
    }
    if (hemi.current) hemi.current.intensity = 1.15 + 0.65 * Math.min(1, altitude / 45);
    bg.copy(skyDay).lerp(skyDusk, low * 0.7);
    skyUniforms.horizon.value.copy(bg);
    skyUniforms.top.value.set("#6f9cc4").lerp(new THREE.Color("#8a9fb8"), low * 0.5);
    skyUniforms.sunDir.value.copy(dir);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(bg);
    invalidate();
  }, [hour, estate, centre, target, bg, scene, invalidate, skyUniforms]);

  const setSunHour = usePlotStore((s) => s.setSunHour);
  const setSunPlaying = usePlotStore((s) => s.setSunPlaying);
  useFrame((_, dt) => {
    if (!playing || hourOverride !== undefined) return;
    const next = usePlotStore.getState().sunHour + dt * 0.75;
    if (next >= 18.5) {
      setSunHour(18.5);
      setSunPlaying(false);
    } else setSunHour(next);
  });

  const half = Math.max(estate.width, estate.height) * 0.75;
  return (
    <>
      <mesh position={centre} renderOrder={-1} raycast={() => null}>
        <sphereGeometry args={[1900, 32, 16]} />
        <shaderMaterial
          ref={skyMat}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
          uniforms={skyUniforms}
          vertexShader={`varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`uniform vec3 top; uniform vec3 horizon; uniform vec3 glow; uniform vec3 sunDir; varying vec3 vPos;
            void main(){ float h = clamp(vPos.y, 0.0, 1.0); vec3 c = mix(horizon, top, pow(h, 0.55));
            float s = max(dot(normalize(vPos), normalize(sunDir)), 0.0); c += glow * pow(s, 18.0) * 0.55 + glow * pow(s, 3.0) * 0.12;
            gl_FragColor = vec4(c, 1.0); }`}
        />
      </mesh>
      <hemisphereLight ref={hemi} args={["#eef4ff", "#7d8a5a", 1.4]} />
      <directionalLight
        ref={light}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-half}
        shadow-camera-right={half}
        shadow-camera-top={half}
        shadow-camera-bottom={-half}
        shadow-camera-near={10}
        shadow-camera-far={900}
      />
    </>
  );
}
