"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserProfile } from "@/services/user.service";
import { UserProfile, UserStage } from "@/types/user";

type FlowContextType = {
  profile: UserProfile | null;
  stage: UserStage;
  refresh: () => Promise<void>;
  flowLoading: boolean;
};

const FlowContext = createContext<FlowContextType | null>(null);

const resolveStage = (user: UserProfile): UserStage => {
  if (!user.onboardingCompleted) return "ONBOARDING";
  if (!user.diagnosticCompleted) return "DIAGNOSTIC";
  if (!user.resumeUploaded) return "RESUME";
  return "READY";
};

export const UserFlowProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stage, setStage] = useState<UserStage>("ONBOARDING");
  const [flowLoading, setFlowLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setFlowLoading(false);
      return;
    }

    try {
      const data = await getUserProfile(user.uid);

      if (data) {
        setProfile(data);
        setStage(resolveStage(data));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }

    setFlowLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      refresh();
    }
  }, [user, loading]);

  return (
    <FlowContext.Provider value={{ profile, stage, refresh, flowLoading }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useUserFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useUserFlow must be used inside UserFlowProvider");
  }
  return context;
};