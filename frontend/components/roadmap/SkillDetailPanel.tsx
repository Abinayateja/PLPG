import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BookOpen, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkillNode } from "@/data/roadmapData";

interface SkillDetailPanelProps {
  skill: SkillNode | null;
  status: "completed" | "current" | "locked" | "available";
  onClose: () => void;
}

const SkillDetailPanel = ({ skill, status, onClose }: SkillDetailPanelProps) => {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{skill.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Status */}
            <div className={`rounded-lg p-3 mb-6 border ${
              status === "completed"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : status === "current"
                ? "bg-primary/10 border-primary/30"
                : "bg-muted/30 border-border"
            }`}>
              <div className="flex items-center gap-2">
                {status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-medium text-foreground capitalize">{status}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated: {skill.estimatedHours}h</span>
            </div>

            {/* Prerequisites */}
            {skill.prerequisites.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.prerequisites.map((prereq) => (
                    <span
                      key={prereq}
                      className="px-3 py-1 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {prereq.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                <BookOpen className="w-4 h-4 inline mr-1.5" />
                Learning Resources
              </h3>
              <div className="space-y-2">
                {((skill as any).resources || []).map((resource: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{resource}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            {status === "available" && (
              <Button variant="glow" className="w-full">
                Start Learning
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillDetailPanel;
