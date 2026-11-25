import type { SVGProps } from "react";

/** Stroke icon set (24×24, 1.75 stroke). Decorative by default; pass aria-label to expose. */
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>,
  swatch: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12H12" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" /><path d="M5 19 13 11" /></>,
  walk: <><circle cx="13" cy="4.5" r="1.8" /><path d="m9 21 2.2-6.5L9 11.5l1.2-4 3.6 2.5 3.2.5M11.2 14.5l3.3 2.5.8 4M10.2 7.5 7 10" /></>,
  cube: <><path d="M12 2.8 20 7.3v9.4L12 21.2 4 16.7V7.3Z" /><path d="M4 7.3 12 12l8-4.7M12 12v9.2" /></>,
  plan: <><rect x="3.5" y="3.5" width="17" height="17" rx="1.5" /><path d="M3.5 10h7v10.5M10.5 3.5V7M14 10h6.5M14 10v4" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  play: <><path d="M8 5.5v13l10-6.5Z" /></>,
  pause: <><path d="M8 5h3v14H8zM14 5h3v14h-3z" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" /></>,
  home: <><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></>,
  arrowRight: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  arrowLeft: <><path d="M19 12H5M11 6l-6 6 6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7M9 7h8v8" /></>,
  chevronDown: <><path d="m6 9 6 6 6-6" /></>,
  chevronUp: <><path d="m6 15 6-6 6 6" /></>,
  doc: <><path d="M7 3h7l4 4v14H7Z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  phone: <><path d="M5 4h3.5l1.5 4.5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" /></>,
  whatsapp: <><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.7Z" /><path d="M9 8.5c0 3.5 2.6 6.4 6 6.6l1.2-1.5-1.8-1-1 .8a4.5 4.5 0 0 1-2.4-2.4l.8-1-1-1.8Z" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 6.5 8 6 8-6" /></>,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  house: <><path d="M3.5 10.5 12 4l8.5 6.5V20h-17Z" /><path d="M9.5 20v-6h5v6" /></>,
  ruler: <><path d="m3.5 16.5 13-13 4 4-13 13Z" /><path d="m7 13 1.5 1.5M10 10l1.5 1.5M13 7l1.5 1.5" /></>,
  layers: <><path d="m12 3.5 8.5 4.5L12 12.5 3.5 8Z" /><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" /></>,
  sparkle: <><path d="M12 3.5 13.8 10 20.5 12l-6.7 2L12 20.5 10.2 14 3.5 12l6.7-2Z" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  shield: <><path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
  wallet: <><path d="M4 7.5h15a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5h12" /><circle cx="16.5" cy="13.5" r="1.2" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  minus: <><path d="M5 12h14" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  expand: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>,
  moon: <><path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" /></>,
  camera: <><path d="M4 8h3l1.5-2.5h7L17 8h3a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-10A.5.5 0 0 1 4 8Z" /><circle cx="12" cy="13" r="3.5" /></>,
  stairs: <><path d="M3.5 19.5h5v-4h4v-4h4v-4h4" /></>,
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 20, strokeWidth = 1.75, ...rest }: Props) {
  const labelled = Boolean(rest["aria-label"]);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
