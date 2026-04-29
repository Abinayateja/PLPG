"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import SkillVaultLoader from "@/components/SkillVaultLoader";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <SkillVaultLoader
        fullScreen
        size="lg"
        message="Checking authentication..."
      />
    );
  }

  if (!user) {
    return (
      <SkillVaultLoader
        fullScreen
        size="lg"
        message="Redirecting..."
      />
    );
  }

  return children;
}