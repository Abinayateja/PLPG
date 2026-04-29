"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

interface DiagnosticResult {
  score: number;
  level: string;
  skill: string;
}

interface ResumeAnalysis {
  skills_found: string[];
  missing_skills: string[];
}

export default function Results() {
  const router = useRouter();
  const { user } = useAuth(); // ✅ FIXED

  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true); // ✅ better UX

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          setLoading(false);
          return;
        }

        const data = snap.data();

        setDiagnostic({
          score: data.score ?? 0,
          level: data.actualLevel ?? "beginner",
          skill: data.goal ?? "AI Engineer",
        });

        // localStorage safe parsing
        const r = localStorage.getItem("resume_analysis");
        if (r) {
          try {
            setAnalysis(JSON.parse(r));
          } catch {
            console.error("Invalid JSON in localStorage");
          }
        }

      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  // 🔥 Loading state (proper handling)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading results...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-6">

        <h1 className="text-4xl font-bold">
          SkillVault Analysis
        </h1>

        {diagnostic && (
          <div className="text-xl space-y-2">
            <p>
              Diagnostic Score:{" "}
              <span className="font-bold">
                {diagnostic.score}
              </span>
            </p>

            <p>
              Skill Level:{" "}
              <span className="font-bold capitalize">
                {diagnostic.level}
              </span>
            </p>
          </div>
        )}

        {analysis ? (
          <div className="grid md:grid-cols-2 gap-8 mt-6 text-left max-w-3xl">

            <div>
              <h2 className="text-xl font-semibold mb-2">
                Skills Detected
              </h2>

              <ul className="space-y-1">
                {analysis.skills_found.map((skill, i) => (
                  <li key={i}>✔ {skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                Skills to Learn
              </h2>

              <ul className="space-y-1">
                {analysis.missing_skills.map((skill, i) => (
                  <li key={i}>⚡ {skill}</li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <p className="text-muted-foreground">
            Resume analysis not available yet.
          </p>
        )}

        <button
          onClick={() => router.push("/chat")}
          className="mt-6 px-6 py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600"
        >
          Open AI Career Mentor
        </button>

      </div>
    </ProtectedRoute>
  );
}