"use client";

// components/dag/CompletionModal.tsx
// Alexandria High-End Editorial - 7-Day Completion Conferral Celebration Dialog

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { getRoleDAG } from "@/lib/dagData";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  onOpenPivot: () => void;
}

export default function CompletionModal({
  isOpen,
  onClose,
  roleId,
  onOpenPivot,
}: CompletionModalProps) {
  const roleGraph = getRoleDAG(roleId);

  // Trigger confetti burst on modal mount
  useEffect(() => {
    if (isOpen) {
      const end = Date.now() + 1.2 * 1000;
      const colors = ["#094cb2", "#6d5e00", "#10b981", "#fef3c7"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative max-w-lg w-full p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200 overflow-hidden text-slate-900">
        {/* Milestone Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-4xl mx-auto shadow-md">
            🏆
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full font-label text-[10px] font-black tracking-widest uppercase bg-[#6d5e00] text-white shadow-sm">
            100% Mastered
          </span>
        </div>

        {/* Header Text */}
        <div className="space-y-2 pt-2">
          <span className="font-label text-xs font-bold uppercase tracking-widest text-[#6d5e00]">
            Milestone Conferral
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            7-Day Experiential Pathway Complete!
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            You have successfully completed all real-world workplace simulation praxis folios for{" "}
            <strong className="text-slate-900 font-semibold">{roleGraph.roleTitle}</strong>.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left font-sans">
          <div className="space-y-0.5">
            <span className="font-label text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Nodes Completed</span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#6d5e00]">7 / 7</span>
          </div>
          <div className="space-y-0.5 border-x border-slate-200 px-3">
            <span className="font-label text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Micro-Tasks</span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#094cb2]">Simulated</span>
          </div>
          <div className="space-y-0.5 pl-1">
            <span className="font-label text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Competency</span>
            <span className="font-serif text-base sm:text-lg font-bold text-emerald-700">Level 1 Ready</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary CTA */}
          <Link
            href={`/roadmap/${roleGraph.roleId}`}
            onClick={onClose}
            className="w-full py-4 px-6 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#094cb2]/20 active:scale-[0.98] transition flex items-center justify-center gap-2 group"
          >
            <span>Unlock 3-Horizon Long-Term Roadmap</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {/* Secondary CTAs */}
          <div className="flex items-center gap-2 pt-1 font-label">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPivot();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 border border-slate-200 transition"
            >
              🔄 Explore Alternative Pathway
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              Review Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
