"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

import {
  Sparkles,
  Upload,
  FileText,
  SkipForward,
} from "lucide-react";

export default function Resume() {

  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
  if (!file) return;

  setLoading(true);

  try {
    const user = auth.currentUser;

    if (!user) {
      setResult("User not authenticated");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const formData = new FormData();
    formData.append("file", file);

    

const snap = await getDoc(userRef);
const userData = snap.data();

const goal = userData?.goal || "AI Engineer";

    const res = await fetch(
      `http://127.0.0.1:8000/resume/analyze/${goal}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // 🔥 SAVE TO FIRESTORE (CORE CHANGE)
    await updateDoc(userRef, {
  resumeAnalysis: data.analysis || "",
  resumeSkills: data.skills || [],
  resumeMissingSkills: data.missing_skills || [],
  resumeUploaded: true,
});

    setResult(
  data.analysis ||
  "✅ Resume analyzed. Personalized roadmap generated."
);

    setLoading(false);

    setTimeout(() => {
      router.push("/roadmap");
    }, 1500);

  } catch (error) {
    console.error(error);

    setResult("⚠️ Error analyzing resume");

    setLoading(false);

    setTimeout(() => {
  router.push("/roadmap?source=resume");
}, 1500);
  }
};

  const skipResume = () => {
    router.push("/roadmap");
  };

  if (loading) {

    return (
      <div className="relative min-h-screen bg-radial-void overflow-hidden">

        <ParticlesBackground />

        <SkillVaultLoader
          fullScreen
          size="lg"
          message="Analyzing your resume with AI..."
        />

      </div>
    );

  }

  return (

    <div className="relative min-h-screen flex flex-col items-center justify-center bg-radial-void overflow-hidden px-6">

      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-xl"
      >

        {/* Header */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 mb-3">

            <Sparkles className="w-5 h-5 text-primary" />

            <span className="text-gradient font-semibold">
              Resume Analyzer
            </span>

          </div>

          <h1 className="text-3xl font-bold text-foreground">
            Analyze Your Resume
          </h1>

          <p className="text-muted-foreground mt-2">
            Upload your resume for AI-powered skill gap analysis, or skip if you don't have one yet
          </p>

        </div>

        {/* Upload Card */}

        <div className="glass-card glow-border p-8">

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 cursor-pointer hover:border-primary/40 transition-colors">

            <Upload className="w-10 h-10 text-muted-foreground mb-3" />

            <span className="text-sm text-muted-foreground">

              {file
                ? file.name
                : "Click to upload your resume (PDF)"
              }

            </span>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

          </label>

          <Button
            variant="glow"
            size="lg"
            className="w-full mt-6"
            onClick={uploadResume}
            disabled={!file}
          >

            Analyze Resume

          </Button>

          {/* Divider */}

          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-border" />

            </div>

            <div className="relative flex justify-center">

              <span className="px-4 text-sm text-muted-foreground bg-card/80 rounded">
                or
              </span>

            </div>

          </div>

          <Button
            variant="glow-outline"
            size="lg"
            className="w-full"
            onClick={skipResume}
          >

            <SkipForward className="w-4 h-4 mr-2" />

            Skip for now — I'll do this later

          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">

            Don't worry! You can always upload your resume later from the dashboard.

          </p>

        </div>

        {/* Result Panel */}

        {result && (

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card p-6"
          >

            <div className="flex items-center gap-2 mb-4">

              <FileText className="w-5 h-5 text-primary" />

              <span className="font-semibold text-foreground">
                Analysis Result
              </span>

            </div>

            <p className="font-mono-ai text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">

              {result}

            </p>

          </motion.div>

        )}

      </motion.div>

    </div>

  );

}