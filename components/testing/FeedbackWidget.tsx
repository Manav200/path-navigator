"use client";

// components/testing/FeedbackWidget.tsx
// Alexandria High-End Editorial - Floating feedback collector for live evaluation sessions

import { useState } from "react";
import { usePathname } from "next/navigation";
import { recordFeedback } from "@/lib/analytics";

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [wouldSwitch, setWouldSwitch] = useState<"Yes" | "No" | "Unsure">("Yes");
  const [submitted, setSubmitted] = useState(false);

  // Extract roleId if current route is /pathway/[roleId] or /roadmap/[roleId]
  const roleMatch = pathname.match(/\/(pathway|roadmap)\/([^/?]+)/);
  const currentRoleId = roleMatch ? roleMatch[2] : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordFeedback({
      rating,
      feedback: feedbackText.trim() || "(Rating submitted without text comments)",
      wouldSwitch,
      roleId: currentRoleId,
      page: pathname,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFeedbackText("");
    }, 2000);
  };

  return (
    <>
      {/* ── Fixed Floating Trigger Button ────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-label font-bold text-xs uppercase tracking-wider shadow-lg border border-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
          aria-label="Open User Testing Feedback"
        >
          <span className="text-sm">💬</span>
          <span>Curator Feedback</span>
          <span className="w-2 h-2 rounded-full bg-[#094cb2] animate-pulse" />
        </button>
      </div>

      {/* ── Feedback Sheet Modal ─────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 relative overflow-hidden text-slate-900 font-sans">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#094cb2] via-[#1d63d8] to-[#6d5e00]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs transition border border-slate-200"
              aria-label="Close"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] text-[#453b00] text-2xl flex items-center justify-center mx-auto border border-[#fde68a]">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-950">Observation Recorded</h3>
                <p className="font-sans text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Thank you for contributing to PathNavigate. Your telemetry evaluation has been recorded into the live registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div>
                  <span className="font-label px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 uppercase tracking-wider">
                    Curatorial Evaluation
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-950 mt-1">
                    Rate Diagnostic Fidelity
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    How accurately did our diagnostic engine reflect your cognitive affinity and praxis readiness?
                  </p>
                </div>

                {/* Star Rating Picker */}
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-semibold text-slate-700 block uppercase tracking-wider">
                    Diagnostic Accuracy Index:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl p-1 rounded-xl transition ${
                          star <= rating
                            ? "text-[#6d5e00] scale-110"
                            : "text-slate-200 hover:text-slate-400"
                        }`}
                        title={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-label text-xs font-bold text-[#6d5e00] ml-2 uppercase">
                      {rating === 5
                        ? "Spot on (5/5)"
                        : rating === 4
                        ? "Very accurate (4/5)"
                        : rating === 3
                        ? "Moderate fit (3/5)"
                        : "Needs tuning"}
                    </span>
                  </div>
                </div>

                {/* Domain Pivot Question */}
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-semibold text-slate-700 block uppercase tracking-wider">
                    Would you consider validating this career trajectory?
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-label">
                    {(["Yes", "No", "Unsure"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWouldSwitch(opt)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                          wouldSwitch === opt
                            ? "bg-[#094cb2] border-[#094cb2] text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-semibold text-slate-700 block uppercase tracking-wider">
                    Scholarly Remarks &amp; Suggestions:
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="E.g. Clear experiential workplace task; would like to see further case law analysis..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#094cb2] transition resize-none font-sans"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2 flex items-center justify-between gap-3 font-label">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Logged to session ledger
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition"
                  >
                    Submit Feedback →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
