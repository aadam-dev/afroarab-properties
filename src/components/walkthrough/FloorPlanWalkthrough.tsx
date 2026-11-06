"use client";

import { FloorPlanWalker } from "@/components/floor-plan/FloorPlanWalker";

export function FloorPlanWalkthrough({ projectName }: { projectName: string }) {
  return <FloorPlanWalker projectName={projectName} />;
}
