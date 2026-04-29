import { motion } from "framer-motion";
import type { Phase, SkillNode } from "@/data/roadmapData";
import SkillNodeComponent from "./SkillNode";

interface PhaseCardProps {
  phase: Phase & { _recommended?: boolean };
  phaseIndex: number;
  getStatus: (skillId: string, prerequisites: string[]) => "completed" | "current" | "locked" | "available";
  onSkillClick: (skill: SkillNode) => void;
  isActive: boolean;
}

const PhaseCard = ({ phase, phaseIndex, getStatus, onSkillClick, isActive }: PhaseCardProps) => {
  const recommended = (phase as Phase & { _recommended?: boolean })._recommended !== false;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: phaseIndex * 0.15 }}
      className="relative"
    >
      {/* Phase connector line */}
      {phaseIndex > 0 && (
        <div className="absolute -top-8 left-8 w-px h-8 bg-gradient-to-b from-transparent via-primary/30 to-primary/50" />
      )}

      {/* Phase header */}
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Phase {phase.id}: {phase.title}
            </h3>
            {!recommended && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                Later
              </span>
            )}
            {isActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                Recommended
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-6 pl-6 border-l-2 ${
        isActive ? "border-primary/30" : "border-border/30"
      }`}>
        {phase.skills.map((skill, idx) => (
          <SkillNodeComponent
            key={skill.id}
            skill={skill}
            status={getStatus(skill.id, skill.prerequisites)}
            onClick={onSkillClick}
            index={idx}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PhaseCard;
