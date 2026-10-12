"use client";

// components/dag/PathwayClient.tsx
// Alexandria High-End Editorial - Client Component for 7-Day DAG Workspace

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDAGStore } from "@/store/useDAGStore";
import { getRoleDAG } from "@/lib/dagData";
import DAGCanvas from "@/components/dag/DAGCanvas";
import NodeDrawer from "@/components/dag/NodeDrawer";
import PivotOverlayModal from "@/components/dag/PivotOverlayModal";
import CompletionModal from "@/components/dag/CompletionModal";

export default function PathwayClient({ roleId }: { roleId: string }) {
  const { user } = useAuth();

  const {
    activeRoleId,
    setActiveRole,
    completedNodeIds,
    resetGraph,
    isCelebrationOpen,
    closeCelebration,
    getCompletionPercentage,
  } = useDAGStore();

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize store with active role and user UID
  useEffect(() => {
    setMounted(true);
    const validRole = getRoleDAG(roleId);
    setActiveRole(validRole.roleId, user?.uid || "guest_uid");
  }, [roleId, user, setActiveRole]);

  const roleGraph = getRoleDAG(roleId);
  const totalDays = roleGraph.nodes.length || 7;
  const completedDaysCount = completedNodeIds.length;
  const completionPercentage = getCompletionPercentage();

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00] pb-16">
      {/* ── Top Masthead Bar ─────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#094cb2] flex items-center justify-center font-serif font-black text-white text-sm shadow-sm">
              P
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-slate-950 hidden sm:inline">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roleGraph.roleIcon}</span>
            <span className="font-serif font-bold text-sm sm:text-base text-slate-950">
              {roleGraph.roleTitle} Experiential DAG
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="font-label text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 transition shadow-sm flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Switch Domain</span>
          </button>

          <Link
            href="/results"
            className="font-label text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition hidden md:inline"
          >
            Diagnostic Dossier
          </Link>
        </div>
      </header>

      {/* ── Sub-Header & Progress Tracker ────────────────────────────── */}
      <div className="relative z-10 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
                7-Day Experiential Skill Tree
              </span>
              <span className="font-label text-xs font-bold text-slate-700">
                {completedDaysCount} of {totalDays} Days Completed ({completionPercentage}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-64 sm:w-80 bg-slate-200/80 h-2 rounded-full overflow-hidden mt-1.5 border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-[#094cb2] to-[#1d63d8] transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset your completion progress for this pathway?")) {
                  resetGraph(user?.uid || "guest_uid");
                }
              }}
              className="font-label text-xs uppercase tracking-wider font-bold text-slate-600 hover:text-slate-950 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200/60"
            >
              Reset Graph State
            </button>

            {completedDaysCount >= totalDays && (
              <Link
                href={`/roadmap/${roleGraph.roleId}`}
                className="font-label text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl bg-[#6d5e00] hover:bg-[#857300] text-white shadow-md transition flex items-center gap-1.5"
              >
                <span>Full Career Roadmap →</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Canvas Viewport ─────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-6 flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between font-label text-xs text-slate-700 font-semibold px-1 uppercase tracking-wider">
          <span>Select any unlocked folio node to initiate workplace simulation.</span>
          <span className="hidden sm:inline">Use mouse scroll or pinch to zoom &amp; pan canvas blueprint.</span>
        </div>

        {/* React Flow DAG Visualizer */}
        <DAGCanvas roleId={roleGraph.roleId} />
      </main>

      {/* ── Slide-over Sheet Drawer ──────────────────────────────────── */}
      <NodeDrawer />

      {/* ── Mid-Flight Pivot Overlay Modal ────────────────────────────── */}
      <PivotOverlayModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        currentRoleId={roleGraph.roleId}
      />

      {/* ── 7-Day Completion Celebration Modal ──────────────────────── */}
      <CompletionModal
        isOpen={isCelebrationOpen}
        onClose={closeCelebration}
        roleId={roleGraph.roleId}
        onOpenPivot={() => setIsSwitchModalOpen(true)}
      />
    </div>
  );
}
