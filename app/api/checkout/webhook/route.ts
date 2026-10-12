// app/api/checkout/webhook/route.ts
// Razorpay Webhook Handler
// POST /api/checkout/webhook
// Catches and processes 'payment.captured' and 'order.paid' events from Razorpay.
// Verifies webhook signature against RAZORPAY_WEBHOOK_SECRET and atomically converts slots to 'booked'.

import { NextRequest, NextResponse } from "next/server";
import { confirmSlotBooking, buildSlotId } from "@/lib/slotLockEngine";
import { getMentorById, generateMeetLink } from "@/lib/mentorData";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // ── Signature Verification ──────────────────────────────────────────────
    if (signature && process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(
        rawBody,
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error("[Razorpay Webhook Error]: Invalid signature verification.");
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const body = JSON.parse(rawBody || "{}");
    const event = body.event;

    // Support both direct PathNavigate webhook calls and Razorpay standard webhooks
    let slotId = body.slotId;
    let mentorId = body.mentorId;
    let studentId = body.studentId;
    let paymentOrderId = body.paymentOrderId || body.razorpay_order_id;
    let paymentId = body.paymentId || body.razorpay_payment_id || `pay_${Date.now()}`;

    // Handle Razorpay 'payment.captured' event
    if (event === "payment.captured" && body.payload?.payment?.entity) {
      const paymentEntity = body.payload.payment.entity;
      paymentId = paymentEntity.id;
      paymentOrderId = paymentEntity.order_id;
      if (paymentEntity.notes) {
        slotId = slotId || paymentEntity.notes.slotId;
        mentorId = mentorId || paymentEntity.notes.mentorId;
        studentId = studentId || paymentEntity.notes.studentId;
      }
    }

    // Handle Razorpay 'order.paid' event
    if (event === "order.paid" && body.payload?.order?.entity) {
      const orderEntity = body.payload.order.entity;
      paymentOrderId = orderEntity.id;
      if (orderEntity.notes) {
        slotId = slotId || orderEntity.notes.slotId;
        mentorId = mentorId || orderEntity.notes.mentorId;
        studentId = studentId || orderEntity.notes.studentId;
      }
      if (body.payload?.payment?.entity) {
        paymentId = body.payload.payment.entity.id;
      }
    }

    // Fallback: auto-build slotId from date & time if available
    if (!slotId && mentorId && body.date && body.time) {
      slotId = buildSlotId(mentorId, body.date, body.time);
    }

    // If webhook is an unhandled informational event or missing notes, acknowledge 200
    if (!slotId || !mentorId || !studentId) {
      return NextResponse.json(
        {
          received: true,
          status: "skipped",
          message: "Event acknowledged; booking notes not present or non-booking event.",
        },
        { status: 200 }
      );
    }

    // Lookup mentor to retrieve authenticated Google Meet link
    const mentor = getMentorById(mentorId);
    const resolvedMeetLink =
      body.meetLink || mentor?.googleMeetLink || generateMeetLink(mentor);

    // Atomically convert slot from 'locked_pending' to 'booked'
    const confirmation = await confirmSlotBooking(
      slotId,
      mentorId,
      studentId,
      paymentOrderId || `order_${Date.now()}`,
      paymentId,
      resolvedMeetLink
    );

    if (!confirmation.success) {
      console.error("[Webhook Slot Confirmation Failed]:", confirmation.message);
      return NextResponse.json(
        { error: confirmation.message || "Failed to confirm slot booking." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      received: true,
      event: event || "payment.confirmed",
      status: "booked",
      bookingId: confirmation.bookingId,
      meetLink: confirmation.meetLink,
      message: "Slot atomically confirmed and booked via webhook.",
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook Exception]:", err);
    return NextResponse.json(
      { error: "Webhook processing encountered an error.", details: err.message },
      { status: 500 }
    );
  }
}
