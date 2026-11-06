"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Moderate decelerate — avoids expo-out freezes on slow settles. */
export const easeOutLux: [number, number, number, number] = [0.2, 0.6, 0.35, 1];

type RevealVariant = "up" | "left" | "right" | "fade" | "scale";

const offsets: Record<RevealVariant, { x?: number; y?: number; scale?: number }> = {
  up: { y: 28 },
  left: { x: -32 },
  right: { x: 32 },
  fade: {},
  scale: { scale: 0.97, y: 16 },
};

type Props = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView">;

export function ScrollReveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const offset = offsets[variant];

  return (
    <motion.div
      className={cn(className)}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0, scale: offset.scale ?? 1 }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-12% 0px -8% 0px", amount: 0.2 }}
      transition={{ duration: reduce ? 0.35 : duration, delay, ease: easeOutLux }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();
  const offset = offsets[variant];

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: reduce
          ? { opacity: 0 }
          : { opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0, scale: offset.scale ?? 1 },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: reduce ? 0.3 : 0.65, ease: easeOutLux },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
