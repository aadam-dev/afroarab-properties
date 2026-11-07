/** Custom event so footer/header CTAs can open the floating site guide. */
export const OPEN_ASSISTANT_EVENT = "aa-open-assistant";

export function openAssistant() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT));
}
