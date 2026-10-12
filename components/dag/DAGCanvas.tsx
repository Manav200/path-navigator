"use client";

// components/dag/DAGCanvas.tsx
// Alexandria High-End Editorial - React Flow DAG Canvas Visualizer with Scholarly Blueprint Grid & Directional Vectors

import { useMemo, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import { getRoleDAG } from "@/lib/dagData";
import { useDAGStore } from "@/store/useDAGStore";

const nodeTypes = {
  custom: CustomNode as any,
};

export default function DAGCanvas({ roleId }: { roleId: string }) {
  const { openNode, getNodeStatus, completedNodeIds } = useDAGStore();
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const roleGraph = useMemo(() => getRoleDAG(roleId), [roleId]);

  // Transform graph data into React Flow Nodes
  const initialNodes = useMemo(() => {
    return roleGraph.nodes.map((n) => ({
      id: n.id,
      type: "custom",
      position: n.position,
      data: n.data,
    })) as Node[];
  }, [roleGraph]);

  // Transform graph edges with dynamic status styling
  const initialEdges = useMemo(() => {
    return roleGraph.edges.map((e) => {
      const isSourceCompleted = completedNodeIds.includes(e.source);
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: isSourceCompleted,
        style: {
          stroke: isSourceCompleted ? "#094cb2" : "#94a3b8",
          strokeWidth: isSourceCompleted ? 2.5 : 1.75,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isSourceCompleted ? "#094cb2" : "#64748b",
          width: 16,
          height: 16,
        },
      } as Edge;
    });
  }, [roleGraph, completedNodeIds]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Handle Node Click
  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      const status = getNodeStatus(node.id);
      if (status === "locked") {
        setLockedToast(`🔒 Folio Day 0${node.data.day} Locked: Complete prerequisite curriculum nodes first.`);
        setTimeout(() => setLockedToast(null), 3000);
      } else {
        openNode(node.id);
      }
    },
    [getNodeStatus, openNode]
  );

  return (
    <div className="relative w-full h-[720px] rounded-3xl bg-slate-50/50 border border-slate-200/90 overflow-hidden shadow-sm">
      {/* ── React Flow Canvas ────────────────────────────────────────── */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="touch-none select-none"
      >
        <Background color="#94a3b8" gap={28} size={1} className="opacity-25" />
        <Controls
          className="!bg-white !border-slate-200 !rounded-xl !shadow-md [&>button]:!bg-white [&>button]:!border-slate-100 [&>button]:!text-slate-700 hover:[&>button]:!bg-slate-50"
        />
      </ReactFlow>

      {/* ── Locked Toast Notification Banner ─────────────────────────── */}
      {lockedToast && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-label text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-top duration-200 z-30 flex items-center gap-2">
          <span>{lockedToast}</span>
        </div>
      )}

      {/* ── Canvas Mini Legend ───────────────────────────────────────── */}
      <div className="absolute bottom-5 left-5 hidden sm:flex items-center gap-4 px-4 py-2 rounded-xl bg-white/95 border border-slate-200 shadow-sm backdrop-blur-md font-label text-[11px] text-slate-600 z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6d5e00]" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#094cb2]" />
          <span>Active / Unlocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span>Locked (Requires Prior Days)</span>
        </div>
      </div>
    </div>
  );
}
