"use client";

// components/dag/widgets/BusinessAnalystWidget.tsx
// Interactive SQL Query & Metric Drop Inspector for Business Analyst pathway

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function BusinessAnalystWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const options: string[] = node.taskPayload?.options || [
    "AVG(amount) OVER (PARTITION BY user_id)",
    "SELECT * GROUP BY user_id",
  ];
  const correctAnswer: string = node.taskPayload?.correctAnswer || options[0];

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setFeedback(null);

    setTimeout(() => {
      setIsVerifying(false);
      const isCorrect = selectedOption === correctAnswer || isAlreadyCompleted;

      if (isCorrect) {
        setFeedback({
          success: true,
          message: "Data model verified! Cohort integrity confirmed and executive KPI variance resolved.",
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
          message: "Analytical premise incorrect. Re-examine the underlying cohort parameters.",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Mini Dataset Preview Table */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden text-xs shadow-sm">
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-slate-700">
          <span className="font-bold text-slate-900">E-Commerce Cohort Metrics (Sample Slice)</span>
          <span className="text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">SQL Table: analytics_mrr</span>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="p-2">Cohort Month</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Users</th>
                <th className="p-2">D30 Retention</th>
                <th className="p-2">CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              <tr>
                <td className="p-2">2026-Q1</td>
                <td className="p-2 text-cyan-800 font-bold">Organic Search</td>
                <td className="p-2">14,200</td>
                <td className="p-2 text-emerald-800 font-bold">82%</td>
                <td className="p-2">$12</td>
              </tr>
              <tr>
                <td className="p-2">2026-Q1</td>
                <td className="p-2 text-rose-800 font-bold">Paid Social Ads</td>
                <td className="p-2">28,500</td>
                <td className="p-2 text-rose-800 font-bold">12%</td>
                <td className="p-2 text-rose-800 font-bold">$64</td>
              </tr>
              <tr>
                <td className="p-2">2026-Q1</td>
                <td className="p-2 text-cyan-800 font-bold">Referrals</td>
                <td className="p-2">6,800</td>
                <td className="p-2 text-emerald-800 font-bold">74%</td>
                <td className="p-2">$18</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Option Radio Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
          Select Analytical Determination / SQL Clause:
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

      {/* Verification CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || (!selectedOption && !isAlreadyCompleted)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide uppercase transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isVerifying ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : isAlreadyCompleted ? (
            "Re-run Analytics Model ✓"
          ) : (
            "Run Analytics Verification"
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
            <span>{feedback.success ? "✓ Passed:" : "✗ Analysis Error:"}</span>
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
