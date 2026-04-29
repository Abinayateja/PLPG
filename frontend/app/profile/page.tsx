"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ParticlesBackground from "@/components/ParticlesBackground";
import SkillVaultLoader from "@/components/SkillVaultLoader";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUserFlow } from "@/context/UserFlowContext";


import {
  ArrowLeft,
  Camera,
  Save,
  Moon,
  Sun,
  RefreshCw,
  User,
  Mail,
  Target,
  GraduationCap,
  Clock,
  Compass,
  Calendar,
  Code2,
  LogOut,
  CheckCircle2,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  goal?: string;
  education?: string;
  year?: string;
  skill_level?: string;
  time_available?: string;
  purpose?: string;
}

const GOAL_OPTIONS = [
  { label: "AI Engineer", value: "AI Engineer", icon: "🤖" },
  { label: "Data Scientist", value: "Data Scientist", icon: "📊" },
  { label: "Web Developer", value: "Web Developer", icon: "🌐" },
  { label: "Mobile Developer", value: "Mobile Developer", icon: "📱" },
  { label: "DevOps Engineer", value: "DevOps Engineer", icon: "⚙️" },
  { label: "Cybersecurity", value: "Cybersecurity", icon: "🔒" },
];

const EDUCATION_OPTIONS = [
  { label: "BTech / BE", value: "BTech" },
  { label: "MTech / ME", value: "MTech" },
  { label: "BCA / BCS", value: "BCA" },
  { label: "MCA", value: "MCA" },
  { label: "Intermediate / 12th", value: "Intermediate" },
  { label: "Self-taught / Other", value: "Self-taught" },
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const SKILL_LEVELS = [
  { label: "Beginner", value: "beginner", icon: "🌱" },
  { label: "Some Basics", value: "basic", icon: "📖" },
  { label: "Intermediate", value: "intermediate", icon: "⚡" },
  { label: "Advanced", value: "advanced", icon: "🚀" },
];

const TIME_OPTIONS = ["5 hours", "10 hours", "20 hours", "20+ hours"];

const PURPOSE_OPTIONS = [
  "Find my career path",
  "Improve my skills",
  "Switch career",
  "Prepare for interviews",
];

const educationsWithYears = ["BTech", "MTech", "BCA", "MCA"];

export default function Profile() {
  
const { refresh } = useUserFlow();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [goal, setGoal] = useState("");
  const [education, setEducation] = useState("");
  const [year, setYear] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [purpose, setPurpose] = useState("");

  const [editingPreferences, setEditingPreferences] = useState(false);

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;

    setIsDark(dark);

    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  const { user } = useAuth();

useEffect(() => {
  if (!user) {
  setLoading(false);
  return;
}

  const fetchProfile = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();

    const p: ProfileData = {
      id: user.uid,
      email: user.email || "",
      full_name: data?.full_name || "",
      avatar_url: data?.avatar_url || "",
      goal: data?.goal || "",
      education: data?.education || "",
      year: data?.year || "",
      skill_level: data?.skill_level || "",
      time_available: data?.time_available || "",
      purpose: data?.purpose || "",
    };

    setProfile(p);
    setFullName(p.full_name || "");
    setAvatarPreview(p.avatar_url || null);

    setGoal(p.goal || "");
    setEducation(p.education || "");
    setYear(p.year || "");
    setSkillLevel(p.skill_level || "");
    setTimeAvailable(p.time_available || "");
    setPurpose(p.purpose || "");

    setLoading(false);
  };

  fetchProfile();
}, [user]);

  const toggleTheme = () => {
    const newDark = !isDark;

    setIsDark(newDark);

    localStorage.setItem("theme", newDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark", newDark);
    document.documentElement.classList.toggle("light", !newDark);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onloadend = () => setAvatarPreview(reader.result as string);

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    let avatar_url = profile.avatar_url || "";

    if (avatarFile) avatar_url = avatarPreview || "";
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
  full_name: fullName,
  avatar_url,
  goal,
  education,
  year: educationsWithYears.includes(education) ? year : null,
  skill_level: skillLevel,
  time_available: timeAvailable,
  purpose,
});
await refresh(); // 🔥 sync system

    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    await signOut(auth);
router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkillVaultLoader fullScreen size="lg" message="Loading profile..." />
      </div>
    );
  }

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() || "U";

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen">

      <ParticlesBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <h1 className="text-xl font-bold">
            Profile & Settings
          </h1>

          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>

        </div>

        {/* Avatar */}

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          className="glass-card p-6 mb-6"
        >

          <div className="flex gap-6">

            <div className="relative group">

              <Avatar className="w-20 h-20">

                {avatarPreview && <AvatarImage src={avatarPreview} />}

                <AvatarFallback>{initials}</AvatarFallback>

              </Avatar>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Camera />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleAvatarChange}
              />

            </div>

            <div className="flex-1">

              <Label>Full Name</Label>

              <Input
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
              />

              <div className="text-sm text-muted-foreground mt-2 flex gap-2 items-center">
                <Mail className="w-4 h-4"/>
                {profile?.email}
              </div>

            </div>

          </div>

        </motion.div>

        {/* Save */}

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving}
        >

          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2"/> Saved
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2"/> Save Changes
            </>
          )}

        </Button>

      </div>
    </div>
    </ProtectedRoute>
  );
}