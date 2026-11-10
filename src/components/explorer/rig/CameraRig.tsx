"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import type { Estate } from "@/data/masterplan";
import { usePlotStore } from "@/store/usePlotStore";
import { headingBus } from "../world/core";

const ACTION = {
  NONE: 0,
  ROTATE: 1,
  TRUCK: 2,
  DOLLY: 16,
  TOUCH_ROTATE: 64,
  TOUCH_TRUCK: 128,
  TOUCH_DOLLY_TRUCK: 4096,
} as const;

const PANEL_PX = 420;

export function homeView(estate: Estate, aspect: number) {
  const cx = estate.width / 2;
  const tz = -estate.height * 0.47;
  const dir = new THREE.Vector3(0.3, 0.6, 0.74).normalize();
  const dist = 360 * Math.max(1, 1.45 / aspect);
  const pos = new THREE.Vector3(cx, 0, tz).addScaledVector(dir, dist);
  return { pos, target: new THREE.Vector3(cx, 0, tz) };
}

export function planDistance(estate: Estate, aspect: number, fovDeg: number) {
  const half = (fovDeg * Math.PI) / 360;
  const needH = estate.height * 1.12;
  const needW = (estate.width * 1.12) / aspect;
  return Math.max(needH, needW) / 2 / Math.tan(half);
}

/** Orbit + plan camera with fly-to transitions. Disabled while walking. */
export function CameraRig({ estate, panelOpen }: { estate: Estate; panelOpen: boolean }) {
  const ref = useRef<CameraControls>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const mode = usePlotStore((s) => s.mode);
  const request = usePlotStore((s) => s.cameraRequest);
  const prevMode = useRef(mode);
  const initialised = useRef(false);
  const aspect = size.width / Math.max(1, size.height);
  const isDesktop = size.width >= 1024;

  // Mode configuration. The controls are unmounted while walking, so base
  // settings are re-applied whenever they mount again.
  useEffect(() => {
    const from = prevMode.current;
    prevMode.current = mode;
    const c = ref.current;
    if (mode === "walk" || !c) return;

    c.smoothTime = 0.45;
    c.draggingSmoothTime = 0.12;
    c.dollyToCursor = true;
    c.minDistance = 16;
    c.maxDistance = 900;
    c.setBoundary(
      new THREE.Box3(
        new THREE.Vector3(-160, -1, -estate.height - 160),
        new THREE.Vector3(estate.width + 160, 400, 160),
      ),
    );

    if (!initialised.current) {
      initialised.current = true;
      const { pos, target } = homeView(estate, aspect);
      c.setLookAt(pos.x, pos.y, pos.z, target.x, target.y, target.z, false);
    } else if (from === "walk") {
      // Re-sync the fresh controls with wherever the walker left the camera.
      const fwd = new THREE.Vector3();
      camera.getWorldDirection(fwd);
      const p = camera.position.clone();
      camera.fov = 40;
      camera.updateProjectionMatrix();
      c.setLookAt(p.x, p.y, p.z, p.x + fwd.x * 20, 0, p.z + fwd.z * 20, false);
    }

    if (mode === "plan") {
      c.minPolarAngle = 0;
      c.maxPolarAngle = 0;
      c.minAzimuthAngle = 0;
      c.maxAzimuthAngle = 0;
      c.mouseButtons.left = ACTION.TRUCK;
      c.mouseButtons.right = ACTION.TRUCK;
      c.touches.one = ACTION.TOUCH_TRUCK;
      c.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
      const cx = estate.width / 2;
      const cz = -estate.height / 2;
      const d = planDistance(estate, aspect, camera.fov);
      c.normalizeRotations();
      c.setLookAt(cx, d, cz + 0.01, cx, 0, cz, true);
    } else {
      c.minPolarAngle = 0.05;
      c.maxPolarAngle = 1.3;
      c.minAzimuthAngle = -Infinity;
      c.maxAzimuthAngle = Infinity;
      c.mouseButtons.left = ACTION.ROTATE;
      c.mouseButtons.right = ACTION.TRUCK;
      c.touches.one = ACTION.TOUCH_ROTATE;
      c.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
    }
    invalidate();
    // aspect intentionally excluded: resizing should not re-trigger mode transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, estate, camera, invalidate]);

  /**
   * Focal offset that keeps the subject clear of the plot panel: sideways for the
   * desktop side panel, upwards for the mobile bottom sheet (~46% of the screen).
   */
  function focalFor(distance: number): [number, number] {
    const half = (camera.fov * Math.PI) / 360;
    const visibleH = 2 * Math.tan(half) * distance;
    if (isDesktop) return [(PANEL_PX / 2 / size.width) * visibleH * aspect, 0];
    return [0, 0.22 * visibleH];
  }

  // Camera requests (fly to plot / home).
  useEffect(() => {
    const c = ref.current;
    if (!c || !request || usePlotStore.getState().mode === "walk") return;
    if (request.kind === "home") {
      if (usePlotStore.getState().mode === "plan") return;
      const { pos, target } = homeView(estate, aspect);
      c.setFocalOffset(0, 0, 0, true);
      c.setLookAt(pos.x, pos.y, pos.z, target.x, target.y, target.z, true);
      return;
    }
    if (request.kind === "plot") {
      const plot = estate.plots.find((p) => p.code === request.code);
      if (!plot) return;
      const [px, py] = plot.centroid;
      const n = plot.inward;
      const u = [n[1], -n[0]];
      if (usePlotStore.getState().mode === "plan") {
        c.moveTo(px, 0, -py, true);
        c.dollyTo(Math.min(c.distance, 150), true);
        { const [fx, fy] = focalFor(Math.min(c.distance, 150)); c.setFocalOffset(fx, fy, 0, true); }
        return;
      }
      const back = 46;
      const side = 16;
      const height = 40;
      const camPlan = [px - n[0] * back + u[0] * side, py - n[1] * back + u[1] * side];
      c.setLookAt(camPlan[0], height, -camPlan[1], px, 0, -py, true);
      // Offset from the destination distance, not the current one mid-flight.
      const [fx, fy] = focalFor(Math.hypot(back, side, height));
      c.setFocalOffset(fx, fy, 0, true);
    }
    // focalFor is derived from props read below; request is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, estate, aspect]);

  // Panel closed (or walking): drop the offset so the view recentres.
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (!panelOpen) c.setFocalOffset(0, 0, 0, true);
  }, [panelOpen, mode]);

  const dir = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3());
  useFrame(() => {
    camera.getWorldDirection(dir.current);
    let v = dir.current;
    if (v.y < -0.97) {
      // Looking straight down: screen-up decides the heading.
      up.current.set(0, 1, 0).applyQuaternion(camera.quaternion);
      v = up.current;
    }
    const bearing = (Math.atan2(v.x, -v.z) * 180) / Math.PI;
    headingBus.emit(bearing, [camera.position.x, -camera.position.z]);
  });

  return mode === "walk" ? null : <CameraControls ref={ref} makeDefault />;
}
