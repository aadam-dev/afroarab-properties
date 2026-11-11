import { create } from "zustand";

export type HouseMode = "outside" | "inside" | "walk";

export type HouseCameraRequest =
  | { kind: "home"; nonce: number }
  | { kind: "room"; roomId: string; nonce: number }
  | { kind: "photo"; photoId: string; nonce: number };

type State = {
  mode: HouseMode;
  /** Level shown in the cut-away view, and the level the walker is on. */
  level: string;
  roomId: string | null;
  photoId: string | null;
  cameraRequest: HouseCameraRequest | null;
  /** True once the model has loaded. */
  ready: boolean;
  setMode: (mode: HouseMode) => void;
  setLevel: (level: string) => void;
  selectRoom: (roomId: string | null, level?: string) => void;
  showPhoto: (photoId: string | null) => void;
  requestHome: () => void;
  reset: () => void;
};

let nonce = 0;

export const useHouseStore = create<State>((set, get) => ({
  mode: "outside",
  level: "L0",
  roomId: null,
  photoId: null,
  cameraRequest: null,
  ready: false,

  setMode: (mode) => {
    if (get().mode === mode) return;
    set({ mode, photoId: null, roomId: mode === "walk" ? null : get().roomId, cameraRequest: { kind: "home", nonce: ++nonce } });
  },
  setLevel: (level) => set({ level, roomId: null }),
  selectRoom: (roomId, level) =>
    set({
      roomId,
      photoId: null,
      level: level ?? get().level,
      cameraRequest: roomId && get().mode !== "walk" ? { kind: "room", roomId, nonce: ++nonce } : get().cameraRequest,
    }),
  showPhoto: (photoId) =>
    set({
      photoId,
      roomId: null,
      mode: photoId && get().mode === "walk" ? "outside" : get().mode,
      cameraRequest: photoId ? { kind: "photo", photoId, nonce: ++nonce } : get().cameraRequest,
    }),
  requestHome: () => set({ photoId: null, cameraRequest: { kind: "home", nonce: ++nonce } }),
  reset: () => set({ mode: "outside", level: "L0", roomId: null, photoId: null, cameraRequest: null, ready: false }),
}));

/** Joystick and stair input shared between the HUD and the walker. */
export const houseWalkInput = { x: 0, y: 0, stair: null as "up" | "down" | null };
