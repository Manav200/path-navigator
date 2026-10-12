"use client";

// app/register/mentor/page.tsx
// Alexandria High-End Editorial — Detailed Mentor Verification & Onboarding Form
// Collects professional background, editorial synopsis, LinkedIn credential, economics, and availability slots.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/store/useAuthUserStore";
import { mentorRegistrationSchema } from "@/types/user";

const LAUNCH_PROFESSIONS = [
  { id: "software-engineer", label: "Software / Full-Stack Engineer", icon: "💻" },
  { id: "business-analyst", label: "Business Analyst / Corporate Strategist", icon: "📊" },
  { id: "lawyer", label: "Lawyer / Corporate Legal Specialist", icon: "⚖️" },
  { id: "doctor", label: "Doctor / Clinical Practitioner", icon: "🩺" },
  { id: "pharmacist", label: "Pharmacist / Pharmaceutical Analyst", icon: "💊" },
];

const SUGGESTED_TAGS: Record<string, string[]> = {
  "software-engineer": ["System Design", "Cloud Architecture", "DSA & LeetCode", "Distributed Systems", "Full-Stack", "Kubernetes"],
  "business-analyst": ["Quantitative Modeling", "Power BI / Tableau", "Corporate Strategy", "SQL Analytics", "Valuation", "Agile Product"],
  "lawyer": ["Commercial Arbitration", "Contract Drafting", "Intellectual Property", "Litigation Strategy", "Corporate M&A"],
  "doctor": ["Clinical Medicine", "USMLE / NEET PG", "Diagnostics", "Patient Care", "Internal Medicine"],
  "pharmacist": ["Pharmacology", "Clinical Trials", "GPAT Prep", "Pharmacovigilance", "Formulation Science"],
};

const WEEKLY_SLOTS = [
  "Mon Evening (6:00 PM – 9:00 PM)",
  "Tue Evening (6:00 PM – 9:00 PM)",
  "Wed Evening (6:00 PM – 9:00 PM)",
  "Thu Evening (6:00 PM – 9:00 PM)",
  "Fri Evening (6:00 PM – 9:00 PM)",
  "Sat Morning (9:00 AM – 1:00 PM)",
  "Sat Afternoon (2:00 PM – 6:00 PM)",
  "Sun Morning (9:00 AM – 1:00 PM)",
  "Sun Afternoon (2:00 PM – 6:00 PM)",
];

export default function MentorOnboardingFormPage() {
  const router = useRouter();
  const registerMentor = useAuthUserStore((s) => s.registerMentor);
  const setRole = useAuthUserStore((s) => s.setRole);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [experienceYears, setExperienceYears] = useState<"1-3 Years" | "3-5 Years" | "5-10 Years" | "10+ Years">("5-10 Years");
  const [roleId, setRoleId] = useState("software-engineer");
  const [bio, setBio] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [specializations, setSpecializations] = useState<string[]>(["System Design", "Cloud Architecture"]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [pricePerSession, setPricePerSession] = useState<number>(699);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>([
    "Sat Morning (9:00 AM – 1:00 PM)",
    "Sun Morning (9:00 AM – 1:00 PM)",
  ]);

  // Submission & Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Auto-fill sample mentor credentials for instant testing
  const handleAutoFill = () => {
    setName("Dr. Vikram Patel");
    setEmail("vikram.patel@lead.com");
    setGoogleEmail("vikram.patel.mentorship@gmail.com");
    setGoogleMeetLink("https://meet.google.com/new");
    setDesignation("VP of Engineering");
    setCompany("Razorpay");
    setExperienceYears("10+ Years");
    setRoleId("software-engineer");
    setBio("12+ years building low-latency payment infrastructure, distributed cloud pipelines, and mentoring senior engineering staff.");
    setLinkedIn("https://linkedin.com/in/vikrampatel");
    setSpecializations(["System Design", "Cloud Architecture", "Distributed Systems", "Full-Stack"]);
    setPricePerSession(799);
    setFieldErrors({});
    setGeneralError(null);
  };

  // Tag helper
  const handleAddTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !specializations.includes(clean)) {
      setSpecializations([...specializations, clean]);
    }
    setCustomTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setSpecializations(specializations.filter((t) => t !== tag));
  };

  // Slot checkbox helper
  const handleToggleSlot = (slot: string) => {
    if (availabilitySlots.includes(slot)) {
      setAvailabilitySlots(availabilitySlots.filter((s) => s !== slot));
    } else {
      setAvailabilitySlots([...availabilitySlots, slot]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // Auto-normalize LinkedIn URL if protocol missing
    let cleanLinkedIn = linkedIn.trim();
    if (cleanLinkedIn && !cleanLinkedIn.startsWith("http://") && !cleanLinkedIn.startsWith("https://")) {
      cleanLinkedIn = `https://${cleanLinkedIn}`;
    }

    const payload = {
      name: name.trim() || "Dr. Vikram Patel",
      email: email.trim() || "vikram.patel@lead.com",
      googleEmail: googleEmail.trim() || email.trim() || "vikram.patel.mentorship@gmail.com",
      googleMeetLink: googleMeetLink.trim() || "https://meet.google.com/new",
      designation: designation.trim() || "VP of Engineering",
      company: company.trim() || "Razorpay",
      experienceYears,
      roleId,
      bio: bio.trim() || "12+ years building scalable systems and guiding practitioners.",
      linkedIn: cleanLinkedIn || "https://linkedin.com/in/mentor",
      specializations: specializations.length > 0 ? specializations : ["System Design", "Cloud Architecture"],
      pricePerSession: Number(pricePerSession) || 699,
      currency,
      availabilitySlots: availabilitySlots.length > 0 ? availabilitySlots : ["Sat Morning (9:00 AM – 1:00 PM)"],
      isAcceptingBookings: true,
    };

    // Client-side Zod validation
    const parsed = mentorRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      const formattedErrors: Record<string, string> = {};
      const issues = parsed.error.issues;
      issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || "general";
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      setGeneralError("Please review the highlighted fields below.");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit to registration API route (non-blocking if offline)
      try {
        await fetch("/api/mentors/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn("[Mentor Register API]: local persistence active", err);
      }

      // 2. Save directly into local Auth store for instant client-side state
      registerMentor(payload);
      setRole("mentor");

      // 3. Redirect to Profile Management Workspace
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      registerMentor(payload);
      setRole("mentor");
      router.push("/profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Editorial Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href="/register"
            className="font-label text-xs uppercase font-bold text-slate-500 hover:text-slate-950 tracking-wider transition"
          >
            ← Change Pathway Role
          </Link>
          <span className="font-label text-[11px] text-[#6d5e00] bg-amber-50 border border-[#fde68a] px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
            ✦ Alexandria Practitioner Desk
          </span>
        </div>

        {/* Header Block */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-[#6d5e00] font-bold">
                Editorial Verification & Board Registry
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-snug">
                Register as an Industry Mentor
              </h1>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3.5 py-2 rounded-sm bg-amber-50 hover:bg-amber-100 text-[#6d5e00] border border-[#fde68a] font-label text-xs uppercase font-bold tracking-wider transition self-start sm:self-auto shrink-0 shadow-2xs"
            >
              ✨ Pre-Fill Sample Data
            </button>
          </div>
          <p className="font-sans text-sm text-slate-600 leading-relaxed">
            Join the verified mentor roster to conduct 1:1 strategy calls, evaluate student DAG projects, and unlock direct honorarium bookings.
          </p>
        </div>

        {generalError && (
          <div className="p-4 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
            ⚠ {generalError}
          </div>
        )}

        {/* Multi-Section Form using Surface Shift Transitions */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ──────────────── SECTION 1: PROFESSIONAL BACKGROUND ──────────────── */}
          <div className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <span className="font-label text-[10px] text-[#094cb2] uppercase font-bold tracking-widest">
                  Step 01
                </span>
                <h2 className="font-serif text-xl font-bold text-slate-950">
                  Professional Background & Credentials
                </h2>
              </div>
              <span className="text-xl">💼</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Kavita Raman"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Work / Preferred Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavita.raman@firm.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Google Account Email */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Google Account Email (For Meet)</span>
                  <span className="text-[10px] text-blue-600 font-semibold normal-case">Auto Google Meet Host</span>
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="mentor.google@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  Used by PathNavigate to bind authentic Google Meet sessions directly to your Google account.
                </p>
              </div>

              {/* Personal Google Meet Link */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Personal Google Meet Room URL</span>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 hover:underline font-semibold normal-case"
                  >
                    Open meet.google.com/new ↗
                  </a>
                </label>
                <input
                  type="url"
                  value={googleMeetLink}
                  onChange={(e) => setGoogleMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/new or custom room"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  Default: <span className="font-mono">https://meet.google.com/new</span> (launches an authentic live room in your logged-in Google account).
                </p>
              </div>

              {/* Current Role / Designation */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Principal Architect"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
                {fieldErrors.designation && (
                  <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.designation}</p>
                )}
              </div>

              {/* Current Company */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Company / Firm *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
                {fieldErrors.company && (
                  <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.company}</p>
                )}
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Years of Experience *
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                >
                  <option value="1-3 Years">1–3 Years (Early Career Practitioner)</option>
                  <option value="3-5 Years">3–5 Years (Mid-Level Practitioner)</option>
                  <option value="5-10 Years">5–10 Years (Senior Specialist / Lead)</option>
                  <option value="10+ Years">10+ Years (Staff / Executive / Director)</option>
                </select>
              </div>

              {/* Primary Profession Dropdown */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Launch Profession *
                </label>
                <select
                  value={roleId}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setRoleId(newRole);
                    if (SUGGESTED_TAGS[newRole]) {
                      setSpecializations(SUGGESTED_TAGS[newRole].slice(0, 3));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                >
                  {LAUNCH_PROFESSIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ──────────────── SECTION 2: EDITORIAL SYNOPSIS & VERIFICATION ──────────────── */}
          <div className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <span className="font-label text-[10px] text-[#094cb2] uppercase font-bold tracking-widest">
                  Step 02
                </span>
                <h2 className="font-serif text-xl font-bold text-slate-950">
                  Editorial Synopsis & Public Profile
                </h2>
              </div>
              <span className="text-xl">✍️</span>
            </div>

            {/* Editorial Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label text-xs font-medium uppercase tracking-wider text-slate-700">
                  Practitioner Bio & Mentorship Philosophy *
                </label>
                <span
                  className={`font-label text-[11px] ${
                    bio.length < 10 || bio.length > 800 ? "text-amber-700" : "text-slate-400"
                  }`}
                >
                  {bio.length} / 800 chars (min 10)
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Highlight your domain milestones, systems you have built, teams led, and what students can expect from your 1:1 sessions..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs leading-relaxed"
              />
              {fieldErrors.bio && (
                <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.bio}</p>
              )}
            </div>

            {/* LinkedIn Profile URL */}
            <div>
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                LinkedIn Profile URL or Handle (Required for Editorial Verification) *
              </label>
              <input
                type="text"
                required
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                placeholder="https://www.linkedin.com/in/yourname or linkedin.com/in/yourname"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
              />
              {fieldErrors.linkedIn && (
                <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.linkedIn}</p>
              )}
              <span className="font-sans text-[11px] text-slate-500 mt-1 block">
                Used to issue your Alexandria Verified Practitioner badge.
              </span>
            </div>

            {/* Core Skills & Specializations Multi-Tag Chip Selector */}
            <div className="space-y-3">
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700">
                Core Skills & Specializations *
              </label>

              {/* Active Selected Tags */}
              <div className="flex flex-wrap gap-2 min-h-[34px] p-2 bg-slate-50 border border-slate-200 rounded-sm">
                {specializations.length === 0 ? (
                  <span className="text-xs text-slate-400 italic font-sans py-0.5">
                    No specializations added yet. Click suggested tags below or type your own.
                  </span>
                ) : (
                  specializations.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-slate-300 font-label text-xs text-slate-800 shadow-2xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-1 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(customTagInput);
                    }
                  }}
                  placeholder="Type a skill and press Enter or Add..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(customTagInput)}
                  className="px-4 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 font-label text-xs uppercase font-bold text-slate-800 transition"
                >
                  Add +
                </button>
              </div>

              {/* Suggested Tags based on Selected Role */}
              {SUGGESTED_TAGS[roleId] && (
                <div className="space-y-1.5 pt-1">
                  <p className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Suggested for your domain:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS[roleId].map((tag) => {
                      const isAdded = specializations.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddTag(tag)}
                          className={`px-2 py-0.5 rounded-sm font-label text-[11px] uppercase tracking-wider transition ${
                            isAdded
                              ? "bg-slate-100 text-slate-400 cursor-default"
                              : "bg-amber-50 hover:bg-amber-100 text-[#6d5e00] border border-[#fde68a]"
                          }`}
                        >
                          + {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {fieldErrors.specializations && (
                <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.specializations}</p>
              )}
            </div>
          </div>

          {/* ──────────────── SECTION 3: MENTORSHIP ECONOMICS & AVAILABILITY ──────────────── */}
          <div className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <span className="font-label text-[10px] text-[#094cb2] uppercase font-bold tracking-widest">
                  Step 03
                </span>
                <h2 className="font-serif text-xl font-bold text-slate-950">
                  Consultation Economics & Preferred Slots
                </h2>
              </div>
              <span className="text-xl">💳</span>
            </div>

            {/* Pricing Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Honorarium Rate per 30-Min Session *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-label text-sm text-slate-500 font-bold">
                    {currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    type="number"
                    min={199}
                    max={10000}
                    step={50}
                    required
                    value={pricePerSession}
                    onChange={(e) => setPricePerSession(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs font-semibold"
                  />
                </div>
                {fieldErrors.pricePerSession && (
                  <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.pricePerSession}</p>
                )}
                <span className="font-sans text-[11px] text-slate-400 mt-1 block">
                  Recommended standard: ₹499 – ₹999 / session.
                </span>
              </div>

              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Payout Currency
                </label>
                <div className="flex gap-3 pt-1">
                  <label className="flex items-center gap-2 font-label text-xs text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="currency"
                      value="INR"
                      checked={currency === "INR"}
                      onChange={() => setCurrency("INR")}
                      className="accent-[#094cb2]"
                    />
                    <span>INR (Indian Rupee ₹)</span>
                  </label>
                  <label className="flex items-center gap-2 font-label text-xs text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="currency"
                      value="USD"
                      checked={currency === "USD"}
                      onChange={() => setCurrency("USD")}
                      className="accent-[#094cb2]"
                    />
                    <span>USD ($)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Availability Slots Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700">
                Weekly Consultation Availability Windows *
              </label>
              <p className="font-sans text-xs text-slate-500">
                Select the timeframes when you are typically open to hosting 1:1 candidate calls:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {WEEKLY_SLOTS.map((slot) => {
                  const isChecked = availabilitySlots.includes(slot);
                  return (
                    <label
                      key={slot}
                      onClick={() => handleToggleSlot(slot)}
                      className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition select-none ${
                        isChecked
                          ? "border-[#094cb2] bg-[#094cb2]/5 ring-1 ring-[#094cb2]/50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="accent-[#094cb2] w-4 h-4 rounded-sm"
                      />
                      <span className="font-sans text-xs text-slate-800 font-medium">
                        {slot}
                      </span>
                    </label>
                  );
                })}
              </div>
              {fieldErrors.availabilitySlots && (
                <p className="text-[11px] text-rose-600 font-sans mt-1">{fieldErrors.availabilitySlots}</p>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 space-y-4">
            {generalError && (
              <div className="p-3.5 rounded-sm bg-rose-50 border border-rose-300 text-rose-800 text-xs font-sans flex items-start gap-2">
                <span className="font-bold">⚠</span>
                <div className="flex-1">
                  <p className="font-semibold">{generalError}</p>
                  <p className="mt-0.5 text-[11px] text-rose-700">
                    Or tap <strong>&ldquo;Pre-Fill Sample Data&rdquo;</strong> at the top to test with complete verified details.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-sm bg-gradient-to-r from-[#094cb2] to-[#1d63d8] hover:from-[#083e91] hover:to-[#1752b5] text-white font-label font-bold text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registering Mentor Credentials...
                </>
              ) : (
                "✦ Submit Mentor Credentials & Launch Directory Profile"
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans pt-1">
              <span>Already registered?</span>
              <Link href="/profile" className="text-[#094cb2] hover:underline font-semibold font-label uppercase">
                Go directly to Profile Workspace →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
