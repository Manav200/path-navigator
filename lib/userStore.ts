// lib/userStore.ts
// Thin localStorage helper that namespaces all user data under their Firebase UID.
// Authenticated user writes are mirrored to Firestore (fire-and-forget) for cross-device persistence.
// Guest user data resides securely in localStorage until account creation/sign-in.

import { FinalEvaluationResult } from "@/lib/questions";
import { isGuestUid } from "@/lib/db";

export type PersonaType = "school" | "college" | "professional" | "unemployed";

export type OnboardingData = {
  persona: PersonaType;
  grade?: string;
  stream?: string;
  branch?: string;
  currentDomain?: string;
  experienceYears?: string;
  interests?: string[];
  otherInterest?: string;
  updatedAt: number;
};

export type AssessmentResult = {
  answers: Record<string, any>;
  topCareers: string[];
  pivotRecommendation: string;
  evaluation?: FinalEvaluationResult;
  completedAt: number;
};

export type DAGProgress = {
  roleId: string;
  completedNodeIds: string[];
  lastUpdatedAt: number;
};

const key = (uid: string, suffix: string) => "pn_" + uid + "_" + suffix;

// --- Onboarding ---

export function saveOnboarding(uid: string, data: Omit<OnboardingData, "updatedAt">) {
  if (typeof window === "undefined") return;
  const payload: OnboardingData = { ...data, updatedAt: Date.now() };
  localStorage.setItem(key(uid, "onboarding"), JSON.stringify(payload));
  if (!isGuestUid(uid)) {
    import("@/lib/db").then(({ fsSetOnboarding }) => {
      fsSetOnboarding(uid, payload).catch((e: any) =>
        console.warn("[userStore] Firestore onboarding write failed:", e)
      );
    });
  }
}

export function getOnboarding(uid: string): OnboardingData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key(uid, "onboarding"));
  return raw ? (JSON.parse(raw) as OnboardingData) : null;
}

export async function getOnboardingAsync(uid: string): Promise<OnboardingData | null> {
  if (isGuestUid(uid)) return getOnboarding(uid);
  try {
    const { fsGetOnboarding } = await import("@/lib/db");
    const remote = await fsGetOnboarding(uid);
    if (remote) {
      if (typeof window !== "undefined") {
        localStorage.setItem(key(uid, "onboarding"), JSON.stringify(remote));
      }
      return remote;
    }
  } catch (e) {
    console.warn("[userStore] Firestore onboarding read failed:", e);
  }
  return getOnboarding(uid);
}

// --- Assessment ---

export function saveAssessment(uid: string, data: Omit<AssessmentResult, "completedAt">) {
  if (typeof window === "undefined") return;
  const payload: AssessmentResult = { ...data, completedAt: Date.now() };
  localStorage.setItem(key(uid, "assessment"), JSON.stringify(payload));
  if (!isGuestUid(uid)) {
    import("@/lib/db").then(({ fsSetAssessment }) => {
      fsSetAssessment(uid, payload).catch((e: any) =>
        console.warn("[userStore] Firestore assessment write failed:", e)
      );
    });
  }
}

export function getAssessment(uid: string): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key(uid, "assessment"));
  return raw ? (JSON.parse(raw) as AssessmentResult) : null;
}

export async function getAssessmentAsync(uid: string): Promise<AssessmentResult | null> {
  if (isGuestUid(uid)) return getAssessment(uid);
  try {
    const { fsGetAssessment } = await import("@/lib/db");
    const remote = await fsGetAssessment(uid);
    if (remote) {
      if (typeof window !== "undefined") {
        localStorage.setItem(key(uid, "assessment"), JSON.stringify(remote));
      }
      return remote;
    }
  } catch (e) {
    console.warn("[userStore] Firestore assessment read failed:", e);
  }
  return getAssessment(uid);
}

// --- DAG Progress ---

export function saveDAGProgress(uid: string, data: Omit<DAGProgress, "lastUpdatedAt">) {
  if (typeof window === "undefined") return;
  const payload: DAGProgress = { ...data, lastUpdatedAt: Date.now() };
  localStorage.setItem(key(uid, "dag_" + data.roleId), JSON.stringify(payload));
  if (!isGuestUid(uid)) {
    import("@/lib/db").then(({ fsSetDAGProgress }) => {
      fsSetDAGProgress(uid, payload).catch((e: any) =>
        console.warn("[userStore] Firestore DAG write failed:", e)
      );
    });
  }
}

export function getDAGProgress(uid: string, roleId: string): DAGProgress | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key(uid, "dag_" + roleId));
  return raw ? (JSON.parse(raw) as DAGProgress) : null;
}

export async function getDAGProgressAsync(uid: string, roleId: string): Promise<DAGProgress | null> {
  if (isGuestUid(uid)) return getDAGProgress(uid, roleId);
  try {
    const { fsGetDAGProgress } = await import("@/lib/db");
    const remote = await fsGetDAGProgress(uid, roleId);
    if (remote) {
      if (typeof window !== "undefined") {
        localStorage.setItem(key(uid, "dag_" + roleId), JSON.stringify(remote));
      }
      return remote;
    }
  } catch (e) {
    console.warn("[userStore] Firestore DAG read failed:", e);
  }
  return getDAGProgress(uid, roleId);
}

// --- Clear all data for a user (on logout) ---

export function clearUserData(uid: string) {
  if (typeof window === "undefined") return;
  const prefix = "pn_" + uid + "_";
  Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .forEach((k) => localStorage.removeItem(k));
}