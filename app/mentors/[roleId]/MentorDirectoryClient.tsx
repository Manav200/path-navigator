"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getMentorsByRole, Mentor } from "@/lib/mentorData";

const ROLE_META: Record<string, { label: string; icon: string; domain: string }> = {
  "software-engineer": { label: "Software / Full-Stack Engineer", icon: "💻", domain: "Computing & Distributed Systems" },
  "business-analyst":  { label: "Business Analyst", icon: "📊", domain: "Corporate Strategy & Quantitative Modeling" },
  "lawyer":            { label: "Lawyer / Corporate Legal Specialist", icon: "⚖️", domain: "Jurisprudence & Commercial Arbitration" },
  "doctor":            { label: "Doctor / Clinical Practitioner", icon: "🩺", domain: "Clinical Medicine & Patient Diagnosis" },
  "pharmacist":        { label: "Pharmacist / Pharmaceutical Analyst", icon: "💊", domain: "Pharmacology & Chemical Toxicology" },
};

const PRICE_FILTERS = [
  { label: "All Prices", max: Infinity },
  { label: "Under ₹500", max: 499 },
  { label: "₹500–₹700", max: 700 },
  { label: "₹700+", max: Infinity, min: 700 },
];
const EXP_FILTERS = [
  { label: "Any Experience", min: 0 },
  { label: "5+ Years", min: 5 },
  { label: "8+ Years", min: 8 },
  { label: "12+ Years", min: 12 },
];

function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 font-label text-[11px]">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "text-[#6d5e00]" : "text-slate-200"}>★</span>
      ))}
      <span className="text-slate-500 ml-0.5">{rating.toFixed(1)} ({count})</span>
    </span>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="bg-surface-lowest rounded-sm border border-slate-200 hover:border-[#094cb2] transition-colors shadow-xs flex flex-col group overflow-hidden">
      {mentor.matchScore >= 85 && (
        <div className="h-1 bg-gradient-to-r from-[#094cb2] to-[#1d63d8]" />
      )}

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-sm bg-[#094cb2]/10 border border-[#094cb2]/20 flex items-center justify-center font-serif text-base font-bold text-[#094cb2] shrink-0">
            {mentor.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base font-bold text-slate-950 group-hover:text-[#094cb2] transition-colors leading-tight">
              {mentor.name}
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-0.5 truncate">
              {mentor.designation} · {mentor.company}
            </p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-sm bg-amber-50 border border-[#fde68a] text-[#6d5e00] font-label text-[10px] font-bold uppercase tracking-wider">
              ✦ {mentor.credentialBadge}
            </span>
          </div>

          {mentor.matchScore > 0 && (
            <div className="text-center shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-[#094cb2]/30 flex items-center justify-center bg-[#094cb2]/5">
                <span className="font-label text-[11px] font-bold text-[#094cb2]">{mentor.matchScore}%</span>
              </div>
              <span className="font-label text-[9px] uppercase tracking-wider text-slate-400 block mt-0.5">Match</span>
            </div>
          )}
        </div>

        <p className="font-sans text-xs text-slate-600 leading-relaxed line-clamp-3">{mentor.bio}</p>

        <div className="flex flex-wrap gap-1.5">
          {mentor.specializations.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-sm bg-surface-container border border-slate-200 font-label text-[10px] text-slate-600 uppercase tracking-wider">
              {s}
            </span>
          ))}
          {mentor.specializations.length > 3 && (
            <span className="px-2 py-0.5 rounded-sm bg-surface-container border border-slate-200 font-label text-[10px] text-slate-400">
              +{mentor.specializations.length - 3}
            </span>
          )}
        </div>

        <StarRow rating={mentor.rating} count={mentor.reviewCount} />

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="font-label text-lg font-bold text-slate-950">₹{mentor.pricePerSession}</span>
            <span className="font-label text-[10px] text-slate-400 ml-1">/ 30 mins</span>
          </div>
          <Link
            href={`/mentors/book/${mentor.id}`}
            className="px-4 py-2 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-xs"
          >
            Reserve 1:1 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MentorDirectoryClient() {
  const params = useParams();
  const router = useRouter();
  const roleId = typeof params.roleId === "string" ? params.roleId : "";
  const meta = ROLE_META[roleId];

  const allMentors = useMemo(() => getMentorsByRole(roleId), [roleId]);

  const [priceFilter, setPriceFilter] = useState(0);
  const [expFilter, setExpFilter]     = useState(0);

  const filtered = useMemo(() => {
    const pf = PRICE_FILTERS[priceFilter];
    const ef = EXP_FILTERS[expFilter];
    return allMentors.filter((m) => {
      const priceOk = m.pricePerSession <= (pf.max === Infinity && (pf as any).min ? Infinity : pf.max) &&
        m.pricePerSession >= ((pf as any).min ?? 0);
      const expOk = m.experience >= ef.min;
      return priceOk && expOk;
    });
  }, [allMentors, priceFilter, expFilter]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-serif text-2xl text-slate-700">Role Not Found</p>
          <Link href="/" className="font-label text-sm text-[#094cb2] hover:underline">← Back to PathNavigate</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-low text-slate-900 font-sans selection:bg-[#fef3c7] selection:text-[#453b00]">
      {/* ── Archival Top Bar ─────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 bg-white px-6 py-2 text-[11px] font-label tracking-widest uppercase text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6d5e00]" />
          PathNavigate · Vetted Practitioner Network
        </span>
        <Link href="/" className="hidden sm:inline text-slate-400 hover:text-slate-700 transition">
          ← Return to Homepage
        </Link>
      </div>

      {/* ── Editorial Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white font-bold shadow-xs text-sm">
            PN
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-slate-950">
            Path<span className="text-[#094cb2]">Navigate</span>
          </span>
        </div>
        <nav className="flex items-center gap-3 sm:gap-4 font-label text-xs text-slate-500">
          <Link href={`/pathway/${roleId}`} className="hover:text-[#094cb2] transition hidden sm:inline">DAG Skill Tree</Link>
          <Link href="/dashboard/sessions" className="hover:text-[#094cb2] transition">Sessions</Link>
          <Link href="/register/mentor" className="text-[#6d5e00] hover:text-amber-800 transition font-semibold">
            ✦ Join as Mentor
          </Link>
          <Link href="/profile" className="px-2.5 py-1 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition">
            Profile 👤
          </Link>
        </nav>
      </header>

      {/* ── Hero Editorial Banner ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 px-6 sm:px-10 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label px-2.5 py-0.5 rounded-sm text-[10px] font-bold bg-[#094cb2]/10 text-[#094cb2] border border-[#094cb2]/20 uppercase tracking-widest">
              Editorial Access
            </span>
            <span className="font-label text-xs text-slate-400 uppercase tracking-widest">
              • Vetted Senior Practitioners Only
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-950 tracking-tight leading-tight">
            Connect 1:1 with Senior{" "}
            <span className="italic font-normal text-[#094cb2]">
              {meta.label} Practitioners.
            </span>
          </h1>

          <p className="font-sans text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Each mentor is manually vetted by the PathNavigate Curatorial Board.
            30-minute live calls · Real workplace insights · Fully encrypted video sessions.
          </p>

          <div className="flex items-center gap-2 font-label text-xs text-slate-400 uppercase tracking-wider pt-1">
            <span className="text-lg">{meta.icon}</span>
            <span>{meta.domain}</span>
            <span>·</span>
            <span className="text-[#094cb2] font-bold">{allMentors.length} Vetted Mentors</span>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
      <section className="bg-surface-low border-b border-slate-200 px-6 sm:px-10 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-slate-400 font-bold">Filter:</span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {PRICE_FILTERS.map((f, i) => (
              <button
                key={f.label}
                onClick={() => setPriceFilter(i)}
                className={`px-3 py-1 rounded-sm font-label text-[11px] font-bold uppercase tracking-wider border transition ${
                  priceFilter === i
                    ? "bg-[#094cb2] border-[#094cb2] text-white"
                    : "bg-surface-lowest border-slate-200 text-slate-600 hover:border-[#094cb2] hover:text-[#094cb2]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {EXP_FILTERS.map((f, i) => (
              <button
                key={f.label}
                onClick={() => setExpFilter(i)}
                className={`px-3 py-1 rounded-sm font-label text-[11px] font-bold uppercase tracking-wider border transition ${
                  expFilter === i
                    ? "bg-[#6d5e00] border-[#6d5e00] text-white"
                    : "bg-surface-lowest border-slate-200 text-slate-600 hover:border-[#6d5e00] hover:text-[#6d5e00]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="ml-auto font-label text-[11px] text-slate-400">
            {filtered.length} of {allMentors.length} mentors
          </span>
        </div>
      </section>

      {/* ── Mentor Grid ──────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-6">
        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif text-xl text-slate-600">No mentors match your current filters.</p>
            <button
              onClick={() => { setPriceFilter(0); setExpFilter(0); }}
              className="font-label text-sm text-[#094cb2] hover:underline"
            >
              Clear all filters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-slate-200 text-center space-y-3">
          <p className="font-sans text-sm text-slate-500">
            Want a different specialty?{" "}
            <span className="font-semibold text-slate-700">All mentors are manually vetted and background-checked.</span>
          </p>
          <div className="flex items-center justify-center gap-4 font-label text-xs text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#094cb2] transition">← All Disciplines</Link>
            <span>•</span>
            <Link href="/dashboard/sessions" className="hover:text-[#094cb2] transition">View My Sessions →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
