"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type Room = {
  id: string;
  name: string;
  description: string;
  polygon: string;
};

const rooms: Room[] = [
  {
    id: "living",
    name: "Living / dining",
    description: "Open living zone facing the garden edge. Accuracy: reconstructed demo.",
    polygon: "40,40 220,40 220,150 40,150",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Galley kitchen with rear access. Verify dimensions against construction drawings.",
    polygon: "220,40 320,40 320,120 220,120",
  },
  {
    id: "bed-1",
    name: "Bedroom 1",
    description: "Primary bedroom upstairs in townhouse schemes — shown as plan zone for demo.",
    polygon: "40,160 160,160 160,260 40,260",
  },
  {
    id: "bed-2",
    name: "Bedroom 2",
    description: "Second bedroom with shared wash access.",
    polygon: "170,160 320,160 320,260 170,260",
  },
];

export function FloorPlanWalkthrough({ projectName }: { projectName: string }) {
  const [active, setActive] = useState(rooms[0].id);
  const current = useMemo(() => rooms.find((r) => r.id === active)!, [active]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-4">
        <svg viewBox="0 0 360 300" className="h-auto w-full" role="img" aria-label={`${projectName} floor plan`}>
          <rect width="360" height="300" fill="#f7f4ef" />
          {rooms.map((room) => (
            <polygon
              key={room.id}
              points={room.polygon}
              role="button"
              tabIndex={0}
              aria-pressed={active === room.id}
              aria-label={room.name}
              onClick={() => setActive(room.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(room.id);
                }
              }}
              fill={active === room.id ? "#2f5643" : "#e2d5c3"}
              stroke="#1b3022"
              strokeWidth="2"
              className="cursor-pointer"
            />
          ))}
        </svg>
        <p className="mt-3 text-xs text-stone-500">
          Accuracy declaration: <strong>reconstructed</strong> demo shell. Not for dimensional
          sales claims until CAD/IFC QA is complete.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-brand-red">Walkthrough</p>
        <h2 className="mt-2 font-display text-3xl text-forest-900">{current.name}</h2>
        <p className="mt-3 text-stone-500">{current.description}</p>
        <ul className="mt-6 space-y-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <button
                type="button"
                aria-pressed={active === room.id}
                onClick={() => setActive(room.id)}
                className={cn(
                  "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium",
                  active === room.id
                    ? "bg-forest-800 text-white"
                    : "bg-sand-100 text-forest-800",
                )}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
