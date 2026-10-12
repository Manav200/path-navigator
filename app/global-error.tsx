"use client";

// app/global-error.tsx
// Root-level Error Boundary for Next.js App Router
// Catches any unexpected crash in the root layout with a clean recovery UI.

import { useEffect } from "react";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Layout Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-slate-100 min-h-screen flex items-center justify-center p-6 selection:bg-violet-500/30">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0f0f1a] border border-white/[0.1] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto">
            ⚡
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Temporary Connection Notice
            </h1>
            <p className="text-xs text-white/60 leading-relaxed">
              We encountered a temporary interface loading issue. Your data and progress remain safe.
              Please reload to continue your session.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-violet-500/30"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
