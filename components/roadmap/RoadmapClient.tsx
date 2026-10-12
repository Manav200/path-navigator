"use client";

// components/roadmap/RoadmapClient.tsx
// Alexandria High-End Editorial - Long-Term Career Progression Roadmap Client Component
// 3-Horizon Timeline, Regulatory Requirements, Portfolio Projects & Salary Benchmarks

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCareerRoadmap,
  getAllRoadmapRoleIds,
  CAREER_ROADMAPS,
  CareerRoadmap,
} from "@/lib/roadmapData";
import { useAuth } from "@/context/AuthContext";

export default function RoadmapClient({ roleId }: { roleId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [activeHorizonIndex, setActiveHorizonIndex] = useState<number>(0);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

  const roadmap: CareerRoadmap | null = getCareerRoadmap(roleId);

  // Load saved roadmap checklist progress
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storageKey = `pn_roadmap_${user?.uid || "guest"}_${roleId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCompletedMilestones(JSON.parse(saved));
        } catch {
          setCompletedMilestones([]);
        }
      }
    }
  }, [roleId, user]);

  const toggleMilestone = (title: string) => {
    setCompletedMilestones((prev) => {
      const updated = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      if (typeof window !== "undefined") {
        const storageKey = `pn_roadmap_${user?.uid || "guest"}_${roleId}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!mounted) return null;

  // Fallback if role is not recognized
  if (!roadmap) {
    const allRoleIds = getAllRoadmapRoleIds();
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
          <span className="text-4xl">🏛️</span>
          <h1 className="font-serif text-2xl font-bold text-slate-950">Curriculum Roadmap Not Located</h1>
          <p className="font-sans text-xs text-slate-600 leading-relaxed">
            The requested career monograph "{roleId}" could not be catalogued. Please consult one of our 17 validated career pathways:
          </p>
          <div className="grid grid-cols-1 gap-2 pt-2 text-left max-h-60 overflow-y-auto">
            {allRoleIds.map((id) => {
              const r = CAREER_ROADMAPS[id];
              return (
                <Link
                  key={id}
                  href={`/roadmap/${id}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <span>{r?.roleIcon || "🎯"}</span>
                    <span>{r?.roleTitle || id}</span>
                  </span>
                  <span>→</span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/"
            className="block font-label text-xs uppercase tracking-wider text-[#094cb2] hover:underline pt-2 transition font-bold"
          >
            ← Return to Curatorial Masthead
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total milestones across 3 horizons
  const allMilestones = roadmap.horizons.flatMap((h) => h.milestones);
  const totalMilestonesCount = allMilestones.length;
  const completedCount = completedMilestones.length;
  const progressPercent = totalMilestonesCount > 0
    ? Math.round((completedCount / totalMilestonesCount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00] print:bg-white print:text-black">
      {/* ── Top Masthead Bar ─────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#094cb2] flex items-center justify-center font-serif font-black text-white text-sm shadow-sm">
              P
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-slate-950 hidden sm:inline">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roadmap.roleIcon}</span>
            <span className="font-serif font-bold text-sm sm:text-base text-slate-950">
              {roadmap.roleTitle} Long-Term Progression Blueprint
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/pathway/${roadmap.roleId}`}
            className="font-label text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 transition shadow-sm flex items-center gap-1.5"
          >
            <span>🌿</span>
            <span className="hidden sm:inline">7-Day Experiential DAG</span>
          </Link>

          <Link
            href="/results"
            className="font-label text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition hidden md:inline"
          >
            Diagnostic Monograph
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="font-label text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* ── Main Content Container ───────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-8 space-y-10 flex-1">
        {/* ── Hero Section ────────────────────────────────────────────── */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden print:border print:border-black/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="font-label px-3 py-1 rounded-full text-[10px] font-bold bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 uppercase tracking-widest">
                  Post-7-Day Career Curriculum
                </span>
                <span className="font-label text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  • 3 Execution Horizons (0–12 Months)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl">{roadmap.roleIcon}</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {roadmap.roleTitle}
                </h1>
              </div>

              <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                {roadmap.tagline}
              </p>
            </div>

            {/* Checklist Progress Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 min-w-[240px]">
              <div className="w-14 h-14 rounded-2xl bg-[#094cb2] flex items-center justify-center font-serif font-black text-lg text-white shadow-sm">
                {progressPercent}%
              </div>
              <div>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider text-[#094cb2] block">
                  Curriculum Completion
                </span>
                <span className="font-serif text-sm font-bold text-slate-900">
                  {completedCount} of {totalMilestonesCount} Milestones
                </span>
                <span className="font-sans text-[10px] text-slate-400 block">
                  Click checklist items to track
                </span>
              </div>
            </div>
          </div>

          {/* Compensation Brackets Quick-Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-label text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Entry-Level Compensation Band
              </span>
              <span className="font-serif text-base font-extrabold text-[#6d5e00]">
                {roadmap.salaryRange.entry}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-label text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mid-Level Bracket (3–5 Years)
              </span>
              <span className="font-serif text-base font-extrabold text-[#094cb2]">
                {roadmap.salaryRange.mid}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-label text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Senior / Lead Band (5+ Years)
              </span>
              <span className="font-serif text-base font-extrabold text-slate-900">
                {roadmap.salaryRange.senior}
              </span>
            </div>
          </div>
        </section>

        {/* ── 3-Horizon Interactive Timeline ──────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <span className="font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
                Phased Progression Architecture
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-950 tracking-tight">
                The 3-Horizon Execution Timeline
              </h2>
            </div>

            {/* Horizon Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 overflow-x-auto print:hidden font-label">
              {roadmap.horizons.map((h, idx) => (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => setActiveHorizonIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap ${
                    activeHorizonIndex === idx
                      ? "bg-[#094cb2] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{h.icon}</span>
                  <span>{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.horizons.map((horizon, idx) => {
              const isActive = activeHorizonIndex === idx;
              return (
                <div
                  key={horizon.label}
                  onClick={() => setActiveHorizonIndex(idx)}
                  className={`p-6 rounded-3xl border transition flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? "bg-white border-2 border-[#094cb2] shadow-md scale-[1.01]"
                      : "bg-white border-slate-200/90 hover:border-slate-300 opacity-90 shadow-sm"
                  } print:bg-white print:border-black/20 print:opacity-100`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 rounded-2xl bg-slate-100 border border-slate-200">
                        {horizon.icon}
                      </span>
                      <span
                        className={`font-label text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          idx === 0
                            ? "bg-[#094cb2]/10 text-[#094cb2] border-[#094cb2]/20"
                            : idx === 1
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-[#fef3c7] text-[#453b00] border-[#fde68a]"
                        }`}
                      >
                        {horizon.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-950">
                        {horizon.theme}
                      </h3>
                    </div>

                    {/* Milestones Checklist */}
                    <div className="space-y-2.5 pt-2">
                      {horizon.milestones.map((m) => {
                        const isDone = completedMilestones.includes(m.title);
                        return (
                          <div
                            key={m.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestone(m.title);
                            }}
                            className={`p-3 rounded-xl border transition text-left cursor-pointer flex items-start gap-3 ${
                              isDone
                                ? "bg-[#fefce8] border-[#fde68a] text-slate-900"
                                : "bg-slate-50/60 border-slate-200/80 text-slate-800 hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-1 rounded accent-[#094cb2] cursor-pointer"
                            />
                            <div className="space-y-1 flex-1 font-sans">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isDone ? "line-through text-slate-400" : "text-slate-900"
                                  }`}
                                >
                                  {m.title}
                                </span>
                                {m.duration && (
                                  <span className="font-label text-[9px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-200/60 shrink-0 uppercase">
                                    {m.duration}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                {m.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tools & Certifications */}
                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                    {horizon.tools.length > 0 && (
                      <div>
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Target Toolchain
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {horizon.tools.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {horizon.certifications.length > 0 && (
                      <div>
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider text-[#094cb2] block mb-1.5">
                          Recommended Certifications
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {horizon.certifications.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-md bg-[#094cb2]/10 border border-[#094cb2]/20 text-[10px] font-medium text-[#094cb2]"
                            >
                              🏅 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Regulatory & Licensing Requirements ──────────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="font-label text-xs font-bold uppercase tracking-wider text-[#6d5e00]">
              Statutory Compliance &amp; Credentials
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-950 tracking-tight">
              Regulatory Prerequisites &amp; Certifications
            </h2>
            <p className="font-sans text-xs text-slate-600 mt-1 max-w-xl">
              Mandatory legal and institutional qualifications required to practice in this domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.regulatory.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5 font-sans"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif text-xs font-bold text-slate-950 flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>{item.body}</span>
                  </span>
                  <span
                    className={`font-label text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      item.isBlocking
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-[#fef3c7] text-[#453b00] border-[#fde68a]"
                    }`}
                  >
                    {item.isBlocking ? "Mandatory Regulatory License" : "Recommended Credential"}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.requirement}
                </p>
                {item.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Recommended Portfolio Capstones ─────────────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
              Proof-of-Work Artifacts
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-950 tracking-tight">
              Recommended Portfolio Capstone Projects
            </h2>
            <p className="font-sans text-xs text-slate-600 mt-1 max-w-xl">
              High-signal projects that prove real-world execution capacity to hiring committees and technical managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roadmap.capstoneProjects.map((cap, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#094cb2]/10 text-[#094cb2] font-label font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-slate-950">{cap.title}</h3>
                  </div>

                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 font-sans">
                  <div>
                    <span className="font-label text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Target Deliverable
                    </span>
                    <span className="text-xs font-semibold text-[#094cb2]">
                      📦 {cap.deliverable}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 font-label">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Hiring Companies & Ecosystem Leaders ────────────────── */}
        <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="font-label text-xs font-bold uppercase tracking-wider text-[#6d5e00]">
              Industry Ecosystem
            </span>
            <h2 className="font-serif text-xl font-bold text-slate-950 tracking-tight">
              Top Employers &amp; Hiring Organizations
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              Leading organizations known to recruit top talent in this specialization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 font-sans">
            {roadmap.topCompanies.map((comp) => (
              <span
                key={comp}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:border-[#094cb2] transition flex items-center gap-2"
              >
                <span>🏢</span>
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ── Bottom Action Controls ───────────────────────────────────── */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden font-label">
          <Link
            href={`/pathway/${roadmap.roleId}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
          >
            <span>← Return to 7-Day Experiential DAG</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/results"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200 transition text-center shadow-sm"
            >
              Diagnostic Monograph
            </Link>
            <Link
              href="/assessment"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200 transition text-center shadow-sm"
            >
              Retake Assessment
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
