"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useUserFlow } from "@/context/UserFlowContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  BarChart3,
} from "lucide-react";


export default function Diagnostic() {
  const router = useRouter();
  const { user } = useAuth();
const { refresh } = useUserFlow();
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [skill, setSkill] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const TOTAL_QUESTIONS = 5;

  // 🚀 START
useEffect(() => {
  if (!user) return;

  const init = async () => {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const profile = snap.data();

      if (!profile?.goal) throw new Error("User goal missing");

      const skillMap: Record<string, string> = {
        "AI Engineer": "machine learning",
        "Data Scientist": "machine learning",
        "Web Developer": "javascript",
        "Mobile Developer": "javascript",
        "DevOps Engineer": "devops",
        "Cybersecurity": "devops",
      };

      const selectedSkill = skillMap[profile.goal];
      setSkill(selectedSkill);

      const res = await fetch(
  `http://localhost:8000/diagnostic/start/${selectedSkill}`
);

const data = await res.json();
setQuestions(data.questions);
setCurrentQuestion(data.questions[0]);
setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  init();
}, [user]);

  // ✅ SELECT
  const selectAnswer = (index: number) => {
    setSelectedIndex(index);
  };

  // 🚀 NEXT
  const nextQuestion = () => {
  if (selectedIndex === null) return;

  const selectedAnswer = currentQuestion.options[selectedIndex];

  if (selectedAnswer === currentQuestion.answer) {
    setScore((prev) => prev + 1);
  }

  const nextStep = step + 1;
  setSelectedIndex(null);
  setStep(nextStep);

  if (nextStep >= TOTAL_QUESTIONS) {
    setShowResults(true);
  } else {
    setCurrentQuestion(questions[nextStep]);
  }
};

  const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);

  const level =
    percentage >= 70
      ? "Advanced"
      : percentage >= 40
      ? "Intermediate"
      : "Beginner";

  // ✅ SAVE
  const handleFinish = async () => {
  setSaving(true);

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      skill: skill,
      actualLevel: level.toLowerCase(),
      diagnosticCompleted: true,
      score: score,
    });

    // 🔥 SKILL GAP CALL
    try {
      const res = await fetch(
        `http://localhost:8000/skill-gap/${user.uid}`
      );

      const gapData = await res.json();

      await setDoc(doc(db, "users", user.uid), {
  roadmap: gapData,
}, { merge: true });
    } catch (err) {
      console.error("Skill gap failed:", err);
    }

  } catch (err) {
    console.error("❌ Finish failed:", err);
  }

  await refresh();
router.replace("/");
};

  // LOADING
  if (loading) {
    return (
     <ProtectedRoute>
      <div className="relative min-h-screen bg-radial-void overflow-hidden">
        <ParticlesBackground />
        <SkillVaultLoader fullScreen size="lg" message="Generating..." />
      </div>
      </ProtectedRoute>
    );
  }

  // RESULTS
  if (showResults) {
    if (saving) {
      return (
        <ProtectedRoute>
        <div className="relative min-h-screen bg-radial-void overflow-hidden">
          <ParticlesBackground />
          <SkillVaultLoader fullScreen size="lg" message="Saving..." />
        </div>
        </ProtectedRoute> 
      );
    }

    return (
      <ProtectedRoute>
      
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticlesBackground />

        <div className="text-center">
          <Trophy className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Diagnostic Complete</h2>
          <p>Your Level: {level}</p>

          <div className="grid grid-cols-3 gap-4 my-6">
            <div>
              <Target />
              <p>{score}/5</p>
            </div>
            <div>
              <BarChart3 />
              <p>{percentage}%</p>
            </div>
            <div>
              <Trophy />
              <p>{level}</p>
            </div>
          </div>
          <Button onClick={handleFinish}>
            Continue <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
      </ProtectedRoute> 
    );
  }
  // UI (UNCHANGED STYLE)
  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-radial-void overflow-hidden">
      <ParticlesBackground />

      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-secondary"
            animate={{ width: `${((step + 1) / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-xl w-full"
          >
            <h2 className="text-3xl font-bold text-center mb-10">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3">
              {currentQuestion.options.map((opt: string, i: number) => {
                const isSelected = selectedIndex === i;

                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`p-5 rounded-xl text-left ${
                      isSelected
                        ? "glass-card glow-border-active"
                        : "glass-card-hover"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={nextQuestion}
                disabled={selectedIndex === null}
              >
                {step === TOTAL_QUESTIONS - 1 ? "View Results" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </ProtectedRoute> 
  );
}