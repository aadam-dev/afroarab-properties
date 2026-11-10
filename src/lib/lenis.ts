import type Lenis from "lenis";

/** Shared handle so overlays (mobile menu, dialogs) can pause smooth scrolling. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function lockScroll(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
