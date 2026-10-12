"use client";

// components/testing/AnalyticsModal.tsx
// Alexandria High-End Editorial - Real-time aggregated testing dashboard displaying live participant stats

import { useState, useEffect } from "react";
import { getAggregatedAnalytics, resetAnalytics, AggregatedAnalytics } from "@/lib/analytics";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const [data, setData] = useState<AggregatedAnalytics | null>(null);

  const refreshData = () => {
    setData(getAggregatedAnalytics());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const handleReset = () => {
    if (confirm("Clear all recorded analytics and feedback submissions?")) {
      resetAnalytics();
      refreshData();
    }
  };

  if (!isOpen || !data) return null;

  const totalReviews = data.totalFeedbackCount;
  const hasFeedback = totalReviews > 0;
  const hasSessions = data.totalSessions > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans"
    >
      <div className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900">
        {/* Top Header Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 uppercase tracking-wider">
                Curatorial Telemetry
              </span>
              <span className="font-label text-xs text-slate-400 font-semibold uppercase tracking-wider">
                • Real-Time Dossier
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 mt-1.5 tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>Participant Feedback &amp; Usage Metrics</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Aggregated in real-time from active sessions and user-submitted ratings.
              Shows actual diagnostic accuracy, domain pivoting frequency, and 7-day DAG engagement.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs transition shrink-0 border border-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Sessions
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950">
                {data.totalSessions}
              </div>
              <span className="font-label text-[11px] text-[#094cb2] block font-bold uppercase tracking-wider">
                {hasSessions ? `${data.activeUsers} Active` : "Awaiting sessions"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Diagnostic Accuracy
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#6d5e00]">
                {hasFeedback ? data.averageAccuracyScore : "—"}
                {hasFeedback && <span className="font-sans text-base text-slate-400 font-normal"> / 5.0</span>}
              </div>
              <span className="font-label text-[11px] text-[#6d5e00] block font-bold uppercase tracking-wider">
                {hasFeedback ? `${data.accuracyPercentage}% Satisfaction` : "No ratings yet"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Domain Pivot Rate
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#094cb2]">
                {data.pivotRatePercentage}%
              </div>
              <span className="font-label text-[11px] text-slate-500 block font-medium">
                Affinity Shift Frequency
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Day 1 DAG Completion
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {data.day1CompletionRate}%
              </div>
              <span className="font-label text-[11px] text-emerald-800 block font-medium">
                {data.avgTimeSpentMinutes > 0 ? `~${data.avgTimeSpentMinutes} min / node` : "Simulations pending"}
              </span>
            </div>
          </div>

          {/* Middle Row: Star Ratings & Pivot Willingness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Star Distribution */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-serif text-sm font-bold text-slate-950">
                  Rating Distribution ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
                </h3>
                <span className="font-label text-xs text-slate-400">5-Star Scale</span>
              </div>

              {!hasFeedback ? (
                <div className="py-6 text-center text-xs text-slate-400 italic font-sans">
                  No ratings submitted yet. Use the "Curator Feedback" button to submit observation.
                </div>
              ) : (
                <div className="space-y-2 pt-1 font-sans">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = data.starRatingsCount[star] || 0;
                    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-10 text-slate-700 font-semibold flex items-center gap-1">
                          <span>{star}</span>
                          <span className="text-[#6d5e00]">★</span>
                        </span>
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-[#6d5e00] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-slate-500 text-[11px] font-label">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pivot Willingness */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-serif text-sm font-bold text-slate-950">
                  Career Pivot Receptivity
                </h3>
                <span className="font-label text-xs text-slate-400">Survey Response</span>
              </div>

              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                "Would you switch or validate your current academic stream based on this diagnosis?"
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-2 font-sans">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="font-serif text-lg font-bold text-emerald-800">
                    {data.wouldSwitchStats.yes}
                  </span>
                  <span className="font-label text-[10px] text-emerald-700 block uppercase font-bold">Yes / Eager</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-center">
                  <span className="font-serif text-lg font-bold text-[#453b00]">
                    {data.wouldSwitchStats.unsure}
                  </span>
                  <span className="font-label text-[10px] text-[#453b00] block uppercase font-bold">Validating</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="font-serif text-lg font-bold text-slate-700">
                    {data.wouldSwitchStats.no}
                  </span>
                  <span className="font-label text-[10px] text-slate-500 block uppercase font-bold">Stick to Stream</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Recommended Career Distribution */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-slate-950 border-b border-slate-100 pb-2">
              Recommended Professions Across Active Sessions
            </h3>
            {data.topRecommendedProfessions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic font-sans">
                No diagnostic sessions completed yet. Complete an assessment or select a demo preset to log session data.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1 font-sans">
                {data.topRecommendedProfessions.map((p) => (
                  <div
                    key={p.role}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-800">{p.role}</span>
                    <span className="font-label text-xs font-bold text-[#094cb2] bg-[#094cb2]/10 px-2 py-0.5 rounded-md border border-[#094cb2]/20">
                      {p.percentage}% ({p.count})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verbatim Participant Feedback */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-slate-950 border-b border-slate-100 pb-2">
              User Observations &amp; Remarks
            </h3>
            {data.recentFeedback.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic font-sans">
                No observations logged yet. Test the application and submit feedback via the floating button!
              </div>
            ) : (
              <div className="space-y-2.5 pt-1 font-sans">
                {data.recentFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 flex-1">
                      <p className="text-xs text-slate-700 italic">"{fb.feedback}"</p>
                      <div className="flex items-center gap-2 font-label text-[10px] text-slate-400 uppercase">
                        {fb.roleId && <span className="text-[#094cb2] font-bold">Target: {fb.roleId}</span>}
                        <span>•</span>
                        <span>Pivot Decision: {fb.wouldSwitch}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#6d5e00] text-xs shrink-0">
                      {"★".repeat(fb.rating)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-label">
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-400 hover:text-rose-600 transition uppercase tracking-wider font-semibold"
          >
            Clear Stored Feedback &amp; Events
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold uppercase tracking-wider transition shadow-sm"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
