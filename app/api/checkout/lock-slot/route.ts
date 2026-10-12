// app/api/checkout/lock-slot/route.ts
// Atomic Pre-Lock Endpoint: POST /api/checkout/lock-slot
// Acquires an exclusive 10-minute pre-booking reservation lock on a slot before payment.
// If another candidate already holds the lock, returns HTTP 409 Conflict.

import { NextRequest, NextResponse } from "next/server";
import { acquireSlotLock, getMentorSlotStatuses, buildSlotId } from "@/lib/slotLockEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId: rawSlotId, mentorId, studentId, date, time } = body;

    if (!mentorId || !studentId) {
      return NextResponse.json(
        { error: "mentorId and studentId are required" },
        { status: 400 }
      );
    }

    const slotId = rawSlotId || (date && time ? buildSlotId(mentorId, date, time) : null);

    if (!slotId) {
      return NextResponse.json(
        { error: "slotId or (date and time) are required to identify the reservation slot" },
        { status: 400 }
      );
    }

    // Atomic lock acquisition with concurrency control
    const lockResult = await acquireSlotLock(slotId, mentorId, studentId, date, time);

    if (!lockResult.success) {
      // 409 Conflict: Slot is already locked by another student or booked
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

    // Successfully acquired lock
    return NextResponse.json(
      {
        success: true,
        slotId,
        lockExpiration: lockResult.lockExpiration,
        paymentOrderId: lockResult.paymentOrderId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[SlotLock API Error]:", err);
    return NextResponse.json(
      { error: "Internal server error during slot lock acquisition." },
      { status: 500 }
    );
  }
}

// GET /api/checkout/lock-slot?mentorId=...
// Returns live status map of all slots for a mentor (including active locks and bookings)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get("mentorId");

    if (!mentorId) {
      return NextResponse.json({ error: "mentorId query parameter is required" }, { status: 400 });
    }

    const statuses = getMentorSlotStatuses(mentorId);
    return NextResponse.json({ statuses });
  } catch (err: any) {
    console.error("[SlotLock Status Query Error]:", err);
    return NextResponse.json({ error: "Failed to fetch slot statuses." }, { status: 500 });
  }
}
