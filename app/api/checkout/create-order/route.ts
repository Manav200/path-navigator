// app/api/checkout/create-order/route.ts
// Atomic Slot Lock & Razorpay Order Creation Route
// POST /api/checkout/create-order
// 1. Validates inputs & atomically acquires a 10-minute mutex reservation lock on the chosen slot.
// 2. Creates a Razorpay Order via Razorpay SDK with session metadata in notes.
// 3. Returns the Razorpay Order ID, Key, and lock expiration timestamp to the client.

import { NextRequest, NextResponse } from "next/server";
import { razorpayInstance } from "@/lib/razorpay";
import { acquireSlotLock, buildSlotId } from "@/lib/slotLockEngine";
import { calculatePricing, getMentorById } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mentorId,
      studentId,
      date,
      time,
      basePrice,
      slotId: rawSlotId,
      studentEmail,
      studentName,
      agenda,
    } = body;

    // Validate required parameters
    if (!mentorId || !studentId || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking fields: mentorId, studentId, date, time",
        },
        { status: 400 }
      );
    }

    const targetSlotId = rawSlotId || buildSlotId(mentorId, date, time);
    const mentor = getMentorById(mentorId);
    const effectivePrice = Number(basePrice) || mentor?.pricePerSession || 699;
    const pricing = calculatePricing(effectivePrice);
    const amountInPaise = Math.round(pricing.total * 100);

    // ── STEP 1: Atomically Acquire Concurrency Lock on Slot ─────────────────
    const lockResult = await acquireSlotLock(
      targetSlotId,
      mentorId,
      studentId,
      date,
      time
    );

    if (!lockResult.success) {
      return NextResponse.json(
        {
          success: false,
          conflict: true,
          message:
            lockResult.message ||
            "This slot was just selected by another student. Please choose an alternative time.",
        },
        { status: 409 }
      );
    }

    // ── STEP 2: Create Razorpay Order ───────────────────────────────────────
    let order: any;
    const receiptId = `pn_rcpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    try {
      order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        notes: {
          slotId: targetSlotId,
          mentorId,
          studentId,
          date,
          time,
          studentEmail: studentEmail || "candidate@pathnavigate.in",
          studentName: studentName || "Candidate Scholar",
          agenda: (agenda || "").slice(0, 200),
        },
      });
    } catch (apiErr: any) {
      const errorMsg =
        apiErr?.error?.description ||
        apiErr?.message ||
        (typeof apiErr === "object" ? JSON.stringify(apiErr) : String(apiErr));
      console.warn("[Razorpay API Orders Create Error / Fallback]:", errorMsg);

      // In local dev/sandbox mode without active live keys, generate compliant fallback order
      order = {
        id: `order_sb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        entity: "order",
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        status: "created",
        isMock: true,
        errorReason: errorMsg,
        notes: {
          slotId: targetSlotId,
          mentorId,
          studentId,
          date,
          time,
          studentEmail: studentEmail || "candidate@pathnavigate.in",
          studentName: studentName || "Candidate Scholar",
        },
      };
    }

    const isMock = Boolean(
      order.isMock ||
      !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes("pathnavigate_sandbox")
    );

    // ── STEP 3: Return Order & Lock Credentials ─────────────────────────────
    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        order,
        isMock,
        slotId: targetSlotId,
        lockExpiration: lockResult.lockExpiration,
        paymentOrderId: lockResult.paymentOrderId,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_pathnavigate_sandbox",
        amount: amountInPaise,
        currency: "INR",
        pricing,
        mentor: {
          id: mentor?.id || mentorId,
          name: mentor?.name || "Industry Mentor",
          designation: mentor?.designation || "Senior Specialist",
          company: mentor?.company || "Tech",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Create Order Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while creating checkout order.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
