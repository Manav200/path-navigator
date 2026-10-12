"use client";

// components/checkout/RazorpayCheckoutButton.tsx
// Alexandria High-End Editorial — Razorpay Standard Checkout Client Component
// 1. Dynamically injects Razorpay Checkout SDK (checkout.js).
// 2. Acquires atomic 10-minute mutex slot lock & creates server-side Razorpay Order.
// 3. Launches the Razorpay payment modal with branded editorial theme.
// 4. Verifies cryptographic payment signature at /api/checkout/verify upon success.

import { useState } from "react";
import {
  RazorpayOptions,
  RazorpayPaymentSuccessResponse,
  RazorpayPaymentErrorResponse,
} from "@/types/razorpay";

export interface RazorpayCheckoutButtonProps {
  slotId?: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  basePrice: number;
  agenda?: string;
  totalAmount?: number;
  onSuccess: (paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
    bookingId?: string;
    meetLink?: string;
    calendarInviteUrl?: string;
  }) => void;
  onError?: (errorMessage: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

/**
 * Dynamically loads the official Razorpay Checkout SDK if not yet loaded.
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(false);
    }
    if (window.Razorpay) {
      return resolve(true);
    }
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutButton({
  slotId,
  mentorId,
  mentorName,
  studentId,
  studentName,
  studentEmail,
  date,
  time,
  basePrice,
  agenda,
  totalAmount,
  onSuccess,
  onError,
  disabled = false,
  className = "",
  label = "Confirm & Proceed to Razorpay",
}: RazorpayCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSandboxFallback, setShowSandboxFallback] = useState(false);
  const [fallbackOrderData, setFallbackOrderData] = useState<any>(null);

  const handleLaunchCheckout = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // ── STEP 1: Atomically lock slot & create Razorpay Order ────────────────
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          mentorId,
          studentId,
          date,
          time,
          basePrice,
          studentEmail,
          studentName,
          agenda,
        }),
      });

      const orderData = await orderRes.json();

      if (orderRes.status === 409 || !orderRes.ok || !orderData.success) {
        const errorMsg =
          orderData.message ||
          orderData.error ||
          "This slot was just selected by another candidate. Please choose an alternative slot.";
        onError?.(errorMsg);
        setIsProcessing(false);
        return;
      }

      // If Razorpay order is mock / fallback because live keys are not configured in .env.local,
      // open the sandbox simulator modal directly rather than launching an invalid Razorpay iframe
      if (orderData.isMock || !orderData.key || orderData.key.includes("pathnavigate_sandbox")) {
        setFallbackOrderData(orderData);
        setShowSandboxFallback(true);
        setIsProcessing(false);
        return;
      }

      // ── STEP 2: Dynamically load Razorpay SDK ──────────────────────────────
      const isScriptLoaded = await loadRazorpayScript();

      // If Razorpay SDK loaded and window.Razorpay is available
      if (isScriptLoaded && typeof window !== "undefined" && window.Razorpay) {
        const options: RazorpayOptions = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "PathNavigate",
          description: `1:1 Consultation with ${mentorName}`,
          image: "https://pathnavigate.in/favicon.ico",
          order_id: orderData.orderId,
          notes: {
            slotId: orderData.slotId,
            mentorId,
            studentId,
            date,
            time,
          },
          prefill: {
            name: studentName,
            email: studentEmail,
          },
          theme: {
            color: "#094cb2",
            backdrop_color: "rgba(15, 23, 42, 0.75)",
          },
          handler: async (response: RazorpayPaymentSuccessResponse) => {
            await handleVerifyPayment(response, orderData.slotId);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        try {
          const rzpInstance = new window.Razorpay(options);
          rzpInstance.on("payment.failed", (errResp: RazorpayPaymentErrorResponse) => {
            console.error("[Razorpay Payment Failed]:", errResp);
            onError?.(errResp.error.description || "Payment failed or was cancelled.");
            setIsProcessing(false);
          });
          rzpInstance.open();
          return;
        } catch (rzpInitErr) {
          console.warn("[Razorpay Overlay Initialization Notice]:", rzpInitErr);
        }
      }

      // ── STEP 3: Fallback Sandbox Flow (if SDK is blocked or offline) ────────
      setFallbackOrderData(orderData);
      setShowSandboxFallback(true);
    } catch (err: any) {
      console.error("[Checkout Initiation Exception]:", err);
      onError?.(err.message || "An unexpected error occurred while initiating checkout.");
      setIsProcessing(false);
    }
  };

  /**
   * Verifies the Razorpay payment signature server-side at /api/checkout/verify
   */
  const handleVerifyPayment = async (
    paymentResponse: RazorpayPaymentSuccessResponse,
    activeSlotId: string
  ) => {
    try {
      const verifyRes = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          slotId: activeSlotId,
          mentorId,
          studentId,
          date,
          time,
          studentName,
          studentEmail,
          agenda,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error(verifyData.error || "Payment cryptographic verification failed.");
      }

      onSuccess({
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        signature: paymentResponse.razorpay_signature,
        bookingId: verifyData.bookingId,
        meetLink: verifyData.meetLink,
        calendarInviteUrl: verifyData.calendarInviteUrl,
      });
    } catch (verifyErr: any) {
      console.error("[Verification Failure]:", verifyErr);
      onError?.(verifyErr.message || "Verification failed after payment.");
    } finally {
      setIsProcessing(false);
      setShowSandboxFallback(false);
    }
  };

  /**
   * Completes the sandbox verification for development/testing
   */
  const handleCompleteSandbox = async () => {
    if (!fallbackOrderData) return;
    setIsProcessing(true);
    const mockPaymentId = `pay_sb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const mockSignature = "mock_signature_success";

    await handleVerifyPayment(
      {
        razorpay_payment_id: mockPaymentId,
        razorpay_order_id: fallbackOrderData.orderId,
        razorpay_signature: mockSignature,
      },
      fallbackOrderData.slotId
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLaunchCheckout}
        disabled={disabled || isProcessing}
        className={
          className ||
          "w-full py-3.5 px-6 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2"
        }
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Locking Slot & Securing Gateway...</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            {totalAmount ? (
              <span className="font-semibold ml-1">· ₹{totalAmount}</span>
            ) : null}
            <span className="font-sans text-[11px] text-blue-200">🔒</span>
          </>
        )}
      </button>

      {/* ── Sandbox Developer Simulation Modal ───────────────────────────────── */}
      {showSandboxFallback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-blue-50 border border-blue-200 font-label text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                  Razorpay Sandbox Simulator
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSandboxFallback(false);
                  setIsProcessing(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-slate-950">
                1:1 Mentorship Checkout
              </h4>
              <p className="font-sans text-xs text-slate-600">
                Order <span className="font-mono font-semibold text-slate-900">{fallbackOrderData?.orderId}</span> created with slot lock active for 10 minutes.
              </p>
              <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 text-xs space-y-1 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mentor:</span>
                  <span className="font-semibold text-slate-800">{mentorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Date:</span>
                  <span className="font-semibold text-slate-800">{date} at {time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Due:</span>
                  <span className="font-bold text-slate-950">₹{fallbackOrderData?.pricing?.total || basePrice}</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-sm text-[11px] text-amber-900 font-sans">
                💡 <strong>Notice:</strong> Your <code className="font-mono text-amber-950">.env.local</code> currently has placeholder keys (<code className="font-mono">rzp_test_pathnavigate_sandbox</code>). To launch Razorpay&apos;s real live popup, paste your actual Key ID &amp; Secret into <code className="font-mono">.env.local</code> and restart the server.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSandboxFallback(false);
                  setIsProcessing(false);
                }}
                className="px-4 py-2 rounded-sm border border-slate-200 hover:bg-slate-50 text-slate-700 font-label text-xs uppercase tracking-wider font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSandbox}
                disabled={isProcessing}
                className="px-4 py-2 rounded-sm bg-[#094cb2] hover:bg-[#1d63d8] text-white font-label text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {isProcessing ? "Verifying..." : "Simulate Payment Success ↗"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
