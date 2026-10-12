"use client";

// components/dag/NodeDrawer.tsx
// Alexandria High-End Editorial - Slide-over Dossier Sheet displaying curriculum notes, objectives, and embedding the micro-project task runner

import { useState } from "react";
import { useDAGStore } from "@/store/useDAGStore";
import { getRoleDAG } from "@/lib/dagData";
import SoftwareEngineerWidget from "./widgets/SoftwareEngineerWidget";
import BusinessAnalystWidget from "./widgets/BusinessAnalystWidget";
import LawyerWidget from "./widgets/LawyerWidget";
import DoctorWidget from "./widgets/DoctorWidget";
import PharmacistWidget from "./widgets/PharmacistWidget";
import GenericDesignWidget from "./widgets/GenericDesignWidget";

export default function NodeDrawer() {
  const {
    activeNodeId,
    activeRoleId,
    isDrawerOpen,
    closeDrawer,
    getNodeStatus,
    openNode,
  } = useDAGStore();

  const [activeTab, setActiveTab] = useState<"task" | "concept">("task");

  if (!isDrawerOpen || !activeNodeId) return null;

  const roleGraph = getRoleDAG(activeRoleId);
  const nodeObj = roleGraph.nodes.find((n) => n.id === activeNodeId);
  if (!nodeObj) return null;

  const nodeData = nodeObj.data;
  const status = getNodeStatus(nodeData.id);
  const isCompleted = status === "completed";

  // Find next unlocked node if completed
  const nextNode = roleGraph.nodes.find(
    (n) => n.data.day === nodeData.day + 1
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* ── Top Header ────────────────────────────────────────────── */}
          <div>
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 tracking-wider">
                    Folio Day 0{nodeData.day} Micro-Task
                  </span>
                  {isCompleted && (
                    <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span> Mastered
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-950 tracking-tight pt-1">
                  {nodeData.title}
                </h3>
                <p className="font-sans text-xs text-slate-500">{nodeData.subtitle}</p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeDrawer}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition shrink-0 border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* ── Tab Switcher ─────────────────────────────────────────── */}
            <div className="px-6 pt-4 flex gap-6 border-b border-slate-200 font-label text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("task")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "task"
                    ? "border-[#094cb2] text-[#094cb2] font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                ⚡ Hands-on Workplace Task
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("concept")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "concept"
                    ? "border-[#094cb2] text-[#094cb2] font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                📖 Scholarly Theory &amp; Notes
              </button>
            </div>

            {/* ── Tab Body Content ─────────────────────────────────────── */}
            <div className="p-6 space-y-6">
              {activeTab === "task" ? (
                <div className="space-y-5">
                  {/* Task Instructions */}
                  <div className="p-4 rounded-2xl bg-[#094cb2]/5 border border-[#094cb2]/15 text-xs text-slate-800 leading-relaxed font-sans">
                    <strong className="font-label uppercase tracking-wider text-[#094cb2] block mb-1 text-[11px]">
                      Workplace Simulation Directive:
                    </strong>
                    {nodeData.taskInstructions}
                  </div>

                  {/* Render Widget Based on Role Widget Type */}
                  {/* ── Original 5 hand-crafted widgets ──────────────────── */}
                  {nodeData.widgetType === "se_logic" && (
                    <SoftwareEngineerWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "ba_sql" && (
                    <BusinessAnalystWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "law_clause" && (
                    <LawyerWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "doc_diag" && (
                    <DoctorWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "pharm_audit" && (
                    <PharmacistWidget node={nodeData} />
                  )}

                  {/* ── Expanded domain category widgets ──────────────────── */}
                  {nodeData.widgetType === "tech_logic" && (
                    <SoftwareEngineerWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "data_query" && (
                    <BusinessAnalystWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "case_strategy" && (
                    <LawyerWidget node={nodeData} />
                  )}
                  {nodeData.widgetType === "design_flow" && (
                    <GenericDesignWidget node={nodeData} />
                  )}
                </div>
              ) : (
                <div className="space-y-6 text-xs leading-relaxed text-slate-700">
                  <div className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-950">Architectural Summary</h4>
                    <p className="font-sans text-slate-600 leading-relaxed">
                      {nodeData.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-950">Core Industry Concepts</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {nodeData.keyConcepts.map((kc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]"
                        >
                          {kc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fef3c7]/60 border border-[#fde68a] text-[#453b00] text-[11px] leading-relaxed font-sans">
                    💡 <strong>Real Workplace Relevance:</strong> Unlike generic multiple-choice quizzes, completing this node simulates the exact workflow expected from junior-to-mid practitioners in leading enterprises.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom Drawer Footer ─────────────────────────────────── */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeDrawer}
              className="font-label text-xs uppercase tracking-wider font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition"
            >
              Dismiss Folio
            </button>

            {isCompleted && nextNode && (
              <button
                type="button"
                onClick={() => openNode(nextNode.id)}
                className="font-label text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-xl bg-[#094cb2] hover:bg-[#1d63d8] text-white shadow-md transition flex items-center gap-1.5"
              >
                <span>Advance to Day 0{nextNode.data.day}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
