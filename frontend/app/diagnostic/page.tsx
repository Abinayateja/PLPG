"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Question {
  question: string;
  options: { label: string; correct: boolean }[];
}

// Fallback questions if backend is unavailable
const fallbackQuestions: Question[] = [
  {
    question: "Python list comprehension creates?",
    options: [
      { label: "New list", correct: true },
      { label: "Dictionary", correct: false },
      { label: "Tuple", correct: false },
      { label: "Set", correct: false },
    ],
  },
  {
    question: "What is regression in ML?",
    options: [
      { label: "Predict numerical value", correct: true },
      { label: "Classification task", correct: false },
      { label: "Clustering method", correct: false },
      { label: "Feature selection", correct: false },
    ],
  },
  {
    question: "What does CSS Flexbox primarily handle?",
    options: [
      { label: "One-dimensional layout", correct: true },
      { label: "Two-dimensional layout", correct: false },
      { label: "Animations", correct: false },
      { label: "Typography", correct: false },
    ],
  },
  {
    question: "What is the time complexity of binary search?",
    options: [
      { label: "O(log n)", correct: true },
      { label: "O(n)", correct: false },
      { label: "O(n²)", correct: false },
      { label: "O(1)", correct: false },
    ],
  },
  {
    question: "Which protocol does REST API typically use?",
    options: [
      { label: "HTTP", correct: true },
      { label: "FTP", correct: false },
      { label: "SMTP", correct: false },
      { label: "WebSocket", correct: false },
    ],
  },
];

const Diagnostic = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [skill, setSkill] = useState("python");
  const [saving, setSaving] = useState(false);

  // Fetch questions from backend or use fallback
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("goal")
            .eq("id", user.id)
            .single();

          const skillMap: Record<string, string> = {
            "AI Engineer": "machine learning",
            "Data Scientist": "data science",
            "Web Developer": "javascript",
            "Mobile Developer": "flutter",
            "DevOps Engineer": "devops",
            "Cybersecurity": "cybersecurity",
          };

          const selectedSkill = skillMap[profile?.goal] || "python";
          setSkill(selectedSkill);

          try {
            const res = await fetch(
              `http://localhost:8000/diagnostic/generate/${selectedSkill}`
            );
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
              setQuestions(data.questions);
              setLoadingQuestions(false);
              return;
            }
          } catch {
            // Backend unavailable, use fallback
          }
        }
      } catch {
        // Auth error, use fallback
      }

      setQuestions(fallbackQuestions);
      setLoadingQuestions(false);
    };

    fetchQuestions();
  }, []);

  if (loadingQuestions) {
    return (
      <div className="relative min-h-screen bg-radial-void overflow-hidden">
        <ParticlesBackground />
        <SkillVaultLoader
          fullScreen
          size="lg"
          message="Generating your personalized diagnostic questions..."
        />
      </div>
    );
  }

  const totalQ = questions.length;
  const progress = ((currentQ + 1) / totalQ) * 100;
  const question = questions[currentQ];

  const selectAnswer = (index: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ]: index }));
  };

  const goBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ(currentQ - 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < totalQ - 1) {
      setDirection(1);
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, aIdx]) => {
    return acc + (questions[Number(qIdx)].options[aIdx].correct ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / totalQ) * 100);
  const level =
    percentage >= 70 ? "Advanced" : percentage >= 40 ? "Intermediate" : "Beginner";

  const handleFinish = async () => {
    setSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (user) {
        await supabase.from("skill_profiles").insert({
          user_id: user.id,
          skill: skill,
          level: level.toLowerCase(),
          score: score,
        });
      }
    } catch (err) {
      console.error("Save error", err);
    }

    localStorage.setItem("diagnostic_score", score.toString());
    localStorage.setItem("diagnostic_level", level.toLowerCase());
    router.push("/resume");
  };

  // Results screen
  if (showResults) {
    if (saving) {
      return (
        <div className="relative min-h-screen bg-radial-void overflow-hidden">
          <ParticlesBackground />
          <SkillVaultLoader
            fullScreen
            size="lg"
            message="Saving your results..."
          />
        </div>
      );
    }

    return (
      <div className="relative min-h-screen flex flex-col bg-radial-void overflow-hidden">
        <ParticlesBackground />
        <div className="flex-1 flex items-center justify-center z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4"
              >
                <Trophy className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Diagnostic Complete!
              </h2>
              <p className="text-muted-foreground">Here's how you performed</p>
            </div>

            <div className="glass-card glow-border p-8 mb-6">
              <div className="grid grid-cols-3 gap-6 text-center mb-8">
                {[
                  {
                    icon: <Target className="w-5 h-5 text-primary" />,
                    value: `${score}/${totalQ}`,
                    label: "Correct",
                  },
                  {
                    icon: <BarChart3 className="w-5 h-5 text-secondary" />,
                    value: `${percentage}%`,
                    label: "Accuracy",
                  },
                  {
                    icon: <Trophy className="w-5 h-5 text-primary" />,
                    value: level,
                    label: "Level",
                    gradient: true,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {stat.icon}
                    </div>
                    <p
                      className={`text-3xl font-bold ${
                        stat.gradient ? "text-gradient" : "text-foreground"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Question Breakdown
                </h3>
                {questions.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[qIdx];
                  const isCorrect =
                    userAnswer !== undefined && q.options[userAnswer].correct;
                  return (
                    <motion.div
                      key={qIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + qIdx * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isCorrect
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {q.question}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Correct: {q.options.find((o) => o.correct)?.label}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Button
              variant="glow"
              size="lg"
              onClick={handleFinish}
              className="w-full"
            >
              Continue to Resume Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-radial-void overflow-hidden">
      <ParticlesBackground />

      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-secondary"
            style={{ boxShadow: "0 0 10px hsl(var(--secondary) / 0.5)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-gradient font-semibold">Diagnostic</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentQ + 1} / {totalQ}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center z-10 px-6 pt-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-xl"
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">
              {question.question}
            </h2>

            <div className="grid gap-3">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswers[currentQ] === i;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectAnswer(i)}
                    className={`w-full p-5 rounded-xl text-left transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "glass-card glow-border-active"
                        : "glass-card-hover"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm text-muted-foreground font-mono">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-foreground font-medium flex-1">
                      {opt.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              {currentQ > 0 ? (
                <Button
                  variant="glow-outline"
                  size="lg"
                  onClick={goBack}
                  className="min-w-[120px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="glow"
                size="lg"
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQ] === undefined}
              >
                {currentQ === totalQ - 1 ? "View Results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Diagnostic;
