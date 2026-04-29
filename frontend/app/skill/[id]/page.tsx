"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, YoutubeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import skillContent from "@/data/skill_content.json";

export default function SkillPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const key = decodeURIComponent(id as string);
    const data = (skillContent as Record<string, any>)[key];
    setSkill(data || null);
  }, [id]);

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading or Skill not found...</p>
      </div>
    );
  }

  const ytQuery = encodeURIComponent(
    skill.youtube_query || skill.label || id
  );

  return (
    <div className="relative min-h-screen bg-radial-void">
      <ParticlesBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">

        {/* ✅ FIXED BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => router.push("/roadmap")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h1 className="text-3xl font-bold mb-2">
            {skill.label || skill.title || id}
          </h1>

          <p className="text-muted-foreground mb-6">
            {skill.description}
          </p>

          {/* Meta */}
          <div className="flex gap-4 mb-8 text-sm text-muted-foreground">
            {skill.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {skill.estimated_hours}h
              </span>
            )}
            {skill.difficulty && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {skill.difficulty}
              </span>
            )}
          </div>

          {/* 🔥 TOPICS FIXED */}
          {skill.topics?.length > 0 && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Topics</h2>

              <div className="space-y-3">
                {skill.topics.map((t: any, i: number) => (
                  <div key={i} className="p-3 border rounded-lg">

                    <div className="font-semibold">
                      {typeof t === "string" ? t : t.title}
                    </div>

                    {typeof t !== "string" && t.description && (
                      <p className="text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    )}

                    {typeof t !== "string" && t.estimatedMinutes && (
                      <p className="text-xs text-muted-foreground">
                        ⏱ {t.estimatedMinutes} mins
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔥 RESOURCES SAFE */}
          {skill.resources?.length > 0 && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Resources</h2>

              <div className="space-y-2">
                {skill.resources.map((r: any, i: number) => (
                  <a
                    key={i}
                    href={typeof r === "string" ? r : r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-primary hover:underline"
                  >
                    {typeof r === "string" ? r : r.title || r.url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* YouTube */}
          <a
            href={`https://www.youtube.com/results?search_query=${ytQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button className="w-full mt-4 gap-2">
              <YoutubeIcon className="w-5 h-5" />
              Watch Tutorials
            </Button>
          </a>

        </motion.div>
      </div>
    </div>
  );
}