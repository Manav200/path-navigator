"use client";

// components/testing/DemoPresetBar.tsx
// Quick-select toolbar for live judge demonstrations and instant onboarding bypass
// Toggled via ?demo=true URL query or Ctrl+Shift+D key shortcut

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOnboardingStore } from "@/lib/onboardingStore";
import { saveOnboarding, saveAssessment } from "@/lib/userStore";
import { trackEvent } from "@/lib/analytics";
import AnalyticsModal from "@/components/testing/AnalyticsModal";

interface DemoPreset {
  id: string;
  label: string;
  personaTitle: string;
  targetRole: string;
  targetRoleId: string;
  icon: string;
  destination: string;
  badge: string;
  apply: (uid: string) => void;
}

export default function DemoPresetBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { setPersona, setGrade, setStream, setBranch, setInterests } = useOnboardingStore();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Check URL param ?demo=true or local storage toggle
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setIsVisible(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchParams]);

  const uid = user?.uid || "guest_uid";

  const presets: DemoPreset[] = [
    {
      id: "preset-pcm",
      label: "Preset 1",
      personaTitle: "Class 12th PCM",
      targetRole: "Software Engineer",
      targetRoleId: "software-engineer",
      icon: "💻",
      badge: "Core Match",
      destination: "/pathway/software-engineer",
      apply: (activeUid) => {
        saveOnboarding(activeUid, {
          persona: "school",
          grade: "Class 11th - 12th",
          stream: "Science (PCM)",
          interests: ["Algorithmic Logic", "AI & Machine Learning", "Cloud Architecture"],
        });
        saveAssessment(activeUid, {
          answers: { q1: "A", q2: "B", q3a: "DFS/BFS Graph Traversal", q4: "A", q7: "Build large-scale AI distributed apps." },
          topCareers: [
            "Software / Full-Stack Engineer",
            "Data Scientist",
            "AI / Machine Learning Engineer",
          ],
          pivotRecommendation: "no_pivot",
          evaluation: {
            topCareers: [
              {
                role: "Software / Full-Stack Engineer",
                roleId: "software-engineer",
                score: 95,
                fitScore: 96,
                interestScore: 92,
                rationale: "Outstanding algorithmic logic (92/100) and precision adherence (88/100).",
              },
              {
                role: "AI / Machine Learning Engineer",
                roleId: "ai-ml-engineer",
                score: 91,
                fitScore: 90,
                interestScore: 94,
                rationale: "Strong quantitative data analysis and machine learning pipeline aptitude.",
              },
              {
                role: "Data Scientist",
                roleId: "data-scientist",
                score: 86,
                fitScore: 85,
                interestScore: 89,
                rationale: "Elevated quantitative analysis and probabilistic reasoning.",
              },
            ],
            isCloseCall: false,
            pivotStatus: "no_pivot",
            pivotGap: 0,
            homeProfession: "Software / Full-Stack Engineer",
            recommendedRole: "Software / Full-Stack Engineer",
            recommendedRoleId: "software-engineer",
            blendedTraits: { LOG: 92, DAT: 86, EMP: 55, INT: 68, PRC: 88, AMB: 70 },
            pivotAnalysis: "Your psychological aptitudes strongly reinforce your core domain. Direct experiential immersion will sharpen your execution.",
          },
        });
      },
    },
    {
      id: "preset-mech-pivot",
      label: "Preset 2",
      personaTitle: "B.Tech Mechanical",
      targetRole: "Pivot to Business Analyst",
      targetRoleId: "business-analyst",
      icon: "📊",
      badge: "Strong Pivot (+28%)",
      destination: "/results",
      apply: (activeUid) => {
        saveOnboarding(activeUid, {
          persona: "college",
          branch: "B.Tech / B.E. (Mechanical/Civil)",
          interests: ["Data Visualization", "Financial Modeling", "Product Management & KPIs"],
        });
        saveAssessment(activeUid, {
          answers: { q1: "B", q2: "A", q3a: "SQL Group By and Joins", q4: "B", q7: "Analyze market metrics and optimize corporate revenue pipelines." },
          topCareers: [
            "Business Analyst",
            "Product Manager",
            "Mechanical & Robotics Engineer",
          ],
          pivotRecommendation: "strong_pivot",
          evaluation: {
            topCareers: [
              {
                role: "Business Analyst",
                roleId: "business-analyst",
                score: 93,
                fitScore: 94,
                interestScore: 90,
                rationale: "Strong quantitative analysis (94/100) and strategic persuasion (88/100).",
              },
              {
                role: "Product Manager",
                roleId: "product-manager",
                score: 87,
                fitScore: 86,
                interestScore: 90,
                rationale: "High strategic interpretation and ambiguity tolerance.",
              },
              {
                role: "Mechanical & Robotics Engineer",
                roleId: "mechanical-robotics-engineer",
                score: 65,
                fitScore: 66,
                interestScore: 62,
                rationale: "Baseline academic match but cognitive affinity points to analytics.",
              },
            ],
            isCloseCall: false,
            pivotStatus: "strong_pivot",
            pivotGap: 28,
            homeProfession: "Mechanical & Robotics Engineer",
            recommendedRole: "Business Analyst",
            recommendedRoleId: "business-analyst",
            blendedTraits: { LOG: 80, DAT: 94, EMP: 60, INT: 88, PRC: 74, AMB: 78 },
            pivotAnalysis: "Significant domain pivot recommended! Your latent quantitative and persuasive traits match Business Analyst over Mechanical Engineering by an exceptional +28% differential.",
          },
        });
      },
    },
    {
      id: "preset-bcom-pm",
      label: "Preset 3",
      personaTitle: "B.Com Graduate",
      targetRole: "Product Manager",
      targetRoleId: "product-manager",
      icon: "💡",
      badge: "Commercial Pivot",
      destination: "/pathway/product-manager",
      apply: (activeUid) => {
        saveOnboarding(activeUid, {
          persona: "college",
          branch: "B.Com",
          interests: ["Financial Modeling", "Product Management & KPIs", "Corporate Law"],
        });
        saveAssessment(activeUid, {
          answers: { q1: "D", q2: "C", q4: "D", q7: "Lead cross-functional product roadmaps and customer journey experiments." },
          topCareers: [
            "Product Manager",
            "Financial Analyst / Investment Specialist",
            "Management Consultant",
          ],
          pivotRecommendation: "explore_pivot",
          evaluation: {
            topCareers: [
              {
                role: "Product Manager",
                roleId: "product-manager",
                score: 94,
                fitScore: 95,
                interestScore: 91,
                rationale: "Superior strategic interpretation (95/100) and user empathy (88/100).",
              },
              {
                role: "Financial Analyst / Investment Specialist",
                roleId: "financial-analyst",
                score: 88,
                fitScore: 89,
                interestScore: 85,
                rationale: "Rigorous valuation modeling and balance sheet breakdown.",
              },
              {
                role: "Management Consultant",
                roleId: "management-consultant",
                score: 85,
                fitScore: 86,
                interestScore: 82,
                rationale: "Strategic executive deconstruction and communication.",
              },
            ],
            isCloseCall: false,
            pivotStatus: "explore_pivot",
            pivotGap: 18,
            homeProfession: "Financial Analyst / Investment Specialist",
            recommendedRole: "Product Manager",
            recommendedRoleId: "product-manager",
            blendedTraits: { LOG: 76, DAT: 82, EMP: 88, INT: 95, PRC: 70, AMB: 90 },
            pivotAnalysis: "Moderate domain pivot detected. Your natural communication and cross-functional empathy unlock superior alignment with Product Management.",
          },
        });
      },
    },
    {
      id: "preset-class10",
      label: "Preset 4",
      personaTitle: "Class 10th Student",
      targetRole: "Stream Guidance (PCM vs PCB)",
      targetRoleId: "doctor",
      icon: "🩺",
      badge: "Stream Selector",
      destination: "/results",
      apply: (activeUid) => {
        saveOnboarding(activeUid, {
          persona: "school",
          grade: "Class 9th - 10th",
          interests: ["Clinical Diagnosis", "Emergency Patient Care", "Pharmaceuticals & Chemistry"],
        });
        saveAssessment(activeUid, {
          answers: { q1: "C", q2: "C", q4: "C", q7: "Diagnose rare conditions and provide compassionate clinical patient care." },
          topCareers: [
            "Doctor / Clinical Practitioner",
            "Pharmacist / Pharmaceutical Analyst",
            "Biotechnology & Genomic Researcher",
          ],
          pivotRecommendation: "no_pivot",
          evaluation: {
            topCareers: [
              {
                role: "Doctor / Clinical Practitioner",
                roleId: "doctor",
                score: 96,
                fitScore: 97,
                interestScore: 93,
                rationale: "Elevated empathy quotient (96/100) and strict clinical protocol precision (94/100).",
              },
              {
                role: "Pharmacist / Pharmaceutical Analyst",
                roleId: "pharmacist",
                score: 88,
                fitScore: 87,
                interestScore: 90,
                rationale: "Attention to chemical precision and dosage safety.",
              },
              {
                role: "Biotechnology & Genomic Researcher",
                roleId: "biotech-genomics-researcher",
                score: 82,
                fitScore: 80,
                interestScore: 86,
                rationale: "Laboratory protocol precision and genomic sequencing curiosity.",
              },
            ],
            isCloseCall: false,
            pivotStatus: "no_pivot",
            pivotGap: 0,
            homeProfession: "Doctor / Clinical Practitioner",
            recommendedRole: "Doctor / Clinical Practitioner",
            recommendedRoleId: "doctor",
            blendedTraits: { LOG: 82, DAT: 74, EMP: 96, INT: 72, PRC: 94, AMB: 50 },
            pivotAnalysis: "Strong alignment with Healthcare (Science PCB). Your empathy and diagnostic rigor indicate a natural fit for Clinical Practice.",
          },
        });
      },
    },
  ];

  const handleApplyPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    preset.apply(uid);
    trackEvent("demo_preset_applied", { presetId: preset.id, target: preset.targetRole });
    router.push(preset.destination);
    setTimeout(() => setActivePresetId(null), 1000);
  };

  return (
    <>
      {/* ── Discreet Toggle Pill if hidden ────────────────────────────── */}
      {!isVisible && (
        <div className="fixed top-2 right-4 z-40 print:hidden opacity-40 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsVisible(true)}
            className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[10px] text-white/70 hover:text-white border border-white/[0.1] backdrop-blur-md flex items-center gap-1.5 transition"
            title="Press Ctrl+Shift+D or click to open Hackathon Demo Toolbar"
          >
            <span>⚡</span>
            <span>Demo Mode (Ctrl+Shift+D)</span>
          </button>
        </div>
      )}

      {/* ── Collapsible Judge Demo Toolbar ────────────────────────────── */}
      {isVisible && (
        <aside
          aria-label="Curator Demo Presets"
          className="relative z-50 bg-white border-b border-slate-200/90 px-4 py-2.5 shadow-md print:hidden animate-in slide-in-from-top-2 duration-200 text-slate-900"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
            {/* Left Header */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#094cb2] animate-ping" />
              <div className="flex items-center gap-2">
                <span className="font-label text-xs font-extrabold text-slate-950 tracking-wider uppercase flex items-center gap-1">
                  <span>⚡</span>
                  <span>Demo Presets</span>
                </span>
                <span className="font-label text-[10px] text-[#094cb2] px-2 py-0.5 rounded bg-[#094cb2]/10 border border-[#094cb2]/20 hidden sm:inline uppercase font-bold">
                  Onboarding Bypass
                </span>
              </div>
            </div>

            {/* Middle Presets Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-sans">
              {presets.map((preset) => {
                const isLoading = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition active:scale-95 ${
                      isLoading
                        ? "bg-[#094cb2] border-[#094cb2] text-white animate-pulse"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-[#094cb2]"
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <div className="text-left">
                      <span className="block leading-tight text-[11px] font-bold text-slate-900">
                        {preset.personaTitle}
                      </span>
                      <span className="block text-[9px] text-slate-500 leading-tight">
                        {preset.targetRole}
                      </span>
                    </div>
                    <span className="font-label text-[9px] px-1.5 py-0.5 rounded bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase font-bold">
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Action: Metrics Dashboard & Close */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-label">
              <button
                type="button"
                onClick={() => setIsAnalyticsOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#094cb2]/10 hover:bg-[#094cb2]/20 text-[#094cb2] border border-[#094cb2]/30 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
              >
                <span>📊</span>
                <span>Metrics Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs transition border border-slate-200"
                title="Hide Toolbar (Ctrl+Shift+D to toggle)"
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Judge Analytics Dashboard Modal ──────────────────────────── */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </>
  );
}
