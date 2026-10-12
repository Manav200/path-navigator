"use client";

// components/AuthGuard.tsx
// Wraps any page/component that requires authentication.
// - If loading: shows a full-screen spinner.
// - If unauthenticated: shows an inline modal with Google + Guest login options.
// - If authenticated: renders children as-is.
//
// Usage:
//   <AuthGuard>
//     <YourProtectedPage />
//   </AuthGuard>

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sanitizeClientError } from "@/lib/errorSanitizer";

interface AuthGuardProps {
  children: ReactNode;
  /**
   * If true, show a full-page redirect to /login instead of the inline modal.
   * Defaults to false (shows the modal).
   */
  redirectToLogin?: boolean;
}

export default function AuthGuard({
  children,
  redirectToLogin = false,
}: AuthGuardProps) {
  const { user, loading, signInWithGoogle, signInAnonymouslyUser } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Full-screen loading spinner ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Authenticated — render children ──────────────────────────────────────
  if (user) return <>{children}</>;

  // ── Unauthenticated — redirect mode ──────────────────────────────────────
  if (redirectToLogin) {
    router.replace("/login");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Unauthenticated — inline modal ───────────────────────────────────────

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(sanitizeClientError(err, "Sign-in could not be completed. Please try again or continue with instant Guest access."));
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
      setError(sanitizeClientError(err, "Guest session could not be initialized. Please refresh and try again."));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <>
      {/* Blurred content behind modal */}
      <div className="pointer-events-none select-none filter blur-sm opacity-30 min-h-screen bg-[#0a0a0f]">
        {children}
      </div>

      {/* Modal backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4
                   bg-black/70 backdrop-blur-md"
      >
        {/* Modal card */}
        <div
          className="w-full max-w-sm rounded-2xl border border-white/[0.1]
                     bg-[#0f0f1a]/90 backdrop-blur-xl p-8 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/* Copy */}
          <h2
            id="auth-modal-title"
            className="text-xl font-bold text-white text-center mb-1"
          >
            Sign in to continue
          </h2>
          <p className="text-white/45 text-sm text-center mb-6 leading-relaxed">
            Create a free account to save your career progress and access your
            personalised pathway.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              id="auth-guard-google-btn"
              onClick={handleGoogle}
              disabled={googleLoading || guestLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
                         bg-white text-gray-800 font-semibold text-sm
                         hover:bg-gray-100 active:scale-[0.98]
                         transition-all duration-150 shadow-md
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              id="auth-guard-guest-btn"
              onClick={handleGuest}
              disabled={googleLoading || guestLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
                         border border-violet-500/40 bg-violet-500/10 text-violet-300 font-semibold text-sm
                         hover:bg-violet-500/20 hover:border-violet-400/60 active:scale-[0.98]
                         transition-all duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guestLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 shrink-0"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              )}
              Try as Guest — Instant Access
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
            >
              {error}
            </div>
          )}

          <p className="text-center text-white/25 text-[11px] mt-5">
            Or{" "}
            <button
              onClick={() => router.push("/login")}
              className="underline hover:text-white/50 transition-colors"
            >
              go to sign-in page
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
