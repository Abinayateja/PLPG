"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  GraduationCap,
  Clock,
  Compass,
  Calendar,
  Code2,
} from "lucide-react";

interface StepOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

interface Step {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  key: string;
  options: StepOption[];
}

const baseSteps: Step[] = [
  {
    title: "What is your career goal?",
    subtitle: "Choose the path that excites you most",
    icon: <Target className="w-5 h-5" />,
    key: "goal",
    options: [
      { label: "AI Engineer", value: "AI Engineer", icon: "🤖", description: "Build intelligent systems & ML models" },
      { label: "Data Scientist", value: "Data Scientist", icon: "📊", description: "Analyze data & extract insights" },
      { label: "Web Developer", value: "Web Developer", icon: "🌐", description: "Create modern web applications" },
      { label: "Mobile Developer", value: "Mobile Developer", icon: "📱", description: "Build iOS & Android apps" },
      { label: "DevOps Engineer", value: "DevOps Engineer", icon: "⚙️", description: "Automate infrastructure & CI/CD" },
      { label: "Cybersecurity", value: "Cybersecurity", icon: "🔒", description: "Secure systems & prevent threats" },
    ],
  },
  {
    title: "Highest Education Level",
    subtitle: "Your academic background helps us personalize your path",
    icon: <GraduationCap className="w-5 h-5" />,
    key: "education",
    options: [
      { label: "BTech / BE", value: "BTech", icon: "🎓" },
      { label: "MTech / ME", value: "MTech", icon: "🎓" },
      { label: "BCA / BCS", value: "BCA", icon: "💻" },
      { label: "MCA", value: "MCA", icon: "💻" },
      { label: "Intermediate / 12th", value: "Intermediate", icon: "📚" },
      { label: "Self-taught / Other", value: "Self-taught", icon: "🧠" },
    ],
  },
  {
    title: "What year are you in?",
    subtitle: "This helps us recommend the right focus areas",
    icon: <Calendar className="w-5 h-5" />,
    key: "year",
    options: [
      { label: "1st Year", value: "1st Year", icon: "1️⃣" },
      { label: "2nd Year", value: "2nd Year", icon: "2️⃣" },
      { label: "3rd Year", value: "3rd Year", icon: "3️⃣" },
      { label: "4th Year", value: "4th Year", icon: "4️⃣" },
    ],
  },
  {
    title: "Rate your current skill level",
    subtitle: "Be honest — we adapt the roadmap",
    icon: <Code2 className="w-5 h-5" />,
    key: "skill_level",
    options: [
      { label: "Complete Beginner", value: "beginner", icon: "🌱" },
      { label: "Some Basics", value: "basic", icon: "📖" },
      { label: "Intermediate", value: "intermediate", icon: "⚡" },
      { label: "Advanced", value: "advanced", icon: "🚀" },
    ],
  },
  {
    title: "How much time per week?",
    subtitle: "We'll adapt the roadmap to your pace",
    icon: <Clock className="w-5 h-5" />,
    key: "time",
    options: [
      { label: "Less than 5 hours", value: "5 hours", icon: "⚡" },
      { label: "5–10 hours", value: "10 hours", icon: "🔥" },
      { label: "10–20 hours", value: "20 hours", icon: "🚀" },
      { label: "20+ hours", value: "20+ hours", icon: "💪" },
    ],
  },
  {
    title: "Why are you using SkillVault?",
    subtitle: "Help us understand your motivation",
    icon: <Compass className="w-5 h-5" />,
    key: "purpose",
    options: [
      { label: "Find my career path", value: "Find my career path", icon: "🧭" },
      { label: "Improve my skills", value: "Improve my skills", icon: "📈" },
      { label: "Switch career", value: "Switch career", icon: "🔄" },
      { label: "Prepare for interviews", value: "Prepare for interviews", icon: "💼" },
    ],
  },
];

const educationsWithYears = ["BTech", "MTech", "BCA", "MCA"];

const Onboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const steps: Step[] = baseSteps.filter((step) => {
    if (step.key === "year") {
      return educationsWithYears.includes(answers.education || "");
    }
    return true;
  });

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const selectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const next = async () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          goal: answers.goal,
          education: answers.education,
          year: answers.year || null,
          skill_level: answers.skill_level,
          time_available: answers.time,
          purpose: answers.purpose,
        });
      }

      localStorage.setItem("userProfile", JSON.stringify(answers));

      router.push("/diagnostic");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-radial-void overflow-hidden">
        <ParticlesBackground />
        <SkillVaultLoader
          fullScreen
          size="lg"
          message="Personalizing your experience..."
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-radial-void overflow-hidden">
      <ParticlesBackground />

      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center z-10 px-6 pt-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.key}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            className="w-full max-w-xl"
          >
            <h2 className="text-3xl font-bold text-center mb-6">
              {step.title}
            </h2>

            <div className="grid gap-3">
  {step.options.map((option) => (
    <button
      key={option.value}
      onClick={() => selectOption(option.value)}
      className={`w-full p-5 rounded-xl text-left flex items-center gap-4 transition-all duration-300 ${
        answers[step.key] === option.value
          ? "glass-card glow-border-active"
          : "glass-card-hover hover:scale-[1.02]"
      }`}
    >
      <span className="text-xl">{option.icon}</span>
      <span className="text-foreground font-medium">{option.label}</span>
    </button>
  ))}
</div>

            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <Button onClick={goBack}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              )}

              <Button
                onClick={next}
                disabled={!answers[step.key]}
              >
                {currentStep === totalSteps - 1 ? "Finish" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;