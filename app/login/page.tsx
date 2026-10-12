"use client";

// app/login/page.tsx
// Alexandria High-End Editorial Entry Portal
// Google SSO + Anonymous guest scholar access with authoritative styling

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOnboarding, getAssessment } from "@/lib/userStore";
import { sanitizeClientError } from "@/lib/errorSanitizer";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInAnonymouslyUser } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && user) {
      const onboarding = getOnboarding(user.uid);
      const assessment = getAssessment(user.uid);
      if (assessment?.topCareers?.length) {
        router.replace("/pathway");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [user, loading, router]);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(
        sanitizeClientError(
          err,
          "Sign-in could not be completed. Please try again or continue with instant Guest Scholar access."
        )
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setGuestLoading(true);
    try {
      await signInAnonymouslyUser();
    } catch (err: unknown) {
      setError(
        sanitizeClientError(
          err,
          "Guest session could not be initialized. Please refresh and try again."
        )
      );
    } finally {
      setGuestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-full border-2 border-[#094cb2] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <main className="relative min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center px-4 py-12 selection:bg-[#fef3c7] selection:text-[#453b00]">
      {/* Background Archival Header Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#6d5e00]" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Monogram */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-sm bg-[#094cb2] flex items-center justify-center font-serif text-white text-xl font-bold shadow-xs">
              PN
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-950 block leading-tight">
                Path<span className="text-[#094cb2]">Navigate</span>
              </span>
              <span className="font-label text-[10px] tracking-widest uppercase text-slate-500 block">
                Alexandria Digital Curator
              </span>
            </div>
          </Link>
        </div>

        {/* Editorial Dossier Card */}
        <div className="rounded-sm border border-slate-200 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Top Archival Folio Ribbon */}
          <div className="border-b border-slate-100 pb-5 mb-6 text-center space-y-2">
            <span className="font-label text-[10px] font-bold tracking-widest uppercase text-[#6d5e00] px-2.5 py-0.5 rounded-sm bg-[#fef3c7] border border-[#fde68a] inline-block">
              Entry Portal • Scholar Access
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Access Your Career Dossier
            </h1>
            <p className="font-sans text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Authenticate to preserve your psychological diagnostic results, domain pivot index, and 7-day experiential learning milestones.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 font-label">
            {/* Google Sign-In */}
            <button
              id="btn-google-signin"
              onClick={handleGoogle}
              disabled={googleLoading || guestLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs tracking-wider uppercase transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Guest / Anonymous */}
            <button
              id="btn-guest-signin"
              onClick={handleGuest}
              disabled={googleLoading || guestLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-bold text-xs tracking-wider uppercase transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guestLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <span className="text-sm">⚡</span>
              )}
              <span>Enter as Guest Scholar</span>
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div
              role="alert"
              className="mt-5 p-3.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed flex items-start gap-2.5 font-sans"
            >
              <span className="text-base shrink-0">⚠️</span>
              <div className="space-y-0.5">
                <span className="font-bold block font-label uppercase text-[10px] tracking-wider text-rose-900">
                  Authentication Notice
                </span>
                <p className="text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* Bottom Archival Metadata */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap gap-2 justify-center font-label text-[10px] tracking-wider uppercase text-slate-500">
            <span className="px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200">
              7-Day Skill Trees
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200">
              Groq Llama 3
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200">
              Zero Commercial Rote
            </span>
          </div>
        </div>

        <div className="text-center font-label text-[11px] text-slate-500">
          <Link href="/" className="hover:text-[#094cb2] transition">
            ← Return to Curated Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
