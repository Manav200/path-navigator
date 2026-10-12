// lib/db.ts
// Firestore data-access layer.
// All writes go to Firestore (persisted across devices) AND to localStorage
// (instant reads / offline fallback). Reads prefer Firestore when online.
//
// Collection layout:
//   users/{uid}/profile/onboarding   – document
//   users/{uid}/profile/assessment   – document
//   users/{uid}/dagProgress/{roleId} – document
//   feedback/{id}                    – document  (global, read by analytics)
//   analyticsEvents/{id}             – document  (global)

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { OnboardingData, AssessmentResult, DAGProgress } from "@/lib/userStore";
import type { FeedbackSubmission, AnalyticsEvent } from "@/lib/analytics";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Strip undefined values so Firestore doesn't reject them. */
function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/** Check if UID represents an unauthenticated guest session. */
export function isGuestUid(uid?: string | null): boolean {
  if (!uid) return true;
  return uid === "guest" || uid === "guest_uid" || uid.startsWith("guest_");
}

/** Check if current user is authorized to write to users/{uid} in Firestore. */
function canAccessUserDoc(uid: string): boolean {
  if (isGuestUid(uid)) return false;
  if (typeof window !== "undefined") {
    // In client browser, only attempt write if authenticated user matches UID
    return auth.currentUser?.uid === uid;
  }
  return true;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function fsSetOnboarding(uid: string, data: OnboardingData): Promise<void> {
  if (!canAccessUserDoc(uid)) return;
  await setDoc(
    doc(db, "users", uid, "profile", "onboarding"),
    { ...clean(data), _updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function fsGetOnboarding(uid: string): Promise<OnboardingData | null> {
  if (!canAccessUserDoc(uid)) return null;
  const snap = await getDoc(doc(db, "users", uid, "profile", "onboarding"));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    persona: d.persona,
    grade: d.grade,
    stream: d.stream,
    branch: d.branch,
    currentDomain: d.currentDomain,
    experienceYears: d.experienceYears,
    interests: d.interests,
    otherInterest: d.otherInterest,
    updatedAt: d.updatedAt ?? Date.now(),
  } as OnboardingData;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export async function fsSetAssessment(uid: string, data: AssessmentResult): Promise<void> {
  if (!canAccessUserDoc(uid)) return;
  await setDoc(
    doc(db, "users", uid, "profile", "assessment"),
    { ...clean(data), _updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function fsGetAssessment(uid: string): Promise<AssessmentResult | null> {
  if (!canAccessUserDoc(uid)) return null;
  const snap = await getDoc(doc(db, "users", uid, "profile", "assessment"));
  if (!snap.exists()) return null;
  return snap.data() as AssessmentResult;
}

// ─── DAG Progress ─────────────────────────────────────────────────────────────

export async function fsSetDAGProgress(uid: string, data: DAGProgress): Promise<void> {
  if (!canAccessUserDoc(uid)) return;
  await setDoc(
    doc(db, "users", uid, "dagProgress", data.roleId),
    { ...clean(data), _updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function fsGetDAGProgress(uid: string, roleId: string): Promise<DAGProgress | null> {
  if (!canAccessUserDoc(uid)) return null;
  const snap = await getDoc(doc(db, "users", uid, "dagProgress", roleId));
  if (!snap.exists()) return null;
  return snap.data() as DAGProgress;
}

// ─── Feedback / Reviews ───────────────────────────────────────────────────────

export async function fsAddFeedback(submission: FeedbackSubmission): Promise<void> {
  await addDoc(collection(db, "feedback"), {
    ...clean(submission),
    _createdAt: serverTimestamp(),
  });
}

export async function fsGetRecentFeedback(count = 20): Promise<FeedbackSubmission[]> {
  const q = query(
    collection(db, "feedback"),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FeedbackSubmission);
}

// ─── Analytics Events ─────────────────────────────────────────────────────────

export async function fsTrackEvent(event: AnalyticsEvent): Promise<void> {
  await addDoc(collection(db, "analyticsEvents"), {
    ...clean(event),
    _createdAt: serverTimestamp(),
  });
}

export async function fsGetEvents(count = 150): Promise<AnalyticsEvent[]> {
  const q = query(
    collection(db, "analyticsEvents"),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as AnalyticsEvent);
}

// ─── Migrate localStorage → Firestore (called once on first sign-in) ──────────

export async function migrateLocalToFirestore(uid: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // Onboarding
    const rawOnboarding =
      localStorage.getItem(`pn_${uid}_onboarding`) ??
      localStorage.getItem("pn_guest_uid_onboarding") ??
      localStorage.getItem("pn_onboarding");
    if (rawOnboarding) {
      await fsSetOnboarding(uid, JSON.parse(rawOnboarding) as OnboardingData);
    }

    // Assessment
    const rawAssessment =
      localStorage.getItem(`pn_${uid}_assessment`) ??
      localStorage.getItem("pn_guest_uid_assessment") ??
      localStorage.getItem("pn_assessment");
    if (rawAssessment) {
      await fsSetAssessment(uid, JSON.parse(rawAssessment) as AssessmentResult);
    }

    // DAG Progress
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("pn_guest_uid_dag_") || k.startsWith("pn_dag_")) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw) as DAGProgress;
            fsSetDAGProgress(uid, parsed);
          }
        } catch {}
      }
    });

    // Feedback
    const rawFeedback = localStorage.getItem("pathnavigate_user_feedback_v2");
    if (rawFeedback) {
      const feedbacks: FeedbackSubmission[] = JSON.parse(rawFeedback);
      await Promise.all(feedbacks.map((f) => fsAddFeedback(f)));
    }

    // Analytics events
    const rawEvents = localStorage.getItem("pathnavigate_user_events_v2");
    if (rawEvents) {
      const events: AnalyticsEvent[] = JSON.parse(rawEvents);
      await Promise.all(events.map((e) => fsTrackEvent(e)));
    }

    console.info("[DB] Local → Firestore migration complete for", uid);
  } catch (err) {
    console.warn("[DB] Migration error:", err);
  }
}
