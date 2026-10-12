"use client";

// app/register/page.tsx
// Alexandria High-End Editorial — Dual-Role Pathway Selection
// Allows users to initiate registration either as a Student / Learner or as an Industry Mentor.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/store/useAuthUserStore";

export default function RegisterRoleSelectionPage() {
  const router = useRouter();
  const setRole = useAuthUserStore((s) => s.setRole);

  const handleSelectStudent = () => {
    setRole("student");
    router.push("/onboarding");
  };

  const handleSelectMentor = () => {
    setRole("mentor");
    router.push("/register/mentor");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 flex flex-col justify-between items-center selection:bg-[#fef3c7] selection:text-[#453b00]">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-8 border-b border-slate-200">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white font-bold text-sm shadow-xs">
            PN
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-950 block leading-tight">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
            <span className="font-label text-[10px] tracking-widest uppercase text-slate-500 block">
              Registration Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">Already have an account?</span>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-sm border border-slate-300 hover:border-[#094cb2] hover:text-[#094cb2] bg-white text-slate-700 font-label text-xs uppercase font-bold tracking-wider transition shadow-2xs"
          >
            Log In
          </Link>
        </div>
      </header>

      <div className="max-w-4xl w-full my-auto py-8 space-y-10">
        {/* Navigation Breadcrumb / Tag */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-50 border border-[#fde68a] text-[#6d5e00]">
            <span className="font-label text-[11px] font-bold uppercase tracking-widest">
              ✦ Registration &amp; Onboarding
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight leading-snug">
            Choose Your Registration Pathway
          </h1>
          <p className="font-sans text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Register as a Student to explore career fit and 7-day experiential skill roadmaps, or join as a Mentor to guide candidates and host 1:1 sessions.
          </p>
        </div>

        {/* Dual Role Surface Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {/* Card 1: Student / Learner */}
          <div
            onClick={handleSelectStudent}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelectStudent();
            }}
            className="group relative bg-[#ffffff] rounded-sm p-8 sm:p-10 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer border border-[rgba(148,163,184,0.15)] hover:border-[#094cb2] flex flex-col justify-between"
          >
            {/* Top Accent Indicator */}
            <div className="w-12 h-12 rounded-sm bg-[#094cb2]/10 border border-[#094cb2]/20 flex items-center justify-center text-2xl font-serif text-[#094cb2] mb-6 group-hover:scale-105 transition-transform">
              🎓
            </div>

            <div className="space-y-3 mb-8">
              <span className="font-label text-[11px] font-bold uppercase tracking-widest text-[#094cb2]">
                Curated Track 01
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-950 group-hover:text-[#094cb2] transition-colors">
                Student / Learner
              </h2>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Discover high-fit career paths, take AI diagnostics, explore curated DAG learning roadmaps, and build 7-day micro-projects with simulated industry widgets.
              </p>

              {/* Feature Highlights */}
              <ul className="pt-3 space-y-2 text-xs font-sans text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>AI Career Diagnostic & Alignment Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Interactive Directed Acyclic Graph (DAG) syllabus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Verified 1:1 Executive Mentorship booking</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-label text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#094cb2] transition-colors">
                Begin Student Onboarding
              </span>
              <span className="w-8 h-8 rounded-sm bg-slate-100 group-hover:bg-[#094cb2] group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors text-slate-700">
                →
              </span>
            </div>
          </div>

          {/* Card 2: Industry Mentor */}
          <div
            onClick={handleSelectMentor}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelectMentor();
            }}
            className="group relative bg-[#ffffff] rounded-sm p-8 sm:p-10 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer border border-[rgba(148,163,184,0.15)] hover:border-[#6d5e00] flex flex-col justify-between"
          >
            {/* Top Accent Indicator */}
            <div className="w-12 h-12 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl font-serif text-[#6d5e00] mb-6 group-hover:scale-105 transition-transform">
              ✦
            </div>

            <div className="space-y-3 mb-8">
              <span className="font-label text-[11px] font-bold uppercase tracking-widest text-[#6d5e00]">
                Curated Track 02
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-950 group-hover:text-[#6d5e00] transition-colors">
                Industry Mentor
              </h2>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Guide the next generation of professionals, share real workplace insights, conduct paid 1:1 consultation sessions, and establish your verified editorial credential.
              </p>

              {/* Feature Highlights */}
              <ul className="pt-3 space-y-2 text-xs font-sans text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-[#6d5e00] font-bold">✦</span>
                  <span>Set custom session pricing (INR / USD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#6d5e00] font-bold">✦</span>
                  <span>Automated Razorpay payouts & Google Meet sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#6d5e00] font-bold">✦</span>
                  <span>Featured profile on launch profession directories</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-label text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#6d5e00] transition-colors">
                Register as Verified Mentor
              </span>
              <span className="w-8 h-8 rounded-sm bg-slate-100 group-hover:bg-[#6d5e00] group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors text-slate-700">
                →
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Back Navigation */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="font-label text-xs uppercase font-bold text-slate-500 hover:text-slate-900 tracking-wider transition"
          >
            ← Return to Career Graph
          </Link>
        </div>
      </div>
    </main>
  );
}
