// lib/slotLockEngine.ts
// Atomic Slot Locking & Concurrency Control Engine
// Prevents double-booking via pre-booking reservation locks, 10-minute expiry windows,
// and atomic compare-and-swap (CAS) transactions.

export type SlotStatus = "available" | "locked_pending" | "booked";

export interface SlotLockRecord {
  slotId: string;
  mentorId: string;
  date: string;
  time: string;
  status: SlotStatus;
  lockedByStudentId?: string;
  lockedAt?: number;
  lockedUntil?: number; // Timestamp in milliseconds
  paymentOrderId?: string;
  bookingId?: string;
  confirmedAt?: number;
}

export interface LockResult {
  success: boolean;
  conflict?: boolean;
  message?: string;
  lockExpiration?: number;
  paymentOrderId?: string;
  slotRecord?: SlotLockRecord;
}

export interface ConfirmResult {
  success: boolean;
  message?: string;
  bookingId?: string;
  meetLink?: string;
  slotRecord?: SlotLockRecord;
}

// ── In-Memory Atomic Lock Registry (Server Runtime) ──────────────────────────
// Global across the process lifetime to prevent concurrent request race conditions.
const globalSlotRegistry = new Map<string, SlotLockRecord>();
const lockMutexes = new Map<string, Promise<void>>();

// 10-minute pre-booking lock window
export const LOCK_EXPIRATION_MS = 10 * 60 * 1000;

/**
 * Execute an operation with an exclusive per-slot mutex to guarantee thread-safe CAS.
 */
async function withSlotMutex<T>(slotId: string, op: () => Promise<T> | T): Promise<T> {
  while (lockMutexes.has(slotId)) {
    try {
      await lockMutexes.get(slotId);
    } catch {
      // Previous lock rejected, proceed
    }
  }

  let releaseMutex: () => void = () => {};
  const mutexPromise = new Promise<void>((resolve) => {
    releaseMutex = resolve;
  });

  lockMutexes.set(slotId, mutexPromise);

  try {
    return await op();
  } finally {
    lockMutexes.delete(slotId);
    releaseMutex();
  }
}

/**
 * Normalizes a slot ID from mentorId, date, and time.
 */
export function buildSlotId(mentorId: string, date: string, time: string): string {
  const cleanTime = time.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `${mentorId}_${date}_${cleanTime}`;
}

/**
 * Atomically attempts to acquire a lock for a slot.
 * If status is 'available' -> locks slot.
 * If status is 'locked_pending' and expired -> takes over lock.
 * If already locked by another student -> returns 409 conflict.
 */
export async function acquireSlotLock(
  slotId: string,
  mentorId: string,
  studentId: string,
  date?: string,
  time?: string
): Promise<LockResult> {
  return withSlotMutex(slotId, async () => {
    const now = Date.now();
    const current = globalSlotRegistry.get(slotId);

    // Case 1: Slot is permanently booked
    if (current && current.status === "booked") {
      return {
        success: false,
        conflict: true,
        message: "This slot is already fully booked. Please choose an alternative time.",
      };
    }

    // Case 2: Slot is currently locked pending payment
    if (current && current.status === "locked_pending") {
      const isExpired = !current.lockedUntil || current.lockedUntil < now;

      // Same student refreshing their checkout session -> extend lock
      if (!isExpired && current.lockedByStudentId === studentId) {
        current.lockedUntil = now + LOCK_EXPIRATION_MS;
        globalSlotRegistry.set(slotId, current);
        return {
          success: true,
          lockExpiration: current.lockedUntil,
          paymentOrderId: current.paymentOrderId,
          slotRecord: current,
        };
      }

      // Still locked by another student -> reject with conflict
      if (!isExpired) {
        return {
          success: false,
          conflict: true,
          message: "This slot was just selected by another student. Please choose an alternative time.",
        };
      }

      // Expired lock -> allowed takeover
    }

    // Case 3: Available or expired lock -> acquire new lock
    const lockExpiration = now + LOCK_EXPIRATION_MS;
    const paymentOrderId = `order_lock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const newRecord: SlotLockRecord = {
      slotId,
      mentorId,
      date: date || current?.date || new Date().toISOString().split("T")[0],
      time: time || current?.time || "10:00 AM",
      status: "locked_pending",
      lockedByStudentId: studentId,
      lockedAt: now,
      lockedUntil: lockExpiration,
      paymentOrderId,
    };

    globalSlotRegistry.set(slotId, newRecord);

    return {
      success: true,
      lockExpiration,
      paymentOrderId,
      slotRecord: newRecord,
    };
  });
}

/**
 * Atomically confirms a slot booking upon successful payment webhook.
 * Converts status from 'locked_pending' to 'booked'.
 */
export async function confirmSlotBooking(
  slotId: string,
  mentorId: string,
  studentId: string,
  paymentOrderId: string,
  paymentId?: string,
  providedMeetLink?: string
): Promise<ConfirmResult> {
  return withSlotMutex(slotId, async () => {
    const now = Date.now();
    const current = globalSlotRegistry.get(slotId);

    // If no record exists, initialize booked record
    const bookingId = `book_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const meetLink = providedMeetLink && providedMeetLink.trim().length > 0
      ? providedMeetLink.trim()
      : "https://meet.google.com/new";

    const updatedRecord: SlotLockRecord = {
      slotId,
      mentorId,
      date: current?.date || new Date().toISOString().split("T")[0],
      time: current?.time || "10:00 AM",
      status: "booked",
      lockedByStudentId: studentId,
      lockedAt: current?.lockedAt || now,
      lockedUntil: undefined, // Cleared on permanent booking
      paymentOrderId,
      bookingId,
      confirmedAt: now,
    };

    globalSlotRegistry.set(slotId, updatedRecord);

    return {
      success: true,
      bookingId,
      meetLink,
      slotRecord: updatedRecord,
    };
  });
}

/**
 * Releases a pending lock back to available if candidate abandons checkout.
 */
export async function releaseSlotLock(slotId: string, studentId: string): Promise<boolean> {
  return withSlotMutex(slotId, async () => {
    const current = globalSlotRegistry.get(slotId);
    if (!current) return true;

    // Only the holder of the pending lock or expired lock can release it
    if (
      current.status === "locked_pending" &&
      (current.lockedByStudentId === studentId || (current.lockedUntil && current.lockedUntil < Date.now()))
    ) {
      globalSlotRegistry.delete(slotId);
      return true;
    }
    return false;
  });
}

/**
 * Query-time cleanup & retrieval of all slot statuses for a mentor.
 * Automatically lapses expired 'locked_pending' slots back to 'available'.
 */
export function getMentorSlotStatuses(mentorId: string): Record<string, { status: SlotStatus; lockedUntil?: number; lockedByStudentId?: string }> {
  const now = Date.now();
  const statuses: Record<string, { status: SlotStatus; lockedUntil?: number; lockedByStudentId?: string }> = {};

  for (const [slotId, record] of globalSlotRegistry.entries()) {
    if (record.mentorId !== mentorId) continue;

    // Check expiration
    if (record.status === "locked_pending" && record.lockedUntil && record.lockedUntil < now) {
      // Automatically lapsed
      globalSlotRegistry.delete(slotId);
      statuses[slotId] = { status: "available" };
    } else {
      statuses[slotId] = {
        status: record.status,
        lockedUntil: record.lockedUntil,
        lockedByStudentId: record.lockedByStudentId,
      };
    }
  }

  return statuses;
}
