"use client";

// app/assessment/page.tsx
// Alexandria High-End Editorial Diagnostic Examination
// Standardized psychometric examination combining deterministic scoring with Groq Llama 3 semantic analysis

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOnboarding, saveAssessment } from "@/lib/userStore";
import {
  QUESTION_CONFIGS,
  INTEREST_CHIP_OPTIONS,
  AssessmentAnswers,
} from "@/lib/questions";
import { sanitizeClientError } from "@/lib/errorSanitizer";
import { LlamaDiagnosisSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AssessmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0); // 0 to 6
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    q1: undefined,
    q2: undefined,
    q3a: "",
    q3b: "",
    q4: undefined,
    q5a: 3,
    q5b: 3,
    q6: ["tech_lab", "analytics_boardroom", "legal_chamber", "clinical_unit"],
    q7: "",
    interests: [],
    otherInterest: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check auth & existing onboarding
  useEffect(() => {
    const activeUid = user?.uid || "guest_uid";
    const ob = getOnboarding(activeUid);
    if (ob) {
      setAnswers((prev) => ({
        ...prev,
        interests: prev.interests && prev.interests.length > 0 ? prev.interests : ob.interests || [],
        otherInterest: prev.otherInterest || ob.otherInterest || "",
      }));
    }
  }, [user, authLoading]);

  const totalSteps = QUESTION_CONFIGS.length; // 7
  const currentConfig = QUESTION_CONFIGS[currentStep];

  const canProceed = () => {
    if (currentStep === 0) return !!answers.q1;
    if (currentStep === 1) return !!answers.q2;
    if (currentStep === 2) return (answers.q3a?.trim().length || 0) > 0 && (answers.q3b?.trim().length || 0) > 0;
    if (currentStep === 3) return !!answers.q4;
    if (currentStep === 4) return typeof answers.q5a === "number" && typeof answers.q5b === "number";
    if (currentStep === 5) return answers.q6 && answers.q6.length === 4;
    if (currentStep === 6) return (answers.q7?.trim().length || 0) >= 15;
    return true;
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await handleSubmitAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const activeUid = user?.uid || "guest_uid";
      const onboardingData = getOnboarding(activeUid);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          stream: onboardingData?.stream || "",
          grade: onboardingData?.grade || "",
          persona: onboardingData?.persona || "student",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate career diagnosis");
      }

      const diagnosis = await res.json();

      saveAssessment(activeUid, {
        answers,
        topCareers: diagnosis.top_careers.map((c: any) => c.role),
        pivotRecommendation: diagnosis.pivot_status,
        evaluation: diagnosis.raw_evaluation,
      });

      setTimeout(() => {
        router.push("/results");
      }, 700);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        sanitizeClientError(
          err,
          "We encountered an issue processing your career diagnosis. Please try submitting again."
        )
      );
    }
  };

  // Reordering handler for Q6
  const moveItem = (index: number, direction: "up" | "down") => {
    const list = [...(answers.q6 || ["tech_lab", "analytics_boardroom", "legal_chamber", "clinical_unit"])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setAnswers({ ...answers, q6: list });
  };

  // Interest chip toggle for Q7
  const toggleInterest = (id: string) => {
    const current = answers.interests || [];
    if (current.includes(id)) {
      setAnswers({ ...answers, interests: current.filter((x) => x !== id) });
    } else {
      setAnswers({ ...answers, interests: [...current, id] });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00] pb-24">
      {/* ── Top Archival Examination Bar ───────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white text-base font-bold shadow-xs">
            PN
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-slate-950 block leading-tight">
              Standardized Diagnostic Examination
            </h1>
            <p className="font-label text-[10px] tracking-widest uppercase text-slate-500">
              Hybrid Empirical Matrix • Groq Llama 3 Evaluation
            </p>
          </div>
        </Link>

        {/* Question Counter Pill */}
        <div className="flex items-center gap-3 font-label">
          <span className="text-xs font-bold px-3 py-1 rounded-sm bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase tracking-wider">
            Question {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </header>

      {/* ── Progress Indicator Bar ────────────────────────────────────── */}
      <div className="w-full bg-slate-200 h-1 relative z-10">
        <div
          className="h-full bg-[#094cb2] transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* ── Main Question Container ───────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-6 py-10 sm:py-12 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Title Header */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-2 font-label text-[10px] font-bold uppercase tracking-widest text-[#094cb2]">
              <span>Section 0{currentStep + 1}</span>
              <span>•</span>
              <span>{currentConfig.title}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
              {currentConfig.subtitle}
            </h2>
          </div>

          {/* ── Render Specific Question UI ───────────────────────────── */}

          {/* Choice Questions: Q1, Q2, Q4 */}
          {currentConfig.type === "choice" && currentConfig.options && (
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentConfig.options.map((opt) => {
                const isSelected =
                  currentStep === 0
                    ? answers.q1 === opt.id
                    : currentStep === 1
                      ? answers.q2 === opt.id
                      : answers.q4 === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (currentStep === 0) setAnswers({ ...answers, q1: opt.id });
                      else if (currentStep === 1) setAnswers({ ...answers, q2: opt.id });
                      else setAnswers({ ...answers, q4: opt.id });
                    }}
                    className={`text-left p-5 sm:p-6 rounded-sm border transition-all flex items-start gap-4 shadow-xs ${
                      isSelected
                        ? "bg-white border-[#094cb2] ring-2 ring-[#094cb2]/20 text-slate-950"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 font-label font-bold text-xs border ${
                        isSelected
                          ? "bg-[#094cb2] border-[#094cb2] text-white shadow-xs"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="font-sans text-sm md:text-base leading-relaxed pt-0.5">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Q3: Objective Aptitude Check */}
          {currentConfig.type === "aptitude" && currentConfig.subquestions && (
            <div className="space-y-6 pt-2">
              <div className="p-4 rounded-sm bg-[#fef3c7] border border-[#fde68a] text-xs font-sans text-[#453b00] leading-relaxed">
                💡 <strong className="font-label uppercase tracking-wider">Calibration Note:</strong> These objective problems calculate baseline quantitative reasoning and algorithmic decomposition.
              </div>

              {currentConfig.subquestions.map((sub) => (
                <div key={sub.id} className="p-6 rounded-sm bg-white border border-slate-200 shadow-xs space-y-3">
                  <label className="block font-sans text-sm font-semibold text-slate-900 leading-relaxed">
                    {sub.label}
                  </label>
                  <input
                    type="text"
                    value={sub.id === "q3a" ? answers.q3a : answers.q3b}
                    onChange={(e) => {
                      if (sub.id === "q3a") setAnswers({ ...answers, q3a: e.target.value });
                      else setAnswers({ ...answers, q3b: e.target.value });
                    }}
                    placeholder={sub.placeholder}
                    className="w-full max-w-xs px-4 py-2.5 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Q5: Rating Sliders */}
          {currentConfig.type === "sliders" && currentConfig.sliders && (
            <div className="space-y-6 pt-2">
              {currentConfig.sliders.map((sl) => {
                const val = sl.id === "q5a" ? (answers.q5a ?? 3) : (answers.q5b ?? 3);
                return (
                  <div key={sl.id} className="p-6 rounded-sm bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif text-base font-bold text-slate-900">{sl.label}</h3>
                        <p className="font-sans text-xs text-slate-600 mt-1 leading-relaxed">{sl.description}</p>
                      </div>
                      <div className="px-3 py-1 rounded-sm bg-[#fef3c7] border border-[#fde68a] text-[#453b00] font-label font-bold text-sm min-w-[40px] text-center">
                        {val}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={val}
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          if (sl.id === "q5a") setAnswers({ ...answers, q5a: n });
                          else setAnswers({ ...answers, q5b: n });
                        }}
                        className="w-full accent-[#094cb2] cursor-pointer h-2 bg-slate-200 rounded-sm appearance-none"
                      />
                      <div className="flex justify-between font-label text-[10px] uppercase tracking-wider text-slate-400">
                        <span>1 (Low Comfort)</span>
                        <span>3 (Balanced)</span>
                        <span>5 (Maximum Affinity)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Q6: Work Environment Ranking */}
          {currentConfig.type === "ranking" && (
            <div className="space-y-4 pt-2">
              <p className="font-sans text-xs text-slate-600">
                Use the <strong className="font-label text-[#094cb2]">▲ Up</strong> and <strong className="font-label text-[#094cb2]">▼ Down</strong> buttons to rank environments from Primary (#1) to Least Preferred (#4).
              </p>

              <div className="space-y-3">
                {(answers.q6 || ["tech_lab", "analytics_boardroom", "legal_chamber", "clinical_unit"]).map((itemId, idx) => {
                  const itemObj = currentConfig.items?.find((it) => it.id === itemId);
                  return (
                    <div
                      key={itemId}
                      className="p-4 rounded-sm bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs transition-colors hover:border-[#094cb2]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-sm bg-slate-100 border border-slate-200 text-[#094cb2] font-label font-bold text-xs flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-serif text-sm md:text-base font-semibold text-slate-900">
                          {itemObj?.label || itemId}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 font-label">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                          className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 text-xs flex items-center justify-center transition border border-slate-200"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === 3}
                          className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 text-xs flex items-center justify-center transition border border-slate-200"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Q7: Free Text + Interest Selection */}
          {currentConfig.type === "freetext" && (
            <div className="space-y-6 pt-2">
              {/* Interest Chips */}
              <div className="space-y-3">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Key Curiosity Vectors (Optional):
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_CHIP_OPTIONS.map((chip) => {
                    const isSelected = (answers.interests || []).includes(chip.id);
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => toggleInterest(chip.id)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-label font-semibold tracking-wide transition-all ${
                          isSelected
                            ? "bg-[#094cb2] text-white border border-[#094cb2] shadow-xs"
                            : "bg-white text-slate-700 hover:border-slate-400 border border-slate-300"
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free Text Area */}
              <div className="space-y-2">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                  Vocational Aspiration &amp; 7-Day Pivot Trial Vision (Min. 15 chars):
                </label>
                <textarea
                  rows={5}
                  value={answers.q7 || ""}
                  onChange={(e) => setAnswers({ ...answers, q7: e.target.value })}
                  placeholder={currentConfig.placeholder}
                  className="w-full p-4 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 font-sans text-sm leading-relaxed focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2] shadow-xs"
                />
                <div className="flex justify-between items-center font-label text-[10px] uppercase tracking-wider text-slate-400 px-1">
                  <span>Processed with Groq Llama 3 JSON Semantic Engine</span>
                  <span>{answers.q7?.length || 0} characters</span>
                </div>
              </div>

              {/* Custom Other Interest */}
              <div className="space-y-2">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-700">
                  Specific Alternate Domain or Role of Inquiry (Optional):
                </label>
                <input
                  type="text"
                  value={answers.otherInterest || ""}
                  onChange={(e) => setAnswers({ ...answers, otherInterest: e.target.value })}
                  placeholder="e.g. Quantitative Trading, Intellectual Property Law, Bioinformatics"
                  className="w-full px-4 py-2.5 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#094cb2]"
                />
              </div>
            </div>
          )}

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-4 sm:p-5 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-xs font-sans">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="space-y-0.5">
                  <span className="font-bold text-rose-900 block font-label text-[10px] uppercase tracking-wider">
                    Examination Notice
                  </span>
                  <p className="text-xs text-rose-700">{errorMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-label">
                <button
                  type="button"
                  onClick={() => handleSubmitAssessment()}
                  className="px-3 py-1.5 rounded-sm bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Retry Diagnosis
                </button>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="px-2.5 py-1.5 rounded-sm text-slate-500 hover:text-slate-800 text-xs transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation Actions ────────────────────────────────────────── */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-200 mt-8 font-label">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            ← Previous Question
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#094cb2] hover:bg-[#1d63d8] disabled:opacity-40 disabled:pointer-events-none transition shadow-xs flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <span>Synthesize Career Diagnosis</span>
                <span>✨</span>
              </>
            ) : (
              <>
                <span>Next Question</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* ── Fullscreen Dynamic AI Loader Modal ────────────────────────── */}
      {isSubmitting && <LlamaDiagnosisSkeleton />}
    </div>
  );
}
