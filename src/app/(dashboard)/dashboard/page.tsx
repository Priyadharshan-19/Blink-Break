// src/app/(dashboard)/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  Zap,
  GraduationCap,
  Code2,
  Timer,
  Coffee,
  Bell,
  Eye,
  Play,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useTimerStore, ActiveMode } from "@/store/useTimerStore";

export default function DashboardPage() {
  const {
    dailyGoal,
    streakDays,
    plantLevel,
    plantXp,
    plantName,
    getTodayRecord,
    getCurrentWeekRecords,
  } = useTrackerStore();

  const {
    remainingSeconds,
    mode,
    triggerBreakNow,
    setMode,
  } = useTimerStore();

  const today = getTodayRecord();
  const weekRecords = getCurrentWeekRecords();

  const formatFocusHours = (totalMins: number) => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hrs}h ${mins}m`;
  };

  const minsUntilBreak = Math.max(1, Math.ceil(remainingSeconds / 60));

  const quickModes: {
    id: ActiveMode;
    label: string;
    icon: React.ElementType;
    bg: string;
    iconColor: string;
  }[] = [
    {
      id: "study",
      label: "Study Mode",
      icon: GraduationCap,
      bg: "bg-[#EBF3FF] dark:bg-blue-500/10",
      iconColor: "text-[#4A6CF7]",
    },
    {
      id: "coding",
      label: "Coding Mode",
      icon: Code2,
      bg: "bg-[#E6F9F0] dark:bg-emerald-500/10",
      iconColor: "text-[#38A169]",
    },
    {
      id: "pomodoro",
      label: "Pomodoro",
      icon: Timer,
      bg: "bg-[#FFF0EE] dark:bg-rose-500/10",
      iconColor: "text-[#E53E3E]",
    },
    {
      id: "relax",
      label: "Relax Mode",
      icon: Coffee,
      bg: "bg-[#F2EEFF] dark:bg-purple-500/10",
      iconColor: "text-[#7C6FF6]",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      {/* Top Greeting & Notification/User Bar */}
      <TopHeader />

      {/* TOP 3 STAT CARDS ROW (Matches Reference Image 2, leaves right space for floating widget on XL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 xl:pr-72">
        {/* Card 1: Focus Time */}
        <div className="glass-card rounded-[28px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEFF] dark:bg-blue-500/20 flex items-center justify-center text-[#5472F6]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
                Focus Time
              </p>
              <p
                className="text-2xl font-extrabold text-[#14162E] dark:text-white mt-0.5"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {formatFocusHours(today.focusMinutes)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#38A169]">↑ 12%</span>
            <svg viewBox="0 0 64 24" className="w-16 h-6 mt-1">
              <path
                d="M2 20 Q16 12 28 16 T62 4"
                fill="none"
                stroke="#63B3ED"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Breaks Completed */}
        <div className="glass-card rounded-[28px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E2F8EE] dark:bg-emerald-500/20 flex items-center justify-center text-[#38A169]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
                Breaks Completed
              </p>
              <p
                className="text-2xl font-extrabold text-[#14162E] dark:text-white mt-0.5"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {today.completed} / {dailyGoal}
              </p>
              <span className="text-[11px] font-bold text-[#38A169]">
                ↑ 1 today
              </span>
            </div>
          </div>
          {/* Mini Bar Indicator */}
          <div className="flex items-end gap-1.5 h-10">
            <div className="w-2 h-4 rounded-full bg-[#CBD5E1] dark:bg-white/15" />
            <div className="w-2 h-6 rounded-full bg-[#68D391]" />
            <div className="w-2 h-9 rounded-full bg-[#48C78E]" />
            <div className="w-2 h-7 rounded-full bg-[#9AE6B4]" />
          </div>
        </div>

        {/* Card 3: Current Streak */}
        <div className="glass-card rounded-[28px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E5] dark:bg-orange-500/20 flex items-center justify-center text-[#FF8A4C]">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
                Current Streak
              </p>
              <p
                className="text-2xl font-extrabold text-[#14162E] dark:text-white mt-0.5"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {streakDays} days
              </p>
            </div>
          </div>
          <svg viewBox="0 0 60 28" className="w-14 h-7">
            <path
              d="M4 24 L22 18 L38 12 L56 4"
              fill="none"
              stroke="#F6AD55"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="56" cy="4" r="3" fill="#F6AD55" />
          </svg>
        </div>
      </div>

      {/* MIDDLE ROW: 20-20-20 HERO BANNER (7 Cols) + WEEKLY PROGRESS CHART (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center-Left 20-20-20 Break Banner */}
        <div className="lg:col-span-7 glass-card rounded-[32px] p-6 sm:p-7 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#DCE8FF]/80 via-[#EBE8FF]/85 to-[#F5F3FF]/90 dark:from-[#1B213A] dark:to-[#221F3D]">
          <div className="w-48 sm:w-56 flex-shrink-0">
            <MascotIllustration variant="hero" className="w-full h-auto scale-105" />
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#2B2E4A] dark:text-white shadow-sm">
              20-20-20 Rule
            </span>

            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white leading-tight"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Time for a<br />
              little break!
            </h2>

            <p className="text-xs sm:text-sm text-[#4A4E6D] dark:text-[#B8BBE0] max-w-xs">
              Look at something 20 feet away for 20 seconds.
            </p>

            <div className="pt-1">
              <button
                onClick={triggerBreakNow}
                className="pill-btn-primary text-xs sm:text-sm px-6 py-3 shadow-md"
              >
                <span>Start Break</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center-Right Weekly Progress Bar Chart */}
        <div className="lg:col-span-5 glass-card rounded-[32px] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Your Weekly Progress
            </h3>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#14162E] dark:text-white hover:bg-white transition"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 my-3 text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8D6EC] dark:bg-white/20" />
              <span>Missed</span>
            </div>
          </div>

          {/* 7-Day Dual Bars */}
          <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 px-1">
            {weekRecords.map((rec) => {
              const maxVal = 10;
              const compHeight = Math.min(100, Math.max(14, (rec.completed / maxVal) * 100));
              const missHeight = Math.min(100, Math.max(10, (rec.missed / maxVal) * 100));

              return (
                <div key={rec.dayLabel} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div className="flex items-end gap-1 w-full justify-center h-28">
                    <div
                      style={{ height: `${compHeight}%` }}
                      title={`${rec.completed} Completed`}
                      className="w-2.5 sm:w-3 rounded-t-full bg-gradient-to-t from-[#68D391] to-[#48C78E] transition-all duration-300"
                    />
                    <div
                      style={{ height: `${missHeight}%` }}
                      title={`${rec.missed} Missed`}
                      className="w-2 sm:w-2.5 rounded-t-full bg-[#DFDDF2] dark:bg-white/15 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                    {rec.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: VIRTUAL PLANT (4 Cols) + QUICK MODES (4 Cols) + UPCOMING TIMELINE (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bottom-Left: Your Virtual Plant */}
        <div className="lg:col-span-4 glass-card rounded-[32px] p-6 flex flex-col justify-between">
          <div>
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <span>Your Virtual Plant</span>
              <span>🌱</span>
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
              Keep taking breaks to help your plant grow!
            </p>
          </div>

          <div className="flex items-center gap-5 my-4">
            {/* Glass Bowl Terrarium Sprout SVG */}
            <Link
              href="/plant"
              className="w-24 h-24 rounded-3xl bg-gradient-to-b from-[#E6FFFA] to-[#C6F6D5] dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center flex-shrink-0 border border-white shadow-inner group"
            >
              <svg viewBox="0 0 80 80" className="w-20 h-20 group-hover:scale-105 transition-transform">
                <ellipse cx="40" cy="62" rx="24" ry="12" fill="rgba(255,255,255,0.85)" stroke="#9AE6B4" strokeWidth="2.5" />
                <ellipse cx="40" cy="64" rx="19" ry="7" fill="#5A4638" />
                <path d="M40 62 L40 28" stroke="#38A169" strokeWidth="4" strokeLinecap="round" />
                <path d="M40 42 C22 40, 20 22, 34 26 C38 27, 40 34, 40 42 Z" fill="#48BB78" />
                <path d="M40 36 C58 34, 60 16, 46 20 C42 21, 40 28, 40 36 Z" fill="#68D391" />
              </svg>
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-extrabold">
                  Lv. {plantLevel}
                </span>
                <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                  {plantName}
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[#E6E4FA] dark:bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${plantXp}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#48C78E] to-[#68D391] transition-all duration-500"
                />
              </div>
              <p className="text-right text-xs font-bold text-[#14162E] dark:text-white mt-1.5">
                {plantXp} / 100 XP
              </p>
            </div>
          </div>
        </div>

        {/* Bottom-Center: Quick Modes */}
        <div className="lg:col-span-4 glass-card rounded-[32px] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <Zap className="w-4 h-4 text-[#F6AD55] fill-current" />
              <span>Quick Modes</span>
            </h3>
            <Link
              href="/timer"
              className="w-7 h-7 rounded-full bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#14162E] dark:text-white"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2.5 my-auto">
            {quickModes.map((qm) => {
              const Icon = qm.icon;
              const isSelected = mode === qm.id;
              return (
                <button
                  key={qm.id}
                  onClick={() => setMode(qm.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                    qm.bg
                  } ${
                    isSelected
                      ? "ring-2 ring-[#7C6FF6] scale-[1.03] shadow-sm"
                      : "hover:scale-[1.02]"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 flex items-center justify-center mb-2 ${qm.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#14162E] dark:text-white leading-tight">
                    {qm.label.split(" ")[0]}
                    <br />
                    {qm.label.split(" ")[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom-Right: Upcoming Timeline */}
        <div className="lg:col-span-4 glass-card rounded-[32px] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <Bell className="w-4 h-4 text-[#7C6FF6]" />
              <span>Upcoming</span>
            </h3>
            <Link
              href="/settings"
              className="px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white hover:bg-white"
            >
              Edit
            </Link>
          </div>

          <div className="space-y-3.5 my-auto relative pl-4 border-l-2 border-[#DCD8F6] dark:border-white/15 ml-2">
            {/* Timeline Item 1 */}
            <div className="flex items-center justify-between gap-2 relative">
              <span className="w-3 h-3 rounded-full bg-[#7C6FF6] absolute -left-[23px] ring-4 ring-[#EBE8FF] dark:ring-[#1E203B]" />
              <span className="text-xs font-bold text-[#14162E] dark:text-white">
                In {minsUntilBreak} min
              </span>
              <button
                onClick={triggerBreakNow}
                className="px-3.5 py-2 rounded-2xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/25 text-xs font-bold text-[#14162E] dark:text-white flex items-center gap-2 hover:bg-[#DED9FF] transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#7C6FF6]" />
                <span>Eye Break (20s)</span>
              </button>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-center justify-between gap-2 relative">
              <span className="w-3 h-3 rounded-full bg-white border-2 border-[#7C6FF6] absolute -left-[23px]" />
              <span className="text-xs font-medium text-[#5B5E7B] dark:text-[#A3A6C9]">
                In {minsUntilBreak + 20} min
              </span>
              <div className="px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-white/5 text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9] flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-[#5472F6]" />
                <span>Focus Session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}