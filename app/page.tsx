"use client";

// app/page.tsx
// PathNavigate — Alexandria High-End Editorial Landing Experience
// Authoritative, scholarly digital curator for career discovery & experiential learning

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAssessment } from "@/lib/userStore";
import AnalyticsModal from "@/components/testing/AnalyticsModal";

const LAUNCH_PROFESSIONS = [
  {
    role: "Software / Full-Stack Engineer",
    slug: "software-engineer",
    icon: "💻",
    folio: "FOLIO 01",
    domain: "Computing & Distributed Systems",
    description: "System architecture, fault-tolerant micro-tasks, algorithmic optimization, and distributed unit testing.",
    traits: "Logic • Precision • High Ambiguity",
  },
  {
    role: "Business Analyst",
    slug: "business-analyst",
    icon: "📊",
    folio: "FOLIO 02",
    domain: "Corporate Strategy & Quantitative Modeling",
    description: "Financial metrics, product KPIs, SQL cohort analysis, and executive strategic memoranda.",
    traits: "Data • Strategy • Persuasion",
  },
  {
    role: "Lawyer / Corporate Legal Specialist",
    slug: "lawyer",
    icon: "⚖️",
    folio: "FOLIO 03",
    domain: "Jurisprudence & Commercial Arbitration",
    description: "Contract arbitration, statutory compliance, precedent synthesis, and litigation advocacy.",
    traits: "Interpretation • Dialectic Logic",
  },
  {
    role: "Doctor / Clinical Practitioner",
    slug: "doctor",
    icon: "🩺",
    folio: "FOLIO 04",
    domain: "Clinical Medicine & Patient Diagnosis",
    description: "Clinical patient diagnostics, emergency triage, differential symptomatology, and medical ethics.",
    traits: "Empathy • Protocol Precision",
  },
  {
    role: "Pharmacist / Pharmaceutical Analyst",
    slug: "pharmacist",
    icon: "💊",
    folio: "FOLIO 05",
    domain: "Pharmacology & Chemical Toxicology",
    description: "Drug formulation, regulatory trial auditing, dispensing safety, and chemical bioavailability.",
    traits: "Chemical Precision • Quantitative",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [hasAssessment, setHasAssessment] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeUid = user?.uid || "guest_uid";
    const assessment = getAssessment(activeUid);
    if (assessment?.evaluation || assessment?.topCareers?.length) {
      setHasAssessment(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00]">
      {/* ── Top Editorial Archival Bar ──────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 bg-white px-6 py-2 text-[11px] font-label tracking-widest uppercase text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6d5e00]" />
          An Institutional Curator in Indian Career Discovery
        </span>
        <span className="hidden sm:inline text-slate-400">
          Vol. IV • Curated Experiential DAG Engine
        </span>
      </div>

      {/* ── Editorial Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white text-lg font-bold shadow-xs">
            PN
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-950 block leading-tight">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
            <span className="font-label text-[10px] tracking-widest uppercase text-slate-500 block">
              Curated Scholarly Monographs &amp; Skill Trees
            </span>
          </div>
        </div>

        {/* Navigation & Auth Status */}
        <div className="flex items-center gap-3 sm:gap-4 font-label text-xs">
          <nav className="hidden lg:flex items-center gap-4 text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
            <Link href="/mentors/software-engineer" className="hover:text-[#094cb2] transition">
              1:1 Mentors
            </Link>
            <Link href="/register/student" className="hover:text-[#094cb2] transition">
              Student Registration
            </Link>
            <Link href="/register/mentor" className="text-[#6d5e00] hover:text-amber-800 transition">
              ✦ Mentor Registration
            </Link>
            <Link href="/dashboard/sessions" className="hover:text-[#094cb2] transition">
              Sessions
            </Link>
            <Link href="/profile" className="px-2.5 py-1 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition">
              Profile Workspace
            </Link>
          </nav>

          {mounted && user ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-sm border border-slate-200 bg-white text-slate-700 hover:border-[#094cb2] hover:text-[#094cb2] font-semibold transition shadow-2xs text-xs"
              >
                👤 Profile
              </Link>
              {hasAssessment ? (
                <Link
                  href="/results"
                  className="px-3.5 py-1.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-semibold transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Dossier</span>
                  <span>→</span>
                </Link>
              ) : (
                <Link
                  href="/assessment"
                  className="px-3.5 py-1.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-semibold transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Diagnostic</span>
                  <span>→</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 transition uppercase tracking-wider text-[11px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-sm border border-slate-300 hover:border-[#094cb2] hover:text-[#094cb2] bg-white text-slate-800 font-bold transition shadow-2xs text-xs uppercase tracking-wider font-label"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold transition shadow-xs text-xs uppercase tracking-wider font-label"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Editorial Container ────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 sm:py-16 space-y-20">
        {/* ── Hero Section ───────────────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[11px] font-label font-bold uppercase tracking-widest bg-[#fef3c7] text-[#453b00] border border-[#fde68a]">
            <span>🏛️</span>
            Empirical Aptitude &amp; 7-Day Experiential Skill Graphs
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-slate-950 tracking-tight leading-[1.15]">
            Beyond Rote Career Advice.{" "}
            <span className="italic font-normal text-[#094cb2]">
              Diagnose Genuine Aptitude &amp; Test Live Workplace Realities.
            </span>
          </h1>

          <p className="font-sans text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            PathNavigate synthesizes rigorous psychological trait matrices with Groq Llama 3 semantic analysis.
            We quantify your domain pivot feasibility and guide you through an interactive 7-day experiential DAG of real workplace challenges.
          </p>

          {/* ── Prominent Dual Persona Registration in the Beginning ── */}
          <div className="pt-4 pb-2 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* Student Registration Card */}
              <div className="bg-white rounded-sm border border-slate-200 hover:border-[#094cb2] p-5 shadow-xs transition group flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-sm bg-blue-50 border border-blue-200 flex items-center justify-center text-lg">
                      🎓
                    </span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm">
                      Track 01
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-950 group-hover:text-[#094cb2] transition">
                    Student Registration
                  </h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    AI cognitive fit diagnostics, 7-day experiential DAG skill trees, and 1:1 mentorship booking.
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/register/student"
                    className="font-label text-xs font-bold uppercase tracking-wider text-[#094cb2] group-hover:underline flex items-center gap-1"
                  >
                    <span>Register as Student</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Mentor Registration Card */}
              <div className="bg-white rounded-sm border border-slate-200 hover:border-[#6d5e00] p-5 shadow-xs transition group flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-lg text-[#6d5e00]">
                      ✦
                    </span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider text-[#6d5e00] bg-amber-50 px-2 py-0.5 rounded-sm">
                      Track 02
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-950 group-hover:text-[#6d5e00] transition">
                    Mentor Registration
                  </h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Join vetted practitioner directory, set honorarium rates, and auto-sync Google Meet sessions.
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/register/mentor"
                    className="font-label text-xs font-bold uppercase tracking-wider text-[#6d5e00] group-hover:underline flex items-center gap-1"
                  >
                    <span>Register as Mentor</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Access Bar */}
            <div className="mt-3 text-center text-xs font-sans text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#094cb2] hover:underline">
                Log In to your workspace →
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 font-label">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Begin Persona Onboarding</span>
              <span>→</span>
            </Link>

            {hasAssessment ? (
              <Link
                href="/results"
                className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <span>Read Previous Dossier</span>
              </Link>
            ) : (
              <Link
                href="/assessment"
                className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <span>Direct Examination (7 Questions)</span>
              </Link>
            )}
          </div>

          {/* Archival Attributes Banner */}
          <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-[11px] font-label uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#094cb2]" />
              7-Day Experiential DAG Trees
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6d5e00]" />
              Quantified Domain Pivot Index
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Zero Commercial Sponsorship
            </span>
          </div>
        </section>

        {/* ── 3 Core Pillars (Scholarly Tomes) ─────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-sm bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-[#094cb2] absolute left-0 top-0" />
            <span className="font-label text-[10px] font-bold tracking-widest uppercase text-[#094cb2] block">
              Tome I • Psychometrics
            </span>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Deterministic Trait Matrix
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              We decompose problem-solving style across six vectors (Logic, Data, Empathy, Rhetoric, Precision, and Ambiguity Tolerance) calibrated against launch professions.
            </p>
          </div>

          <div className="p-7 rounded-sm bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-[#6d5e00] absolute left-0 top-0" />
            <span className="font-label text-[10px] font-bold tracking-widest uppercase text-[#6d5e00] block">
              Tome II • Pivot Calibration
            </span>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Domain Pivot Index
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Calculates empirical variance between your academic baseline (PCM, PCB, Engineering, Commerce) and latent cognitive affinities to detect high-confidence pivot vectors.
            </p>
          </div>

          <div className="p-7 rounded-sm bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-slate-700 absolute left-0 top-0" />
            <span className="font-label text-[10px] font-bold tracking-widest uppercase text-slate-700 block">
              Tome III • Practical Immersion
            </span>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              7-Day Experiential DAG
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Skip speculative videos. Complete structured workplace simulation nodes featuring code repair, SQL queries, contract clause audits, and clinical triage challenges.
            </p>
          </div>
        </section>

        {/* ── Curated Launch Professions Folio ─────────────────────────────────── */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-label text-[10px] font-bold tracking-widest uppercase text-slate-500 block">
                Primary Archival Exhibits
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950">
                Curated Vocational Pathways
              </h2>
            </div>
            <span className="font-label text-xs text-slate-500">
              Phase 1 Launch Disciplines • 17 Expanded Growth Roles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAUNCH_PROFESSIONS.map((p) => (
              <div
                key={p.slug}
                className="p-6 rounded-sm bg-white border border-slate-200 hover:border-[#094cb2] transition-colors shadow-xs flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-sm bg-slate-100 border border-slate-200">
                      {p.icon}
                    </span>
                    <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 uppercase tracking-widest border border-slate-200">
                      {p.folio}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#094cb2] transition-colors">
                      {p.role}
                    </h3>
                    <span className="font-label text-[10px] uppercase tracking-wider text-slate-500 block mt-0.5">
                      {p.domain}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-label">
                  <span className="text-slate-500">{p.traits}</span>
                  <Link
                    href={`/pathway/${p.slug}`}
                    className="font-bold text-[#094cb2] hover:underline"
                  >
                    View DAG →
                  </Link>
                </div>
              </div>
            ))}

            {/* Curated Consultation Card */}
            <div className="p-6 rounded-sm bg-[#fef3c7] border border-[#fde68a] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="font-label text-[10px] font-bold tracking-widest uppercase text-[#453b00] block">
                  Diagnostic Diagnostic Advisory
                </span>
                <h3 className="font-serif text-lg font-bold text-[#453b00]">
                  Uncertain of Your Alignment?
                </h3>
                <p className="font-sans text-xs text-[#5c4e00] leading-relaxed">
                  Take the standardized 7-question psychological diagnostic to compute whether your current degree stream matches your natural cognitive aptitude.
                </p>
              </div>

              <Link
                href="/assessment"
                className="w-full py-2.5 rounded-sm bg-[#6d5e00] hover:bg-[#544800] text-white font-label font-bold text-xs uppercase tracking-wider text-center transition shadow-xs"
              >
                Launch Diagnostic Examination →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Scholarly Colophon & Footer ─────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 sm:px-10 text-xs font-label text-slate-500 relative z-10 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-serif text-slate-800 font-semibold">
              PathNavigate — Alexandria Digital Curator
            </p>
            <p className="text-[11px] text-slate-400">
              © 2026 PathNavigate Foundation. Standardized Vocational Diagnostic &amp; Experiential Skill Tree Infrastructure for India.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAnalyticsOpen(true)}
            className="px-3.5 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]"
          >
            <span>📊</span>
            <span>Live Telemetry &amp; Test Metrics</span>
          </button>
        </div>
      </footer>

      {/* ── Judge & User Testing Analytics Modal ──────────────────────── */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}
