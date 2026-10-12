// lib/mentorData.ts
// Mentor data models and initial seed roster for the PathNavigate 1:1 Mentorship Marketplace.
// Maps each mentor to a launch profession (roleId) with credentials, pricing, slots, and bio.

export interface MentorSlot {
  date: string;        // ISO date string: "2026-10-15"
  time: string;        // "10:00 AM", "2:30 PM"
  available: boolean;
}

export interface Mentor {
  id: string;
  roleId: string;                  // matches /pathway/[roleId] slugs
  name: string;
  avatar: string;                  // initials fallback
  designation: string;             // Current title
  company: string;
  credentialBadge: string;         // "Ex-Google", "Senior Advocate — Delhi HC", etc.
  bio: string;
  experience: number;              // years
  specializations: string[];
  pricePerSession: number;         // INR per 30 mins
  rating: number;                  // 1–5
  reviewCount: number;
  matchScore: number;              // 0–100 alignment with assessment
  slots: MentorSlot[];
  linkedIn?: string;
  languages: string[];
  email?: string;
  googleEmail?: string;
  googleMeetLink?: string;
}

export interface BookedSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorDesignation: string;
  mentorEmail?: string;
  mentorGoogleEmail?: string;
  roleId: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  studentAcademic?: string;
  date: string;
  time: string;
  meetLink: string;
  calendarEvent?: string;
  calendarEventUrl?: string;
  questions: string;
  status: "upcoming" | "past" | "cancelled";
  studentRating?: number;
  studentNotes?: string;
  mentorFeedbackNotes?: string;
  amountPaid: number;
  mentorHonorarium?: number;
  payoutStatus?: "pending" | "processing" | "settled";
  bookedAt: number;
}

// ── Generate rolling 7-day slot grid ──────────────────────────────────────────
function generateSlots(seedOffset = 0): MentorSlot[] {
  const slots: MentorSlot[] = [];
  const times = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];
  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    times.forEach((time, i) => {
      // Pseudo-random availability based on seed
      const available = (d + i + seedOffset) % 3 !== 0;
      slots.push({ date: dateStr, time, available });
    });
  }
  return slots;
}

// ── Mentor Roster ──────────────────────────────────────────────────────────────
export const MENTORS: Mentor[] = [
  // ── Software Engineer ──
  {
    id: "mentor-se-001",
    roleId: "software-engineer",
    name: "Arjun Sharma",
    avatar: "AS",
    designation: "Senior Staff Engineer",
    company: "Google",
    credentialBadge: "Ex-Google · 11 Years",
    bio: "Architected distributed payment systems at Google Pay handling 50M+ daily transactions. Specializes in system design, DSA coaching, and full-stack mentorship for SDE-1 to SDE-3 transitions.",
    experience: 11,
    specializations: ["System Design", "DSA", "Full-Stack", "Google Prep"],
    pricePerSession: 799,
    rating: 4.9,
    reviewCount: 143,
    matchScore: 94,
    slots: generateSlots(1),
    languages: ["English", "Hindi"],
    email: "arjun.sharma@gmail.com",
    googleEmail: "arjun.sharma.mentorship@gmail.com",
  },
  {
    id: "mentor-se-002",
    roleId: "software-engineer",
    name: "Priya Nair",
    avatar: "PN",
    designation: "Engineering Manager",
    company: "Microsoft",
    credentialBadge: "Ex-Microsoft · 9 Years",
    bio: "Built Azure DevOps pipelines and led a team of 12 engineers. Expert in cloud architecture, Kubernetes, and career growth from IC to management track.",
    experience: 9,
    specializations: ["Cloud Architecture", "Kubernetes", "Leadership", "Azure"],
    pricePerSession: 699,
    rating: 4.8,
    reviewCount: 98,
    matchScore: 87,
    slots: generateSlots(2),
    languages: ["English", "Malayalam"],
    email: "priya.nair@microsoft.com",
    googleEmail: "priya.nair.cloud@gmail.com",
  },
  {
    id: "mentor-se-003",
    roleId: "software-engineer",
    name: "Rohan Mehta",
    avatar: "RM",
    designation: "Principal Engineer",
    company: "Flipkart",
    credentialBadge: "IIT Bombay · 7 Years",
    bio: "Principal engineer at Flipkart's search & recommendation team. Expert in machine learning systems, recommendation engines, and large-scale data pipelines.",
    experience: 7,
    specializations: ["ML Systems", "Recommendation Engines", "Python", "Spark"],
    pricePerSession: 499,
    rating: 4.7,
    reviewCount: 61,
    matchScore: 81,
    slots: generateSlots(3),
    languages: ["English", "Hindi", "Gujarati"],
    email: "rohan.mehta@flipkart.com",
    googleEmail: "rohan.mehta.ml@gmail.com",
  },

  // ── Business Analyst ──
  {
    id: "mentor-ba-001",
    roleId: "business-analyst",
    name: "Deepika Verma",
    avatar: "DV",
    designation: "Senior Business Analyst",
    company: "McKinsey & Company",
    credentialBadge: "Ex-McKinsey · 8 Years",
    bio: "Led digital transformation projects for Fortune 500 clients across BFSI, retail, and pharma. Expert in SQL analytics, JIRA, stakeholder management, and MBB case interview coaching.",
    experience: 8,
    specializations: ["Strategy", "SQL Analytics", "MBB Prep", "BFSI"],
    pricePerSession: 649,
    rating: 4.9,
    reviewCount: 112,
    matchScore: 92,
    slots: generateSlots(4),
    languages: ["English", "Hindi"],
    email: "deepika.verma@mckinsey.com",
    googleEmail: "deepika.verma.consult@gmail.com",
  },
  {
    id: "mentor-ba-002",
    roleId: "business-analyst",
    name: "Karthik Iyer",
    avatar: "KI",
    designation: "Product & Analytics Lead",
    company: "Razorpay",
    credentialBadge: "Ex-Razorpay · 6 Years",
    bio: "Built the analytics dashboard powering Razorpay's SME insights. Specializes in product metrics, funnel analysis, and translating business requirements to technical specs.",
    experience: 6,
    specializations: ["Product Analytics", "Funnel Optimization", "Mixpanel", "Looker"],
    pricePerSession: 499,
    rating: 4.7,
    reviewCount: 74,
    matchScore: 85,
    slots: generateSlots(5),
    languages: ["English", "Tamil", "Kannada"],
    email: "karthik.iyer@razorpay.com",
    googleEmail: "karthik.iyer.analytics@gmail.com",
  },

  // ── Lawyer ──
  {
    id: "mentor-law-001",
    roleId: "lawyer",
    name: "Adv. Meera Krishnamurthy",
    avatar: "MK",
    designation: "Senior Advocate",
    company: "Delhi High Court",
    credentialBadge: "Senior HC Practitioner · 14 Years",
    bio: "Practising at Delhi High Court with expertise in commercial arbitration, IP law, and corporate M&A transactions. Guides students through CLAT strategy, moot court prep, and associate roles.",
    experience: 14,
    specializations: ["Commercial Arbitration", "IP Law", "M&A", "CLAT Prep"],
    pricePerSession: 599,
    rating: 5.0,
    reviewCount: 88,
    matchScore: 96,
    slots: generateSlots(6),
    languages: ["English", "Hindi", "Kannada"],
    email: "meera.krishna@delhihc.in",
    googleEmail: "adv.meera.krishnamurthy@gmail.com",
  },
  {
    id: "mentor-law-002",
    roleId: "lawyer",
    name: "Adv. Vikram Anand",
    avatar: "VA",
    designation: "Corporate Counsel",
    company: "Tata Consultancy Services",
    credentialBadge: "NLU Bangalore · 9 Years",
    bio: "In-house counsel managing TCS's contractual and compliance framework across 40+ jurisdictions. Specializes in tech law, data privacy (DPDP), and corporate legal career transitions.",
    experience: 9,
    specializations: ["Tech Law", "Data Privacy", "Compliance", "Contracts"],
    pricePerSession: 499,
    rating: 4.8,
    reviewCount: 55,
    matchScore: 88,
    slots: generateSlots(0),
    languages: ["English", "Hindi"],
    email: "vikram.anand@tcs.com",
    googleEmail: "adv.vikram.anand@gmail.com",
  },

  // ── Doctor ──
  {
    id: "mentor-doc-001",
    roleId: "doctor",
    name: "Dr. Ananya Pillai",
    avatar: "AP",
    designation: "Senior Resident — Internal Medicine",
    company: "AIIMS Delhi",
    credentialBadge: "AIIMS Delhi · MBBS + MD",
    bio: "Senior resident at AIIMS Internal Medicine. Provides NEET PG strategy, clinical posting advice, residency application guidance, and medical ethics mentorship.",
    experience: 6,
    specializations: ["NEET PG Strategy", "Internal Medicine", "Clinical Postings", "MD Prep"],
    pricePerSession: 549,
    rating: 4.9,
    reviewCount: 97,
    matchScore: 93,
    slots: generateSlots(2),
    languages: ["English", "Malayalam", "Hindi"],
    email: "ananya.pillai@aiims.edu",
    googleEmail: "dr.ananya.pillai.med@gmail.com",
  },
  {
    id: "mentor-doc-002",
    roleId: "doctor",
    name: "Dr. Rahul Bose",
    avatar: "RB",
    designation: "Consultant Cardiologist",
    company: "Fortis Hospital, Gurgaon",
    credentialBadge: "DM Cardiology · 12 Years",
    bio: "Practising interventional cardiologist with 12 years of clinical experience. Mentors medical students on specialty selection, cardiology research, and USMLE pathway planning.",
    experience: 12,
    specializations: ["Cardiology", "USMLE Pathway", "Interventional", "Research"],
    pricePerSession: 699,
    rating: 4.8,
    reviewCount: 63,
    matchScore: 86,
    slots: generateSlots(4),
    languages: ["English", "Bengali", "Hindi"],
    email: "rahul.bose@fortis.in",
    googleEmail: "dr.rahul.bose.cardio@gmail.com",
  },

  // ── Pharmacist ──
  {
    id: "mentor-ph-001",
    roleId: "pharmacist",
    name: "Dr. Sneha Kulkarni",
    avatar: "SK",
    designation: "Regulatory Affairs Lead",
    company: "Sun Pharma",
    credentialBadge: "Ex-Sun Pharma · 10 Years",
    bio: "Leads global regulatory submissions at Sun Pharma for US-FDA, EU-EMA, and CDSCO. Expert in drug dossier preparation, regulatory strategy, and pharma career transitions from B.Pharm.",
    experience: 10,
    specializations: ["Regulatory Affairs", "US-FDA", "Drug Dossier", "Clinical Trials"],
    pricePerSession: 499,
    rating: 4.8,
    reviewCount: 71,
    matchScore: 91,
    slots: generateSlots(1),
    languages: ["English", "Marathi", "Hindi"],
    email: "sneha.kulkarni@sunpharma.com",
    googleEmail: "dr.sneha.kulkarni.pharma@gmail.com",
  },
  {
    id: "mentor-ph-002",
    roleId: "pharmacist",
    name: "Dr. Aditya Rao",
    avatar: "AR",
    designation: "Clinical Pharmacist",
    company: "Apollo Hospitals",
    credentialBadge: "Pharm.D · 8 Years",
    bio: "Clinical pharmacist at Apollo, specializing in antimicrobial stewardship and pharmacovigilance. Guides students toward clinical pharmacy, GPAT preparation, and hospital roles.",
    experience: 8,
    specializations: ["Clinical Pharmacy", "GPAT Prep", "Pharmacovigilance", "Hospital"],
    pricePerSession: 399,
    rating: 4.7,
    reviewCount: 48,
    matchScore: 84,
    slots: generateSlots(3),
    languages: ["English", "Telugu", "Hindi"],
    email: "aditya.rao@apollo.in",
    googleEmail: "dr.aditya.rao.pharmd@gmail.com",
  },
];

// ── Registered Mentors Persistence (localStorage) ─────────────────────────

const REGISTERED_MENTORS_KEY = "pathnavigate_registered_mentors_v1";

export function getCustomRegisteredMentors(): Mentor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_MENTORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredMentor(mentor: Mentor): void {
  if (typeof window === "undefined") {
    MENTORS.unshift(mentor);
    return;
  }
  const existing = getCustomRegisteredMentors();
  const updated = [mentor, ...existing.filter((m) => m.id !== mentor.id)];
  localStorage.setItem(REGISTERED_MENTORS_KEY, JSON.stringify(updated));
  // In-memory update for current session
  if (!MENTORS.some((m) => m.id === mentor.id)) {
    MENTORS.unshift(mentor);
  }
}

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export function getMentorsByRole(roleId: string): Mentor[] {
  const custom = getCustomRegisteredMentors();
  const all = [...custom, ...MENTORS];
  const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
  return unique.filter((m) => m.roleId === roleId);
}

export function getMentorById(mentorId: string): Mentor | undefined {
  const custom = getCustomRegisteredMentors();
  return custom.find((m) => m.id === mentorId) || MENTORS.find((m) => m.id === mentorId);
}

export function getAllRoleIds(): string[] {
  const custom = getCustomRegisteredMentors();
  const all = [...custom, ...MENTORS];
  return [...new Set(all.map((m) => m.roleId))];
}

// ── Session Storage (localStorage) ───────────────────────────────────────────

const SESSIONS_KEY = "pathnavigate_booked_sessions_v1";

export function getBookedSessions(): BookedSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookedSession(session: BookedSession): void {
  if (typeof window === "undefined") return;
  const existing = getBookedSessions();
  const updated = [session, ...existing.filter((s) => s.id !== session.id)];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export function updateSessionRating(sessionId: string, rating: number, notes: string): void {
  if (typeof window === "undefined") return;
  const sessions = getBookedSessions();
  const updated = sessions.map((s) =>
    s.id === sessionId ? { ...s, studentRating: rating, studentNotes: notes } : s
  );
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export function updateMentorSessionNotes(sessionId: string, mentorFeedbackNotes: string): void {
  if (typeof window === "undefined") return;
  const sessions = getBookedSessions();
  const updated = sessions.map((s) =>
    s.id === sessionId ? { ...s, mentorFeedbackNotes } : s
  );
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export function markSessionStatus(sessionId: string, status: "upcoming" | "past" | "cancelled"): void {
  if (typeof window === "undefined") return;
  const sessions = getBookedSessions();
  const updated = sessions.map((s) =>
    s.id === sessionId ? { ...s, status } : s
  );
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

// ── Google Meet Link & Calendar Generator ─────────────────────────────────────

export function generateMeetLink(
  mentor?: { googleMeetLink?: string; googleEmail?: string; email?: string } | null
): string {
  // 1. If mentor configured their real Google Meet link, prioritize it
  if (mentor?.googleMeetLink && mentor.googleMeetLink.trim().length > 0) {
    const raw = mentor.googleMeetLink.trim();
    return raw.startsWith("http") ? raw : `https://${raw}`;
  }

  // 2. Fallback to Google Meet's native instant room launcher under mentor's Google Account
  return "https://meet.google.com/new";
}

/**
 * Generates an authentic Google Calendar event URL pre-filled with mentor's Google Account,
 * student email, session title, and Google Meet conferencing.
 */
export function generateGoogleCalendarUrl(params: {
  title: string;
  description: string;
  mentorEmail?: string;
  studentEmail?: string;
  date: string;
  time: string;
  meetLink?: string;
}): string {
  try {
    const [year, month, day] = params.date.split("-").map(Number);
    const timeMatch = params.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 10;
    let minutes = 0;
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }
    const start = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const end = new Date(start.getTime() + 45 * 60 * 1000); // 45 minute consultation window

    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const attendees = [params.mentorEmail, params.studentEmail].filter(Boolean).join(",");
    const details = `${params.description}\n\nGoogle Meet Room: ${params.meetLink || "https://meet.google.com/new"}\nOrganized via PathNavigate Mentorship Platform`;

    const u = new URL("https://calendar.google.com/calendar/render");
    u.searchParams.set("action", "TEMPLATE");
    u.searchParams.set("text", params.title);
    u.searchParams.set("dates", `${fmt(start)}/${fmt(end)}`);
    u.searchParams.set("details", details);
    u.searchParams.set("location", params.meetLink || "Google Meet Video Conference");
    if (attendees) {
      u.searchParams.set("add", attendees);
    }
    return u.toString();
  } catch {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.title)}`;
  }
}

// ── Price helpers ─────────────────────────────────────────────────────────────

export const PLATFORM_FEE_PERCENT = 0.1; // 10%

export function calculatePricing(basePrice: number) {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_PERCENT);
  const total = basePrice + platformFee;
  return { basePrice, platformFee, total };
}
