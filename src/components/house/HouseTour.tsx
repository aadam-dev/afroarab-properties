"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { HouseModel, TourPoint } from "@/data/houses";
import { useHouseStore } from "@/store/useHouseStore";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Photoreal 360° tour: path-traced panoramas rendered in Blender at fixed
 * points, shown as the scene background with the camera at the render point.
 * Floor arrows sit at their true 3D position, so they line up with the image.
 */

const loader = new THREE.TextureLoader();
const cache = new Map<string, Promise<THREE.Texture>>();
function loadPano(url: string) {
  let p = cache.get(url);
  if (!p) {
    p = loader.loadAsync(url).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
    cache.set(url, p);
  }
  return p;
}

function TourView({
  house,
  point,
  onReady,
  look,
  arrows,
  arrowEls,
}: {
  house: HouseModel;
  point: TourPoint;
  look: number | null;
  arrows: Arrow[];
  arrowEls: React.RefObject<Record<string, HTMLButtonElement | null>>;
  onReady: () => void;
}) {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const folder = house.tour!;

  const apply = () => {
    euler.set(pitch.current, yaw.current, 0);
    camera.quaternion.setFromEuler(euler);
    invalidate();
  };

  // Load this point's panorama, then preload its neighbours.
  useEffect(() => {
    let live = true;
    loadPano(`${folder}/${point.id}.jpg`).then((t) => {
      if (!live) return;
      scene.background = t;
      // Blender renders the image centre along plan +y, which is three.js -z.
      scene.backgroundRotation.set(0, Math.PI / 2, 0);
      camera.position.set(...point.pos);
      onReady();
      invalidate();
      for (const id of point.links) loadPano(`${folder}/${id}.jpg`);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point, folder]);

  // Look along the direction of arrival, or the point's preferred heading.
  useEffect(() => {
    yaw.current = ((look ?? point.look) * Math.PI) / 180;
    pitch.current = -0.08;
    camera.fov = 75;
    camera.updateProjectionMatrix();
    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  // Drag to look, wheel or pinch to zoom.
  useEffect(() => {
    const el = gl.domElement;
    const pointers = new Map<number, [number, number]>();
    let pinch = 0;
    const down = (e: PointerEvent) => {
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) {
          camera.fov = THREE.MathUtils.clamp(camera.fov * (pinch / d), 35, 95);
          camera.updateProjectionMatrix();
        }
        pinch = d;
        invalidate();
        return;
      }
      const k = (camera.fov / 75) * 0.0042;
      yaw.current += (e.clientX - prev[0]) * k;
      pitch.current = THREE.MathUtils.clamp(pitch.current + (e.clientY - prev[1]) * k, -1.35, 1.35);
      apply();
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = 0;
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.03, 35, 95);
      camera.updateProjectionMatrix();
      invalidate();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    el.style.cursor = "grab";
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
      el.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, camera]);

  // Project each arrow's floor point to the screen and move its DOM button.
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    camera.updateMatrixWorld();
    for (const a of arrows) {
      const el = arrowEls.current[a.id];
      if (!el) continue;
      // In front of the camera? (NDC z alone is unreliable for points behind it.)
      tmp.set(...a.pos).applyMatrix4(camera.matrixWorldInverse);
      const ahead = tmp.z < -0.1;
      tmp.set(...a.pos).project(camera);
      const visible = ahead && Math.abs(tmp.x) < 1.2 && Math.abs(tmp.y) < 1.2;
      el.style.opacity = visible ? "1" : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
      el.style.transform = `translate(-50%, -50%) translate(${((tmp.x + 1) / 2) * size.width}px, ${((1 - tmp.y) / 2) * size.height}px)`;
    }
  });
  return null;
}

/** Arrow positions: on the floor towards each linked point. */
function arrowsFor(house: HouseModel, point: TourPoint) {
  const floorY = house.meta.levels.find((l) => l.id === point.level)?.ffl ?? 0;
  return point.links.flatMap((id) => {
    const to = house.meta.tour.find((t) => t.id === id);
    if (!to) return [];
    // Between floors, point at the foot (or head) of the stair rather than straight at the other room.
    const stair = house.meta.walk.stair;
    const goingUp = to.pos[1] > point.pos[1];
    const aim = to.level !== point.level && stair ? (goingUp ? stair.bottomPose.pos : stair.topPose.pos) : [to.pos[0], to.pos[2]];
    const dx = aim[0] - point.pos[0];
    const dz = aim[1] - point.pos[2];
    const dist = Math.hypot(dx, dz) || 1;
    const reach = Math.min(dist * (to.level !== point.level ? 0.9 : 0.6), 2.4);
    const pos: [number, number, number] = [point.pos[0] + (dx / dist) * reach, floorY + 0.02, point.pos[2] + (dz / dist) * reach];
    return [{ id, to, pos, stairs: to.level !== point.level, up: to.pos[1] > point.pos[1] }];
  });
}
type Arrow = ReturnType<typeof arrowsFor>[number];

function MiniPlan({ house, current, onMove }: { house: HouseModel; current: TourPoint; onMove: (id: string) => void }) {
  const { meta } = house;
  const rooms = meta.rooms.filter((r) => r.level === current.level);
  const pts = meta.tour.filter((t) => t.level === current.level);
  // Plan rects are [x0, y0, x1, y1] in metres; draw with plan y going up the screen.
  const xs = rooms.flatMap((r) => [r.rect[0], r.rect[2]]);
  const ys = rooms.flatMap((r) => [r.rect[1], r.rect[3]]);
  const pad = 0.4;
  const x0 = Math.min(...xs) - pad;
  const x1 = Math.max(...xs) + pad;
  const y0 = Math.min(...ys, ...pts.map((p) => -p.pos[2])) - pad;
  const y1 = Math.max(...ys) + pad;
  return (
    <svg viewBox={`${x0} ${-y1} ${x1 - x0} ${y1 - y0}`} className="h-40 w-auto" role="img" aria-label="Floor plan with tour points">
      {rooms.map((r) => (
        <rect
          key={r.id}
          x={r.rect[0]}
          y={-r.rect[3]}
          width={r.rect[2] - r.rect[0]}
          height={r.rect[3] - r.rect[1]}
          className="fill-white/80 stroke-forest-900/40"
          strokeWidth={0.06}
        />
      ))}
      {pts.map((p) => (
        <g key={p.id} onClick={() => onMove(p.id)} className="cursor-pointer">
          <circle cx={p.pos[0]} cy={p.pos[2]} r={p.id === current.id ? 0.42 : 0.3} className={p.id === current.id ? "fill-gold" : "fill-forest-800"} />
          <title>{p.name}</title>
        </g>
      ))}
    </svg>
  );
}

export default function HouseTour({ house }: { house: HouseModel }) {
  const tour = house.meta.tour;
  const tourId = useHouseStore((s) => s.tourId);
  const tourLook = useHouseStore((s) => s.tourLook);
  const setTour = useHouseStore((s) => s.setTour);
  const point = tour.find((t) => t.id === tourId) ?? tour.find((t) => t.start) ?? tour[0];
  const [fading, setFading] = useState(false);
  const levelName = house.meta.levels.find((l) => l.id === point.level)?.name ?? "Outside";
  const arrows = useMemo(() => arrowsFor(house, point), [house, point]);
  const arrowEls = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (id: string) => {
    if (id === point.id) return;
    setFading(true);
    // Let the fade cover the swap, then load the next view.
    setTimeout(() => {
      // Face the direction of travel on arrival.
      const to = tour.find((t) => t.id === id);
      // Same floor: keep facing the way you walked. Up or down the stair: use the stop's own heading.
      const look =
        to && to.level === point.level ? (Math.atan2(-(to.pos[0] - point.pos[0]), -(to.pos[2] - point.pos[2])) * 180) / Math.PI : null;
      setTour(id, look);
    }, 220);
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="demand"
        camera={{ fov: 75, near: 0.05, far: 100, position: point.pos }}
        className="!absolute inset-0 touch-none"
        aria-label={`360° view: ${point.name}`}
      >
        <TourView house={house} point={point} look={tourLook} arrows={arrows} arrowEls={arrowEls} onReady={() => setFading(false)} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {arrows.map((a) => (
          <button
            key={a.id}
            ref={(el) => {
              arrowEls.current[a.id] = el;
            }}
            type="button"
            onClick={() => move(a.id)}
            className="group absolute left-0 top-0 flex flex-col items-center gap-1 opacity-0"
            aria-label={`Go to ${a.to.name}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-black/35 text-white shadow-lux backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-forest-900/80">
              <Icon name={a.stairs ? "stairs" : "arrowUpRight"} size={20} />
            </span>
            <span className="whitespace-nowrap rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {a.stairs ? (a.up ? "Upstairs · " : "Downstairs · ") : ""}
              {a.to.name}
            </span>
          </button>
        ))}
      </div>
      <div className={cn("pointer-events-none absolute inset-0 bg-black transition-opacity duration-200", fading ? "opacity-100" : "opacity-0")} />

      <div className="pointer-events-none absolute left-1/2 top-[4.75rem] z-20 -translate-x-1/2">
        <p className="glass-panel whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold" aria-live="polite">
          {point.name} · {levelName}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20">
        <div className="glass-panel pointer-events-auto rounded-2xl p-2.5">
          <p className="px-0.5 pb-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted">{levelName}</p>
          <MiniPlan house={house} current={point} onMove={move} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-20 flex flex-col items-end gap-2">
        {arrows
          .filter((a) => a.stairs)
          .map((a) => (
            <button key={a.id} type="button" onClick={() => move(a.id)} className="btn-gold pointer-events-auto">
              <Icon name="stairs" size={16} /> {a.up ? "Upstairs" : "Downstairs"} · {a.to.name}
            </button>
          ))}
        <p className="glass-panel rounded-full px-3.5 py-1.5 text-xs text-muted max-md:hidden">Drag to look around · tap an arrow to move · scroll to zoom</p>
      </div>
    </div>
  );
}
