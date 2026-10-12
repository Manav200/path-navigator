"use client";

// app/profile/page.tsx
// Alexandria High-End Editorial — Universal Profile Management Workspace
// Allows both Students and Mentors to manage identity, credentials, settings, and baseline roadmaps.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthUserStore } from "@/store/useAuthUserStore";
import { UserRole } from "@/types/user";

export default function UniversalProfilePage() {
  const {
    role,
    setRole,
    studentProfile,
    mentorProfile,
    updateStudentProfile,
    updateMentorProfile,
  } = useAuthUserStore();

  const [activeTab, setActiveTab] = useState<"general" | "specialized">("general");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Form State
  const [studentName, setStudentName] = useState(studentProfile?.name || "Aarav Mehta");
  const [studentEmail, setStudentEmail] = useState(studentProfile?.email || "aarav.mehta@university.edu");
  const [studentBio, setStudentBio] = useState(studentProfile?.bio || "");
  const [studentDegree, setStudentDegree] = useState(studentProfile?.degree || "B.Tech Computer Science");
  const [studentStream, setStudentStream] = useState(studentProfile?.stream || "Distributed Systems & Cloud");
  const [studentTargetRole, setStudentTargetRole] = useState(studentProfile?.targetRole || "Software Engineer");
  const [studentInterests, setStudentInterests] = useState<string[]>(studentProfile?.interests || ["System Design", "Cloud Infrastructure"]);
  const [newInterestInput, setNewInterestInput] = useState("");

  // Mentor Form State
  const [mentorName, setMentorName] = useState(mentorProfile?.name || "Dr. Vikram Patel");
  const [mentorEmail, setMentorEmail] = useState(mentorProfile?.email || "vikram.patel@lead.com");
  const [mentorGoogleEmail, setMentorGoogleEmail] = useState(mentorProfile?.googleEmail || "vikram.patel.mentorship@gmail.com");
  const [mentorGoogleMeetLink, setMentorGoogleMeetLink] = useState(mentorProfile?.googleMeetLink || "https://meet.google.com/new");
  const [mentorDesignation, setMentorDesignation] = useState(mentorProfile?.designation || "VP of Engineering");
  const [mentorCompany, setMentorCompany] = useState(mentorProfile?.company || "Razorpay");
  const [mentorBio, setMentorBio] = useState(mentorProfile?.bio || "12+ years building low-latency payment infrastructure and engineering teams.");
  const [mentorLinkedIn, setMentorLinkedIn] = useState(mentorProfile?.linkedIn || "https://linkedin.com/in/vikrampatel");
  const [mentorRate, setMentorRate] = useState<number>(mentorProfile?.pricePerSession || 799);
  const [mentorAccepting, setMentorAccepting] = useState<boolean>(mentorProfile?.isAcceptingBookings ?? true);
  const [mentorSlots, setMentorSlots] = useState<string[]>(
    mentorProfile?.availabilitySlots || [
      "Sat Morning (9:00 AM – 1:00 PM)",
      "Sun Morning (9:00 AM – 1:00 PM)",
    ]
  );

  // Sync state when store updates
  useEffect(() => {
    if (studentProfile) {
      setStudentName(studentProfile.name || "Aarav Mehta");
      setStudentEmail(studentProfile.email || "aarav.mehta@university.edu");
      setStudentBio(studentProfile.bio || "");
      setStudentDegree(studentProfile.degree || "B.Tech Computer Science");
      setStudentStream(studentProfile.stream || "Distributed Systems & Cloud");
      setStudentTargetRole(studentProfile.targetRole || "Software Engineer");
      setStudentInterests(studentProfile.interests || ["System Design", "Cloud Infrastructure"]);
    }

    if (mentorProfile) {
      setMentorName(mentorProfile.name || "Dr. Vikram Patel");
      setMentorEmail(mentorProfile.email || "vikram.patel@lead.com");
      setMentorGoogleEmail(mentorProfile.googleEmail || mentorProfile.email || "vikram.patel.mentorship@gmail.com");
      setMentorGoogleMeetLink(mentorProfile.googleMeetLink || "https://meet.google.com/new");
      setMentorDesignation(mentorProfile.designation || "VP of Engineering");
      setMentorCompany(mentorProfile.company || "Razorpay");
      setMentorBio(mentorProfile.bio || "");
      setMentorLinkedIn(mentorProfile.linkedIn || "");
      setMentorRate(mentorProfile.pricePerSession || 799);
      setMentorAccepting(mentorProfile.isAcceptingBookings ?? true);
      setMentorSlots(mentorProfile.availabilitySlots || []);
    }
  }, [studentProfile, mentorProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name: studentName.trim(),
      email: studentEmail.trim(),
      bio: studentBio.trim(),
      degree: studentDegree.trim(),
      stream: studentStream.trim(),
      targetRole: studentTargetRole.trim(),
      interests: studentInterests,
      avatar: studentName.slice(0, 2).toUpperCase() || "ST",
    });
    showToast("Student profile updated successfully.");
  };

  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    updateMentorProfile({
      name: mentorName.trim(),
      email: mentorEmail.trim(),
      googleEmail: mentorGoogleEmail.trim() || mentorEmail.trim(),
      googleMeetLink: mentorGoogleMeetLink.trim() || "https://meet.google.com/new",
      designation: mentorDesignation.trim(),
      company: mentorCompany.trim(),
      bio: mentorBio.trim(),
      linkedIn: mentorLinkedIn.trim(),
      pricePerSession: Number(mentorRate),
      isAcceptingBookings: mentorAccepting,
      availabilitySlots: mentorSlots,
      avatar: mentorName.slice(0, 2).toUpperCase() || "ME",
    });
    showToast("Mentor settings updated successfully.");
  };

  const handleAddInterest = (tag: string) => {
    const clean = tag.trim();
    if (clean && !studentInterests.includes(clean)) {
      setStudentInterests([...studentInterests, clean]);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (tag: string) => {
    setStudentInterests(studentInterests.filter((t) => t !== tag));
  };

  const isMentor = role === "mentor";

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-sm shadow-lg flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="font-sans text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Editorial Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[11px] text-[#6d5e00] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-sm border border-[#fde68a]">
                Editorial Desk
              </span>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                · Identity & Governance
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-2">
              Account & Professional Workspace
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
              Maintain your credentials, refine editorial biographies, and calibrate your platform preferences.
            </p>
          </div>

          {/* Role Status Badge & Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-slate-200 shadow-2xs">
              <span className="font-label text-[10px] text-slate-400 uppercase tracking-widest">
                Active Mode:
              </span>
              <span
                className={`font-label text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                  isMentor
                    ? "bg-amber-100 text-[#6d5e00] border border-amber-200"
                    : "bg-blue-100 text-[#094cb2] border border-blue-200"
                }`}
              >
                {role.toUpperCase()}
              </span>
            </div>

            {/* Quick Switcher for testing/convenience */}
            <button
              onClick={() => {
                const nextRole: UserRole = isMentor ? "student" : "mentor";
                setRole(nextRole);
                showToast(`Switched active workspace view to ${nextRole.toUpperCase()}`);
              }}
              className="px-3 py-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-label text-[11px] font-bold uppercase tracking-wider transition"
            >
              Switch to {isMentor ? "Student" : "Mentor"} ⇄
            </button>
          </div>
        </div>

        {/* Quick Jump Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-label uppercase font-bold tracking-wider">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-sm bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition shadow-2xs"
          >
            ← Career Graph
          </Link>
          <Link
            href="/dashboard/sessions"
            className="px-3 py-1.5 rounded-sm bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition shadow-2xs"
          >
            Student Sessions
          </Link>
          {isMentor && (
            <>
              <Link
                href="/dashboard/mentor/sessions"
                className="px-3 py-1.5 rounded-sm bg-amber-50 border border-[#fde68a] text-[#6d5e00] hover:bg-amber-100 transition shadow-2xs font-bold"
              >
                ✦ Host Sessions &amp; Earnings Desk ↗
              </Link>
              <Link
                href={`/mentors/${mentorProfile?.roleId || "software-engineer"}`}
                className="px-3 py-1.5 rounded-sm bg-[#094cb2] text-white hover:bg-[#1d63d8] transition shadow-2xs"
              >
                View Public Directory ↗
              </Link>
            </>
          )}
        </div>

        {/* Workspace Card Header with Avatar Preview */}
        <div className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-[#094cb2]/10 border border-[#094cb2]/20 flex items-center justify-center font-serif text-2xl font-bold text-[#094cb2] shrink-0">
              {isMentor ? mentorProfile?.avatar || "ME" : studentProfile?.avatar || "ST"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-slate-950">
                  {isMentor ? mentorProfile?.name || mentorName : studentProfile?.name || studentName}
                </h2>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Active
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500 mt-0.5">
                {isMentor
                  ? `${mentorProfile?.designation || mentorDesignation} · ${mentorProfile?.company || mentorCompany}`
                  : `${studentProfile?.degree || studentDegree} · ${studentProfile?.institution || "PathNavigate Scholar"}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-6 text-center sm:text-left">
            <div>
              <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">
                {isMentor ? "Rating" : "AI Alignment"}
              </p>
              <p className="font-serif text-xl font-bold text-slate-950 mt-0.5">
                {isMentor ? "5.0 ★" : `${studentProfile?.assessmentScore || 92}%`}
              </p>
            </div>
            <div>
              <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">
                {isMentor ? "Rate / 30m" : "Tasks Done"}
              </p>
              <p className="font-serif text-xl font-bold text-[#094cb2] mt-0.5">
                {isMentor ? `₹${mentorProfile?.pricePerSession || mentorRate}` : studentProfile?.completedTasks || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition ${
              activeTab === "general"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tab 1: Profile Information
          </button>
          <button
            onClick={() => setActiveTab("specialized")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition ${
              activeTab === "specialized"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tab 2: {isMentor ? "Mentorship Settings & Honorarium" : "Academic & Career Baseline"}
          </button>
        </div>

        {/* ════════════════════════ TAB 1: PROFILE INFORMATION ════════════════════════ */}
        {activeTab === "general" && (
          <form
            onSubmit={isMentor ? handleSaveMentor : handleSaveStudent}
            className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-950">
                Core Identity & Contact Information
              </h3>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                Public Visibility
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={isMentor ? mentorName : studentName}
                  onChange={(e) =>
                    isMentor ? setMentorName(e.target.value) : setStudentName(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={isMentor ? mentorEmail : studentEmail}
                  onChange={(e) =>
                    isMentor ? setMentorEmail(e.target.value) : setStudentEmail(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
              </div>
            </div>

            {/* Editorial Biography */}
            <div>
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                Editorial Bio / Professional Summary
              </label>
              <textarea
                rows={4}
                value={isMentor ? mentorBio : studentBio}
                onChange={(e) =>
                  isMentor ? setMentorBio(e.target.value) : setStudentBio(e.target.value)
                }
                placeholder="Share your background, objectives, and expertise..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs leading-relaxed"
              />
            </div>

            {/* LinkedIn for Mentor or Target Role for Student */}
            {isMentor ? (
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={mentorLinkedIn}
                  onChange={(e) => setMentorLinkedIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
              </div>
            ) : (
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Target Career Role
                </label>
                <input
                  type="text"
                  value={studentTargetRole}
                  onChange={(e) => setStudentTargetRole(e.target.value)}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                />
              </div>
            )}

            {/* Save CTA */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-2xs"
              >
                Save Profile Changes →
              </button>
            </div>
          </form>
        )}

        {/* ════════════════════════ TAB 2: SPECIALIZED SETTINGS ════════════════════════ */}
        {activeTab === "specialized" && (
          <div>
            {isMentor ? (
              /* ── MENTOR SPECIFIC SETTINGS ── */
              <form
                onSubmit={handleSaveMentor}
                className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif text-lg font-bold text-slate-950">
                    Mentorship Economics & Availability Governance
                  </h3>
                  <span className="font-label text-[11px] text-[#6d5e00] bg-amber-50 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                    ✦ Verified Roster
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      Current Title / Designation
                    </label>
                    <input
                      type="text"
                      value={mentorDesignation}
                      onChange={(e) => setMentorDesignation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      Current Company / Firm
                    </label>
                    <input
                      type="text"
                      value={mentorCompany}
                      onChange={(e) => setMentorCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      Honorarium per 30-Min Session (INR ₹)
                    </label>
                    <input
                      type="number"
                      min={199}
                      max={10000}
                      step={50}
                      value={mentorRate}
                      onChange={(e) => setMentorRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs font-semibold"
                    />
                  </div>

                  {/* Toggle Accepting Bookings */}
                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      1:1 Marketplace Status
                    </label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mentorAccepting}
                          onChange={(e) => setMentorAccepting(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094cb2]" />
                      </label>
                      <span className="font-sans text-xs font-semibold text-slate-800">
                        {mentorAccepting ? "Accepting 1:1 Bookings" : "Paused / Not Accepting"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Account & Video Conferencing Governance */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-900">
                        Google Account & Google Meet Integration
                      </h4>
                      <p className="font-sans text-xs text-slate-500">
                        Configure the Google credentials used to generate authentic meeting rooms for candidate calls.
                      </p>
                    </div>
                    <span className="font-label text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                      Live Conferencing
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1">
                        Google Account Email
                      </label>
                      <input
                        type="email"
                        value={mentorGoogleEmail}
                        onChange={(e) => setMentorGoogleEmail(e.target.value)}
                        placeholder="mentor.google@gmail.com"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                      />
                      <p className="text-[10px] text-slate-500 font-sans mt-1">
                        Calendar invites & room ownership bind to this Google address.
                      </p>
                    </div>

                    <div>
                      <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                        <span>Google Meet Room Link</span>
                        <a
                          href="https://meet.google.com/new"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 hover:underline font-semibold"
                        >
                          meet.google.com/new ↗
                        </a>
                      </label>
                      <input
                        type="url"
                        value={mentorGoogleMeetLink}
                        onChange={(e) => setMentorGoogleMeetLink(e.target.value)}
                        placeholder="https://meet.google.com/new or custom URL"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs font-mono text-xs"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={mentorGoogleMeetLink || "https://meet.google.com/new"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#094cb2] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          Test Meeting Link ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Slots */}
                <div className="space-y-2 pt-2">
                  <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700">
                    Active Availability Windows
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mentorSlots.map((slot) => (
                      <span
                        key={slot}
                        className="px-2.5 py-1 rounded-sm bg-slate-50 border border-slate-200 font-label text-xs text-slate-700"
                      >
                        ✓ {slot}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-2xs"
                  >
                    Save Mentorship Settings →
                  </button>
                </div>
              </form>
            ) : (
              /* ── STUDENT SPECIFIC SETTINGS ── */
              <form
                onSubmit={handleSaveStudent}
                className="bg-[#ffffff] rounded-sm p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif text-lg font-bold text-slate-950">
                    Academic Baseline & Career Alignment
                  </h3>
                  <span className="font-label text-[11px] text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                    DAG Syllabus Tracking
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      Degree / Academic Level
                    </label>
                    <input
                      type="text"
                      value={studentDegree}
                      onChange={(e) => setStudentDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                      Academic Branch / Stream
                    </label>
                    <input
                      type="text"
                      value={studentStream}
                      onChange={(e) => setStudentStream(e.target.value)}
                      placeholder="e.g. Distributed Systems & AI"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans shadow-2xs"
                    />
                  </div>
                </div>

                {/* Selected Interests Chips */}
                <div className="space-y-3 pt-2">
                  <label className="block font-label text-xs font-medium uppercase tracking-wider text-slate-700">
                    Selected Career Interests & Topics
                  </label>

                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-sm min-h-[38px]">
                    {studentInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-slate-300 font-label text-xs text-slate-800 shadow-2xs"
                      >
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-slate-400 hover:text-rose-600 font-bold ml-1 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterestInput}
                      onChange={(e) => setNewInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInterest(newInterestInput);
                        }
                      }}
                      placeholder="Add interest (e.g. Microservices, Quant Modeling)..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[rgba(148,163,184,0.25)] rounded-sm focus:outline-none focus:border-[#094cb2] text-slate-900 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddInterest(newInterestInput)}
                      className="px-4 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 font-label text-xs uppercase font-bold text-slate-800 transition"
                    >
                      Add +
                    </button>
                  </div>
                </div>

                {/* AI Assessment History Card */}
                <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-2">
                  <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">
                    AI Diagnostic Baseline
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-base font-bold text-slate-900">
                        High Fit Alignment: {studentProfile?.targetRole || studentTargetRole || "Software Engineer"}
                      </p>
                      <p className="font-sans text-xs text-slate-500">
                        Composite alignment score generated from cognitive and experiential diagnostic models.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-bold text-[#094cb2]">
                        {studentProfile?.assessmentScore || 92}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-2xs"
                  >
                    Save Academic Baseline →
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
