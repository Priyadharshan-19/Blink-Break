// src/components/timer/BreakPopupModal.tsx
"use client";

import React from "react";
import { Eye, Clock, SkipForward, CheckCircle2, Sparkles } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import { CircularCountdownRing, MascotIllustration } from "@/components/ui/BrandPrimitives";

export default function BreakPopupModal() {
  const {
    phase,
    remainingSeconds,
    totalPhaseSeconds,
    startActiveBreak,
    snoozeBreak,
    skipBreak,
    completeBreak,
  } = useTimerStore();

  if (phase === "work") return null;

  const isBreakRunning = phase === "break-active";
  const progress =
    totalPhaseSeconds > 0 ? remainingSeconds / totalPhaseSeconds : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14162E]/55 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-card rounded-[32px] max-w-lg w-full p-6 sm:p-8 border-2 border-white dark:border-white/15 shadow-2xl text-center relative overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/20 text-[#7C6FF6] text-xs font-bold uppercase tracking-wider mb-3">
          <Eye className="w-3.5 h-3.5" />
          <span>20-20-20 Eye-Care Reminder</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {isBreakRunning
            ? "Gaze 20 Feet Away & Blink Slowly..."
            : "Time for a little break!"}
        </h2>

        <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1.5 max-w-md mx-auto">
          {isBreakRunning
            ? "Relax your shoulders and keep looking at a distant object until the 20-second chime rings."
            : "You've been focusing hard! Rest your eyes for 20 seconds to prevent digital strain and water your virtual plant."}
        </p>

        {/* Mascot + Circular Countdown */}
        <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6 bg-white/70 dark:bg-white/5 rounded-3xl p-5 border border-white/90 dark:border-white/10">
          <MascotIllustration variant="hero" className="w-36 h-36" />
          <CircularCountdownRing
            progress={progress}
            timeLabel={`00:${String(remainingSeconds).padStart(2, "0")}`}
            subLabel={isBreakRunning ? "Looking 20ft away" : "20s Eye Break"}
            size={144}
          />
        </div>

        {/* Actions */}
        {!isBreakRunning ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startActiveBreak}
              className="pill-btn-primary w-full sm:w-auto justify-center px-7 py-3.5 text-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start 20s Break</span>
            </button>

            <button
              onClick={() => snoozeBreak(5)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-xs font-bold text-[#14162E] dark:text-white hover:bg-[#DED9FF] transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Snooze 5m</span>
            </button>

            <button
              onClick={skipBreak}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9] dark:hover:text-white transition"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={completeBreak}
              className="pill-btn-primary px-6 py-3 text-xs sm:text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Break Early (+20 XP)</span>
            </button>
            <button
              onClick={skipBreak}
              className="text-xs font-semibold text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}