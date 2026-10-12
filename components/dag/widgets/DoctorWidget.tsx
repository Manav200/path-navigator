"use client";

// components/dag/widgets/DoctorWidget.tsx
// Interactive Clinical Scenario & Differential Diagnostic Runner for Doctor pathway

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function DoctorWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const options: string[] = node.taskPayload?.options || [
    "Immediate IV resuscitation",
    "Non-urgent observation",
  ];
  const correctAnswer: string = node.taskPayload?.correctAnswer || options[0];

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isTreating, setIsTreating] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleAdminister = () => {
    setIsTreating(true);
    setFeedback(null);

    setTimeout(() => {
      setIsTreating(false);
      const isCorrect = selectedOption === correctAnswer || isAlreadyCompleted;

      if (isCorrect) {
        setFeedback({
          success: true,
          message: "Clinical intervention successful! Patient hemodynamics stabilized and diagnostic pathway verified.",
        });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        completeNode(node.id, user?.uid || "guest_uid");
      } else {
        setFeedback({
          success: false,
          message: "Patient decompensation risk! Re-evaluate triage protocols and urgent clinical priorities.",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Patient Monitor Telemetry Card */}
      <div className="rounded-2xl bg-black/70 border border-white/[0.1] overflow-hidden text-xs">
        <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white/90">Emergency ICU Bedside Monitor</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Patient: Male, 48y</span>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 block">BLOOD PRESSURE</span>
            <span className="text-base font-bold text-rose-400">80/50</span>
            <span className="text-[9px] text-rose-300/80 block">HYPOTENSIVE</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 block">HEART RATE</span>
            <span className="text-base font-bold text-amber-400">125 bpm</span>
            <span className="text-[9px] text-amber-300/80 block">TACHYCARDIA</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 block">RESPIRATION</span>
            <span className="text-base font-bold text-white">26 /min</span>
            <span className="text-[9px] text-white/40 block">TACHYPNEA</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 block">SPO2</span>
            <span className="text-base font-bold text-cyan-400">93%</span>
            <span className="text-[9px] text-cyan-300/80 block">BORDERLINE</span>
          </div>
        </div>
      </div>

      {/* Clinical Differential Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
          Select Primary Intervention / Differential Diagnosis:
        </label>
        <div className="space-y-2">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-violet-50 border-violet-500 text-violet-950 font-semibold shadow-sm ring-1 ring-violet-500/50"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-violet-600 bg-violet-600" : "border-slate-300"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleAdminister}
          disabled={isTreating || (!selectedOption && !isAlreadyCompleted)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide uppercase transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isTreating ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : isAlreadyCompleted ? (
            "Re-run Clinical Protocol ✓"
          ) : (
            "Execute Clinical Intervention"
          )}
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs border ${
            feedback.success
              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
              : "bg-rose-50 border-rose-300 text-rose-950 font-semibold"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.success ? "✓ Clinical Success:" : "✗ Clinical Error:"}</span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {isAlreadyCompleted && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2">
          <span>✓</span> Node successfully validated and unlocked downstream graph!
        </div>
      )}
    </div>
  );
}
