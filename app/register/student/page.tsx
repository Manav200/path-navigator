"use client";

// app/register/student/page.tsx
// Alexandria High-End Editorial — Student / Candidate Registration Gateway
// Calibrates the student persona and immediately begins the onboarding journey.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/store/useAuthUserStore";
import Link from "next/link";

export default function StudentRegistrationPage() {
  const router = useRouter();
  const setRole = useAuthUserStore((s) => s.setRole);

  useEffect(() => {
    setRole("student");
  }, [setRole]);

  const handleStart = () => {
    setRole("student");
    router.push("/onboarding");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 flex flex-col justify-between items-center selection:bg-[#fef3c7] selection:text-[#453b00]">
      {/* Top Header */}
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
              Student Registration
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-sm border border-slate-300 hover:border-[#094cb2] hover:text-[#094cb2] bg-white text-slate-700 font-label text-xs uppercase font-bold tracking-wider transition shadow-2xs"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-xl w-full my-auto py-10 space-y-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-50 border border-blue-200 text-[#094cb2]">
          <span className="font-label text-[11px] font-bold uppercase tracking-widest">
            🎓 Student &amp; Learner Track
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            Register as a Student / Scholar
          </h1>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Diagnose your genuine cognitive fit with AI psychometrics, test live workplace realities with 7-day experiential DAG skill trees, and book vetted 1:1 mentorship sessions.
          </p>
        </div>

        {/* Benefits Card */}
        <div className="bg-white rounded-sm border border-slate-200 p-6 text-left space-y-3 shadow-xs">
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-slate-500">
            What your student registration includes:
          </h3>
          <ul className="space-y-2 text-sm text-slate-700 font-sans">
            <li className="flex items-start gap-2.5">
              <span className="text-[#094cb2] font-bold">✓</span>
              <span><strong>AI Psychometric Diagnostic:</strong> Pinpoints your natural aptitude across 5 launch professions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#094cb2] font-bold">✓</span>
              <span><strong>7-Day Experiential DAG:</strong> Interactive day-by-day simulated micro-tasks and learning nodes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#094cb2] font-bold">✓</span>
              <span><strong>1:1 Verified Mentorship:</strong> Direct video consultations with senior practitioners.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to Demographic Calibration</span>
            <span>→</span>
          </button>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="font-label text-xs uppercase font-bold text-slate-500 hover:text-slate-900 tracking-wider transition"
            >
              ← Back to Role Selection (or Switch to Mentor)
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-label uppercase tracking-wider">
        PathNavigate · Alexandria Curated Experiential System
      </footer>
    </main>
  );
}
