// app/api/checkout/razorpay/route.ts
// Production Razorpay Order creation and signature verification route.
// Handles checkout requests with the official Razorpay SDK.

import { NextRequest, NextResponse } from "next/server";
import { razorpayInstance, verifyRazorpaySignature } from "@/lib/razorpay";
import { calculatePricing } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mentorId,
      mentorName,
      slotDate,
      slotTime,
      basePrice,
      studentEmail,
      studentName,
    } = body;

    if (!mentorId || !basePrice || !slotDate || !slotTime) {
      return NextResponse.json(
        { error: "Missing required fields: mentorId, basePrice, slotDate, slotTime" },
        { status: 400 }
      );
    }

    const pricing = calculatePricing(Number(basePrice));
    const amountInPaise = Math.round(pricing.total * 100);
    const receipt = `pn_rcpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    // Create authentic Razorpay order via SDK
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        mentorId: String(mentorId),
        mentorName: mentorName || "Industry Mentor",
        slotDate: String(slotDate),
        slotTime: String(slotTime),
        studentEmail: studentEmail || "",
        studentName: studentName || "",
      },
    });

    return NextResponse.json({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
      pricing: {
        basePrice: pricing.basePrice,
        platformFee: pricing.platformFee,
        total: pricing.total,
      },
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null
        ? JSON.stringify(err)
        : String(err);
    console.error("[Razorpay Orders API Error]:", errorMsg);
    return NextResponse.json(
      { error: "Failed to create Razorpay order", details: errorMsg },
      { status: 502 }
    );
  }
}

// Server-side signature verification endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Razorpay Signature Verification Error]:", errorMsg);
    return NextResponse.json(
      { error: "Verification failed", details: errorMsg },
      { status: 500 }
    );
  }
}
