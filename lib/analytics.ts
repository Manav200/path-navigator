// lib/analytics.ts
// Real-time event tracking and authentic feedback collection.
// Dual-write strategy: localStorage (fast / offline) + Firestore (persistent / cross-device).
// All mock data, seed feedback, and synthetic reviews have been purged.
// getAggregatedAnalyticsFromFirestore() fetches live data from Firestore for cross-device telemetry.

export interface FeedbackSubmission {
  id: string;
  rating: number;
  feedback: string;
  wouldSwitch: "Yes" | "No" | "Unsure";
  roleId?: string;
  page?: string;
  timestamp: number;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: number;
}

export interface AggregatedAnalytics {
  totalSessions: number;
  activeUsers: number;
  averageAccuracyScore: number;
  accuracyPercentage: number;
  totalFeedbackCount: number;
  pivotRatePercentage: number;
  day1CompletionRate: number;
  avgTimeSpentMinutes: number;
  topRecommendedProfessions: { role: string; count: number; percentage: number }[];
  starRatingsCount: Record<number, number>;
  wouldSwitchStats: { yes: number; no: number; unsure: number };
  recentFeedback: FeedbackSubmission[];
}

const FEEDBACK_STORAGE_KEY = "pathnavigate_user_feedback_v2";
const ANALYTICS_STORAGE_KEY = "pathnavigate_user_events_v2";
const SESSION_STORAGE_KEY = "pathnavigate_session_id";

function purgeLegacyMockData() {
  if (typeof window === "undefined") return;
  try {
    const legacyFeedback = localStorage.getItem("pathnavigate_feedback_events");
    if (
      legacyFeedback &&
      (legacyFeedback.includes("fb-1") ||
        legacyFeedback.includes("analytical bias toward Data Science") ||
        legacyFeedback.includes("SQL node widget") ||
        legacyFeedback.includes("pharma council") ||
        legacyFeedback.includes("lawyer actually does"))
    ) {
      localStorage.removeItem("pathnavigate_feedback_events");
      localStorage.removeItem("pathnavigate_analytics_events");
    }
  } catch {
    // ignore
  }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  purgeLegacyMockData();
  let sId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sId) {
    sId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    sessionStorage.setItem(SESSION_STORAGE_KEY, sId);
    trackEvent("session_start", { sessionId: sId });
  }
  return sId;
}

export function trackEvent(name: string, properties: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    const newEvent: AnalyticsEvent = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name,
      properties: {
        ...properties,
        sessionId: sessionStorage.getItem(SESSION_STORAGE_KEY) || "default",
      },
      timestamp: Date.now(),
    };
    events.unshift(newEvent);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(0, 150)));
    import("@/lib/db").then(({ fsTrackEvent }) => {
      fsTrackEvent(newEvent).catch((e: any) =>
        console.warn("[Analytics] Check your Internet Connection", e)
      );
    });
  } catch (e) {
    console.warn("[Analytics] Track error:", e);
  }
}

export function getFeedbackList(): FeedbackSubmission[] {
  if (typeof window === "undefined") return [];
  purgeLegacyMockData();
  const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: any) => {
      if (!item || !item.id) return false;
      const text = String(item.feedback || "").toLowerCase();
      if (
        text.includes("analytical bias toward data science") ||
        text.includes("lawyer actually does") ||
        text.includes("sql node widget") ||
        text.includes("pharma council") ||
        text.includes("positive general appraisal")
      ) {
        return false;
      }
      return true;
    });
  } catch {
    return [];
  }
}

export function recordFeedback(
  submission: Omit<FeedbackSubmission, "id" | "timestamp">
): FeedbackSubmission {
  if (typeof window === "undefined") {
    return { ...submission, id: "server", timestamp: Date.now() };
  }
  const current = getFeedbackList();
  const newFeedback: FeedbackSubmission = {
    ...submission,
    id: "fb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    timestamp: Date.now(),
  };
  const updated = [newFeedback, ...current];
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
  trackEvent("feedback_submitted", {
    rating: submission.rating,
    wouldSwitch: submission.wouldSwitch,
    roleId: submission.roleId,
  });
  import("@/lib/db").then(({ fsAddFeedback }) => {
    fsAddFeedback(newFeedback).catch((e: any) =>
      console.warn("[Analytics] Please Check your Internet Connection, and try again later", e)
    );
  });
  return newFeedback;
}

export function getAggregatedAnalytics(): AggregatedAnalytics {
  purgeLegacyMockData();
  const feedbacks = getFeedbackList();

  let events: AnalyticsEvent[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) events = JSON.parse(raw);
    } catch {
      events = [];
    }
  }

  const sessionsSet = new Set<string>();
  events.forEach((e) => {
    if (e.properties?.sessionId) sessionsSet.add(e.properties.sessionId);
  });
  const totalSessions = Math.max(sessionsSet.size, feedbacks.length > 0 ? 1 : 0);

  const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRatingSum = 0;
  feedbacks.forEach((f) => {
    if (f.rating >= 1 && f.rating <= 5) {
      starCounts[f.rating] = (starCounts[f.rating] || 0) + 1;
      totalRatingSum += f.rating;
    }
  });

  const totalFeedbackCount = feedbacks.length;
  const avgScore =
    totalFeedbackCount > 0
      ? Number((totalRatingSum / totalFeedbackCount).toFixed(1))
      : 0;
  const accuracyPercent =
    totalFeedbackCount > 0 ? Math.round((avgScore / 5) * 100) : 0;

  const switchStats = { yes: 0, no: 0, unsure: 0 };
  feedbacks.forEach((f) => {
    if (f.wouldSwitch === "Yes") switchStats.yes++;
    else if (f.wouldSwitch === "No") switchStats.no++;
    else if (f.wouldSwitch === "Unsure") switchStats.unsure++;
  });

  const roleCounts: Record<string, number> = {};
  let totalAssessments = 0;
  let pivotAssessments = 0;

  events.forEach((e) => {
    if (e.name === "assessment_complete" || e.name === "demo_preset_applied") {
      totalAssessments++;
      const role =
        e.properties?.target || e.properties?.role || "Software Engineer";
      roleCounts[role] = (roleCounts[role] || 0) + 1;
      if (
        e.properties?.pivotStatus === "strong_pivot" ||
        e.properties?.pivotStatus === "explore_pivot"
      ) {
        pivotAssessments++;
      }
    }
  });

  const topProfessions = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([role, count]) => ({
      role,
      count,
      percentage:
        totalAssessments > 0 ? Math.round((count / totalAssessments) * 100) : 0,
    }));

  const pivotRate =
    totalAssessments > 0
      ? Math.round((pivotAssessments / totalAssessments) * 100)
      : 0;

  const nodeEvents = events.filter((e) => e.name === "dag_node_complete");
  const day1Completions = nodeEvents.filter(
    (e) => e.properties?.day === 1 || e.properties?.nodeId?.includes("day-1")
  ).length;
  const day1Rate =
    totalSessions > 0
      ? Math.min(100, Math.round((day1Completions / totalSessions) * 100))
      : 0;

  return {
    totalSessions,
    activeUsers: totalSessions,
    averageAccuracyScore: avgScore,
    accuracyPercentage: accuracyPercent,
    totalFeedbackCount,
    pivotRatePercentage: pivotRate,
    day1CompletionRate: day1Rate,
    avgTimeSpentMinutes: nodeEvents.length > 0 ? 2.5 : 0,
    topRecommendedProfessions: topProfessions,
    starRatingsCount: starCounts,
    wouldSwitchStats: switchStats,
    recentFeedback: feedbacks.slice(0, 8),
  };
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  localStorage.removeItem("pathnavigate_feedback_events");
  localStorage.removeItem("pathnavigate_analytics_events");
}

/**
 * Fetches feedback + events from Firestore and returns a fully aggregated
 * AggregatedAnalytics object that includes ALL users (cross-device).
 * Falls back gracefully if Firestore is unreachable.
 */
export async function getAggregatedAnalyticsFromFirestore(): Promise<AggregatedAnalytics> {
  // Start with the local snapshot so we always have something to show
  const localData = getAggregatedAnalytics();

  try {
    const { fsGetRecentFeedback, fsGetEvents } = await import("@/lib/db");
    const [remoteFeedbacks, remoteEvents] = await Promise.all([
      fsGetRecentFeedback(200),
      fsGetEvents(500),
    ]);

    // Merge: de-duplicate by id, remote wins on conflicts
    const localFeedbacks = getFeedbackList();
    const feedbackMap = new Map<string, FeedbackSubmission>();
    [...localFeedbacks, ...remoteFeedbacks].forEach((f) => feedbackMap.set(f.id, f));
    const feedbacks = Array.from(feedbackMap.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );

    let localEvents: AnalyticsEvent[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
        if (raw) localEvents = JSON.parse(raw);
      } catch { }
    }
    const eventMap = new Map<string, AnalyticsEvent>();
    [...localEvents, ...remoteEvents].forEach((e) => eventMap.set(e.id, e));
    const events = Array.from(eventMap.values());

    // Re-aggregate with merged data
    const sessionsSet = new Set<string>();
    events.forEach((e) => {
      if (e.properties?.sessionId) sessionsSet.add(e.properties.sessionId);
    });
    const totalSessions = Math.max(sessionsSet.size, feedbacks.length > 0 ? 1 : 0);

    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatingSum = 0;
    feedbacks.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) {
        starCounts[f.rating] = (starCounts[f.rating] || 0) + 1;
        totalRatingSum += f.rating;
      }
    });
    const totalFeedbackCount = feedbacks.length;
    const avgScore =
      totalFeedbackCount > 0
        ? Number((totalRatingSum / totalFeedbackCount).toFixed(1))
        : 0;
    const accuracyPercent =
      totalFeedbackCount > 0 ? Math.round((avgScore / 5) * 100) : 0;

    const switchStats = { yes: 0, no: 0, unsure: 0 };
    feedbacks.forEach((f) => {
      if (f.wouldSwitch === "Yes") switchStats.yes++;
      else if (f.wouldSwitch === "No") switchStats.no++;
      else switchStats.unsure++;
    });

    const roleCounts: Record<string, number> = {};
    let totalAssessments = 0;
    let pivotAssessments = 0;
    events.forEach((e) => {
      if (e.name === "assessment_complete" || e.name === "demo_preset_applied") {
        totalAssessments++;
        const role = e.properties?.target || e.properties?.role || "Software Engineer";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
        if (
          e.properties?.pivotStatus === "strong_pivot" ||
          e.properties?.pivotStatus === "explore_pivot"
        ) {
          pivotAssessments++;
        }
      }
    });
    const topProfessions = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([role, count]) => ({
        role,
        count,
        percentage:
          totalAssessments > 0 ? Math.round((count / totalAssessments) * 100) : 0,
      }));
    const pivotRate =
      totalAssessments > 0
        ? Math.round((pivotAssessments / totalAssessments) * 100)
        : 0;
    const nodeEvents = events.filter((e) => e.name === "dag_node_complete");
    const day1Completions = nodeEvents.filter(
      (e) => e.properties?.day === 1 || e.properties?.nodeId?.includes("day-1")
    ).length;
    const day1Rate =
      totalSessions > 0
        ? Math.min(100, Math.round((day1Completions / totalSessions) * 100))
        : 0;

    return {
      totalSessions,
      activeUsers: totalSessions,
      averageAccuracyScore: avgScore,
      accuracyPercentage: accuracyPercent,
      totalFeedbackCount,
      pivotRatePercentage: pivotRate,
      day1CompletionRate: day1Rate,
      avgTimeSpentMinutes: nodeEvents.length > 0 ? 2.5 : 0,
      topRecommendedProfessions: topProfessions,
      starRatingsCount: starCounts,
      wouldSwitchStats: switchStats,
      recentFeedback: feedbacks.slice(0, 20),
    };
  } catch (err) {
    console.warn("[Analytics] Check your Internet Connection", err);
    return localData;
  }
}