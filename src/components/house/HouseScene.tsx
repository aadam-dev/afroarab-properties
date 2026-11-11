"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { lensToFov, type HouseModel } from "@/data/houses";
import { useHouseStore } from "@/store/useHouseStore";
import { Icon } from "@/components/ui/Icon";
import { HouseWalker } from "./HouseWalker";

const ACTION = { ROTATE: 1, TRUCK: 2, TOUCH_ROTATE: 64, TOUCH_DOLLY_TRUCK: 4096 } as const;
const DEFAULT_FOV = 45;

/** Which model nodes are hidden for a mode and level. Node names come from build_house.py. */
function hiddenFor(name: string, mode: string, level: string) {
  if (mode !== "inside") return false;
  if (name.startsWith("A_ROOF")) return true;
  if (level === "L0") return name.startsWith("A_L1__") || name.startsWith("ROOM__L1__");
  return false;
}

function Model({ house }: { house: HouseModel }) {
  const { scene } = useGLTF(house.model);
  const mode = useHouseStore((s) => s.mode);
  const level = useHouseStore((s) => s.level);
  const roomId = useHouseStore((s) => s.roomId);
  const invalidate = useThree((s) => s.invalidate);

  // One-off material and shadow setup.
  const roomMeshes = useMemo(() => {
    const rooms = new Map<string, THREE.Mesh[]>();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats as THREE.MeshStandardMaterial[]) {
        if (m.map) m.map.anisotropy = 8;
        if (m.name === "glass") {
          m.transparent = true;
          m.opacity = 0.42;
          m.depthWrite = false;
          m.side = THREE.DoubleSide;
          m.envMapIntensity = 1.6;
          mesh.castShadow = false;
        }
      }
      let p: THREE.Object3D | null = mesh;
      while (p && !p.userData.room) p = p.parent;
      if (p?.userData.room) {
        // Own material per room so the selected floor can be tinted.
        mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
        const list = rooms.get(p.userData.room) ?? [];
        list.push(mesh);
        rooms.set(p.userData.room, list);
      }
    });
    return rooms;
  }, [scene]);

  useEffect(() => {
    useHouseStore.setState({ ready: true });
  }, [scene]);

  useEffect(() => {
    for (const child of scene.children) child.visible = !hiddenFor(child.name, mode, level);
    invalidate();
  }, [scene, mode, level, invalidate]);

  useEffect(() => {
    for (const [id, meshes] of roomMeshes) {
      for (const mesh of meshes) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        m.emissive.set(id === roomId && mode === "inside" ? "#c9a85a" : "#000000");
        m.emissiveIntensity = id === roomId ? 0.7 : 0;
      }
    }
    invalidate();
  }, [roomMeshes, roomId, mode, invalidate]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const s = useHouseStore.getState();
    if (s.mode !== "inside") return;
    let o: THREE.Object3D | null = e.object;
    while (o && !o.userData.room) o = o.parent;
    if (!o || !o.visible || o.userData.level !== s.level) return;
    e.stopPropagation();
    s.selectRoom(o.userData.room);
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        let o: THREE.Object3D | null = e.object;
        while (o && !o.userData.room) o = o.parent;
        if (o && useHouseStore.getState().mode === "inside") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "")}
    />
  );
}

/** Orbit camera for the outside and cut-away views, with fly-to for rooms and photos. */
function CameraRig({ house }: { house: HouseModel }) {
  const ref = useRef<CameraControls>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const mode = useHouseStore((s) => s.mode);
  const level = useHouseStore((s) => s.level);
  const request = useHouseStore((s) => s.cameraRequest);
  const levelZ = house.meta.levels.find((l) => l.id === level)?.ffl ?? 0;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.smoothTime = 0.5;
    c.draggingSmoothTime = 0.1;
    c.minDistance = 0.5;
    c.maxDistance = 70;
    c.maxPolarAngle = 1.5;
    c.dollyToCursor = true;
    c.mouseButtons.left = ACTION.ROTATE;
    c.mouseButtons.right = ACTION.TRUCK;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-25, -0.5, -30), new THREE.Vector3(30, 40, 25)));
  }, [mode]);

  // Fly-to requests. Home differs per mode; rooms and photos have their own poses.
  useEffect(() => {
    const c = ref.current;
    if (!c || mode === "walk") return;
    const setFov = (fov: number) => {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    };
    const req = request ?? { kind: "home" as const, nonce: 0 };
    if (req.kind === "photo") {
      const ph = house.meta.photos.find((p) => p.id === req.photoId);
      if (!ph) return;
      setFov(Math.min(80, lensToFov(ph.lensMm)));
      c.setLookAt(...ph.pos, ...ph.target, true);
    } else if (req.kind === "room") {
      const r = house.meta.rooms.find((x) => x.id === req.roomId);
      if (!r) return;
      setFov(DEFAULT_FOV);
      const [x, y, z] = r.center;
      c.setLookAt(x - 3.2, y + 7.5, z + 5.5, x, y, z, true);
    } else if (mode === "inside") {
      setFov(DEFAULT_FOV);
      c.setLookAt(-8, levelZ + 13, 9, 2.3, levelZ, -5.6, true);
    } else {
      setFov(DEFAULT_FOV);
      c.setLookAt(-7.5, 8.5, 17, 3.8, 2.4, -3.5, true);
    }
    invalidate();
  }, [request, mode, levelZ, house, camera, invalidate]);

  return mode === "walk" ? null : <CameraControls ref={ref} makeDefault />;
}

function PhotoPins({ house }: { house: HouseModel }) {
  const mode = useHouseStore((s) => s.mode);
  const level = useHouseStore((s) => s.level);
  const photoId = useHouseStore((s) => s.photoId);
  const showPhoto = useHouseStore((s) => s.showPhoto);
  if (mode === "walk") return null;
  const l1 = house.meta.levels.find((l) => l.id === "L1")?.ffl ?? 99;
  return (
    <>
      {house.meta.photos.map((p) => {
        if (p.id === photoId) return null;
        // In the ground-floor cut-away, hide pins that sit on the removed upper floor.
        if (mode === "inside" && level === "L0" && p.pos[1] > l1) return null;
        return (
          <Html key={p.id} position={p.pos} center zIndexRange={[20, 0]}>
            <button
              type="button"
              onClick={() => showPhoto(p.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-forest-900 text-white shadow-lux transition hover:scale-110"
              aria-label={`See the photo taken here: ${p.shows}`}
              title="A real photo was taken here"
            >
              <Icon name="camera" size={17} />
            </button>
          </Html>
        );
      })}
    </>
  );
}

/** Wide ground that fades into the fog, so the compound doesn't float on a slab. */
function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[4, -0.06, -4]} receiveShadow raycast={() => null}>
      <circleGeometry args={[400, 48]} />
      <meshStandardMaterial color="#b49a78" roughness={1} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#eef4ff", "#9c8a66", 1.35]} />
      <directionalLight
        position={[-14, 22, 12]}
        intensity={2.6}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={80}
      />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[30, 30, 1]} color="#dfe9f2" />
        <Lightformer intensity={1.2} position={[0, 3, 18]} scale={[40, 6, 1]} color="#f4ead8" />
        <Lightformer intensity={0.8} position={[-18, 3, 0]} rotation-y={Math.PI / 2} scale={[40, 6, 1]} color="#cfdbe6" />
      </Environment>
    </>
  );
}

export default function HouseScene({ house }: { house: HouseModel }) {
  const mode = useHouseStore((s) => s.mode);
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      frameloop={mode === "walk" ? "always" : "demand"}
      camera={{ fov: DEFAULT_FOV, near: 0.05, far: 400, position: [-7.5, 8.5, 17] }}
      gl={{ antialias: true }}
      className="!absolute inset-0 touch-none"
      aria-label={`3D model of ${house.meta.name}`}
    >
      <color attach="background" args={["#cfdde6"]} />
      <fog attach="fog" args={["#cfdde6", 40, 120]} />
      <Lights />
      <Ground />
      <Suspense fallback={null}>
        <Model house={house} />
        <PhotoPins house={house} />
      </Suspense>
      <CameraRig house={house} />
      <HouseWalker house={house} />
    </Canvas>
  );
}
