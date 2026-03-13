"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-radial-void overflow-hidden">
      <ParticlesBackground />

      <div className="z-10 text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 glass-card text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Career Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          <span className="text-gradient neon-text-cyan">SkillVault</span>{" "}
          <span className="text-foreground">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Discover your ideal career path using artificial intelligence.
          Analyze skills, detect gaps, and generate a personalized learning roadmap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={() => router.push("/login")}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="glow-outline"
            size="lg"
            onClick={() => router.push("/chat")}
          >
            Try AI Demo
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default Landing;