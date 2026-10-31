import { projects } from "@/data/projects";
import { isEngineeringLabProjectId, type EngineeringLabProjectId } from "@/graphite/data/labProjectIds";

export const LAB_PROJECTS = projects.filter(
  (project): project is typeof project & { id: EngineeringLabProjectId } => isEngineeringLabProjectId(project.id),
);

export const LAB_EXHIBIT_NOTES: Record<EngineeringLabProjectId, {
  shortName: string;
  problem: string;
  approach: string;
  recordedOutcome: string;
}> = {
  "medico-ai": {
    shortName: "MEDICO.AI",
    problem: "Clinical assessments need continuity across follow-ups and a consistent way to produce structured reports.",
    approach: "The project record describes multi-step patient interactions with retained context, urgency classification, persistent assessments, and automated tests for authentication, triage, and AI failure cases.",
    recordedOutcome: "An AI-assisted clinical assessment system that generates structured medical reports. The current record does not state a measured result or Aayush's specific contribution.",
  },
  researchsync: {
    shortName: "ResearchSync",
    problem: "Faculty publication submissions, verification, and accreditation reporting need a shared workflow; extracted metadata can be incomplete or inconsistent.",
    approach: "The project record describes a PDF-to-structured-data pipeline that validates metadata and routes incomplete or inconsistent records for coordinator review.",
    recordedOutcome: "A centralized publication platform for PICT. The current record does not state a measured result or Aayush's specific contribution.",
  },
  "elevra-ai": {
    shortName: "Elevra.ai",
    problem: "Student information is spread across seven academic, attendance, learning, and career data sources, making early support harder to coordinate.",
    approach: "The project record describes unified student profiles, explainable success scores, academic and placement risk indicators, and handling for missing data.",
    recordedOutcome: "A student success platform designed to help mentors identify students who may need early support. The current record does not state a measured result or Aayush's specific contribution.",
  },
};
