"use client";

// app/dashboard/mentor/sessions/page.tsx
// Alexandria High-End Editorial — Mentor 1:1 Session Management & Host Workspace
// Dedicated interface for industry mentors to view scheduled candidate calls, launch Google Meet,
// inspect candidate agenda questions, record advisory notes, and track honorarium earnings.

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getBookedSessions,
  saveBookedSession,
  updateMentorSessionNotes,
  markSessionStatus,
  BookedSession,
  generateMeetLink,
  generateGoogleCalendarUrl,
} from "@/lib/mentorData";
import { useAuthUserStore } from "@/store/useAuthUserStore";

// Seed sample host sessions for the mentor if none exist
function getInitialMentorSessions(mentorId: string): BookedSession[] {
  const existing = getBookedSessions();
  if (existing.length > 0) return existing;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const sampleUpcoming: BookedSession = {
    id: "sess_cand_201",
    mentorId: mentorId || "mentor_default_01",
    mentorName: "Dr. Vikram Patel",
    mentorDesignation: "VP of Engineering · Razorpay",
    mentorEmail: "vikram.patel@lead.com",
    mentorGoogleEmail: "vikram.patel.mentorship@gmail.com",
    roleId: "software-engineer",
    studentId: "student_01",
    studentName: "Aarav Mehta",
    studentEmail: "aarav.mehta@university.edu",
    studentAcademic: "B.Tech Computer Science (Final Year) · IIT Delhi",
    date: tomorrowStr,
    time: "4:00 PM",
    meetLink: "https://meet.google.com/new",
    calendarEventUrl: generateGoogleCalendarUrl({
      title: "1:1 Mentorship Consultation: Dr. Vikram Patel & Aarav Mehta",
      description: "Evaluating transition from SDE-1 to SDE-2, system design interview prep, and distributed consensus algorithms.",
      mentorEmail: "vikram.patel.mentorship@gmail.com",
      studentEmail: "aarav.mehta@university.edu",
      date: tomorrowStr,
      time: "4:00 PM",
      meetLink: "https://meet.google.com/new",
    }),
    questions: "Evaluating transition from SDE-1 to SDE-2, system design interview prep, and distributed consensus algorithms.",
    status: "upcoming",
    amountPaid: 879,
    mentorHonorarium: 799,
    payoutStatus: "settled",
    bookedAt: Date.now() - 3600000 * 5,
  };

  const samplePast: BookedSession = {
    id: "sess_cand_199",
    mentorId: mentorId || "mentor_default_01",
    mentorName: "Dr. Vikram Patel",
    mentorDesignation: "VP of Engineering · Razorpay",
    roleId: "software-engineer",
    studentId: "student_02",
    studentName: "Ananya Deshmukh",
    studentEmail: "ananya.d@tech.in",
    studentAcademic: "B.Tech Data Engineering · BITS Pilani",
    date: "2026-10-10",
    time: "11:30 AM",
    meetLink: generateMeetLink(),
    questions: "Kafka consumer rebalancing strategies and microservice idempotency patterns.",
    status: "past",
    studentRating: 5,
    studentNotes: "Outstanding session! Dr. Patel gave concrete architectural suggestions that helped me crack the backend assessment.",
    mentorFeedbackNotes: "Strong foundational knowledge of pub-sub architectures. Advised candidate to focus on exactly-once processing semantics and distributed tracing.",
    amountPaid: 879,
    mentorHonorarium: 799,
    payoutStatus: "settled",
    bookedAt: Date.now() - 86400000 * 3,
  };

  saveBookedSession(sampleUpcoming);
  saveBookedSession(samplePast);
  return [sampleUpcoming, samplePast];
}

export default function MentorSessionsDashboardPage() {
  const { mentorProfile, setRole } = useAuthUserStore();
  const mentorId = mentorProfile?.id || "mentor_default_01";

  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mentor feedback notes state
  const [mentorNotes, setMentorNotes] = useState<Record<string, string>>({});
  const [savedNotesId, setSavedNotesId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure active role is set to mentor when visiting mentor desk
    setRole("mentor");
    const list = getInitialMentorSessions(mentorId);
    setSessions(list);

    const notesMap: Record<string, string> = {};
    list.forEach((s) => {
      if (s.mentorFeedbackNotes) notesMap[s.id] = s.mentorFeedbackNotes;
    });
    setMentorNotes(notesMap);
  }, [mentorId, setRole]);

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status === "past");

  const totalEarnings = sessions.reduce((acc, s) => acc + (s.mentorHonorarium || 700), 0);

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveNotes = (sessionId: string) => {
    const text = mentorNotes[sessionId] || "";
    updateMentorSessionNotes(sessionId, text);
    setSavedNotesId(sessionId);
    setTimeout(() => setSavedNotesId(null), 3000);
  };

  const handleMarkCompleted = (sessionId: string) => {
    markSessionStatus(sessionId, "past");
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, status: "past" as const } : s
    );
    setSessions(updated);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[11px] text-[#6d5e00] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-sm border border-[#fde68a]">
                ✦ Practitioner Host Desk
              </span>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                · 1:1 Candidate Consultation Portal
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-2">
              Host Mentorship Schedule &amp; Registry
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
              Host upcoming calls, inspect candidate questions, launch encrypted Google Meet rooms, and record post-consultation guidance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/sessions"
              className="px-3.5 py-2 rounded-sm bg-white border border-slate-200 text-slate-700 hover:text-slate-950 font-label text-xs uppercase font-bold tracking-wider hover:bg-slate-50 transition shadow-2xs"
            >
              Student View ⇄
            </Link>
            <Link
              href="/profile"
              className="px-3.5 py-2 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-xs uppercase font-bold tracking-wider transition shadow-2xs"
            >
              Profile &amp; Rates ⚙
            </Link>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-sm p-4 shadow-2xs">
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Upcoming Calls</p>
            <p className="font-serif text-2xl font-bold text-[#094cb2] mt-0.5">{upcoming.length}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Completed Sessions</p>
            <p className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">{past.length}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Total Honorarium</p>
            <p className="font-serif text-2xl font-bold text-slate-950 mt-0.5">₹{totalEarnings}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Payout Status</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-label text-[10px] font-bold uppercase tracking-wider">
              ● Razorpay Active
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition ${
              activeTab === "upcoming"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upcoming Consultations ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition ${
              activeTab === "past"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Completed Consultations ({past.length})
          </button>
        </div>

        {/* ══════════════════ TAB 1: UPCOMING SESSIONS ══════════════════ */}
        {activeTab === "upcoming" && (
          <div className="space-y-5">
            {upcoming.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center font-serif text-xl">
                  📅
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Scheduled Sessions</h3>
                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto">
                  When students book your available time slots from the public directory, their scheduled meetings and agenda questions will appear here.
                </p>
                <Link
                  href={`/mentors/${mentorProfile?.roleId || "software-engineer"}`}
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-sm bg-[#094cb2] text-white font-label text-xs uppercase tracking-wider font-bold shadow-2xs hover:bg-[#1d63d8] transition"
                >
                  View Your Live Directory Listing ↗
                </Link>
              </div>
            ) : (
              upcoming.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 shadow-2xs space-y-5 hover:border-slate-300 transition"
                >
                  {/* Top Bar: Candidate Details & Schedule */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-50 text-[#094cb2] border border-blue-200">
                          Candidate Consultation
                        </span>
                        <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                          ID: {session.id.slice(0, 14)}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        {session.studentName || "Candidate Scholar"}
                      </h3>
                      <p className="font-sans text-xs text-slate-500">
                        {session.studentAcademic || "Undergraduate Candidate"} · {session.studentEmail || "student@pathnavigate.in"}
                      </p>
                    </div>

                    <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-sm">
                      <span className="font-label text-[10px] text-slate-400 uppercase tracking-widest block">
                        Scheduled Slot
                      </span>
                      <p className="font-serif text-base font-bold text-slate-900 mt-0.5">
                        {session.date}
                      </p>
                      <p className="font-label text-xs font-semibold text-[#094cb2]">
                        {session.time} IST
                      </p>
                    </div>
                  </div>

                  {/* Conference Room Action */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-label text-[11px] font-bold uppercase text-blue-950 tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Host Google Meet Room
                      </p>
                      <p className="font-mono text-xs text-blue-900 font-medium break-all select-all">
                        {session.meetLink}
                      </p>
                      <p className="font-sans text-[11px] text-blue-700/80">
                        Host Account: <span className="font-semibold text-blue-900">{session.mentorGoogleEmail || session.mentorEmail || "Your Google Account"}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyLink(session.id, session.meetLink)}
                        className="px-3 py-2 rounded-sm border border-blue-300 bg-white hover:bg-blue-50 font-label text-[11px] font-bold uppercase text-blue-900 tracking-wider transition"
                      >
                        {copiedId === session.id ? "Copied! ✓" : "Copy Room Link"}
                      </button>
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-[11px] font-bold uppercase tracking-wider transition shadow-2xs flex items-center gap-1"
                      >
                        Launch Meet ↗
                      </a>
                      {session.calendarEventUrl && (
                        <a
                          href={session.calendarEventUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 font-label text-[11px] font-bold uppercase text-slate-800 tracking-wider transition"
                          title="Add to Google Calendar"
                        >
                          Calendar 📅
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Candidate Agenda Briefing */}
                  <div>
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Candidate Briefing &amp; Questions Submitted:
                    </span>
                    <p className="font-sans text-xs text-slate-700 italic bg-slate-50 p-3 rounded-sm border border-slate-100 leading-relaxed">
                      &ldquo;{session.questions}&rdquo;
                    </p>
                  </div>

                  {/* Mentor Advisory Notes & Complete Action */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Mentor Guidance &amp; Action Plan for Candidate:
                      </span>
                      {savedNotesId === session.id && (
                        <span className="font-label text-[10px] text-emerald-700 font-bold uppercase">
                          Saved to Candidate Record ✓
                        </span>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      value={mentorNotes[session.id] || ""}
                      onChange={(e) =>
                        setMentorNotes((prev) => ({ ...prev, [session.id]: e.target.value }))
                      }
                      placeholder="Write recommendations, recommended study roadmaps, or interview tips discussed during the call..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#094cb2] bg-white text-slate-900 font-sans"
                    />

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(session.id)}
                        className="px-3 py-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-label text-[11px] font-bold uppercase tracking-wider transition"
                      >
                        Save Guidance Notes
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkCompleted(session.id)}
                        className="px-4 py-1.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-[11px] font-bold uppercase tracking-wider transition shadow-2xs"
                      >
                        Mark Session as Completed ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════════ TAB 2: PAST SESSIONS ══════════════════ */}
        {activeTab === "past" && (
          <div className="space-y-5">
            {past.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center font-serif text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Historical Records</h3>
                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto">
                  Completed consultations and candidate feedback ratings will be archived here.
                </p>
              </div>
            ) : (
              past.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                          ✓ Completed Consultation
                        </span>
                        <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                          {session.date} at {session.time}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        {session.studentName || "Candidate Scholar"}
                      </h3>
                      <p className="font-sans text-xs text-slate-500">
                        {session.studentAcademic || "Undergraduate Candidate"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="font-label text-[10px] text-slate-400 uppercase tracking-widest block">
                        Honorarium Settled
                      </span>
                      <p className="font-label text-base font-bold text-emerald-700 mt-0.5">
                        ₹{session.mentorHonorarium || 799}
                      </p>
                    </div>
                  </div>

                  {/* Student Rating Received */}
                  {session.studentRating && (
                    <div className="bg-amber-50/60 border border-amber-200 rounded-sm p-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6d5e00] font-bold text-sm">
                          {"★".repeat(session.studentRating)}
                        </span>
                        <span className="font-label text-xs font-bold text-[#6d5e00] uppercase">
                          Candidate Evaluation ({session.studentRating} / 5)
                        </span>
                      </div>
                      {session.studentNotes && (
                        <p className="font-sans text-xs text-slate-700 italic mt-1">
                          &ldquo;{session.studentNotes}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mentor Recorded Guidance Notes */}
                  {session.mentorFeedbackNotes && (
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 space-y-1">
                      <span className="font-label text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                        Guidance Given to Candidate:
                      </span>
                      <p className="font-sans text-xs text-slate-800 leading-relaxed">
                        {session.mentorFeedbackNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
