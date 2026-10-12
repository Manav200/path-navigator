"use client";

// components/mentors/SlotGrid.tsx
// Real-time interactive grid displaying available, pending, and locked slots.
// Communicates with /api/checkout/lock-slot to acquire atomic pre-booking locks and prevent double-booking.

import { useState, useEffect, useMemo, useCallback } from "react";
import { MentorSlot } from "@/lib/mentorData";
import { buildSlotId, SlotStatus } from "@/lib/slotLockEngine";

interface SlotGridProps {
  mentorId: string;
  slots: MentorSlot[];
  selectedDate: string;
  selectedTime: string;
  studentId: string;
  onSlotLocked?: (data: {
    date: string;
    time: string;
    slotId: string;
    lockExpiration: number;
    paymentOrderId: string;
  }) => void;
  onSlotSelected?: (date: string, time: string) => void;
}

export default function SlotGrid({
  mentorId,
  slots,
  selectedDate,
  selectedTime,
  studentId,
  onSlotLocked,
  onSlotSelected,
}: SlotGridProps) {
  // Live server status map: slotId -> { status, lockedUntil, lockedByStudentId }
  const [liveStatuses, setLiveStatuses] = useState<
    Record<string, { status: SlotStatus; lockedUntil?: number; lockedByStudentId?: string }>
  >({});
  const [isLocking, setIsLocking] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [activeLockTimer, setActiveLockTimer] = useState<{ slotId: string; remainingSec: number } | null>(null);

  // Fetch live statuses from server
  const fetchLiveStatuses = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkout/lock-slot?mentorId=${mentorId}`);
      if (res.ok) {
        const data = await res.json();
        setLiveStatuses(data.statuses || {});
      }
    } catch (e) {
      // Quiet failover to local slot states
    }
  }, [mentorId]);

  useEffect(() => {
    fetchLiveStatuses();
    const interval = setInterval(fetchLiveStatuses, 15000); // 15s polling
    return () => clearInterval(interval);
  }, [fetchLiveStatuses]);

  // Countdown timer for active hold
  useEffect(() => {
    if (!activeLockTimer || activeLockTimer.remainingSec <= 0) return;
    const t = setInterval(() => {
      setActiveLockTimer((prev) => {
        if (!prev || prev.remainingSec <= 1) return null;
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeLockTimer]);

  // Group slots by date
  const slotsForDate = useMemo(() => {
    return slots.filter((s) => s.date === selectedDate);
  }, [slots, selectedDate]);

  // Handle slot lock attempt
  const handleSlotClick = async (time: string, initialAvailable: boolean) => {
    if (!initialAvailable) return;
    setConflictError(null);

    const slotId = buildSlotId(mentorId, selectedDate, time);
    const currentStatus = liveStatuses[slotId];

    // Check if locked by another student
    if (
      currentStatus &&
      currentStatus.status === "locked_pending" &&
      currentStatus.lockedByStudentId !== studentId &&
      currentStatus.lockedUntil &&
      currentStatus.lockedUntil > Date.now()
    ) {
      setConflictError("This slot was just selected by another student. Please choose an alternative time.");
      return;
    }

    if (currentStatus?.status === "booked") {
      setConflictError("This slot is already fully booked. Please choose an alternative time.");
      return;
    }

    setIsLocking(slotId);

    try {
      const res = await fetch("/api/checkout/lock-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          mentorId,
          studentId,
          date: selectedDate,
          time,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || !res.ok) {
        // Concurrency conflict hit!
        setConflictError(
          data.message || "This slot was just selected by another student. Please choose an alternative time."
        );
        fetchLiveStatuses(); // Refresh grid
        return;
      }

      // Lock successfully acquired
      const remainingSec = Math.max(0, Math.floor((data.lockExpiration - Date.now()) / 1000));
      setActiveLockTimer({ slotId, remainingSec });

      // Update local status map
      setLiveStatuses((prev) => ({
        ...prev,
        [slotId]: {
          status: "locked_pending",
          lockedUntil: data.lockExpiration,
          lockedByStudentId: studentId,
        },
      }));

      onSlotSelected?.(selectedDate, time);
      onSlotLocked?.({
        date: selectedDate,
        time,
        slotId,
        lockExpiration: data.lockExpiration,
        paymentOrderId: data.paymentOrderId,
      });
    } catch (err) {
      console.error(err);
      setConflictError("Unable to reserve slot lock. Please check your connection.");
    } finally {
      setIsLocking(null);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-4">
      {/* Concurrency Conflict Alert Banner */}
      {conflictError && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm text-amber-900 text-xs font-sans flex items-start gap-2 animate-in fade-in">
          <span className="text-amber-700 font-bold shrink-0 mt-0.5">⚠</span>
          <div className="flex-1">
            <p className="font-semibold">{conflictError}</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Slot concurrency locks prevent double-booking. Another candidate is currently completing checkout for this time.
            </p>
          </div>
          <button
            onClick={() => setConflictError(null)}
            className="text-amber-600 hover:text-amber-900 font-bold text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* Active Lock Countdown Badge */}
      {activeLockTimer && (
        <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#094cb2] animate-ping" />
            <span className="font-label text-xs uppercase font-bold text-[#094cb2]">
              Slot Reserved for You
            </span>
          </div>
          <span className="font-label text-xs font-bold text-blue-900 bg-white px-2 py-0.5 rounded-sm border border-blue-200">
            Hold expires in: {formatTimer(activeLockTimer.remainingSec)}
          </span>
        </div>
      )}

      {/* Slot Grid Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {slotsForDate.map((slot, idx) => {
          const slotId = buildSlotId(mentorId, selectedDate, slot.time);
          const live = liveStatuses[slotId];
          const isSelected = selectedTime === slot.time;
          const isHoldPending =
            live?.status === "locked_pending" &&
            live.lockedByStudentId !== studentId &&
            Boolean(live.lockedUntil && live.lockedUntil > Date.now());
          const isBooked = live?.status === "booked" || !slot.available;
          const isHeldByMe =
            live?.status === "locked_pending" && live.lockedByStudentId === studentId;
          const isCurrentLocking = isLocking === slotId;

          // State 1: Booked
          if (isBooked) {
            return (
              <div
                key={idx}
                className="py-2.5 px-2 rounded-sm border border-slate-200 bg-slate-100 text-center select-none cursor-not-allowed opacity-75"
              >
                <p className="font-label text-xs font-medium text-slate-400 line-through">
                  {slot.time}
                </p>
                <span className="font-label text-[9px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5 block">
                  Fully Booked
                </span>
              </div>
            );
          }

          // State 2: Locked Pending (by another candidate)
          if (isHoldPending) {
            return (
              <div
                key={idx}
                className="py-2.5 px-2 rounded-sm border border-amber-200 bg-amber-50/60 text-center select-none cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="font-label text-xs font-medium text-amber-800">
                    {slot.time}
                  </p>
                </div>
                <span className="font-label text-[9px] uppercase tracking-wider text-[#6d5e00] font-bold mt-0.5 block">
                  Hold in Progress
                </span>
              </div>
            );
          }

          // State 3: Available (or selected / locked by self)
          return (
            <button
              key={idx}
              type="button"
              disabled={isLocking !== null}
              onClick={() => handleSlotClick(slot.time, slot.available)}
              className={`py-2.5 px-2 rounded-sm border text-center transition select-none flex flex-col items-center justify-center relative ${
                isSelected || isHeldByMe
                  ? "border-[#094cb2] bg-[#094cb2]/10 text-[#094cb2] ring-1 ring-[#094cb2]"
                  : "border-[rgba(148,163,184,0.25)] hover:border-[#094cb2] bg-white text-slate-800 hover:shadow-2xs"
              }`}
            >
              {isCurrentLocking ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-[#094cb2]/30 border-t-[#094cb2] rounded-full animate-spin my-1" />
              ) : (
                <>
                  <p className="font-label text-xs font-semibold">
                    {slot.time}
                  </p>
                  <span
                    className={`font-label text-[9px] uppercase tracking-wider font-bold mt-0.5 ${
                      isSelected || isHeldByMe ? "text-[#094cb2]" : "text-emerald-700"
                    }`}
                  >
                    {isSelected || isHeldByMe ? "Reserved" : "Available"}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
