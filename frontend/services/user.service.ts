import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  // ✅ GUARANTEE STRUCTURE
  return {
    id: uid,
    onboardingCompleted: data.onboardingCompleted ?? false,
    diagnosticCompleted: data.diagnosticCompleted ?? false,
    resumeUploaded: data.resumeUploaded ?? false,

    goal: data.goal ?? null,
    skill: data.skill ?? null,
    declaredLevel: data.declaredLevel ?? null,
    actualLevel: data.actualLevel ?? null,
  };
};