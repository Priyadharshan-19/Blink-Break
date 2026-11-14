// src/components/timer/FloatingTimerWidget.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pause,
  Play,
  Settings,
  GripHorizontal,
  Minimize2,
  Maximize2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";

export default function FloatingTimerWidget() {
  const {
    phase,
    mode,
    isRunning,
    remainingSeconds,
    totalPhaseSeconds,
    widgetMinimized,
    pauseTimer,
    resumeTimer,
    snoozeBreak,
    triggerBreakNow,
    setWidgetMinimized,
  } = useTimerStore();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress =
    totalPhaseSeconds > 0
      ? Math.min(1, Math.max(0, remainingSeconds / totalPhaseSeconds))
      : 0;

  const size = 76;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  if (widgetMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-40 glass-card rounded-full px-4 py-2.5 flex items-center gap-3 cursor-grab active:cursor-grabbing shadow-xl"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E] animate-pulse" />
        <span
          className="font-extrabold text-sm text-[#14162E] dark:text-white"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {formatTime(remainingSeconds)}
        </span>
        <button
          onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
          className="w-7 h-7 rounded-full bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#14162E] dark:text-white"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        <button
          onClick={() => setWidgetMinimized(false)}
          title="Expand Widget"
          className="text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9] dark:hover:text-white"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed top-20 right-6 z-40 w-[285px] select-none cursor-grab active:cursor-grabbing"
    >
      {/* Peeking Chibi Mascot on top right of widget (matches Reference Image 2) */}
      <div className="relative flex justify-end pr-5 -mb-3 z-10 pointer-events-none">
        <div className="relative w-20 h-14 flex items-end justify-center">
          {/* Cute Exclamation Doodle Rays */}
          <span className="absolute -left-3 top-2 text-xs font-extrabold text-[#14162E] dark:text-white -rotate-12">
            !
          </span>
          <MascotIllustration variant="chibi-peek" className="w-16 h-14 object-cover object-top" />
        </div>
      </div>

      {/* Main Floating Glass Card */}
      <div className="glass-card rounded-[28px] p-5 border-2 border-white/90 dark:border-white/15 shadow-[0_18px_40px_-8px_rgba(100,90,195,0.22)]">
        {/* Top Grip & Status Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[#8C8FA6]" title="Drag widget anywhere">
            <GripHorizontal className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6FF6]">
              {mode === "standard" ? "20-20-20" : `${mode} mode`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#14162E] dark:text-white">
              {phase === "work" ? "Next Break In" : "Break Active"}
            </span>
            <button
              onClick={() => setWidgetMinimized(true)}
              title="Minimize widget"
              className="text-[#8C8FA6] hover:text-[#14162E] dark:hover:text-white transition"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Progress Ring + Large Countdown Readout */}
        <div className="flex items-center justify-between gap-3 my-2">
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90 transform">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-[#E2E0F8] dark:text-[#2A2D4A]"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="url(#widgetRingGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="widgetRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#48C78E" />
                  <stop offset="100%" stopColor="#68D391" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex-1 text-right">
            <div
              className="text-4xl font-extrabold tracking-tight text-[#14162E] dark:text-white leading-none"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {formatTime(remainingSeconds)}
            </div>
            <p className="text-xs font-medium text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
              {Math.round(totalPhaseSeconds / 60)} min session
            </p>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-3 pt-3 mt-2 border-t border-[#E6E4FA] dark:border-white/10">
          <button
            onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
            title={isRunning ? "Pause timer" : "Resume timer"}
            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#14162E] dark:text-white transition"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <span className="h-5 w-[1px] bg-[#DCD8F6] dark:bg-white/10" />

          <button
            onClick={() => snoozeBreak(5)}
            title="Snooze +5m"
            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={triggerBreakNow}
            title="Take 20s Break Now"
            className="w-10 h-10 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 shadow-sm hover:scale-105 flex items-center justify-center text-[#7C6FF6] dark:text-white transition"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <Link
            href="/settings"
            title="Timer Settings"
            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}