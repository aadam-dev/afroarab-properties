"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import * as THREE from "three";
import { labelTexture, type LabelStyle } from "./core";

let fontsReady = false;
let fontsPromise: Promise<unknown> | null = null;
const fontListeners = new Set<() => void>();

function subscribeFonts(cb: () => void) {
  fontListeners.add(cb);
  if (!fontsPromise && typeof document !== "undefined") {
    fontsPromise = Promise.race([
      "fonts" in document ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(() => {
      fontsReady = true;
      fontListeners.forEach((l) => l());
    });
  }
  return () => {
    fontListeners.delete(cb);
  };
}

/** Labels are painted onto canvases, so wait for the web fonts before painting. */
export function useFontsReady() {
  return useSyncExternalStore(
    subscribeFonts,
    () => fontsReady,
    () => false,
  );
}

type Props = {
  text: string;
  style?: LabelStyle;
  /** World position of the label centre. */
  position: [number, number, number];
  /** Height of the label in metres. Width follows the text. */
  height: number;
  /** Rotation about world Y (radians). 0 reads with north up when flat. */
  yaw?: number;
  /** Flat on the ground (default) or standing upright. */
  upright?: boolean;
  opacity?: number;
  renderOrder?: number;
};

export function Label({
  text,
  style,
  position,
  height,
  yaw = 0,
  upright = false,
  opacity = 1,
  renderOrder = 2,
}: Props) {
  const ready = useFontsReady();
  const tex = useMemo(() => (ready ? labelTexture(text, style) : null), [ready, text, style]);
  const material = useMemo(() => {
    if (!tex) return null;
    return new THREE.MeshBasicMaterial({
      map: tex.texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      opacity,
      side: upright ? THREE.DoubleSide : THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
  }, [tex, opacity, upright]);

  useEffect(() => () => material?.dispose(), [material]);

  if (!tex || !material) return null;
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh
        rotation={upright ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}
        scale={[height * tex.aspect, height, 1]}
        material={material}
        renderOrder={renderOrder}
        raycast={() => null}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}
