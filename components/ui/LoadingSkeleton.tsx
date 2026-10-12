"use client";

// components/ui/LoadingSkeleton.tsx
// Alexandria High-End Editorial - Loading states for Llama AI inference and DAG tree visualizer

import { useEffect, useState } from "react";

const LLAMA_LOADING_PHASES = [
  "Parsing cognitive traits & algorithmic thinking patterns...",
  "Evaluating stream alignment against Indian curriculum baselines...",
  "Consulting Groq Llama 3 neural evaluation engine...",
  "Computing domain pivot gap vs. current discipline...",
  "Synthesizing top career matches & fit score vectors...",
  "Generating personalized 7-Day Experiential DAG nodes...",
];

export function LlamaDiagnosisSkeleton({ phaseIndex }: { phaseIndex?: number }) {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (phaseIndex !== undefined) {
      setCurrentPhase(phaseIndex % LLAMA_LOADING_PHASES.length);
      return;
    }
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % LLAMA_LOADING_PHASES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [phaseIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-7 animate-in fade-in zoom-in-95 duration-300">
        {/* Scholarly Seal Spinner */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#094cb2]/10 animate-pulse" />
          <div className="w-20 h-20 rounded-full border-2 border-slate-200 border-t-[#094cb2] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl">🏛️</span>
            <span className="font-label text-[9px] font-extrabold text-[#094cb2] tracking-widest uppercase mt-0.5">
              Curator
            </span>
          </div>
        </div>

        {/* Phase Message */}
        <div className="space-y-2">
          <span className="font-label px-3 py-1 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase tracking-widest">
            Diagnostic Synthesis in Progress
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-950 tracking-tight">
            Synthesizing Career Monograph
          </h2>
          <p className="font-sans text-slate-600 text-xs sm:text-sm h-12 flex items-center justify-center px-2 transition-all duration-300 italic">
            "{LLAMA_LOADING_PHASES[currentPhase]}"
          </p>
        </div>

        {/* Dynamic Multi-Step Progress Tracker */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#094cb2] to-[#1d63d8] transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, ((currentPhase + 1) / LLAMA_LOADING_PHASES.length) * 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between font-label text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Psychometric Baseline</span>
            <span>Neural Inference</span>
            <span>Curriculum DAG</span>
          </div>
        </div>

        <p className="font-sans text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
          Reconciling deterministic psychometrics with Groq-accelerated Llama reasoning against Indian industry benchmarks.
        </p>
      </div>
    </div>
  );
}

export function DAGCanvasSkeleton() {
  return (
    <div className="w-full h-[620px] rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between p-8">
      {/* Header controls skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      {/* Mock DAG Node Skeletons */}
      <div className="flex flex-col items-center gap-10 my-auto">
        {/* Node 1 */}
        <div className="w-64 h-20 rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-3/4 bg-slate-200 rounded" />
            <div className="h-2 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-8 bg-slate-300 animate-pulse" />

        {/* Node 2 & 3 Parallel */}
        <div className="flex items-center gap-8">
          <div className="w-56 h-20 rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
              <div className="h-2 w-1/2 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="w-56 h-20 rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
              <div className="h-2 w-1/2 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint skeleton */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-label">
        <div className="h-3 w-36 bg-slate-100 rounded" />
        <div className="h-3 w-28 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-2.5 w-1/3 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
