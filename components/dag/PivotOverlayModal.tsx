"use client";

// components/dag/PivotOverlayModal.tsx
// Alexandria High-End Editorial - Mid-Flight Domain Pivoting Overlay Modal

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAssessment } from "@/lib/userStore";
import {
  PROFESSION_SLUGS,
  PROFESSION_WEIGHTS,
  ProfessionKey,
  TRAIT_DEFINITIONS,
  TraitKey,
} from "@/lib/questions";
import { CAREER_ROADMAPS } from "@/lib/roadmapData";

interface PivotOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoleId: string;
}

interface ProfessionCardItem {
  role: ProfessionKey;
  roleId: string;
  icon: string;
  title: string;
  category: string;
  fitScore: number;
  matchPercentage: number;
  rationale: string;
  keyTraits: { key: TraitKey; score: number; name: string }[];
}

const CATEGORY_MAP: Record<string, string> = {
  "software-engineer": "Tech & Engineering",
  "ai-ml-engineer": "Tech & Engineering",
  "data-scientist": "Tech & Engineering",
  "cybersecurity-cloud-engineer": "Tech & Engineering",
  "electronics-embedded-engineer": "Tech & Engineering",
  "mechanical-robotics-engineer": "Tech & Engineering",
  "civil-structural-engineer": "Tech & Engineering",
  doctor: "Healthcare & Science",
  pharmacist: "Healthcare & Science",
  "biotech-genomics-researcher": "Healthcare & Science",
  "business-analyst": "Business & Finance",
  "product-manager": "Business & Finance",
  "financial-analyst": "Business & Finance",
  "management-consultant": "Business & Finance",
  "digital-marketing-growth": "Business & Finance",
  "ui-ux-product-designer": "Creative & Design",
  lawyer: "Legal & Consulting",
};

export default function PivotOverlayModal({
  isOpen,
  onClose,
  currentRoleId,
}: PivotOverlayModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Read assessment data from localStorage
  const assessment = useMemo(() => {
    return getAssessment(user?.uid || "guest_uid");
  }, [user]);

  // Build full list of 17 professions with scores
  const allProfessions: ProfessionCardItem[] = useMemo(() => {
    const list: ProfessionCardItem[] = [];
    const evaluation = assessment?.evaluation;
    const blendedTraits = evaluation?.blendedTraits || {
      LOG: 75,
      DAT: 70,
      EMP: 65,
      INT: 70,
      PRC: 75,
      AMB: 60,
    };

    const topResults = evaluation?.topCareers || [];
    const topScoreMap = new Map<string, number>();
    topResults.forEach((r) => {
      topScoreMap.set(r.roleId, r.score);
    });

    const roles = Object.keys(PROFESSION_WEIGHTS) as ProfessionKey[];
    const processedRoleIds = new Set<string>();

    for (const role of roles) {
      const roleId = PROFESSION_SLUGS[role];
      if (!roleId || processedRoleIds.has(roleId)) continue;
      processedRoleIds.add(roleId);

      const weights = PROFESSION_WEIGHTS[role];
      const roadmap = CAREER_ROADMAPS[roleId];
      const icon = roadmap?.roleIcon || "🎯";
      const title = roadmap?.roleTitle || role;
      const category = CATEGORY_MAP[roleId] || "Tech & Engineering";

      // Compute or retrieve score
      let score = topScoreMap.get(roleId);
      if (score === undefined) {
        let weightedSum = 0;
        let sumWeights = 0;
        const traitKeys: TraitKey[] = ["LOG", "DAT", "EMP", "INT", "PRC", "AMB"];
        for (const tk of traitKeys) {
          const w = weights[tk] || 0;
          sumWeights += w;
          weightedSum += w * (blendedTraits[tk] || 50);
        }
        score = sumWeights > 0 ? Math.round(weightedSum / sumWeights) : 70;
      }

      // Top 3 relevant traits for this profession
      const sortedTraits = (Object.keys(weights) as TraitKey[])
        .filter((tk) => weights[tk] > 0)
        .sort((a, b) => weights[b] - weights[a])
        .slice(0, 3)
        .map((tk) => ({
          key: tk,
          score: blendedTraits[tk] || 70,
          name: TRAIT_DEFINITIONS[tk]?.name.split("&")[0].trim() || tk,
        }));

      // Find rationale from topResults or generate
      const existingResult = topResults.find((r) => r.roleId === roleId);
      const rationale =
        existingResult?.rationale ||
        roadmap?.tagline ||
        `Strong cognitive alignment across ${sortedTraits.map((t) => t.name).join(", ")}.`;

      list.push({
        role,
        roleId,
        icon,
        title,
        category,
        fitScore: score,
        matchPercentage: score,
        rationale,
        keyTraits: sortedTraits,
      });
    }

    // Sort descending by match percentage
    list.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return list;
  }, [assessment]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    Object.values(CATEGORY_MAP).forEach((c) => set.add(c));
    return Array.from(set);
  }, []);

  // Filtered professions
  const filteredList = useMemo(() => {
    return allProfessions.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProfessions, selectedCategory, searchTerm]);

  if (!isOpen) return null;

  const handlePivot = (newRoleId: string) => {
    onClose();
    router.push(`/pathway/${newRoleId}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-900">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 uppercase tracking-wider">
                Mid-Flight Domain Pivoting
              </span>
              <span className="font-label text-xs text-slate-400 font-semibold uppercase tracking-wider">
                • Progress Preserved Continuously
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 mt-1.5 tracking-tight">
              Switch Career Pathway
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore alternative career pathways calibrated against your psychometric profile. Your completed
              7-day nodes in the current path remain safely stored in your portfolio registry.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-label">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-[#094cb2] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-64 font-sans">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#094cb2] transition"
            />
          </div>
        </div>

        {/* Career Grid */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-white">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-sans">
              No matching careers found for "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredList.map((item) => {
                const isCurrent = item.roleId === currentRoleId;
                return (
                  <div
                    key={item.roleId}
                    className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? "bg-[#094cb2]/5 border-2 border-[#094cb2] shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon + Title + Score */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200">
                            {item.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif font-bold text-sm text-slate-950">{item.title}</h3>
                              {isCurrent && (
                                <span className="font-label px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#094cb2] text-white uppercase tracking-wider">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Match Percentage Badge */}
                        <div className="text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg font-label text-xs font-bold border uppercase tracking-wider ${
                              item.matchPercentage >= 80
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : item.matchPercentage >= 65
                                ? "bg-[#fef3c7] text-[#453b00] border-[#fde68a]"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {item.matchPercentage}% Fit
                          </span>
                        </div>
                      </div>

                      {/* Rationale Quote */}
                      <p className="font-sans text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {item.rationale}
                      </p>

                      {/* Trait Mini-Bars */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap font-label">
                        {item.keyTraits.map((trait) => (
                          <div
                            key={trait.key}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px]"
                          >
                            <span className="text-slate-400 uppercase font-semibold">{trait.key}:</span>
                            <span className="font-bold text-slate-900">{trait.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                        7-Day Experiential DAG
                      </span>
                      {isCurrent ? (
                        <button
                          type="button"
                          disabled
                          className="font-label text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 cursor-default font-bold"
                        >
                          Already Active
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePivot(item.roleId)}
                          className="font-label text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
                        >
                          <span>Switch Path</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between font-label text-xs text-slate-500 uppercase tracking-wider">
          <span>Displaying {filteredList.length} of {allProfessions.length} validated career domains</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
