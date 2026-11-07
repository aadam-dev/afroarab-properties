import Image from "next/image";
import Link from "next/link";
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

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Afro Arab Properties home"
    >
      {surface === "dark" ? (
        <Mark src="/brand/logo-on-dark.png" dim={dim} priority={priority} />
      ) : surface === "light" ? (
        <Mark src="/brand/logo-on-light.png" dim={dim} priority={priority} />
      ) : (
        <span className="relative inline-flex items-center">
          <Mark
            src="/brand/logo-on-light.png"
            dim={dim}
            priority={priority}
            className="dark:hidden"
          />
          <Mark
            src="/brand/logo-on-dark.png"
            dim={dim}
            priority={priority}
            className="hidden dark:block"
          />
        </span>
      )}
    </Link>
  );
}
