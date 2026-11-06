"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { RoomFinish, RoomLighting } from "@/store/useFloorPlanStore";

interface PanoramaViewerProps {
  roomName: string;
  finish: RoomFinish;
  lighting: RoomLighting;
}

export function PanoramaViewer({ roomName, finish, lighting }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Create a dynamic luxury panoramic texture using an offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Background gradient based on lighting
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      if (lighting === "sunset") {
        grad.addColorStop(0, "#2c1820");
        grad.addColorStop(0.4, "#8a4b2d");
        grad.addColorStop(0.55, "#d4803b");
        grad.addColorStop(0.7, "#1a161f");
        grad.addColorStop(1, finish === "marble" ? "#e0ded9" : "#4a3321");
      } else if (lighting === "ambient") {
        grad.addColorStop(0, "#080c14");
        grad.addColorStop(0.4, "#141c2b");
        grad.addColorStop(0.6, "#222c3f");
        grad.addColorStop(0.7, "#0c1018");
        grad.addColorStop(1, finish === "marble" ? "#8c8e94" : "#2e2116");
      } else {
        // Daylight
        grad.addColorStop(0, "#3a6073");
        grad.addColorStop(0.4, "#c2e59c");
        grad.addColorStop(0.5, "#fdfbf7");
        grad.addColorStop(0.65, "#e6decb");
        grad.addColorStop(1, finish === "marble" ? "#f5f3ef" : "#68482f");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Architectural window arches & columns
      ctx.fillStyle = "rgba(16, 24, 34, 0.85)";
      for (let i = 0; i < 4; i++) {
        const x = i * 512 + 40;
        ctx.fillRect(x, 260, 430, 420);
        ctx.clearRect(x + 20, 280, 390, 380);

        // Glass reflection sheen
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(x + 20, 280, 390, 380);
        ctx.fillStyle = "rgba(16, 24, 34, 0.85)";
      }

      // Finish details on floor: Marble grid or Hardwood planks
      if (finish === "marble") {
        ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
        ctx.lineWidth = 2;
        for (let y = 680; y < 1024; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(2048, y);
          ctx.stroke();
        }
        for (let x = 0; x < 2048; x += 120) {
          ctx.beginPath();
          ctx.moveTo(x, 680);
          ctx.lineTo(x, 1024);
          ctx.stroke();
        }
      } else {
        // Hardwood plank lines
        ctx.strokeStyle = "rgba(35, 20, 10, 0.6)";
        ctx.lineWidth = 1.5;
        for (let y = 680; y < 1024; y += 18) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(2048, y);
          ctx.stroke();
        }
      }

      // Room Title watermark
      ctx.fillStyle = "rgba(197, 160, 89, 0.5)";
      ctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`AFRO-ARAB PROPERTIES &bull; ${roomName.toUpperCase()}`, 100, 200);
      ctx.font = "24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`FINISH: ${finish.toUpperCase()} &bull; LIGHTING: ${lighting.toUpperCase()}`, 100, 240);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // Sphere geometry with inward facing normals
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Interactive Drag Orbit Variables
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let lon = 0;
    let onPointerDownLon = 0;
    let lat = 0;
    let onPointerDownLat = 0;
    let phi = 0;
    let theta = 0;

    const onPointerDown = (event: PointerEvent) => {
      isUserInteracting = true;
      setIsInteracting(true);
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isUserInteracting) return;
      lon = (onPointerDownPointerX - event.clientX) * 0.15 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
      setIsInteracting(false);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow gentle auto-rotation when user is not dragging
      if (!isUserInteracting) {
        lon += 0.05;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [roomName, finish, lighting]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      
      {/* 360 Drag Indicator Badge */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs text-white backdrop-blur-md">
        <svg className="h-3.5 w-3.5 text-[#C5A059] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span>{isInteracting ? "Looking around..." : "Click & Drag in 360° to view room"}</span>
      </div>
    </div>
  );
}
