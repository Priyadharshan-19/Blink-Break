// src/app/(dashboard)/timer/page.tsx
"use client";

import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  SkipForward,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { CircularCountdownRing, MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTimerStore, ActiveMode } from "@/store/useTimerStore";

export default function TimerStudioPage() {
  const {
    mode,
    isRunning,
    remainingSeconds,
    totalPhaseSeconds,
    pauseTimer,
    resumeTimer,
    resetTimer,
    triggerBreakNow,
    snoozeBreak,
    skipBreak,
    setMode,
  } = useTimerStore();

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress =
    totalPhaseSeconds > 0 ? remainingSeconds / totalPhaseSeconds : 0;

  const modes: { id: ActiveMode; label: string; desc: string }[] = [
    { id: "standard", label: "20-20-20 Standard", desc: "20m work • 20s eye break" },
    { id: "study", label: "Study Mode", desc: "25m study • 20s eye rest" },
    { id: "coding", label: "Coding Mode", desc: "30m deep code • 20s eye rest" },
    { id: "pomodoro", label: "Pomodoro Sync", desc: "25m focus • 5m break" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="glass-card rounded-[32px] p-6 sm:p-10 text-center">
        {/* Mode Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mode === m.id
                  ? "bg-[#14162E] dark:bg-[#7C6FF6] text-white shadow-md"
                  : "bg-white/70 dark:bg-white/10 text-[#5B5E7B] dark:text-[#A3A6C9] hover:bg-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Center Mascot + Giant Ring */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 my-6">
          <MascotIllustration variant="hero" className="w-56 h-56" />
          <CircularCountdownRing
            progress={progress}
            timeLabel={formatMMSS(remainingSeconds)}
            subLabel={isRunning ? "Session in progress" : "Timer paused"}
            size={220}
          />
        </div>

        {/* Primary Timer Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <button
            onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
            className="pill-btn-primary px-8 py-3.5 text-sm"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Session</span>
              </>
            )}
          </button>

          <button
            onClick={triggerBreakNow}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/25 text-xs sm:text-sm font-bold text-[#14162E] dark:text-white hover:bg-[#DED9FF] transition"
          >
            <Sparkles className="w-4 h-4 text-[#7C6FF6]" />
            <span>Start 20s Break Now</span>
          </button>

          <button
            onClick={() => snoozeBreak(5)}
            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white hover:bg-white transition"
          >
            <Clock className="w-4 h-4" />
            <span>Snooze +5m</span>
          </button>

          <button
            onClick={resetTimer}
            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white hover:bg-white transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={skipBreak}
            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full text-xs font-semibold text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9]"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip Cycle</span>
          </button>
        </div>
      </div>
    </div>
  );
}