"use client";

// components/dag/widgets/LawyerWidget.tsx
// Interactive Contract Clause Analyzer & Statutory Argument Builder for Lawyer pathway

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function LawyerWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const options: string[] = node.taskPayload?.options || [
    "Insert mutual liability cap",
    "Accept terms as drafted",
  ];
  const correctAnswer: string = node.taskPayload?.correctAnswer || options[0];

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isFiling, setIsFiling] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmitMotion = () => {
    setIsFiling(true);
    setFeedback(null);

    setTimeout(() => {
      setIsFiling(false);
      const isCorrect = selectedOption === correctAnswer || isAlreadyCompleted;

      if (isCorrect) {
        setFeedback({
          success: true,
          message: "Statutory argument upheld! Legal brief satisfies all judicial tests and protects client interests.",
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
          message: "Judicial objection overruled: The selected counter-clause fails Indian statutory requirements.",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Sample Contract Brief Snippet */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden text-xs shadow-sm">
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-slate-700">
          <span className="font-bold text-slate-900">Draft Commercial Agreement (Excerpt)</span>
          <span className="text-[10px] text-violet-900 bg-violet-100 px-2 py-0.5 rounded border border-violet-200 font-mono font-bold">Sec. 10 &amp; Sec. 27 ICA 1872</span>
        </div>
        <div className="p-4 space-y-2 text-slate-800 leading-relaxed font-serif">
          <p className="text-slate-800 text-[11px] italic font-serif leading-relaxed">
            "Party B agrees that following termination, Party B shall be completely restrained from practicing any legal trade or occupation anywhere in India for 10 years, and agrees to unlimited consequential damages..."
          </p>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-sans text-xs">
            ⚠️ <strong>Legal Flag:</strong> Apparent violation of Section 27 (Agreement in Restraint of Trade is Void) &amp; uncapped liability.
          </div>
        </div>
      </div>

      {/* Counter-Argument Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
          Select Statutory Redline / Legal Argument:
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

      {/* Submit Motion Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmitMotion}
          disabled={isFiling || (!selectedOption && !isAlreadyCompleted)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide uppercase transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isFiling ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : isAlreadyCompleted ? (
            "Re-file Statutory Motion ✓"
          ) : (
            "File Legal Brief & Validate"
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
            <span>{feedback.success ? "✓ Motion Upheld:" : "✗ Judicial Rejection:"}</span>
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
