export const ENGINEERING_LAB_PROJECT_IDS = ["medico-ai", "researchsync", "elevra-ai"] as const;
export type EngineeringLabProjectId = (typeof ENGINEERING_LAB_PROJECT_IDS)[number];

export function isEngineeringLabProjectId(id: string): id is EngineeringLabProjectId {
  return ENGINEERING_LAB_PROJECT_IDS.some((projectId) => projectId === id);
}
