"use client";

import { useMemo } from "react";
import {
  doorsFor,
  roomWalls,
  type Estate,
  type HouseType,
  type Plot,
} from "@/data/masterplan";
import { roomFloor } from "./world/core";

const FT = 0.3048;
const ROAD = 6;
const M = 4;

/**
 * Plot drawn in its own frame: frontage at the bottom (as seen from the street),
 * with side roads for corner plots, setbacks, and the suggested house layout.
 */
export function PlotFloorPlan({
  plot,
  estate,
  type,
  showHouse,
}: {
  plot: Plot;
  estate: Estate;
  type: HouseType;
  showHouse: boolean;
}) {
  const F = plot.frontageFt * FT;
  const D = plot.depthFt * FT;
  const hasLeft = plot.frontages.some((f) => f.side === "left");
  const hasRight = plot.frontages.some((f) => f.side === "right");
  const left = M + (hasLeft ? ROAD + 1 : 0);
  const right = M + (hasRight ? ROAD + 1 : 0);
  const top = M + 2;
  const bottom = M + ROAD + 1;
  const vbW = left + F + right;
  const vbH = top + D + bottom;

  const hx0 = left + (F - type.widthM) / 2;
  const hyFront = top + D - type.frontSetbackM;
  const X = (x: number) => hx0 + x;
  const Y = (y: number) => hyFront - y;

  const doors = useMemo(() => doorsFor(type), [type]);
  const walls = useMemo(() => type.rooms.flatMap((r) => roomWalls(r, doors, type, 0.24)), [type, doors]);

  const n = plot.inward;
  const u = [n[1], -n[0]];
  const northDeg = (Math.atan2(u[1], n[1]) * 180) / Math.PI;
  const roadName = (side: string) => {
    const fr = plot.frontages.find((f) => f.side === side);
    const road = estate.roads.find((r) => r.id === fr?.roadId);
    return road ? `${road.widthM} m · ${road.name}` : "";
  };

  return (
    <svg
      viewBox={`0 0 ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Plot ${plot.code}: ${plot.frontageFt} by ${plot.depthFt} feet${showHouse ? `, with a suggested ${type.name}` : ""}. Street at the bottom.`}
    >
      {/* Front road */}
      <rect x={0} y={top + D + 1} width={vbW} height={ROAD} fill="#4a4d52" rx={0.6} />
      <text x={vbW / 2} y={top + D + 1 + ROAD / 2} textAnchor="middle" dominantBaseline="central" fontSize={1.9} fontWeight={700} fill="#f3ead6" letterSpacing={0.15}>
        {roadName("front").toUpperCase()}
      </text>
      {hasLeft ? (
        <g>
          <rect x={M - 2} y={top - 2} width={ROAD} height={D + 3} fill="#4a4d52" rx={0.6} />
          <text transform={`translate(${M - 2 + ROAD / 2} ${top + D / 2}) rotate(-90)`} textAnchor="middle" dominantBaseline="central" fontSize={1.9} fontWeight={700} fill="#f3ead6" letterSpacing={0.15}>
            {roadName("left").toUpperCase()}
          </text>
        </g>
      ) : null}
      {hasRight ? (
        <g>
          <rect x={left + F + 1} y={top - 2} width={ROAD} height={D + 3} fill="#4a4d52" rx={0.6} />
          <text transform={`translate(${left + F + 1 + ROAD / 2} ${top + D / 2}) rotate(90)`} textAnchor="middle" dominantBaseline="central" fontSize={1.9} fontWeight={700} fill="#f3ead6" letterSpacing={0.15}>
            {roadName("right").toUpperCase()}
          </text>
        </g>
      ) : null}

      {/* Plot */}
      <rect x={left} y={top} width={F} height={D} fill="#a9c27e" stroke="#ffffff" strokeWidth={0.35} />
      <rect x={left} y={top} width={F} height={D} fill="none" stroke="#6b501c" strokeWidth={0.18} strokeDasharray="0.8 0.6" />

      {showHouse ? (
        <g>
          <rect x={X(type.entranceX) - 0.7} y={Y(0)} width={1.4} height={type.frontSetbackM} fill="#e4d8c3" />
          {type.rooms.map((r) => (
            <rect key={r.id} x={X(r.x)} y={Y(r.y + r.d)} width={r.w} height={r.d} fill={roomFloor[r.kind]} />
          ))}
          {walls.map((s, i) => (
            <line
              key={i}
              x1={X(s.x0)}
              y1={Y(s.y0)}
              x2={X(s.x1)}
              y2={Y(s.y1)}
              stroke="#3b3128"
              strokeWidth={0.24}
              strokeLinecap="square"
            />
          ))}
          {type.rooms.map((r) =>
            r.w >= 2.4 && r.d >= 2.4 ? (
              <text
                key={r.id}
                x={X(r.x + r.w / 2)}
                y={Y(r.y + r.d / 2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={Math.min(1.15, r.w / 6)}
                fontWeight={700}
                fill="#4a3d2c"
              >
                {r.label.toUpperCase()}
              </text>
            ) : null,
          )}
          {/* Entrance arrow */}
          <path
            d={`M ${X(type.entranceX)} ${Y(-0.2)} l -1 1.6 h 0.6 v 1.6 h 0.8 v -1.6 h 0.6 Z`}
            fill="#8a6828"
          />
        </g>
      ) : null}

      {/* Dimensions */}
      <text x={left + F / 2} y={top + D - 1.4} textAnchor="middle" fontSize={2} fontWeight={800} fill="#2d3a22">
        {plot.frontageFt} ft
      </text>
      <text transform={`translate(${left + 1.6} ${top + D / 2}) rotate(-90)`} textAnchor="middle" dominantBaseline="central" fontSize={2} fontWeight={800} fill="#2d3a22">
        {plot.depthFt} ft
      </text>

      {/* North arrow */}
      <g transform={`translate(${vbW - M - 1.2} ${top + 1.8}) rotate(${northDeg.toFixed(1)})`}>
        <circle r={2.2} fill="#ffffff" opacity={0.92} />
        <path d="M0 -1.7 L0.9 0.9 L0 0.35 L-0.9 0.9 Z" fill="#c4161c" />
        <text y={-2.9} textAnchor="middle" fontSize={1.5} fontWeight={800} fill="#2d3a22" transform={`rotate(${(-northDeg).toFixed(1)} 0 -2.9)`}>
          N
        </text>
      </g>
    </svg>
  );
}
