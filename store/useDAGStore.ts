// store/useDAGStore.ts
// Zustand store managing DAG node completion, unlocking, drawer state, and persistence

import { create } from "zustand";
import { getRoleDAG } from "@/lib/dagData";
import { saveDAGProgress, getDAGProgress } from "@/lib/userStore";

export type NodeStatus = "completed" | "unlocked" | "locked";

export interface DAGState {
  activeRoleId: string;
  completedNodeIds: string[];
  activeNodeId: string | null;
  isDrawerOpen: boolean;
  isCelebrationOpen: boolean;

  // Actions
  setActiveRole: (roleId: string, userId?: string) => void;
  openNode: (nodeId: string) => void;
  closeDrawer: () => void;
  closeCelebration: () => void;
  completeNode: (nodeId: string, userId?: string) => void;
  resetGraph: (userId?: string) => void;

  // Derived helpers
  isNodeUnlocked: (nodeId: string) => boolean;
  getNodeStatus: (nodeId: string) => NodeStatus;
  getCompletionPercentage: () => number;
}

export const useDAGStore = create<DAGState>((set, get) => ({
  activeRoleId: "software-engineer",
  completedNodeIds: [],
  activeNodeId: null,
  isDrawerOpen: false,
  isCelebrationOpen: false,

  setActiveRole: (roleId: string, userId: string = "guest_uid") => {
    // 1. Check local storage / userStore for existing progress on this role
    let savedCompleted: string[] = [];
    if (typeof window !== "undefined") {
      const storageKey = `pathnavigate_dag_${userId}_${roleId}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          savedCompleted = JSON.parse(raw);
        } catch {
          savedCompleted = [];
        }
      } else {
        const storeProgress = getDAGProgress(userId, roleId);
        if (storeProgress?.completedNodeIds) {
          savedCompleted = storeProgress.completedNodeIds;
        }
      }
    }

    set({
      activeRoleId: roleId,
      completedNodeIds: savedCompleted,
      activeNodeId: null,
      isDrawerOpen: false,
      isCelebrationOpen: false,
    });
  },

  openNode: (nodeId: string) => {
    const status = get().getNodeStatus(nodeId);
    if (status === "locked") return;
    set({ activeNodeId: nodeId, isDrawerOpen: true });
  },

  closeDrawer: () => set({ isDrawerOpen: false }),
  closeCelebration: () => set({ isCelebrationOpen: false }),

  completeNode: (nodeId: string, userId: string = "guest_uid") => {
    const currentCompleted = get().completedNodeIds;
    if (currentCompleted.includes(nodeId)) return;

    const newCompleted = [...currentCompleted, nodeId];
    const roleId = get().activeRoleId;

    // Persist to localStorage and userStore
    if (typeof window !== "undefined") {
      const storageKey = `pathnavigate_dag_${userId}_${roleId}`;
      localStorage.setItem(storageKey, JSON.stringify(newCompleted));
      saveDAGProgress(userId, { roleId, completedNodeIds: newCompleted });
    }

    // Check if all 7 days in the role graph are completed
    const roleGraph = getRoleDAG(roleId);
    const allCompleted = roleGraph.nodes.every((n) => newCompleted.includes(n.id));

    set({
      completedNodeIds: newCompleted,
      isCelebrationOpen: allCompleted,
    });
  },

  resetGraph: (userId: string = "guest_uid") => {
    const roleId = get().activeRoleId;
    if (typeof window !== "undefined") {
      const storageKey = `pathnavigate_dag_${userId}_${roleId}`;
      localStorage.removeItem(storageKey);
      saveDAGProgress(userId, { roleId, completedNodeIds: [] });
    }
    set({
      completedNodeIds: [],
      activeNodeId: null,
      isDrawerOpen: false,
      isCelebrationOpen: false,
    });
  },

  isNodeUnlocked: (nodeId: string) => {
    const roleGraph = getRoleDAG(get().activeRoleId);
    const nodeObj = roleGraph.nodes.find((n) => n.id === nodeId);
    if (!nodeObj) return false;

    // Day 1 / Nodes with no prerequisites are always unlocked
    if (!nodeObj.data.prerequisites || nodeObj.data.prerequisites.length === 0) {
      return true;
    }

    // All prerequisite node IDs must be completed
    const completed = get().completedNodeIds;
    return nodeObj.data.prerequisites.every((reqId) => completed.includes(reqId));
  },

  getNodeStatus: (nodeId: string): NodeStatus => {
    const completed = get().completedNodeIds;
    if (completed.includes(nodeId)) return "completed";
    if (get().isNodeUnlocked(nodeId)) return "unlocked";
    return "locked";
  },

  getCompletionPercentage: () => {
    const roleGraph = getRoleDAG(get().activeRoleId);
    const total = roleGraph.nodes.length || 7;
    const completedCount = get().completedNodeIds.length;
    return Math.min(100, Math.round((completedCount / total) * 100));
  },
}));
