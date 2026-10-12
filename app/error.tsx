"use client";

// app/error.tsx
// Global Error Boundary for Next.js App Router
// Ensures that under any unexpected runtime or rendering error,
// the user is shown a clean, professional, friendly recovery interface
// with empathetic, clear, and actionable guidance — never raw technical errors.

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log technical error securely in the background for debugging
    console.error("[Application Error Intercepted]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center px-6 relative selection:bg-violet-500/30">
      {/* ── Ambient Orbs ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-violet-900/15 blur-[150px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full p-8 rounded-3xl bg-[#0f0f1a] border border-white/[0.1] shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-500/20">
          🛠️
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Temporary Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            We Hit a Brief Interruption
          </h1>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
            A temporary glitch interrupted this page. Your questionnaire responses, account progress,
            and 7-day milestones remain safely preserved in local storage.
          </p>
        </div>

        {/* Helpful Recovery Guidance Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left space-y-2 text-xs text-white/70">
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold mt-0.5">✓</span>
            <span>Your assessment answers and progress are not lost.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-violet-400 font-bold mt-0.5">✓</span>
            <span>You can retry immediately or return to your last visited pathway.</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Try Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/80 hover:text-white border border-white/[0.08] transition text-center"
            >
              Return Home
            </Link>
            <Link
              href="/pathway/software-engineer"
              className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/80 hover:text-white border border-white/[0.08] transition text-center"
            >
              Go to Pathway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
