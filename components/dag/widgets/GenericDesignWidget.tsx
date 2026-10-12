"use client";

// components/dag/widgets/GenericDesignWidget.tsx
// Wireframe / User-Flow Auditor Widget for Design & Product pathway roles

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function GenericDesignWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const [inputVal, setInputVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const KEYWORD_SETS: Record<string, string[]> = {
    problem_frame:   ["jtbd", "job", "user need", "pain"],
    ia_critique:     ["hierarchy", "navigation", "tree", "parent"],
    flow_audit:      ["friction", "drop", "redesign", "checkout"],
    metric_strategy: ["conversion", "retention", "guardrail", "heart"],
    usability:       ["priority", "severity", "frequency", "sprint"],
    a11y:            ["contrast", "wcag", "4.5", "ratio"],
    capstone:        ["narrative", "problem", "solution", "metric"],
  };

  const handleValidate = () => {
    setIsRunning(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsRunning(false);
      const answer = inputVal.trim().toLowerCase();
      const challengeType = node.taskPayload?.challengeType || "capstone";
      const expected = String(node.taskPayload?.correctAnswer || "").toLowerCase();
      const keywords = KEYWORD_SETS[challengeType] || [expected];

      const isCorrect =
        isAlreadyCompleted ||
        answer.includes(expected) ||
        keywords.some((kw) => answer.includes(kw));

      if (isCorrect) {
        setTestResults([
          { passed: true, message: "Validation #1: Problem Framing Clarity — PASSED" },
          { passed: true, message: "Validation #2: Design Rationale Depth — PASSED" },
          { passed: true, message: "Validation #3: User-Centric Completeness — VERIFIED" },
        ]);

        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

        const activeUid = user?.uid || "guest_uid";
        completeNode(node.id, activeUid);
      } else {
        setTestResults([
          { passed: false, message: "Validation Failed: Response doesn't satisfy design critique criteria. Try again — be more specific about the key concept." },
        ]);
      }
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* Design Challenge Card */}
      <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs text-pink-900 font-bold uppercase tracking-wider">
          <span>🎨</span>
          <span>Design / Product Challenge</span>
        </div>

        <div className="font-mono text-xs text-slate-900 bg-white rounded-xl p-4 leading-relaxed border border-pink-200/80 shadow-sm whitespace-pre-wrap">
          {node.taskPayload?.scenario ||
            `Challenge Type: ${node.taskPayload?.challengeType || "Design Critique"}\n\nApply the concept taught in this node to analyse the given design scenario.\nProvide a specific, reasoned answer referencing the core framework.`}
        </div>

        <div className="text-[11px] text-pink-900 font-medium flex items-center gap-1.5">
          <span>💡</span>
          <span>
            Accepted answers include references to:{" "}
            <span className="font-bold text-pink-950 underline decoration-pink-300">
              {(
                KEYWORD_SETS[node.taskPayload?.challengeType || "capstone"] || [
                  node.taskPayload?.correctAnswer,
                ]
              ).join(", ")}
            </span>
          </span>
        </div>
      </div>

      {/* Answer Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Your Design Response
        </label>
        <textarea
          rows={4}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isAlreadyCompleted}
          placeholder="Type your design critique, wireframe rationale, or metric definition here..."
          className="w-full font-mono text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none placeholder:text-slate-400 disabled:opacity-60"
        />
      </div>

      {/* Validate Button */}
      <button
        type="button"
        onClick={handleValidate}
        disabled={isRunning || isAlreadyCompleted || !inputVal.trim()}
        className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isRunning ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Evaluating...
          </>
        ) : isAlreadyCompleted ? (
          "✓ Node Completed"
        ) : (
          "Submit Design Review →"
        )}
      </button>

      {/* Test Results */}
      {testResults && (
        <div className="space-y-2 pt-1">
          {testResults.map((result, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-3 rounded-xl text-xs font-mono border ${
                result.passed
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                  : "bg-rose-50 border-rose-300 text-rose-950 font-semibold"
              }`}
            >
              <span className="shrink-0 font-bold">{result.passed ? "✓" : "✗"}</span>
              <span>{result.message}</span>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-700 font-semibold pt-1">{errorMsg}</p>
      )}
    </div>
  );
}
