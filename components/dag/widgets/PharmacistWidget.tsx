"use client";

// components/dag/widgets/PharmacistWidget.tsx
// Interactive Drug Dosage & Interaction Safety Auditor for Pharmacist pathway

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function PharmacistWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const options: string[] = node.taskPayload?.options || [
    "Flag severe hemorrhage risk",
    "Approve co-prescription without changes",
  ];
  const correctAnswer: string = node.taskPayload?.correctAnswer || options[0];

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleAudit = () => {
    setIsAuditing(true);
    setFeedback(null);

    setTimeout(() => {
      setIsAuditing(false);
      const isCorrect = selectedOption === correctAnswer || isAlreadyCompleted;

      if (isCorrect) {
        setFeedback({
          success: true,
          message: "Pharmacovigilance clearance approved! Hazardous drug-drug interaction intercepted and safe regimen verified.",
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
          message: "Patient safety alert: Toxic metabolic accumulation risk undetected. Review pharmacokinetic half-lives.",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Patient Prescription Audit Box */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden text-xs shadow-sm">
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-slate-700">
          <span className="font-bold text-slate-900">Hospital Clinical Formulary Prescription</span>
          <span className="text-[10px] text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">Rx #49204-IN</span>
        </div>

        <div className="p-4 space-y-3 font-mono">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-900 font-bold block text-sm">Medication 1: Warfarin Sodium</span>
              <span className="text-slate-600 text-[11px]">Dose: 5 mg PO Daily • Indication: Atrial Fibrillation</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border border-amber-200 font-bold">
              Narrow Therapeutic Index
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-900 font-bold block text-sm">Medication 2: Clarithromycin</span>
              <span className="text-slate-600 text-[11px]">Dose: 500 mg PO BID • Indication: Respiratory Infection</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-900 border border-rose-200 font-bold">
              Potent CYP3A4 Inhibitor
            </span>
          </div>
        </div>
      </div>

      {/* Safety Audit Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
          Select Pharmacological Intervention / Audit Decision:
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
          onClick={handleAudit}
          disabled={isAuditing || (!selectedOption && !isAlreadyCompleted)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide uppercase transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isAuditing ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : isAlreadyCompleted ? (
            "Re-run Formulary Safety Audit ✓"
          ) : (
            "Submit Formulary Safety Audit"
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
            <span>{feedback.success ? "✓ Audit Approved:" : "✗ Audit Failed:"}</span>
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
