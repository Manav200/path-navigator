"use client";

// app/dashboard/sessions/page.tsx
// Alexandria High-End Editorial — Student 1:1 Session Management Dashboard
// Displays upcoming and past sessions, Google Meet launcher, and post-session review widget.

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getBookedSessions,
  saveBookedSession,
  updateSessionRating,
  BookedSession,
  generateMeetLink,
  generateGoogleCalendarUrl,
} from "@/lib/mentorData";

// Seed sample session if user has never booked one yet
function getInitialSessions(): BookedSession[] {
  const existing = getBookedSessions();
  if (existing.length > 0) return existing;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const sample: BookedSession = {
    id: "sess_sample_101",
    mentorId: "mentor-se-001",
    mentorName: "Arjun Sharma",
    mentorDesignation: "Senior Staff Engineer · Google",
    mentorEmail: "arjun.sharma@gmail.com",
    mentorGoogleEmail: "arjun.sharma.mentorship@gmail.com",
    roleId: "software-engineer",
    date: tomorrowStr,
    time: "2:00 PM",
    meetLink: "https://meet.google.com/new",
    calendarEventUrl: generateGoogleCalendarUrl({
      title: "1:1 Mentorship Consultation: Arjun Sharma & Candidate Scholar",
      description: "Transition strategy from SDE-1 to SDE-2, system design interview prep for Google.",
      mentorEmail: "arjun.sharma.mentorship@gmail.com",
      date: tomorrowStr,
      time: "2:00 PM",
      meetLink: "https://meet.google.com/new",
    }),
    questions: "Transition strategy from SDE-1 to SDE-2, system design interview prep for Google.",
    status: "upcoming",
    amountPaid: 879,
    bookedAt: Date.now() - 86400000,
  };

  saveBookedSession(sample);
  return [sample];
}

export default function SessionsDashboardPage() {
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Review states
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [reviewSaved, setReviewSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = getInitialSessions();
    setSessions(list);

    // Initialise review states for past sessions
    const rMap: Record<string, number> = {};
    const nMap: Record<string, string> = {};
    list.forEach((s) => {
      if (s.studentRating) rMap[s.id] = s.studentRating;
      if (s.studentNotes) nMap[s.id] = s.studentNotes;
    });
    setReviewRating(rMap);
    setReviewNotes(nMap);
  }, []);

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const pastSessions = sessions.filter((s) => s.status === "past");

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleMarkAsPast = (sessionId: string) => {
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, status: "past" as const } : s
    );
    setSessions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("pathnavigate_booked_sessions_v1", JSON.stringify(updated));
    }
  };

  const handleSaveReview = (sessionId: string) => {
    const rating = reviewRating[sessionId] || 5;
    const notes = reviewNotes[sessionId] || "";
    updateSessionRating(sessionId, rating, notes);
    setReviewSaved((prev) => ({ ...prev, [sessionId]: true }));
    setTimeout(() => {
      setReviewSaved((prev) => ({ ...prev, [sessionId]: false }));
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[11px] text-[#6d5e00] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-sm border border-[#fde68a]">
                Archival Registry
              </span>
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
                · Executive Consultations
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-2">
              My 1:1 Mentorship Sessions
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
              Access encrypted Google Meet rooms, review briefing notes, and manage consultation records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/dashboard/mentor/sessions"
              className="px-3.5 py-2 rounded-sm bg-amber-50 hover:bg-amber-100 text-[#6d5e00] border border-[#fde68a] font-label text-xs uppercase font-bold tracking-wider transition shadow-2xs"
            >
              ✦ Mentor Host Desk ↗
            </Link>
            <Link
              href="/"
              className="px-3 py-2 rounded-sm bg-white border border-slate-200 text-slate-700 hover:text-slate-950 font-label text-xs uppercase font-bold tracking-wider hover:bg-slate-50 transition shadow-2xs"
            >
              ← Graph
            </Link>
            <Link
              href="/mentors/software-engineer"
              className="px-3.5 py-2 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-xs uppercase font-bold tracking-wider transition shadow-2xs"
            >
              Book Mentor +
            </Link>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-sm p-4 shadow-2xs">
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Total Booked</p>
            <p className="font-serif text-2xl font-bold text-slate-950 mt-0.5">{sessions.length}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Upcoming</p>
            <p className="font-serif text-2xl font-bold text-[#094cb2] mt-0.5">{upcomingSessions.length}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Completed</p>
            <p className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">{pastSessions.length}</p>
          </div>
          <div>
            <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Invested Total</p>
            <p className="font-serif text-2xl font-bold text-slate-950 mt-0.5">
              ₹{sessions.reduce((acc, s) => acc + s.amountPaid, 0)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition relative ${
              activeTab === "upcoming"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upcoming Sessions ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-3 font-label text-xs uppercase font-bold tracking-wider transition relative ${
              activeTab === "past"
                ? "text-[#094cb2] border-b-2 border-[#094cb2]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Past & Completed ({pastSessions.length})
          </button>
        </div>

        {/* TAB 1: UPCOMING SESSIONS */}
        {activeTab === "upcoming" && (
          <div className="space-y-5">
            {upcomingSessions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center font-serif text-xl">
                  📅
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Upcoming Sessions</h3>
                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto">
                  You do not have any scheduled consultations. Choose a verified practitioner in your domain to book your next slot.
                </p>
                <Link
                  href="/mentors/software-engineer"
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-sm bg-[#094cb2] text-white font-label text-xs uppercase tracking-wider font-bold shadow-2xs hover:bg-[#1d63d8] transition"
                >
                  Explore Mentors Roster →
                </Link>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 shadow-2xs space-y-5 hover:border-slate-300 transition"
                >
                  {/* Top Bar: Mentor details & Date Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● Confirmed
                        </span>
                        <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                          Session ID: {session.id.slice(0, 14)}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        {session.mentorName}
                      </h3>
                      <p className="font-sans text-xs text-slate-500">
                        {session.mentorDesignation}
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
                        Live Google Meet Video Room
                      </p>
                      <p className="font-mono text-xs text-blue-900 font-medium break-all select-all">
                        {session.meetLink}
                      </p>
                      <p className="font-sans text-[11px] text-blue-700/80">
                        Host: <span className="font-semibold text-blue-900">{session.mentorGoogleEmail || session.mentorEmail || "Mentor's Google Account"}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyToClipboard(session.id, session.meetLink)}
                        className="px-3 py-2 rounded-sm border border-blue-300 bg-white hover:bg-blue-50 font-label text-[11px] font-bold uppercase text-blue-900 tracking-wider transition"
                      >
                        {copiedId === session.id ? "Copied! ✓" : "Copy Link"}
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

                  {/* Agenda notes & mark complete */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="text-xs font-sans text-slate-600 italic bg-slate-50 p-3 rounded-sm border border-slate-100 flex-1">
                      <span className="font-label text-[10px] font-bold uppercase text-slate-400 not-italic block mb-0.5">
                        Agenda Notes
                      </span>
                      &ldquo;{session.questions}&rdquo;
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleMarkAsPast(session.id)}
                        className="font-label text-[11px] text-slate-500 hover:text-slate-900 underline uppercase tracking-wider"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAST & COMPLETED SESSIONS */}
        {activeTab === "past" && (
          <div className="space-y-5">
            {pastSessions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center font-serif text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Historical Records</h3>
                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto">
                  Completed sessions and practitioner reviews will appear here following call execution.
                </p>
              </div>
            ) : (
              pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 shadow-2xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                          ✓ Completed
                        </span>
                        <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                          {session.date} at {session.time}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        {session.mentorName}
                      </h3>
                      <p className="font-sans text-xs text-slate-500">
                        {session.mentorDesignation}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="font-label text-[10px] text-slate-400 uppercase tracking-widest block">
                        Amount Settled
                      </span>
                      <p className="font-label text-base font-bold text-slate-900 mt-0.5">
                        ₹{session.amountPaid}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Review Interactive Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-label text-[11px] font-bold uppercase text-slate-800 tracking-wider">
                        Practitioner Rating & Consultation Feedback
                      </p>
                      {reviewSaved[session.id] && (
                        <span className="font-label text-[10px] text-emerald-700 font-bold uppercase">
                          Saved to Registry ✓
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewRating((prev) => ({ ...prev, [session.id]: star }))
                          }
                          className="text-xl transition hover:scale-110 focus:outline-none"
                        >
                          <span
                            className={
                              star <= (reviewRating[session.id] || 0)
                                ? "text-[#6d5e00]"
                                : "text-slate-300"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="font-label text-xs text-slate-500 ml-2">
                        {reviewRating[session.id] ? `${reviewRating[session.id]} / 5 Stars` : "Tap stars to rate"}
                      </span>
                    </div>

                    {/* Feedback Notes */}
                    <textarea
                      rows={2}
                      value={reviewNotes[session.id] || ""}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({ ...prev, [session.id]: e.target.value }))
                      }
                      placeholder="Leave notes on mentor insights, key action points, or career guidance given..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#094cb2] bg-white text-slate-900 font-sans"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveReview(session.id)}
                        className="px-4 py-1.5 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-[11px] font-bold uppercase tracking-wider transition shadow-2xs"
                      >
                        Save Evaluation
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
