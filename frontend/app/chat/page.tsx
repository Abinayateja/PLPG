"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Sparkles, Send, User, Bot, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkillVaultLoader from "@/components/SkillVaultLoader";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const Chat = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: skillsData } = await supabase
        .from("skill_profiles")
        .select("skill")
        .eq("user_id", user.id);

      if (skillsData) {
        const skillList = (skillsData as unknown as Array<{ skill: string }>).map((s) => s.skill);
        setSkills(skillList);
      }

      setInitialLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !profile) return;

    const userMsg = message;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, profile, skills }),
      });

      const data = await res.json();
      const lines = data.reply.split("\n").filter((l: string) => l.trim() !== "");

      let accumulated = "";
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      lines.forEach((line: string, index: number) => {
        setTimeout(() => {
          accumulated += (accumulated ? "\n" : "") + line;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "ai", content: accumulated };
            return copy;
          });
        }, index * 400);
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Could not connect to AI server. Please ensure the backend is running." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-radial-void">
        <SkillVaultLoader
          fullScreen
          size="lg"
          message="Setting up your AI Career Advisor..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-radial-void">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gradient text-lg">SkillVault AI</span>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {(profile as Record<string, unknown>)?.email as string || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(profile as Record<string, unknown>)?.goal as string || "Career Explorer"}
                </p>
              </div>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/resume")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Resume Analyzer
          </button>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col">
        <header className="border-b border-border px-6 py-4 bg-card/20 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-foreground">AI Career Advisor</h1>
          <p className="text-xs text-muted-foreground">Ask about career paths, skills, and learning roadmaps</p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Start a Conversation</h2>
              <p className="text-muted-foreground max-w-sm">
                Ask about career paths, skill gaps, or request a personalized learning roadmap.
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-5 py-3 ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground"
                        : "glass-card"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "ai" ? "font-mono-ai text-muted-foreground" : "text-foreground"}`}>
                      {msg.content}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="glass-card px-5 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 bg-card/20 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a career path..."
              className="input-dark flex-1"
            />
            <Button
              variant="glow"
              size="icon"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="h-12 w-12"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
