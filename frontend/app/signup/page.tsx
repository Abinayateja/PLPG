"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword,onAuthStateChanged,signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Sparkles, Mail, Lock, ShieldCheck } from "lucide-react";

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

 const signup = async () => {
  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      onboardingCompleted: false,
      diagnosticCompleted: false,
      resumeUploaded: false,
      roadmapGenerated: false,
      skill: null,
      declaredLevel: null,
      actualLevel: null,
      createdAt: new Date(),
    });
    router.replace("/");
  } catch (error: any) {
    alert(error.message);
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial-void overflow-hidden">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 glass-card glow-border"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-gradient">
              SkillVault AI
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            Create Account
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Start your AI career journey
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark pl-10 cursor-pointer focus:cursor-text"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark pl-10 cursor-pointer focus:cursor-text"
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-dark pl-10 cursor-pointer focus:cursor-text"
            />
          </div>

          <Button
  variant="glow"
  className="w-full"
  size="lg"
  onClick={signup}
  disabled={loading}
>
  {loading ? "Creating..." : "Create Account"}
</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;