"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import {
  Sparkles,
  ArrowLeft,
  Map,
  MessageSquare,
  FileText,
  User,
  GraduationCap,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import PhaseCard from "@/components/roadmap/PhaseCard";
import SkillDetailPanel from "@/components/roadmap/SkillDetailPanel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  getFilteredRoadmap,
  type SkillNode,
  type GoalRoadmap,
} from "@/data/roadmapData";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth } from "@/lib/firebase";


const RoadmapContent  = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [diagnosticLevel, setDiagnosticLevel] = useState("");
  const [roadmap, setRoadmap] = useState<GoalRoadmap | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [gapData, setGapData] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  

  const fetchData = async (user: any) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const data = snap.data();
  if (!data) return;

  // PROFILE
  setProfile(data);

  // SKILLS
  const skills = data.skills || [];
  setUserSkills(skills);

  // LEVEL
  setDiagnosticLevel(data.actualLevel || "");

  // GAP
  const gap =
  data.resumeMissingSkills ||
  data.roadmap?.missing_skills ||
  [];
  setGapData(gap);

  // ROADMAP
  const goal = data.goal || "AI Engineer";
  const year = data.year || "";

  const filtered = getFilteredRoadmap(goal, year, data.actualLevel);
  setRoadmap(filtered);

  setLoading(false);
};
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (!user) {
  return;
}

    fetchData(user);
  });

  return () => unsubscribe();
}, []);


  const getStatus = (skillId: string, prerequisites: string[]) => {
  const normalized = skillId.toLowerCase().replace(/-/g, " ");

  const user = userSkills.map((s) => s.toLowerCase());
  const gap = gapData.map((g) => g.toLowerCase());

  // ✅ Completed
  if (user.includes(normalized)) return "completed";

  // 🔒 Check prerequisites
  const allDone = prerequisites.every((p) =>
    user.includes(p.toLowerCase())
  );

  if (!allDone) return "locked";

  // 🎯 AI recommended
  if (gap.includes(normalized)) return "current";

  return "available";
};

  const handleSkillClick = async (skill: SkillNode) => {
  router.push(`/skill/${encodeURIComponent(skill.id)}`);
  }

  const getActivePhaseId = (): number => {
    if (!profile) return 1;

    const year = (profile as Record<string, unknown>)?.year as string;
    if (!year) return 1;

    const y = parseInt(year);

    if (y <= 1) return 1;
    if (y === 2) return 2;
    if (y === 3) return 3;

    return 4;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-radial-void">
        <SkillVaultLoader
          fullScreen
          size="lg"
          message="Building your personalized roadmap..."
        />
      </div>
    );
  }

  if (!roadmap) return null;

  const goal =
    (profile as Record<string, unknown>)?.goal as string || "AI Engineer";
  const education =
    (profile as Record<string, unknown>)?.education as string || "";
  const year =
    (profile as Record<string, unknown>)?.year as string || "";

  const activePhase = getActivePhaseId();

  const totalSkills = roadmap.phases.reduce(
    (acc, p) => acc + p.skills.length,
    0
  );

  const completedSkills = roadmap.phases
    .flatMap((p) => p.skills)
    .filter((s) => getStatus(s.id, s.prerequisites) === "completed").length;

  const progressPercent =
    totalSkills > 0
      ? Math.round((completedSkills / totalSkills) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-radial-void">

      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg hidden sm:inline">
                SkillVault AI
              </span>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/chat")}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">AI Mentor</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/resume")}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Resume</span>
            </Button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <h1 className="text-3xl font-bold mb-4">
          {roadmap.title}
        </h1>

        <p className="text-muted-foreground mb-6">
          {roadmap.subtitle}
        </p>
        <div className="glass-card p-4 mb-6 flex justify-between items-center">
  <div>
    <p className="text-xs text-muted-foreground">Level</p>
    <p className="text-lg font-bold text-primary">
      {(profile as any)?.level || 1}
    </p>
  </div>

  <div className="text-right">
    <p className="text-xs text-muted-foreground">XP</p>
    <p className="text-lg font-bold text-emerald-400">
      {(profile as any)?.xp || 0} XP
    </p>
  </div>
</div>


        {/* Progress */}
        <div className="glass-card p-4 mb-10">

          <div className="flex justify-between mb-2">
            <span>Overall Progress</span>
            <span>
              {completedSkills}/{totalSkills} • {progressPercent}%
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>

        </div>

        {/* Phases */}
        <div className="space-y-10">

          {roadmap.phases.map((phase, idx) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              phaseIndex={idx}
              getStatus={getStatus}
              onSkillClick={handleSkillClick}
              isActive={phase.id === activePhase}
            />
          ))}

        </div>

      </main>

      <SkillDetailPanel
        skill={selectedSkill}
        status={
  selectedSkill
    ? getStatus(selectedSkill.id, selectedSkill.prerequisites)
    : "available"
}
        onClose={() => setSelectedSkill(null)}
      />

    </div>
  );
};

export default function RoadmapPage() {
  return (
    <ProtectedRoute>
      <RoadmapContent />
    </ProtectedRoute>
  );
}