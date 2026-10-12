// app/not-found.tsx
// 404 Page for PathNavigate

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center px-6 relative selection:bg-violet-500/30">
      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-[#0f0f1a] border border-white/[0.1] shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-xl font-mono font-bold text-violet-400 mx-auto">
          404
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
            The page or pathway you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wide shadow-lg shadow-violet-500/25 active:scale-[0.98] transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
