import { motion } from "framer-motion";
import { Check, Lock, Zap, BookOpen } from "lucide-react";
import type { SkillNode as SkillNodeType } from "@/data/roadmapData";

interface SkillNodeProps {
  skill: SkillNodeType;
  status: "completed" | "current" | "locked" | "available";
  onClick: (skill: SkillNodeType) => void;
  index: number;
}

const statusConfig = {
  completed: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_40px_hsl(var(--primary)/0.6)] scale-[1.03]",
    icon: <Check className="w-4 h-4 text-emerald-400" />,
    badge: "Completed",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  current: {
    border: "border-primary/60",
    bg: "bg-primary/10",
    glow: "shadow-[0_0_25px_hsl(var(--primary)/0.3)]",
    icon: <Zap className="w-4 h-4 text-primary" />,
    badge: "In Progress",
    badgeClass: "bg-primary/20 text-primary border-primary/30",
  },
  available: {
    border: "border-border hover:border-primary/40",
    bg: "bg-card/50",
    glow: "hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]",
    icon: <BookOpen className="w-4 h-4 text-muted-foreground" />,
    badge: "Available",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  locked: {
    border: "border-border/50",
    bg: "bg-card/30",
    glow: "",
    icon: <Lock className="w-4 h-4 text-muted-foreground/50" />,
    badge: "Locked",
    badgeClass: "bg-muted/50 text-muted-foreground/50 border-border/50",
  },
};

const SkillNodeComponent = ({ skill, status, onClick, index }: SkillNodeProps) => {
  const config = statusConfig[status];

  return (
    <motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.08 }}
  onClick={() => {
    if (status === "locked") return;
    onClick(skill);
  }}
  className={`relative w-full text-left rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 ${
    status === "locked"
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer group hover:scale-[1.02]"
  } ${config.border} ${config.bg} ${config.glow}`}
>
  {/* 🔒 LOCK OVERLAY */}
  {status === "locked" && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        Complete prerequisites
      </div>
    </div>
  )}

  {/* ✅ XP REWARD */}
  {status === "completed" && (
    <div className="absolute top-2 right-2 text-emerald-400 text-[10px]">
      +10 XP
    </div>
  )}

  {/* Status badge */}
  <div className="absolute -top-1.5 -right-1.5">
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${config.badgeClass}`}
    >
      {config.badge}
    </span>
  </div>

  {/* Content */}
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
      {config.icon}
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground truncate">
        {skill.label}
      </h4>

      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 group-hover:line-clamp-none transition-all">
        {skill.description}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full">
          ⏱ {skill.duration}
        </span>
      </div>
    </div>
  </div>
</motion.button>
  );
};

export default SkillNodeComponent;
