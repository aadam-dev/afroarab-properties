"use client";

import { useEffect, useRef } from "react";
import { statusColor, statusLabel, type Estate } from "@/data/masterplan";
import { headingBus } from "./world/core";

type Props = {
  estate: Estate;
  selectedCode?: string | null;
  matches?: Set<string> | null;
  onSelect?: (code: string) => void;
  /** Tap on empty ground (plan metres). Used by the walk minimap. */
  onGround?: (x: number, y: number) => void;
  /** Show the live walker marker. */
  showWalker?: boolean;
  compact?: boolean;
  className?: string;
  title?: string;
};

/** Top-down SVG of the masterplan. North is up. Also the no-WebGL fallback. */
export function SitePlan2D({
  estate,
  selectedCode,
  matches,
  onSelect,
  onGround,
  showWalker,
  compact,
  className,
  title = `Site plan of ${estate.name}`,
}: Props) {
  const pad = compact ? 4 : 10;
  const W = estate.width;
  const H = estate.height;
  const svgRef = useRef<SVGSVGElement>(null);
  const walkerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!showWalker) return;
    return headingBus.subscribe((heading, pos) => {
      const g = walkerRef.current;
      if (!g) return;
      g.setAttribute("transform", `translate(${pos[0].toFixed(1)} ${(H - pos[1]).toFixed(1)}) rotate(${heading.toFixed(1)})`);
    });
  }, [showWalker, H]);

  const y = (v: number) => H - v;

  return (
    <svg
      ref={svgRef}
      viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
      className={className}
      role="img"
      aria-label={title}
      onClick={(e) => {
        if (!onGround || !svgRef.current) return;
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const m = svgRef.current.getScreenCTM();
        if (!m) return;
        const p = pt.matrixTransform(m.inverse());
        onGround(p.x, H - p.y);
      }}
    >
      <rect x={-pad} y={-pad} width={W + pad * 2} height={H + pad * 2} fill="#7b9352" opacity={compact ? 0.9 : 0.25} />
      <rect x={0} y={0} width={W} height={H} fill="#8fae66" stroke="#ece4d6" strokeWidth={compact ? 1.5 : 1} />
      {estate.amenities.map((a) => (
        <rect
          key={a.id}
          x={a.rect.x0}
          y={y(a.rect.y1)}
          width={a.rect.x1 - a.rect.x0}
          height={a.rect.y1 - a.rect.y0}
          fill={a.kind === "green" ? "#647a42" : a.kind === "gatehouse" ? "#ece4d6" : "#86b25f"}
        />
      ))}
      {estate.roads
        .filter((r) => r.rect.y1 > 0)
        .map((r) => (
          <rect
            key={r.id}
            x={r.rect.x0}
            y={y(r.rect.y1)}
            width={r.rect.x1 - r.rect.x0}
            height={r.rect.y1 - r.rect.y0}
            fill="#4a4d52"
          />
        ))}
      {estate.plots.map((p) => {
        const xs = p.polygon.map((v) => v[0]);
        const ys = p.polygon.map((v) => v[1]);
        const x0 = Math.min(...xs);
        const y1 = Math.max(...ys);
        const w = Math.max(...xs) - x0;
        const h = y1 - Math.min(...ys);
        const dim = matches && !matches.has(p.code);
        const sel = p.code === selectedCode;
        const label = `Plot ${p.code}, ${statusLabel[p.status]}, ${p.frontageFt} by ${p.depthFt} feet`;
        return (
          <g
            key={p.id}
            className={onSelect ? "cursor-pointer" : undefined}
            onClick={
              onSelect
                ? (e) => {
                    e.stopPropagation();
                    onSelect(p.code);
                  }
                : undefined
            }
            role={onSelect && !compact ? "button" : undefined}
            tabIndex={onSelect && !compact ? 0 : undefined}
            aria-label={onSelect && !compact ? label : undefined}
            onKeyDown={
              onSelect && !compact
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(p.code);
                    }
                  }
                : undefined
            }
          >
            <rect
              x={x0 + 0.4}
              y={y(y1) + 0.4}
              width={w - 0.8}
              height={h - 0.8}
              fill={statusColor[p.status]}
              opacity={dim ? 0.28 : 1}
              stroke={sel ? "#c9a85a" : "rgba(255,255,255,0.55)"}
              strokeWidth={sel ? 2.4 : 0.5}
            />
            {!compact ? (
              <text
                x={x0 + w / 2}
                y={y(y1) + h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={8}
                fontWeight={800}
                fill="#fff"
                opacity={dim ? 0.5 : 1}
                style={{ pointerEvents: "none" }}
              >
                {p.code}
              </text>
            ) : null}
          </g>
        );
      })}
      {showWalker ? (
        <g ref={walkerRef}>
          <path d="M0 0 L-7 -14 A 15 15 0 0 1 7 -14 Z" fill="rgba(255,255,255,0.45)" />
          <circle r={3.6} fill="#c4161c" stroke="#fff" strokeWidth={1.4} />
        </g>
      ) : null}
    </svg>
  );
}
