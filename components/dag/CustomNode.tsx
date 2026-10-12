"use client";

// components/dag/CustomNode.tsx
// Alexandria High-End Editorial - Custom React Flow Node Component with Scholarly Folio Badges & State Seals

import { memo } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { DAGNodeData } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";

export type CustomNodeType = Node<DAGNodeData, "custom">;

function CustomNodeComponent({ data }: NodeProps<CustomNodeType>) {
  const nodeData = data as DAGNodeData;
  const { getNodeStatus, activeNodeId } = useDAGStore();
  const status = getNodeStatus(nodeData.id);
  const isActive = activeNodeId === nodeData.id;

  const isCompleted = status === "completed";
  const isUnlocked = status === "unlocked";

  return (
    <div
      className={`relative rounded-2xl p-4 w-[240px] select-none transition-all duration-200 cursor-pointer shadow-sm ${
        isCompleted
          ? "bg-[#fefce8] border-2 border-[#6d5e00] shadow-md text-slate-900"
          : isUnlocked
          ? `bg-white border-2 ${
              isActive
                ? "border-[#094cb2] ring-4 ring-[#094cb2]/20"
                : "border-[#094cb2] ring-2 ring-[#094cb2]/10"
            } shadow-md text-slate-900 hover:scale-[1.02]`
          : "bg-slate-100/90 border border-slate-300 shadow-sm text-slate-800 cursor-not-allowed hover:bg-slate-100"
      }`}
    >
      {/* ── Top Target Handle for incoming edges ─────────────────────── */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white !rounded-full -top-1.5"
      />

      {/* ── Card Content ────────────────────────────────────────────── */}
      <div className="space-y-2">
        {/* Header row: Day Pill + Status Seal */}
        <div className="flex items-center justify-between">
          <span
            className={`font-label text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
              isCompleted
                ? "bg-[#fef3c7] text-[#453b00] border border-[#fde68a]"
                : isUnlocked
                ? "bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20"
                : "bg-slate-200 text-slate-700 border border-slate-300 font-bold"
            }`}
          >
            Day 0{nodeData.day}
          </span>

          {/* Status Indicator Icon */}
          <div className="flex items-center">
            {isCompleted ? (
              <span className="w-5 h-5 rounded-full bg-[#6d5e00] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                ✓
              </span>
            ) : isUnlocked ? (
              <span className="w-5 h-5 rounded-full bg-[#094cb2]/10 border border-[#094cb2]/30 flex items-center justify-center text-[10px] text-[#094cb2]">
                ⚡
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] text-slate-700">
                🔒
              </span>
            )}
          </div>
        </div>

        {/* Node Title & Subtitle */}
        <div>
          <h4
            className={`font-serif font-bold text-sm tracking-tight leading-snug line-clamp-2 ${
              isCompleted
                ? "text-[#453b00]"
                : isUnlocked
                ? "text-slate-900"
                : "text-slate-800"
            }`}
          >
            {nodeData.title}
          </h4>
          <p
            className={`font-sans text-[11px] mt-0.5 truncate ${
              isCompleted
                ? "text-[#6d5e00]"
                : isUnlocked
                ? "text-slate-600"
                : "text-slate-600 font-medium"
            }`}
          >
            {nodeData.subtitle}
          </p>
        </div>
      </div>

      {/* ── Bottom Source Handle for outgoing edges ──────────────────── */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white !rounded-full -bottom-1.5"
      />
    </div>
  );
}

export default memo(CustomNodeComponent);
