// lib/errorSanitizer.ts
// Centralized security & UX utility: sanitizes all internal, system, and library errors
// so that sensitive technical details, API keys, endpoints, or raw stack traces
// are never shown to the end user on the website, while providing actionable,
// human-friendly, and empathetic error messages.

export function sanitizeClientError(
  error: unknown,
  fallback = "We encountered a temporary issue processing your request. Please try again in a few moments."
): string {
  // Always log internal details securely to console for developer debugging
  if (process.env.NODE_ENV !== "production") {
    console.error("[Internal System Error]:", error);
  } else {
    console.error("[Error Intercepted]");
  }

  const rawMessage = error instanceof Error ? error.message : String(error || "");
  const errorCode =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as any).code || "")
      : "";

  // 1. Firebase Authentication Specific Errors
  if (errorCode.includes("auth/popup-closed-by-user") || errorCode.includes("auth/cancelled-popup-request")) {
    return "Sign-in was closed before completion. You can retry signing in or proceed with Instant Guest Access.";
  }
  if (errorCode.includes("auth/popup-blocked")) {
    return "Your browser blocked the sign-in pop-up window. Please allow pop-ups for this site or continue with Instant Guest Access.";
  }
  if (errorCode.includes("auth/network-request-failed") || rawMessage.toLowerCase().includes("failed to fetch")) {
    return "Network connection interrupted. Please check your internet connection and try again.";
  }
  if (errorCode.includes("auth/too-many-requests")) {
    return "Too many sign-in attempts detected. Please pause for a moment before trying again, or use Guest Access.";
  }
  if (errorCode.includes("auth/unauthorized-domain")) {
    return "Google Authentication is temporarily restricted on this domain. Please proceed using Instant Guest Access.";
  }
  if (errorCode.includes("auth/user-disabled")) {
    return "This account is temporarily inactive. Please continue using Instant Guest Access.";
  }

  // 2. Network & Timeout Errors
  if (
    rawMessage.includes("NetworkError") ||
    rawMessage.includes("ERR_INTERNET_DISCONNECTED") ||
    rawMessage.includes("net::") ||
    rawMessage.toLowerCase().includes("offline")
  ) {
    return "You seem to be offline or experiencing connection drops. Please check your network and try again.";
  }
  if (rawMessage.includes("AbortError") || rawMessage.toLowerCase().includes("timeout")) {
    return "The server took longer than expected to respond. Please check your internet connection and retry.";
  }

  // 3. API & Rate-Limiting Errors
  if (rawMessage.includes("429") || rawMessage.toLowerCase().includes("rate limit")) {
    return "Our AI diagnostic engine is currently receiving high demand. Please wait a few seconds and try submitting again.";
  }
  if (rawMessage.includes("503") || rawMessage.includes("502") || rawMessage.includes("504")) {
    return "The career analysis service is momentarily busy. Please try again shortly.";
  }
  if (rawMessage.includes("500")) {
    return "We ran into an unexpected server hiccup while computing your results. Please retry your submission.";
  }

  // 4. Data Validation Errors
  if (rawMessage.toLowerCase().includes("incomplete") || rawMessage.toLowerCase().includes("missing answers")) {
    return "Some required questions appear to be incomplete. Please verify all sections before proceeding.";
  }

  return fallback;
}
