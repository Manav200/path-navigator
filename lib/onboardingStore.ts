// lib/onboardingStore.ts
// Zustand store for the multi-step Onboarding flow

import { create } from "zustand";
import { PersonaType } from "@/lib/userStore";

export const PREDEFINED_INTERESTS = [
  "Algorithmic Logic",
  "Clinical Diagnosis",
  "Corporate Law",
  "Data Visualization",
  "Financial Modeling",
  "Public Policy",
  "Hardware Systems",
  "AI & Machine Learning",
  "Pharmaceuticals & Chemistry",
  "Constitutional Advocacy",
  "Product Management & KPIs",
  "Emergency Patient Care",
  "Cloud Architecture",
  "Contract Arbitration",
  "Cybersecurity & Networks",
];

export const SCHOOL_STREAMS = [
  "Science (PCM)",
  "Science (PCB)",
  "Commerce with Math",
  "Commerce without Math",
  "Humanities / Arts",
  "Vocational",
];

export const COLLEGE_BRANCHES = [
  // Engineering — Technology & Computing
  "B.Tech / B.E. (CSE/IT)",
  "B.Tech / B.E. (AI & Data Science)",
  "B.Tech / B.E. (ECE/EEE)",
  "B.Tech / B.E. (Mechanical/Civil)",
  "B.Tech / B.E. (Chemical/Biotech)",
  "BCA",
  // Science
  "B.Sc (Computer Science / Data)",
  "B.Sc (Biotech / Life Sciences)",
  "B.Sc (Physics / Chemistry / Maths)",
  // Medical & Pharmacy
  "MBBS",
  "B.Pharm",
  // Business & Commerce
  "BBA",
  "B.Com",
  "MBA",
  // Humanities, Design & Law
  "BA LL.B / BBA LL.B",
  "BA (Design / Fine Arts)",
  "B.Des (Industrial / Communication)",
  // Other
  "Other",
];

export const EXPERIENCE_LEVELS = [
  "0 - 1 years (Entry level / Fresher)",
  "1 - 3 years (Junior associate)",
  "3 - 5 years (Mid-level specialist)",
  "5+ years (Senior / Lead)",
  "Not Applicable (Looking to launch career)",
];

export interface OnboardingState {
  step: number;
  persona: PersonaType | null;

  // Step 2 Demographics
  grade: string;
  stream: string;
  branch: string;
  branchOther: string;
  currentDomain: string;
  experienceYears: string;

  // Step 3 Interests
  interests: string[];
  otherInterest: string;
  isOtherInterestSelected: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPersona: (persona: PersonaType) => void;
  setGrade: (grade: string) => void;
  setStream: (stream: string) => void;
  setBranch: (branch: string) => void;
  setBranchOther: (other: string) => void;
  setCurrentDomain: (domain: string) => void;
  setExperienceYears: (years: string) => void;
  toggleInterest: (interest: string) => void;
  setOtherInterest: (text: string) => void;
  setIsOtherInterestSelected: (selected: boolean) => void;
  setInterests: (interests: string[]) => void;
  reset: () => void;
  isStepValid: (stepNumber: number) => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: 1,
  persona: null,

  grade: "",
  stream: "",
  branch: "",
  branchOther: "",
  currentDomain: "",
  experienceYears: "",

  interests: [],
  otherInterest: "",
  isOtherInterestSelected: false,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(3, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

  setPersona: (persona) => set({ persona }),
  setGrade: (grade) => set({ grade }),
  setStream: (stream) => set({ stream }),
  setBranch: (branch) => set({ branch }),
  setBranchOther: (branchOther) => set({ branchOther }),
  setCurrentDomain: (currentDomain) => set({ currentDomain }),
  setExperienceYears: (experienceYears) => set({ experienceYears }),
  setInterests: (interests) => set({ interests }),

  toggleInterest: (interest: string) =>
    set((state) => {
      const exists = state.interests.includes(interest);
      if (exists) {
        return { interests: state.interests.filter((i) => i !== interest) };
      }
      // Max 5 items total (including other if selected)
      const count = state.interests.length + (state.isOtherInterestSelected ? 1 : 0);
      if (count >= 5) {
        return state;
      }
      return { interests: [...state.interests, interest] };
    }),

  setOtherInterest: (otherInterest) => set({ otherInterest }),

  setIsOtherInterestSelected: (selected) =>
    set((state) => {
      if (selected && !state.isOtherInterestSelected) {
        const count = state.interests.length;
        if (count >= 5) {
          return state;
        }
      }
      return { isOtherInterestSelected: selected };
    }),

  reset: () =>
    set({
      step: 1,
      persona: null,
      grade: "",
      stream: "",
      branch: "",
      branchOther: "",
      currentDomain: "",
      experienceYears: "",
      interests: [],
      otherInterest: "",
      isOtherInterestSelected: false,
    }),

  isStepValid: (stepNumber: number) => {
    const state = get();
    if (stepNumber === 1) {
      return state.persona !== null;
    }

    if (stepNumber === 2) {
      if (!state.persona) return false;
      if (state.persona === "school") {
        if (!state.grade) return false;
        if (state.grade === "Class 11th - 12th") {
          return !!state.stream;
        }
        return true; // Class 9th - 10th doesn't have stream specialization yet
      }
      if (state.persona === "college") {
        if (!state.branch) return false;
        if (state.branch === "Other") {
          return state.branchOther.trim().length > 0;
        }
        return true;
      }
      if (state.persona === "professional" || state.persona === "unemployed") {
        return (
          state.currentDomain.trim().length > 0 &&
          state.experienceYears.trim().length > 0
        );
      }
      return false;
    }

    if (stepNumber === 3) {
      const totalSelected =
        state.interests.length + (state.isOtherInterestSelected ? 1 : 0);
      if (totalSelected === 0) return false;
      if (state.isOtherInterestSelected && !state.otherInterest.trim()) {
        return false;
      }
      return true;
    }

    return true;
  },
}));
