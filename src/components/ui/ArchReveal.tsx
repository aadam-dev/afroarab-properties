"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** "arch" = rounded top like a doorway, "rect" = soft rectangle. */
  shape?: "arch" | "rect";
  priority?: boolean;
  caption?: string;
};

/**
 * Editorial image: the frame wipes open from the bottom as it scrolls into view,
 * while the photo drifts slightly for depth.
 */
export function ArchReveal({ src, alt, className, sizes = "(max-width: 768px) 100vw, 40vw", shape = "arch", priority, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);

  return (
    <figure className={cn("relative", className)}>
      <motion.div
        ref={ref}
        style={reduce ? undefined : { clipPath: clip }}
        className={cn("relative h-full w-full overflow-hidden bg-surface-muted", shape === "arch" ? "arch" : "rounded-[1.25rem]")}
      >
        <motion.div className="absolute inset-[-8%]" style={reduce ? undefined : { y }}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </motion.div>
      </motion.div>
      {caption ? <figcaption className="t-meta mt-3 text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
