"use client";

// app/onboarding/page.tsx
// Alexandria High-End Editorial Multi-Step Onboarding Dossier
// Standardized demographic & cognitive interest calibration

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveOnboarding, PersonaType } from "@/lib/userStore";
import {
  useOnboardingStore,
  PREDEFINED_INTERESTS,
  SCHOOL_STREAMS,
  COLLEGE_BRANCHES,
  EXPERIENCE_LEVELS,
} from "@/lib/onboardingStore";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, signInAnonymouslyUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    step,
    persona,
    grade,
    stream,
    branch,
    branchOther,
    currentDomain,
    experienceYears,
    interests,
    otherInterest,
    isOtherInterestSelected,
    nextStep,
    prevStep,
    setPersona,
    setGrade,
    setStream,
    setBranch,
    setBranchOther,
    setCurrentDomain,
    setExperienceYears,
    toggleInterest,
    setOtherInterest,
    setIsOtherInterestSelected,
    isStepValid,
  } = useOnboardingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSteps = 3;
  const currentStepValid = isStepValid(step);
  const totalInterestsSelected =
    interests.length + (isOtherInterestSelected ? 1 : 0);

  const handleNext = async () => {
    if (!currentStepValid) return;

    if (step < totalSteps) {
      nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsSubmitting(true);
      try {
        let activeUid = user?.uid;
        if (!activeUid) {
          try {
            await signInAnonymouslyUser();
          } catch {
            // fallback
          }
        }
        activeUid = user?.uid || "guest_uid";

        let mappedStreamOrBranch = "";
        if (persona === "school") {
          mappedStreamOrBranch = grade === "Class 11th - 12th" ? stream : "Class 9th - 10th";
        } else if (persona === "college") {
          mappedStreamOrBranch = branch === "Other" ? branchOther : branch;
        } else {
          mappedStreamOrBranch = currentDomain;
        }

        saveOnboarding(activeUid, {
          persona: (persona as PersonaType) || "student",
          grade: persona === "school" ? grade : undefined,
          stream: mappedStreamOrBranch,
          branch: persona === "college" ? (branch === "Other" ? branchOther : branch) : undefined,
          currentDomain: (persona === "professional" || persona === "unemployed") ? currentDomain : undefined,
          experienceYears: (persona === "professional" || persona === "unemployed") ? experienceYears : undefined,
          interests,
          otherInterest: isOtherInterestSelected ? otherInterest : undefined,
        });

        router.push("/assessment");
      } catch (e) {
        setIsSubmitting(false);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-[#fef3c7] selection:text-[#453b00] pb-20">
      {/* ── Top Archival Folio Header ────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white text-base font-bold shadow-xs">
            PN
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-950 block leading-tight">
              Path<span className="text-[#094cb2]">Navigate</span>
            </span>
            <span className="font-label text-[10px] tracking-widest uppercase text-slate-500 block">
              Curator Intake Dossier
            </span>
          </div>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 font-label">
          <span className="text-xs font-bold px-3 py-1 rounded-sm bg-[#fef3c7] text-[#453b00] border border-[#fde68a] uppercase tracking-wider">
            Folio {step} of {totalSteps}
          </span>
        </div>
      </header>

      {/* ── Progress Rule ────────────────────────────────────────────────────── */}
      <div className="w-full bg-slate-200 h-1 relative z-10">
        <div
          className="h-full bg-[#094cb2] transition-all duration-300 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* ── Main Content Container ───────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-6 py-10 sm:py-12 flex flex-col justify-between">
        <div className="space-y-8">
          {/* ── Step 1: Persona Selection ──────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[#094cb2] block">
                  Classification Stage 01
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  Select Your Current Academic or Career Stage
                </h1>
                <p className="font-sans text-slate-600 text-sm leading-relaxed">
                  The psychological scoring matrix and domain pivot calculus adapt specifically to your institutional background.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    id: "school" as PersonaType,
                    icon: "🎒",
                    title: "School Student",
                    subtitle: "Class 9th – 10th or Class 11th – 12th stream selection",
                    description: "Assess scientific (PCM/PCB), commerce, or humanities alignment before crucial board exams.",
                  },
                  {
                    id: "college" as PersonaType,
                    icon: "🎓",
                    title: "College Scholar",
                    subtitle: "B.Tech, MBBS, B.Pharm, BBA, Law, etc.",
                    description: "Evaluate your degree track, specialization fit, or alternate pivot pathways.",
                  },
                  {
                    id: "professional" as PersonaType,
                    icon: "💼",
                    title: "Working Professional",
                    subtitle: "Actively employed & seeking domain pivot",
                    description: "Diagnose if your latent talents match software, analytics, law, or healthcare better.",
                  },
                  {
                    id: "unemployed" as PersonaType,
                    icon: "🚀",
                    title: "Career Transitioner",
                    subtitle: "Seeking structured vocational launch",
                    description: "Map your cognitive strengths to high-growth Indian industry vacancies in 7 days.",
                  },
                ].map((item) => {
                  const isSelected = persona === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPersona(item.id)}
                      className={`text-left p-6 rounded-sm border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                        isSelected
                          ? "bg-white border-[#094cb2] ring-2 ring-[#094cb2]/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-2xl p-2 rounded-sm bg-slate-100 border border-slate-200">
                          {item.icon}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[#094cb2] bg-[#094cb2]"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-serif text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="font-label text-xs font-semibold text-[#094cb2] uppercase tracking-wider">{item.subtitle}</p>
                        <p className="font-sans text-xs text-slate-600 leading-relaxed pt-1">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Conditional Demographic Mapping ────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[#094cb2] block">
                  Classification Stage 02
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  Delineate Your Academic Baseline
                </h1>
                <p className="font-sans text-slate-600 text-sm leading-relaxed">
                  Required to establish your baseline discipline and calculate empirical Domain Pivot differentials.
                </p>
              </div>

              {/* Conditional Form: School Student */}
              {persona === "school" && (
                <div className="space-y-6 p-7 rounded-sm bg-white border border-slate-200 shadow-xs">
                  <div className="space-y-3">
                    <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                      Select Your Grade Category:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Class 9th - 10th", "Class 11th - 12th"].map((gr) => {
                        const isSelected = grade === gr;
                        return (
                          <button
                            key={gr}
                            type="button"
                            onClick={() => {
                              setGrade(gr);
                              if (gr === "Class 9th - 10th") setStream("");
                            }}
                            className={`p-4 rounded-sm border font-label text-xs uppercase font-bold tracking-wider text-left transition-all ${
                              isSelected
                                ? "bg-slate-50 border-[#094cb2] text-[#094cb2] ring-1 ring-[#094cb2]"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {gr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* If Class 11th - 12th, show Stream selection */}
                  {grade === "Class 11th - 12th" && (
                    <div className="space-y-2 pt-2">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                        Senior Secondary Curriculum Stream:
                      </label>
                      <select
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                      >
                        <option value="" disabled className="text-slate-400">
                          -- Select Senior Secondary Stream --
                        </option>
                        {SCHOOL_STREAMS.map((st) => (
                          <option key={st} value={st} className="text-slate-900">
                            {st}
                          </option>
                        ))}
                      </select>
                      <p className="font-sans text-[11px] text-slate-500 pt-1">
                        Defines default home profession benchmark (e.g. PCM → Software, PCB → Clinical Medicine, Commerce → Business Analyst).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Form: College Student */}
              {persona === "college" && (
                <div className="space-y-6 p-7 rounded-sm bg-white border border-slate-200 shadow-xs">
                  <div className="space-y-2">
                    <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                      Indian Degree Program / Specialization Branch:
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                    >
                      <option value="" disabled className="text-slate-400">
                        -- Select Indian Degree Program / Branch --
                      </option>
                      {COLLEGE_BRANCHES.map((br) => (
                        <option key={br} value={br} className="text-slate-900">
                          {br}
                        </option>
                      ))}
                    </select>
                  </div>

                  {branch === "Other" && (
                    <div className="space-y-2 pt-2">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
                        Specify Your Degree or Branch:
                      </label>
                      <input
                        type="text"
                        value={branchOther}
                        onChange={(e) => setBranchOther(e.target.value)}
                        placeholder="e.g. B.Des (Design), B.Voc, Architecture"
                        className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Form: Working Professional or Unemployed */}
              {(persona === "professional" || persona === "unemployed") && (
                <div className="space-y-6 p-7 rounded-sm bg-white border border-slate-200 shadow-xs">
                  <div className="space-y-2">
                    <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                      {persona === "professional"
                        ? "Current Industry Domain / Vocational Title:"
                        : "Educational Degree / Background Field:"}
                    </label>
                    <input
                      type="text"
                      value={currentDomain}
                      onChange={(e) => setCurrentDomain(e.target.value)}
                      placeholder="e.g. Mechanical QA, Commerce / Finance, Sales Support, BCA"
                      className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label text-xs font-bold uppercase tracking-wider text-slate-800">
                      Years of Professional Experience:
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#094cb2] focus:ring-1 focus:ring-[#094cb2]"
                    >
                      <option value="" disabled className="text-slate-400">
                        -- Select Years of Experience --
                      </option>
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <option key={exp} value={exp} className="text-slate-900">
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Multi-Select Interest Mapping ──────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[#094cb2]">
                    Classification Stage 03
                  </span>
                  <span className="font-label text-xs font-bold px-2.5 py-0.5 rounded-sm bg-[#fef3c7] text-[#453b00] border border-[#fde68a]">
                    {totalInterestsSelected} / 5 Selected
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  Which Disciplines Genuinely Pique Your Curiosity?
                </h1>
                <p className="font-sans text-slate-600 text-sm leading-relaxed">
                  Select up to 5 interest chips. These inform the 25% interest weighting in the career fit calculus.
                </p>
              </div>

              {/* Chips Grid */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {PREDEFINED_INTERESTS.map((chip) => {
                  const isSelected = interests.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleInterest(chip)}
                      className={`px-3.5 py-2 rounded-sm text-xs font-label font-semibold tracking-wide transition-all ${
                        isSelected
                          ? "bg-[#094cb2] text-white border border-[#094cb2] shadow-xs"
                          : "bg-white text-slate-700 hover:border-slate-400 border border-slate-300"
                      }`}
                    >
                      {chip} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}

                {/* Other Option Chip */}
                <button
                  type="button"
                  onClick={() => setIsOtherInterestSelected(!isOtherInterestSelected)}
                  className={`px-3.5 py-2 rounded-sm text-xs font-label font-semibold tracking-wide transition-all ${
                    isOtherInterestSelected
                      ? "bg-[#094cb2] text-white border border-[#094cb2] shadow-xs"
                      : "bg-white text-slate-700 hover:border-slate-400 border border-slate-300"
                  }`}
                >
                  Custom Domain {isOtherInterestSelected ? "✓" : "+"}
                </button>
              </div>

              {/* Custom Input */}
              {isOtherInterestSelected && (
                <div className="p-5 rounded-sm bg-white border border-slate-200 space-y-2 mt-4 shadow-xs">
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-[#094cb2]">
                    Specify Custom Intellectual Curiosity:
                  </label>
                  <input
                    type="text"
                    value={otherInterest}
                    onChange={(e) => setOtherInterest(e.target.value)}
                    placeholder="e.g. Intellectual Property Law, Bioinformatics, Quantitative Trading..."
                    className="w-full px-4 py-3 rounded-sm bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#094cb2]"
                  />
                  <p className="font-sans text-[11px] text-slate-500">
                    Parsed via Groq Llama 3 semantic vectors for vocational alignment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation Actions ──────────────────────────────────────────────── */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-200 mt-8 font-label">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            ← Previous Stage
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentStepValid || isSubmitting}
            className="px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#094cb2] hover:bg-[#1d63d8] disabled:opacity-40 disabled:pointer-events-none transition shadow-xs flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Initializing Examination...</span>
              </div>
            ) : step === totalSteps ? (
              <>
                <span>Begin Psychological Diagnostic</span>
                <span>→</span>
              </>
            ) : (
              <>
                <span>Advance to Next Folio</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
