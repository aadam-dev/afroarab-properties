"use client";

import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-10 w-10 items-center justify-center rounded-full",
        "bg-gradient-to-b from-gold-light/35 via-transparent to-gold/25 p-px",
        "transition duration-300 hover:from-gold-light/55 hover:to-gold/45",
        "focus-visible:outline-none",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full",
          "bg-surface text-foreground shadow-soft",
          "transition duration-300 group-hover:bg-forest-950 group-hover:text-gold-light",
          "dark:bg-surface-muted",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            "absolute h-[1.05rem] w-[1.05rem] transition duration-300",
            isDark
              ? "scale-50 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle cx="12" cy="12" r="3.25" />
          <path
            strokeLinecap="round"
            d="M12 3.5v1.6M12 18.9v1.6M3.5 12h1.6M18.9 12h1.6M5.9 5.9l1.1 1.1M17 17l1.1 1.1M5.9 18.1l1.1-1.1M17 7l1.1-1.1"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            "absolute h-[1.05rem] w-[1.05rem] transition duration-300",
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.2 14.35A7.1 7.1 0 0 1 9.65 5.8 7.25 7.25 0 1 0 18.2 14.35Z"
          />
        </svg>
      </span>
    </button>
  );
}
