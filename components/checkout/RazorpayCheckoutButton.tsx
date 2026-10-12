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

      if (!orderData.key || !orderData.orderId) {
        onError?.("Payment gateway configuration error. Please contact support.");
        setIsProcessing(false);
        return;
      }

      // ── STEP 2: Dynamically load Razorpay SDK ──────────────────────────────
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        onError?.(
          "Razorpay payment gateway could not be loaded. Please check your internet connection and try again."
        );
        setIsProcessing(false);
        return;
      }

      // ── STEP 3: Open Razorpay Checkout Modal ───────────────────────────────
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "PathNavigate",
        description: `1:1 Consultation with ${mentorName}`,
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

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", (errResp: RazorpayPaymentErrorResponse) => {
        console.error("[Razorpay Payment Failed]:", errResp);
        onError?.(errResp.error.description || "Payment failed or was cancelled.");
        setIsProcessing(false);
      });
      rzpInstance.open();
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
    }
  };

  return (
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
  );
}
