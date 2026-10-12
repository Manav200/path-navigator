// app/api/checkout/verify/route.ts
// Server-side Razorpay Signature Verification Endpoint
// POST /api/checkout/verify
// 1. Receives razorpay_payment_id, razorpay_order_id, razorpay_signature from client checkout handler.
// 2. Cryptographically validates the HMAC-SHA256 signature against RAZORPAY_KEY_SECRET.
// 3. Atomically confirms slot booking and transitions slot status from 'locked_pending' to 'booked'.
// 4. Returns verified booking status, confirmed Google Meet room, and Google Calendar invitation link.

import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { confirmSlotBooking, buildSlotId } from "@/lib/slotLockEngine";
import { getMentorById, generateMeetLink, generateGoogleCalendarUrl } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      slotId: rawSlotId,
      mentorId,
      studentId,
      date,
      time,
      studentName,
      studentEmail,
      agenda,
    } = body;

    // Validate required verification parameters
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Missing payment verification parameters (payment_id, order_id, signature).",
        },
        { status: 400 }
      );
    }

    if (!mentorId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Missing mentorId or studentId for booking assignment.",
        },
        { status: 400 }
      );
    }

    // ── STEP 1: Cryptographic Signature Verification ────────────────────────
    const isAuthentic = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isAuthentic) {
      console.error(
        `[Payment Verification Failed] Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
      );
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Payment verification failed: Invalid cryptographic signature.",
        },
        { status: 400 }
      );
    }

    // ── STEP 2: Resolve Slot ID & Mentor Meeting Info ───────────────────────
    const slotId = rawSlotId || (date && time ? buildSlotId(mentorId, date, time) : null);
    if (!slotId) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Unable to identify slot identifier for booking confirmation.",
        },
        { status: 400 }
      );
    }

    const mentor = getMentorById(mentorId);
    const resolvedMeetLink = mentor?.googleMeetLink || generateMeetLink(mentor);

    // ── STEP 3: Atomically Confirm Slot Booking ─────────────────────────────
    const confirmation = await confirmSlotBooking(
      slotId,
      mentorId,
      studentId,
      razorpay_order_id,
      razorpay_payment_id,
      resolvedMeetLink
    );

    if (!confirmation.success) {
      return NextResponse.json(
        {
          success: false,
          verified: true,
          error: confirmation.message || "Failed to finalize slot confirmation.",
        },
        { status: 500 }
      );
    }

    // ── STEP 4: Generate Synchronized Google Calendar URL ───────────────────
    const calendarUrl = generateGoogleCalendarUrl({
      title: `1:1 Mentorship Consultation: ${mentor?.name || "Mentor"} & ${studentName || "Candidate"}`,
      description: `Agenda Notes: ${agenda || "Career guidance and pathway progression"}\n\nMentor Contact: ${mentor?.googleEmail || mentor?.email || "mentor@pathnavigate.in"}`,
      mentorEmail: mentor?.googleEmail || mentor?.email,
      studentEmail: studentEmail || undefined,
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00 AM",
      meetLink: confirmation.meetLink,
    });

    return NextResponse.json(
      {
        success: true,
        verified: true,
        status: "booked",
        bookingId: confirmation.bookingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        meetLink: confirmation.meetLink,
        calendarInviteUrl: calendarUrl,
        hostGoogleEmail: mentor?.googleEmail || mentor?.email || "Google Workspace",
        message: "Payment successfully verified and 1:1 mentorship slot confirmed.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Razorpay Verify Route Error]:", err);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: "Internal server error occurred during signature verification.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
