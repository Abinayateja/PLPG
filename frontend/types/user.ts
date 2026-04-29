export type UserStage =
  | "ONBOARDING"
  | "DIAGNOSTIC"
  | "RESUME"
  | "READY";

export interface UserProfile {
  id: string;

  onboardingCompleted: boolean;
  diagnosticCompleted: boolean;
  resumeUploaded: boolean;

  goal?: string;
  skill?: string;

  declaredLevel?: string;
  actualLevel?: string;
}