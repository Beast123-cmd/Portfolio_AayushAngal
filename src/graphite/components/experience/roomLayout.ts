import type { RoomId } from "@/graphite/components/experience/sceneState";

export const DOOR_POSITIONS: Record<RoomId, { z: number; side: -1 | 1 }> = {
  projects: { z: -1.4, side: -1 },
  experience: { z: -4.55, side: 1 },
  studio: { z: -7.7, side: -1 },
  contact: { z: -10.85, side: 1 },
};

export const DOOR_LABELS: Record<RoomId, string> = {
  projects: "01 · Engineering Lab",
  experience: "02 · The Journey",
  studio: "03 · Art Studio",
  contact: "04 · Connect",
};
