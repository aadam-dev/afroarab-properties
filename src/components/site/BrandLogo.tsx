"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type Surface = "auto" | "light" | "dark";

type Props = {
  className?: string;
  /** Compact header mark vs larger footer / hero mark */
  size?: "header" | "footer" | "hero";
  priority?: boolean;
  /**
   * Which surface the mark sits on.
   * - auto: follows `data-theme` (no CSS invert)
   * - dark: white wordmark for photography / forest bands
   * - light: ink wordmark for sand / light surfaces
   */
  surface?: Surface;
};

const sizes = {
  header: { width: 196, height: 42, className: "h-9 w-auto sm:h-10" },
  footer: { width: 220, height: 47, className: "h-11 w-auto" },
  hero: { width: 320, height: 68, className: "h-14 w-auto sm:h-16 md:h-[4.5rem]" },
} as const;

function subscribeTheme(onStoreChange: () => void) {
  const el = document.documentElement;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

function Mark({
  src,
  dim,
  priority,
  className,
}: {
  src: string;
  dim: (typeof sizes)[keyof typeof sizes];
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt="Afro Arab Properties"
      width={dim.width}
      height={dim.height}
      priority={priority}
      className={cn(dim.className, "object-contain object-left", className)}
    />
  );
}

export function BrandLogo({
  className,
  size = "header",
  priority,
  surface = "auto",
}: Props) {
  const dim = sizes[size];
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const src =
    surface === "dark"
      ? "/brand/logo-on-dark.png"
      : surface === "light"
        ? "/brand/logo-on-light.png"
        : theme === "dark"
          ? "/brand/logo-on-dark.png"
          : "/brand/logo-on-light.png";

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Afro Arab Properties home"
    >
      <Mark src={src} dim={dim} priority={priority} />
    </Link>
  );
}
