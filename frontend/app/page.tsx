"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserFlow } from "@/context/UserFlowContext";

import Landing from "@/app/landing/page";
import Onboarding from "@/app/onboarding/page";
import Diagnostic from "@/app/diagnostic/page";
import Resume from "@/app/resume/page";
import Roadmap from "@/app/roadmap/page";

export default function Home() {
  const { user, loading } = useAuth();
  const { stage, flowLoading } = useUserFlow(); // ✅ INSIDE component

  if (loading || flowLoading) return null;

  if (!user) return <Landing />;

  if (stage === "ONBOARDING") return <Onboarding />;
  if (stage === "DIAGNOSTIC") return <Diagnostic />;
  if (stage === "RESUME") return <Resume />;

  return <Roadmap />;
}