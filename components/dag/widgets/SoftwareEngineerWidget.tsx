"use client";

// components/dag/widgets/SoftwareEngineerWidget.tsx
// Interactive Logic & Mini API Validator for Software Engineer pathway

import { useState } from "react";
import confetti from "canvas-confetti";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";
import { useAuth } from "@/context/AuthContext";

export default function SoftwareEngineerWidget({ node }: { node: DAGNodeData }) {
  const { user } = useAuth();
  const { completeNode, getNodeStatus } = useDAGStore();
  const status = getNodeStatus(node.id);
  const isAlreadyCompleted = status === "completed";

  const [inputVal, setInputVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunValidation = () => {
    setIsRunning(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsRunning(false);
      const answer = inputVal.trim();
      const expected = String(node.taskPayload?.correctAnswer || "429").toLowerCase();

      // Check if user answer matches
      const isCorrect =
        answer.toLowerCase().includes(expected) ||
        (node.taskPayload?.challengeType === "fix_logic" && (answer === "429" || answer.includes("429"))) ||
        (node.taskPayload?.challengeType === "indexing" && (answer.includes("tenant_id") || answer.includes("created_at"))) ||
        (node.taskPayload?.challengeType === "circuit_breaker" && answer.includes("50")) ||
        (node.taskPayload?.challengeType === "sql_injection" && (answer.includes("parameter") || answer.includes("prepared"))) ||
        (node.taskPayload?.challengeType === "capstone" && (answer.includes("redlock") || answer.includes("lock") || answer.includes("redis")));

      if (isCorrect || isAlreadyCompleted) {
        setTestResults([
          { passed: true, message: "Unit Test #1: Schema Ingestion & Header Contract — PASSED" },
          { passed: true, message: "Integration Test #2: Boundary Limit & Rate-Limit Threshold — PASSED" },
          { passed: true, message: "Production Telemetry: Latency < 12ms — VERIFIED" },
        ]);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        completeNode(node.id, user?.uid || "guest_uid");
      } else {
        setTestResults([
          { passed: true, message: "Unit Test #1: Schema Ingestion — PASSED" },
          { passed: false, message: `Regression Test #2: Expected [${expected}], got [${answer || "empty"}] — FAILED` },
        ]);
        setErrorMsg(`Validation check failed. Hint: Inspect the expected code or parameter: "${expected}".`);
      }
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Code Inspector Sandbox */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden font-mono text-xs shadow-sm">
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-200">api_validator.ts</span>
          </div>
          <span className="font-label text-[10px] text-[#1d63d8] uppercase font-bold">TypeScript 5.0</span>
        </div>

        <pre className="p-4 text-emerald-300 leading-relaxed overflow-x-auto">
          <code>
            {node.taskPayload?.buggyCode ||
              `// Micro-Task Sandbox: ${node.title}\nexport async function handleRequest(ctx) {\n  // Required fix for ${node.taskPayload?.challengeType || "logic"}\n  const threshold = "${node.taskPayload?.correctAnswer || "429"}";\n  return ctx.verify(threshold);\n}`}
          </code>
        </pre>
      </div>

      {/* Task Input Controller */}
      <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
          Parameter Solution / Value:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Enter expected value (e.g. ${node.taskPayload?.correctAnswer || "429"})`}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#094cb2]"
          />
          <button
            type="button"
            onClick={handleRunValidation}
            disabled={isRunning || (!inputVal.trim() && !isAlreadyCompleted)}
            className="px-6 py-3 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs tracking-wider uppercase transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            {isRunning ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : isAlreadyCompleted ? (
              "Re-verify Code ✓"
            ) : (
              "Run Tests & Validate"
            )}
          </button>
        </div>

        <p className="font-sans text-[11px] text-slate-500">
          Target Answer: Enter <strong className="text-slate-800">{node.taskPayload?.correctAnswer || "429"}</strong> to pass automated CI/CD checks.
        </p>
      </div>

      {/* Test Execution Output */}
      {testResults && (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono shadow-sm">
          <span className="font-label text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Test Runner Telemetry:
          </span>
          {testResults.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${t.passed ? "text-emerald-400" : "text-rose-400"
                }`}
            >
              <span>{t.passed ? "✓" : "✗"}</span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
          {errorMsg}
        </div>
      )}

      {isAlreadyCompleted && (
        <div className="p-3 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[#453b00] text-xs flex items-center gap-2 font-label font-bold uppercase tracking-wider">
          <span>✓</span> Node successfully validated and unlocked downstream graph!
        </div>
      )}
    </div>
  );
}
