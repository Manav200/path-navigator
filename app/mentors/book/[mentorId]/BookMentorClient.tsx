"use client";

// app/mentors/book/[mentorId]/BookMentorClient.tsx
// Alexandria High-End Editorial — 1:1 Mentorship Booking & Checkout Interface
// Integrates slot selection, duration toggle, agenda notes, and Razorpay checkout.

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getMentorById,
  calculatePricing,
  saveBookedSession,
  generateMeetLink,
  generateGoogleCalendarUrl,
  BookedSession,
} from "@/lib/mentorData";
import SlotGrid from "@/components/mentors/SlotGrid";
import RazorpayCheckoutButton from "@/components/checkout/RazorpayCheckoutButton";
import { useAuthUserStore } from "@/store/useAuthUserStore";
import { buildSlotId } from "@/lib/slotLockEngine";


export default function BookMentorClient() {
  const params = useParams();
  const mentorId = typeof params.mentorId === "string" ? params.mentorId : "";

  const mentor = useMemo(() => getMentorById(mentorId), [mentorId]);

  const studentProfile = useAuthUserStore((s) => s.studentProfile);
  const studentId = studentProfile?.id || "student_guest_01";

  // Form states
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [studentName, setStudentName] = useState(studentProfile?.name || "");
  const [studentEmail, setStudentEmail] = useState(studentProfile?.email || "");
  const [agenda, setAgenda] = useState("");
  const [lockedSlotData, setLockedSlotData] = useState<{
    date: string;
    time: string;
    slotId: string;
    lockExpiration: number;
    paymentOrderId: string;
  } | null>(null);

  // Payment & status states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedSession | null>(null);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    if (!mentor) return {};
    const grouped: Record<string, typeof mentor.slots> = {};
    mentor.slots.forEach((s) => {
      if (!grouped[s.date]) grouped[s.date] = [];
      grouped[s.date].push(s);
    });
    return grouped;
  }, [mentor]);

  const availableDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);

  // Select first available date by default
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Pricing calculations
  const basePrice = useMemo(() => {
    if (!mentor) return 0;
    return selectedDuration === 60
      ? Math.round(mentor.pricePerSession * 1.8) // 10% discount on 60 min
      : mentor.pricePerSession;
  }, [mentor, selectedDuration]);

  const pricing = useMemo(() => calculatePricing(basePrice), [basePrice]);

  if (!mentor) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center font-serif text-2xl font-bold">
            ?
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">Mentor Profile Not Found</h1>
          <p className="font-sans text-sm text-slate-600">
            The mentor ID &ldquo;{mentorId}&rdquo; was not found in the verified roster.
          </p>
          <Link
            href="/mentors/software-engineer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#094cb2] text-white font-label text-xs uppercase tracking-wider font-bold shadow-xs hover:bg-[#1d63d8] transition"
          >
            ← Return to Mentors Directory
          </Link>
        </div>
      </main>
    );
  }

  // Called by RazorpayCheckoutButton after successful payment & server verification
  // Receives the actual Razorpay payment IDs and server-generated booking data

  const handlePaymentSuccess = (paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
    bookingId?: string;
    meetLink?: string;
    calendarInviteUrl?: string;
  }) => {
    const confirmedMeetLink =
      paymentData.meetLink || mentor.googleMeetLink || generateMeetLink(mentor);

    const calendarInvite =
      paymentData.calendarInviteUrl ||
      generateGoogleCalendarUrl({
        title: `1:1 Mentorship Session: ${mentor.name} & ${studentName.trim() || studentProfile?.name || "Scholar"}`,
        description: `Career consultation session.\nAgenda: ${agenda.trim() || "General career & pathway progression discussion."}`,
        mentorEmail: mentor.googleEmail || mentor.email,
        studentEmail: studentEmail.trim() || studentProfile?.email,
        date: selectedDate,
        time: selectedTime,
        meetLink: confirmedMeetLink,
      });

    const newSession: BookedSession = {
      id: paymentData.bookingId || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorDesignation: `${mentor.designation} · ${mentor.company}`,
      mentorEmail: mentor.email,
      mentorGoogleEmail: mentor.googleEmail || mentor.email,
      roleId: mentor.roleId,
      studentId: studentId,
      studentName: studentName.trim() || studentProfile?.name || "Candidate Scholar",
      studentEmail: studentEmail.trim() || studentProfile?.email || "candidate@pathnavigate.in",
      studentAcademic: studentProfile?.degree
        ? `${studentProfile.degree} · ${studentProfile.institution || "PathNavigate Scholar"}`
        : "Undergraduate Candidate",
      date: selectedDate,
      time: selectedTime,
      meetLink: confirmedMeetLink,
      calendarEventUrl: calendarInvite,
      questions: agenda.trim() || "General career & pathway progression discussion.",
      status: "upcoming",
      amountPaid: pricing.total,
      mentorHonorarium: pricing.basePrice,
      payoutStatus: "settled",
      bookedAt: Date.now(),
    };

    saveBookedSession(newSession);
    setConfirmedBooking(newSession);
  };

  // ── Confirmation Screen ───────────────────────────────────────────────────
  if (confirmedBooking) {
    const meetTimeStr = `${confirmedBooking.date} at ${confirmedBooking.time}`;
    return (
      <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header celebration */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
              ✓
            </div>
            <span className="inline-block px-3 py-1 rounded-sm bg-amber-50 border border-amber-200 font-label text-[11px] font-bold text-amber-900 tracking-wider uppercase">
              ✦ Order #{confirmedBooking.id.slice(0, 12)} Confirmed
            </span>
            <h1 className="font-serif text-3xl font-bold text-slate-950">
              1:1 Session Confirmed
            </h1>
            <p className="font-sans text-sm text-slate-600 max-w-lg mx-auto">
              Your 1:1 consultation with <strong>{confirmedBooking.mentorName}</strong> has been secured and registered in the Alexandria editorial schedule.
            </p>
          </div>

          {/* Session Details Card */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Mentor</p>
                <h3 className="font-serif text-lg font-bold text-slate-900">{confirmedBooking.mentorName}</h3>
                <p className="font-sans text-xs text-slate-500">{confirmedBooking.mentorDesignation}</p>
              </div>
              <div className="text-right">
                <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">Amount Paid</p>
                <p className="font-label text-base font-bold text-slate-950">₹{confirmedBooking.amountPaid}</p>
                <span className="font-label text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  Razorpay Verified
                </span>
              </div>
            </div>

            {/* Schedule time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-sm border border-slate-200">
              <div>
                <p className="font-label text-[10px] text-slate-500 uppercase tracking-wider">Date & Time</p>
                <p className="font-sans text-sm font-semibold text-slate-900 mt-0.5">{meetTimeStr}</p>
                <p className="font-label text-[11px] text-slate-500">Duration: {selectedDuration} Minutes</p>
              </div>
              <div>
                <p className="font-label text-[10px] text-slate-500 uppercase tracking-wider">Conference Platform</p>
                <p className="font-sans text-sm font-semibold text-slate-900 mt-0.5">Google Meet (Encrypted)</p>
                <p className="font-label text-[11px] text-slate-500">Camera & audio enabled</p>
              </div>
            </div>

            {/* Google Meet Link Banner */}
            <div className="p-5 bg-gradient-to-r from-blue-50/90 to-indigo-50/60 border border-blue-200 rounded-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="font-label text-[10px] text-blue-900 font-bold uppercase tracking-wider">
                      Live Google Meet Video Conference
                    </p>
                  </div>
                  <p className="font-mono text-xs text-blue-900 font-semibold break-all select-all mt-1">
                    {confirmedBooking.meetLink}
                  </p>
                  <p className="font-sans text-[11px] text-blue-700/80 mt-1">
                    Hosted via Mentor&apos;s Google Account: <span className="font-semibold text-blue-900">{confirmedBooking.mentorGoogleEmail || confirmedBooking.mentorEmail || mentor.googleEmail || mentor.email || "Verified Google Account"}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={confirmedBooking.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-xs uppercase tracking-wider font-bold rounded-sm transition shadow-xs"
                  >
                    Join Google Meet ↗
                  </a>
                  {confirmedBooking.calendarEventUrl && (
                    <a
                      href={confirmedBooking.calendarEventUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-label text-xs uppercase tracking-wider font-bold rounded-sm transition"
                      title="Add to Google Calendar"
                    >
                      Add to Calendar 📅
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Note */}
            <div>
              <p className="font-label text-[10px] text-slate-400 uppercase tracking-widest">
                Registered Agenda Notes
              </p>
              <p className="font-sans text-xs text-slate-700 mt-1 italic bg-slate-50 p-3 rounded-sm border border-slate-100">
                &ldquo;{confirmedBooking.questions}&rdquo;
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard/sessions"
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#094cb2] text-white font-label font-bold text-xs uppercase tracking-wider hover:bg-[#1d63d8] transition text-center shadow-xs"
            >
              View in My Sessions Dashboard →
            </Link>
            <Link
              href={`/mentors/${mentor.roleId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-white border border-slate-300 text-slate-700 font-label font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition text-center"
            >
              Explore More Mentors
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Main Booking Form ─────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href={`/mentors/${mentor.roleId}`}
            className="inline-flex items-center gap-1 font-label text-xs uppercase font-bold text-slate-600 hover:text-[#094cb2] transition"
          >
            ← Back to {mentor.roleId.replace("-", " ")} Mentors
          </Link>
          <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider">
            Alexandria Editorial · 1:1 Desk
          </span>
        </div>

        {/* Page Title */}
        <div>
          <span className="font-label text-[11px] text-[#6d5e00] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-sm border border-[#fde68a]">
            Reserve Executive Consultation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-2">
            Schedule 1:1 with {mentor.name}
          </h1>
          <p className="font-sans text-sm text-slate-600 mt-1">
            Choose your preferred time slot, configure the consultation duration, and formulate your briefing notes.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Booking Form (7 cols) */}
          <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-7 space-y-6">
            {/* Step 1: Duration Selector */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-slate-950">
                  1. Select Consultation Length
                </h3>
                <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                  Live Google Meet
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDuration(30)}
                  className={`p-4 rounded-sm border text-left transition ${
                    selectedDuration === 30
                      ? "border-[#094cb2] bg-[#094cb2]/5 ring-1 ring-[#094cb2]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="font-label text-xs uppercase font-bold text-slate-800">
                    30 Minutes
                  </p>
                  <p className="font-serif text-lg font-bold text-slate-950 mt-1">
                    ₹{mentor.pricePerSession}
                  </p>
                  <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                    Focused audit, resume review, or single query
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDuration(60)}
                  className={`p-4 rounded-sm border text-left transition relative ${
                    selectedDuration === 60
                      ? "border-[#094cb2] bg-[#094cb2]/5 ring-1 ring-[#094cb2]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span className="absolute top-2 right-2 font-label text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-[#6d5e00] rounded-sm">
                    Recommended
                  </span>
                  <p className="font-label text-xs uppercase font-bold text-slate-800">
                    60 Minutes
                  </p>
                  <p className="font-serif text-lg font-bold text-slate-950 mt-1">
                    ₹{Math.round(mentor.pricePerSession * 1.8)}
                  </p>
                  <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                    In-depth roadmap, mock interview & deep system QA
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Date & Slot Selector */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-slate-950">
                  2. Choose Date & Time Slot
                </h3>
                <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">
                  IST (Indian Standard Time)
                </span>
              </div>

              {/* Date Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map((dateStr) => {
                  const dateObj = new Date(dateStr);
                  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                  const dayNum = dateObj.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedTime("");
                      }}
                      className={`px-3.5 py-2.5 rounded-sm border text-center shrink-0 transition ${
                        isSelected
                          ? "border-[#094cb2] bg-[#094cb2] text-white"
                          : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <p className={`font-label text-[10px] uppercase font-bold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {weekday}
                      </p>
                      <p className="font-sans text-xs font-bold mt-0.5 whitespace-nowrap">
                        {dayNum}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* SlotGrid with Atomic Concurrency Locks */}
              {selectedDate && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="font-label text-[11px] text-slate-500 uppercase tracking-wider">
                      Times for {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "long" })}:
                    </p>
                    <span className="font-label text-[10px] text-[#094cb2] uppercase tracking-wider">
                      ✦ 10-Min Pre-Booking Lock Protection
                    </span>
                  </div>
                  <SlotGrid
                    mentorId={mentor.id}
                    slots={mentor.slots}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    studentId={studentId}
                    onSlotSelected={(d, t) => {
                      setSelectedDate(d);
                      setSelectedTime(t);
                    }}
                    onSlotLocked={(data) => {
                      setLockedSlotData(data);
                      setSelectedTime(data.time);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Step 3: Student Details & Agenda */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-base font-bold text-slate-950">
                3. Candidate Credentials & Consultation Agenda
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-[#094cb2] bg-white font-sans text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-label text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-[#094cb2] bg-white font-sans text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic Notes & Agenda for {mentor.name}
                </label>
                <textarea
                  rows={3}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Outline your questions, target companies, or share a link to your resume/portfolio..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-[#094cb2] bg-white font-sans text-slate-900"
                />
                <span className="font-sans text-[11px] text-slate-400">
                  Shared directly with the mentor prior to the call.
                </span>
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-sm">
                ⚠ {errorMsg}
              </div>
            )}

            {/* Submit CTA for mobile */}
            <div className="block lg:hidden">
              <RazorpayCheckoutButton
                slotId={lockedSlotData?.slotId || (selectedDate && selectedTime ? buildSlotId(mentor.id, selectedDate, selectedTime) : undefined)}
                mentorId={mentor.id}
                mentorName={mentor.name}
                studentId={studentId}
                studentName={studentName.trim() || studentProfile?.name || "Candidate Scholar"}
                studentEmail={studentEmail.trim() || studentProfile?.email || "candidate@pathnavigate.in"}
                date={selectedDate}
                time={selectedTime}
                basePrice={basePrice}
                agenda={agenda}
                totalAmount={pricing.total}
                disabled={!selectedDate || !selectedTime || !studentName.trim() || !studentEmail.trim()}
                onSuccess={handlePaymentSuccess}
                onError={(err) => setErrorMsg(err)}
                label={`Confirm & Pay ₹${pricing.total}`}
              />
            </div>
          </form>

          {/* RIGHT COLUMN: Mentor Summary & Checkout Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            {/* Mentor Overview Card */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-sm bg-[#094cb2]/10 border border-[#094cb2]/20 flex items-center justify-center font-serif text-lg font-bold text-[#094cb2] shrink-0">
                  {mentor.avatar}
                </div>
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-sm bg-amber-50 border border-[#fde68a] text-[#6d5e00] font-label text-[10px] font-bold uppercase tracking-wider">
                    ✦ {mentor.credentialBadge}
                  </span>
                  <h2 className="font-serif text-lg font-bold text-slate-950 mt-1">
                    {mentor.name}
                  </h2>
                  <p className="font-sans text-xs text-slate-500">
                    {mentor.designation} · {mentor.company}
                  </p>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="font-sans text-xs text-slate-600 line-clamp-3 leading-relaxed border-t border-slate-100 pt-3">
                {mentor.bio}
              </p>

              {/* Specialization Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mentor.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200 font-label text-[10px] text-slate-600 uppercase tracking-wider"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Selected Slot Recap */}
              <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-1">
                <p className="font-label text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Selected Session
                </p>
                <p className="font-sans text-xs font-semibold text-slate-900">
                  {selectedDate
                    ? `${new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${selectedTime || "Time not selected"}`
                    : "No slot selected"}
                </p>
                <p className="font-label text-[11px] text-slate-500">
                  Duration: {selectedDuration} Minutes · Google Meet
                </p>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-sans text-slate-600">
                  <span>Session Fee ({selectedDuration} mins)</span>
                  <span className="font-label font-semibold text-slate-800">₹{pricing.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-600">
                  <span>Curator Platform Fee (10%)</span>
                  <span className="font-label font-semibold text-slate-800">₹{pricing.platformFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-sans font-bold text-slate-950 border-t border-slate-200 pt-2">
                  <span>Total Amount</span>
                  <span className="font-label text-base font-bold text-[#094cb2]">₹{pricing.total}</span>
                </div>
              </div>

              {/* Desktop Checkout CTA */}
              <div className="hidden lg:block pt-2">
                <RazorpayCheckoutButton
                  slotId={lockedSlotData?.slotId || (selectedDate && selectedTime ? buildSlotId(mentor.id, selectedDate, selectedTime) : undefined)}
                  mentorId={mentor.id}
                  mentorName={mentor.name}
                  studentId={studentId}
                  studentName={studentName.trim() || studentProfile?.name || "Candidate Scholar"}
                  studentEmail={studentEmail.trim() || studentProfile?.email || "candidate@pathnavigate.in"}
                  date={selectedDate}
                  time={selectedTime}
                  basePrice={basePrice}
                  agenda={agenda}
                  totalAmount={pricing.total}
                  disabled={!selectedDate || !selectedTime || !studentName.trim() || !studentEmail.trim()}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => setErrorMsg(err)}
                  label={`Confirm & Pay ₹${pricing.total} →`}
                />
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>100% Satisfaction or full refund within 24 hours.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 font-bold">✓</span>
                  <span>Direct calendar invite with verified Google Meet link.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-700 font-bold">✦</span>
                  <span>Secured via Razorpay Webhook Encryption.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
