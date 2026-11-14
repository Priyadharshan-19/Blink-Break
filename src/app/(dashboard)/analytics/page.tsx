// src/app/(dashboard)/analytics/page.tsx
"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Percent,
  Flame,
  Code2,
  GraduationCap,
  Timer,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function WeeklyAnalyticsPage() {
  const { dailyGoal, streakDays, getCurrentWeekRecords } = useTrackerStore();
  const week = getCurrentWeekRecords();

  const totalCompleted = week.reduce((acc, d) => acc + d.completed, 0);
  const totalMissed = week.reduce((acc, d) => acc + d.missed, 0);
  const totalBreakSeconds = week.reduce((acc, d) => acc + d.breakSeconds, 0);
  const totalFocusMinutes = week.reduce((acc, d) => acc + d.focusMinutes, 0);
  const totalStudy = week.reduce((acc, d) => acc + (d.studySessions || 0), 0);
  const totalCoding = week.reduce((acc, d) => acc + (d.codingSessions || 0), 0);
  const totalPomodoro = week.reduce((acc, d) => acc + (d.pomodoroCycles || 0), 0);

  const completionRate =
    totalCompleted + totalMissed > 0
      ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100)
      : 100;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      {/* Top 4 Weekly KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#38A169] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Weekly Completed Breaks
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p
            className="text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {totalCompleted}
          </p>
          <p className="text-xs text-[#38A169] font-semibold mt-1">
            Daily Goal: {dailyGoal} breaks/day
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#7C6FF6] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Habit Completion Rate
            </span>
            <Percent className="w-5 h-5" />
          </div>
          <p
            className="text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {completionRate}%
          </p>
          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            {totalMissed} missed/skipped this week
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#5472F6] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Total Eye Rest Time
            </span>
            <Clock className="w-5 h-5" />
          </div>
          <p
            className="text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {Math.round(totalBreakSeconds / 60)}m {totalBreakSeconds % 60}s
          </p>
          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Across {Math.round(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m focus time
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#FF8A4C] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Consistency Streak
            </span>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <p
            className="text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {streakDays} Days
          </p>
          <p className="text-xs text-[#38A169] font-semibold mt-1">
            Active daily 20-20-20 streak
          </p>
        </div>
      </div>

      {/* Main Weekly Bar Chart + Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2
                className="text-xl font-extrabold text-[#14162E] dark:text-white"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                7-Day Break Consistency Breakdown
              </h2>
              <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                Real-time comparison of completed 20-second eye breaks vs missed reminders
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#48C78E]" />
                Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#DFDDF2] dark:bg-white/20" />
                Missed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 items-end h-56 pt-6 px-2 border-b border-[#E6E4FA] dark:border-white/10 pb-4">
            {week.map((day) => {
              const maxScale = Math.max(10, dailyGoal + 2);
              const compPct = Math.min(100, Math.max(12, (day.completed / maxScale) * 100));
              const missPct = Math.min(100, Math.max(8, (day.missed / maxScale) * 100));

              return (
                <div key={day.date} className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="text-[11px] font-bold text-[#14162E] dark:text-white">
                    {day.completed}/{dailyGoal}
                  </div>
                  <div className="flex items-end gap-1.5 h-36 w-full justify-center">
                    <div
                      style={{ height: `${compPct}%` }}
                      className="w-4 sm:w-5 rounded-t-xl bg-gradient-to-t from-[#68D391] to-[#48C78E]"
                      title={`${day.completed} completed`}
                    />
                    <div
                      style={{ height: `${missPct}%` }}
                      className="w-3 sm:w-4 rounded-t-xl bg-[#DFDDF2] dark:bg-white/15"
                      title={`${day.missed} missed`}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#5B5E7B] dark:text-[#A3A6C9]">
                    {day.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mode Usage Breakdown (Study, Coding, Pomodoro) */}
        <div className="lg:col-span-4 glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Productivity Mode Stats
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
              Sessions completed with 20-20-20 protection
            </p>
          </div>

          <div className="space-y-3 my-auto">
            <div className="p-4 rounded-2xl bg-[#E6F9F0] dark:bg-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-[#38A169]" />
                <div>
                  <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                    Coding Mode
                  </p>
                  <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                    30m deep code + 20s eye rest
                  </p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-[#38A169]">
                {totalCoding}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF3FF] dark:bg-blue-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#4A6CF7]" />
                <div>
                  <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                    Study Mode
                  </p>
                  <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                    25m study blocks + eye care
                  </p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-[#4A6CF7]">
                {totalStudy}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF0EE] dark:bg-rose-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-[#E53E3E]" />
                <div>
                  <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                    Pomodoro Sync
                  </p>
                  <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                    Harmonized 25m/5m cycles
                  </p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-[#E53E3E]">
                {totalPomodoro}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 text-xs text-[#5B5E7B] dark:text-[#A3A6C9] flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[#7C6FF6] flex-shrink-0" />
            <span>
              Tip: Enabling Smart Idle Detection in Settings prevents AFK time from counting as missed breaks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}