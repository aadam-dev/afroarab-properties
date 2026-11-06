import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Compact header mark vs larger footer / hero mark */
  size?: "header" | "footer" | "hero";
  priority?: boolean;
  /** Force white mark on dark photography */
  invert?: boolean;
};

const sizes = {
  header: { width: 168, height: 36, className: "h-8 w-auto sm:h-9" },
  footer: { width: 200, height: 42, className: "h-10 w-auto" },
  hero: { width: 280, height: 60, className: "h-12 w-auto sm:h-14 md:h-16" },
} as const;

export function BrandLogo({ className, size = "header", priority, invert }: Props) {
  const dim = sizes[size];

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Afro Arab Properties home"
    >
      <Image
        src="/brand/logo-green.png"
        alt="Afro Arab Properties"
        width={dim.width}
        height={dim.height}
        priority={priority}
        className={cn(
          dim.className,
          "object-contain object-left",
          invert ? "brightness-0 invert" : "dark:brightness-0 dark:invert",
        )}
      />
    </Link>
  );
}
