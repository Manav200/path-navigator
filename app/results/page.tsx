"use client";

// app/results/page.tsx
// Alexandria High-End Editorial - AI Diagnostic Evaluation & Domain Pivot Recommendation UI

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAssessment, AssessmentResult } from "@/lib/userStore";
import {
  TRAIT_DEFINITIONS,
  TraitKey,
  PROFESSION_SLUGS,
  FinalEvaluationResult,
} from "@/lib/questions";

export default function ResultsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [assessmentData, setAssessmentData] = useState<AssessmentResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeUid = user?.uid || "guest_uid";
    const data = getAssessment(activeUid);
    if (data && data.evaluation) {
      setAssessmentData(data);
    } else {
      const guestData = getAssessment("guest_uid");
      if (guestData && guestData.evaluation) {
        setAssessmentData(guestData);
      }
    }
  }, [user]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 rounded-full border-2 border-[#094cb2] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Fallback if no assessment taken yet
  if (!assessmentData || !assessmentData.evaluation) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 flex items-center justify-center mx-auto text-2xl font-serif font-bold">
            §
          </div>
          <span className="font-label text-xs uppercase tracking-widest text-slate-400 font-bold block">
            Folio Uncatalogued
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-950">No Diagnostic Record Found</h2>
          <p className="font-sans text-sm text-slate-600 leading-relaxed">
            Please complete the 7-question psychometric diagnostic examination to generate your authoritative AI career dossier and curriculum graph.
          </p>
          <Link
            href="/assessment"
            className="inline-block w-full py-3.5 px-5 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-md"
          >
            Commence Diagnostic Examination →
          </Link>
        </div>
      </div>
    );
  }

  const evaluation: FinalEvaluationResult = assessmentData.evaluation;
  const topCareer = evaluation.topCareers[0];
  const runnerUpCareer = evaluation.topCareers[1];

  // Editorial Badge Config for Pivot Status
  const getPivotBadgeConfig = (status: "no_pivot" | "explore_pivot" | "strong_pivot") => {
    switch (status) {
      case "no_pivot":
        return {
          label: "Curriculum Alignment • Natural Affinity",
          colorClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
          cardBorder: "border-emerald-200",
        };
      case "explore_pivot":
        return {
          label: "Recommended Exploration • Moderate Domain Pivot",
          colorClass: "bg-[#fef3c7] text-[#453b00] border-[#fde68a]",
          cardBorder: "border-[#fde68a]",
        };
      case "strong_pivot":
        return {
          label: "Strong Pivot Advised • High Affinity Surge",
          colorClass: "bg-rose-50 text-rose-800 border-rose-300",
          cardBorder: "border-rose-200",
        };
    }
  };

  const pivotBadge = getPivotBadgeConfig(evaluation.pivotStatus);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00] pb-24">
      {/* ── Top Masthead Bar ─────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#094cb2] flex items-center justify-center font-serif font-black text-white text-sm shadow-sm">
              P
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-slate-950">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-label text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:inline">
            Aptitude Assessment Monograph &amp; Career Dossier
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="font-label text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Retake Diagnostic
          </Link>
          <Link
            href={`/pathway/${topCareer.roleId}`}
            className="font-label text-xs uppercase tracking-wider bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition"
          >
            View 7-Day DAG →
          </Link>
        </div>
      </header>

      {/* ── Main Monograph Content ────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-10 space-y-10">
        {/* ── Hero / Primary Match Folio ──────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2.5">
              <span className="font-label px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20">
                Primary Vector Recommendation
              </span>
              {evaluation.isCloseCall && (
                <span className="font-label px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">
                  Dual-Affinity Equilibrium (Differential ≤ 5%)
                </span>
              )}
            </div>

            <span className="font-label text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Registry Ref: #{topCareer.roleId.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-label text-xs text-[#6d5e00] font-bold uppercase tracking-widest">
                Highest Evaluated Profession
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {topCareer.role}
              </h1>
              <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">
                Evaluated compatibility index of{" "}
                <strong className="text-slate-900 font-semibold">{topCareer.score}%</strong>{" "}
                derived from quantitative cognitive calibration, domain heuristics, and semantic aspiration synthesis.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0">
              <Link
                href={`/pathway/${topCareer.roleId}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#094cb2]/20 active:scale-[0.98] transition-all"
              >
                <span>Launch 7-Day Experiential Plan</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Domain Pivot Diagnostic Card ──────────────────────────────── */}
        <section className={`p-6 sm:p-8 rounded-3xl bg-white border ${pivotBadge.cardBorder} shadow-sm space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                🧭
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950">Domain Pivot Assessment</h3>
                <p className="font-label text-xs text-slate-500 uppercase tracking-wider">
                  Origin Stream Baseline: <strong className="text-slate-800">{evaluation.homeProfession}</strong>
                </p>
              </div>
            </div>

            {/* Dynamic Status Badge */}
            <span className={`px-4 py-1.5 rounded-full font-label text-xs font-bold border tracking-wider uppercase ${pivotBadge.colorClass}`}>
              {pivotBadge.label}
            </span>
          </div>

          <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
            {evaluation.pivotAnalysis}
          </p>

          {Boolean(evaluation.q7RationaleQuote && evaluation.q7RationaleQuote.trim().length > 0) && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 italic flex items-start gap-3">
              <span className="font-serif text-2xl text-[#6d5e00] leading-none shrink-0">“</span>
              <span className="font-serif leading-relaxed">{evaluation.q7RationaleQuote}</span>
            </div>
          )}

          {evaluation.isCloseCall && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
              <div>
                <strong className="font-semibold">Secondary Trajectory Equilibrium:</strong> Your score for{" "}
                <strong>{runnerUpCareer.role}</strong> ({runnerUpCareer.score}%) is within 5% of your lead profession.
              </div>
              <Link
                href={`/pathway/${runnerUpCareer.roleId}`}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-label font-bold text-xs uppercase tracking-wider text-amber-900 transition text-center"
              >
                Inspect {runnerUpCareer.role} DAG →
              </Link>
            </div>
          )}
        </section>

        {/* ── Grid: Top 5 Career Rankings + Psychometric Trait Vectors ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top 5 Careers Ranking (7 cols) */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="font-serif text-xl font-bold text-slate-950 tracking-tight">
                Top 5 Profession Rankings
              </h2>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                75% Psychometric + 25% Domain Heuristic
              </span>
            </div>

            <div className="space-y-3.5">
              {evaluation.topCareers.slice(0, 5).map((c, index) => {
                const isRecommended = index === 0;
                return (
                  <div
                    key={c.role}
                    className={`p-5 rounded-2xl border transition-all ${
                      isRecommended
                        ? "bg-white border-[#094cb2] shadow-md ring-1 ring-[#094cb2]/10"
                        : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg font-label text-xs font-bold flex items-center justify-center ${
                            isRecommended
                              ? "bg-[#094cb2] text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <span className="font-serif font-bold text-base text-slate-900">{c.role}</span>
                        {isRecommended && (
                          <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase tracking-wider">
                            Lead Recommendation
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-xl font-black text-slate-900">{c.score}%</span>
                      </div>
                    </div>

                    {/* Compatibility Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isRecommended
                            ? "bg-gradient-to-r from-[#094cb2] to-[#1d63d8]"
                            : "bg-slate-400"
                        }`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>

                    {/* Breakdown sub-metrics */}
                    <div className="flex items-center justify-between font-label text-[11px] text-slate-500 pt-1">
                      <span>Psychological Affinity: <strong className="text-slate-800">{c.fitScore}%</strong></span>
                      <span>Discipline Aptitude: <strong className="text-slate-800">{c.interestScore}%</strong></span>
                    </div>

                    {/* Rationale Commentary */}
                    <p className="font-sans text-xs text-slate-600 mt-3 pt-2.5 border-t border-slate-100 leading-relaxed">
                      {c.rationale}
                    </p>

                    <div className="mt-3 flex justify-end">
                      <Link
                        href={`/pathway/${c.roleId}`}
                        className="font-label text-xs font-bold uppercase tracking-wider text-[#094cb2] hover:text-[#1d63d8] flex items-center gap-1 transition"
                      >
                        Inspect 7-Day Graph →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Psychometric Trait Vector Calibration (5 cols) */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="font-serif text-xl font-bold text-slate-950 tracking-tight">
                Psychometric Vectors
              </h2>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                Index Scale (0–100)
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              {(Object.keys(TRAIT_DEFINITIONS) as TraitKey[]).map((tKey) => {
                const trait = TRAIT_DEFINITIONS[tKey];
                const score = evaluation.blendedTraits[tKey] ?? 50;

                return (
                  <div key={tKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-semibold text-slate-800">{trait.name}</span>
                      <span className="font-label font-bold text-[#094cb2]">{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-[#094cb2] to-[#1d63d8] rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                      {trait.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Experiential DAG Verification Callout */}
            <div className="p-5 rounded-2xl bg-[#fef3c7]/60 border border-[#fde68a] text-xs text-[#453b00] leading-relaxed space-y-2">
              <div className="font-serif font-bold text-sm text-[#453b00] flex items-center gap-2">
                <span>§</span> Experiential DAG Verification
              </div>
              <p className="font-sans">
                Theoretical aptitude scores predict cognitive resonance, but true competence is verified through hands-on praxis.
                The 7-Day Directed Acyclic Graph (DAG) validates your capability through authentic workplace micro-tasks before you commit to career pivots.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
