"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {

    const fetchResults = async () => {

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      /* Fetch latest diagnostic result */

      const { data: diagnosticData } = await supabase
        .from("skill_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosticData) {
        setDiagnostic({
          score: diagnosticData.score,
          level: diagnosticData.level,
          skill: diagnosticData.skill
        });
      }

      /* Resume analysis still uses localStorage (until you move it to Supabase) */

      const r = localStorage.getItem("resume_analysis");

      if (r) {
        setAnalysis(JSON.parse(r));
      }

    };

    fetchResults();

  }, []);

  if (!diagnostic) {

    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading results...
      </div>
    );

  }

  return (

    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-6">

      <h1 className="text-4xl font-bold">
        SkillVault Analysis
      </h1>

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

  );

}