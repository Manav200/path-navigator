// app/api/checkout/razorpay/route.ts
// Mock Razorpay checkout endpoint.
// In production: integrate with Razorpay Orders API using RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET.
// Returns a mock order object compatible with the Razorpay Web SDK interface.

import { NextRequest, NextResponse } from "next/server";
import { calculatePricing } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorId, mentorName, slotDate, slotTime, basePrice, studentEmail } = body;

    if (!mentorId || !basePrice || !slotDate || !slotTime) {
      return NextResponse.json(
        { error: "Missing required fields: mentorId, basePrice, slotDate, slotTime" },
        { status: 400 }
      );
    }

    const pricing = calculatePricing(Number(basePrice));

    // ── Mock Order (replace with real Razorpay Orders API call) ────────────────
    // Real implementation:
    //   const Razorpay = require("razorpay");
    //   const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    //   const order = await instance.orders.create({ amount: pricing.total * 100, currency: "INR", receipt: `pn_${Date.now()}` });

    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const order = {
      id: mockOrderId,
      entity: "order",
      amount: pricing.total * 100,       // paise
      amount_paid: 0,
      amount_due: pricing.total * 100,
      currency: "INR",
      receipt: `pn_session_${Date.now()}`,
      status: "created",
      // Metadata
      notes: {
        mentorId,
        mentorName,
        slotDate,
        slotTime,
        studentEmail: studentEmail || "guest@pathnavigate.in",
      },
      // Pricing breakdown for client
      pricing: {
        basePrice: pricing.basePrice,
        platformFee: pricing.platformFee,
        total: pricing.total,
      },
      // Mock Razorpay key (replace with env var in production)
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key",
    };

    return NextResponse.json(order);
  } catch (err) {
    console.error("[Razorpay] Order creation error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

// Webhook verification (POST /api/checkout/razorpay/verify)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing payment IDs" }, { status: 400 });
    }

    // ── Mock signature verification ─────────────────────────────────────────
    // Real implementation:
    //   const crypto = require("crypto");
    //   const generated = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //     .digest("hex");
    //   if (generated !== razorpay_signature) return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err) {
    console.error("[Razorpay] Webhook error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
