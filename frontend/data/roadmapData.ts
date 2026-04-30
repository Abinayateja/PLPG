// frontend/data/roadmapData.ts  — replace entire file

import roadmapJson from "./roadmap_data.json";

export interface SkillNode {
  id: string;
  label: string;
  description?: string;
  prerequisites: string[];
  xp?: number;
  estimatedHours?: number;
  duration?: string; // ✅ ADD THIS
}

export interface Phase {
  id: number;
  title: string;
  skills: SkillNode[];
}

export interface GoalRoadmap {
  title: string;
  subtitle: string;
  phases: Phase[];
}

export function getFilteredRoadmap(
  goal: string,
  year: string,
  level: string
): GoalRoadmap | null {
  const data = roadmapJson as Record<string, any>;
  const goalData = data[goal] || data["AI Engineer"];
  if (!goalData) return null;

  // Normalise phases so skills are always SkillNode objects
  const phases: Phase[] = (goalData.phases || []).map((p: any, idx: number) => ({
    id: p.id ?? idx + 1,
    title: p.title ?? `Phase ${idx + 1}`,
    skills: (p.skills || []).map((s: any) =>
  typeof s === "string"
    ? {
        id: s,
        label: s.replace(/-/g, " "),
        prerequisites: [],
        duration: "2h",
      }
    : {
        id: s.id ?? s.skill_id ?? s.label,
        label: s.label ?? s.name ?? s.id,
        description: s.description ?? "",
        prerequisites: s.prerequisites ?? [],
        xp: s.xp ?? 10,
        estimatedHours: s.estimatedHours ?? s.estimated_hours ?? 2,
        duration: `${s.estimatedHours ?? s.estimated_hours ?? 2}h`,
      }
),
  }));

  return {
    title: goalData.title ?? `${goal} Roadmap`,
    subtitle: goalData.subtitle ?? `Your personalised learning path`,
    phases,
  };
}