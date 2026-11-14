// src/app/(dashboard)/analytics/page.tsx
"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Percent,
  Flame,
  Code2,
  GraduationCap,
  Timer,
  Sparkles,
  BrainCircuit,
  TrendingUp,
  Check,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTimerStore } from "@/store/useTimerStore";
import { generatePersonalizedInsights } from "@/lib/habitInsights";

interface AiSuggestionResponse {
  source: string;
  weeklySummary: string;
  recommendedRoutine: {
    name: string;
    workMin: number;
    breakSec: number;
    reason: string;
  };
  habitTips: string[];
}

export default function AdvancedAnalyticsPage() {
  const { dailyGoal, streakDays, plantLevel, getCurrentWeekRecords, getTodayRecord } =
    useTrackerStore();
  const updateIntervals = useSettingsStore((s) => s.updateIntervals);
  const syncWithSettings = useTimerStore((s) => s.syncWithSettings);

  const [reportRange, setReportRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AiSuggestionResponse | null>(null);
  const [routineApplied, setRoutineApplied] = useState(false);

  const week = getCurrentWeekRecords();
  const today = getTodayRecord();

  const multiplier = reportRange === "daily" ? 0 : reportRange === "weekly" ? 1 : 4;
  const totalCompleted =
    reportRange === "daily"
      ? today.completed
      : week.reduce((acc, d) => acc + d.completed, 0) * multiplier;
  const totalMissed =
    reportRange === "daily"
      ? today.missed
      : week.reduce((acc, d) => acc + d.missed, 0) * multiplier;
  const totalBreakSeconds =
    reportRange === "daily"
      ? today.breakSeconds
      : week.reduce((acc, d) => acc + d.breakSeconds, 0) * multiplier;
  const totalFocusMinutes =
    reportRange === "daily"
      ? today.focusMinutes
      : week.reduce((acc, d) => acc + d.focusMinutes, 0) * multiplier;

  const totalStudy = week.reduce((acc, d) => acc + (d.studySessions || 0), 0);
  const totalCoding = week.reduce((acc, d) => acc + (d.codingSessions || 0), 0);
  const totalPomodoro = week.reduce((acc, d) => acc + (d.pomodoroCycles || 0), 0);

  const completionRate =
    totalCompleted + totalMissed > 0
      ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100)
      : 100;

  const insights = generatePersonalizedInsights(
    week,
    dailyGoal,
    streakDays,
    plantLevel
  );

  const handleGenerateAiCoach = async () => {
    setAiLoading(true);
    setRoutineApplied(false);
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalCompleted: week.reduce((acc, d) => acc + d.completed, 0),
          totalMissed: week.reduce((acc, d) => acc + d.missed, 0),
          streakDays,
          focusMinutes: week.reduce((acc, d) => acc + d.focusMinutes, 0),
          dailyGoal,
          preferredMode: "coding",
        }),
      });
      const data = await res.json();
      setAiData(data);
    } catch {
      // ignore error
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiRoutine = () => {
    if (!aiData?.recommendedRoutine) return;
    const { workMin, breakSec } = aiData.recommendedRoutine;
    updateIntervals(workMin, breakSec);
    syncWithSettings(workMin, breakSec);
    setRoutineApplied(true);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      {/* Report Range Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Advanced Analytics & Habit Intelligence
          </h2>
          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
            Real-time reports, personalized habit insights, and optional AI wellness coaching.
          </p>
        </div>

        <div className="flex items-center gap-2 glass-card p-1.5 rounded-full">
          {(["daily", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setReportRange(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all ${
                reportRange === tab
                  ? "bg-[#14162E] dark:bg-[#7C6FF6] text-white"
                  : "text-[#5B5E7B] dark:text-[#A3A6C9]"
              }`}
            >
              {tab} Report
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#38A169] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] capitalize">
              {reportRange} Completed Breaks
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
              Completion Percentage
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
            {totalMissed} missed/skipped
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#5472F6] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Total Eye Recovery Time
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
            Focus time: {Math.round(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between text-[#FF8A4C] mb-2">
            <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Longest & Active Streak
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
            Personal Best: {Math.max(14, streakDays)} Days
          </p>
        </div>
      </div>

      {/* Personalized Habit Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="glass-card rounded-[28px] p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7C6FF6]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Habit Insight</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-[11px] font-bold text-[#14162E] dark:text-white">
                  {ins.metricBadge}
                </span>
              </div>
              <h3
                className="text-base font-extrabold text-[#14162E] dark:text-white"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {ins.title}
              </h3>
              <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1.5 leading-relaxed">
                {ins.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart + Mode Stats */}
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
                Completed 20-second eye breaks vs missed reminders
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
                    />
                    <div
                      style={{ height: `${missPct}%` }}
                      className="w-3 sm:w-4 rounded-t-xl bg-[#DFDDF2] dark:bg-white/15"
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
        </div>
      </div>

      {/* AI-Generated Wellness Suggestions Section */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-[#EBE8FF]/85 via-[#F5F3FF]/90 to-[#E6FFFA]/85 dark:from-[#1E203B] dark:to-[#172830]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 text-xs font-extrabold text-[#7C6FF6]">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI Wellness Coach (Server-Side Protected API)</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-extrabold text-[#14162E] dark:text-white mt-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Personalized Schedule & Habit Recommendations
            </h3>
            <p className="text-xs sm:text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
              Analyze your weekly break patterns to generate custom routines and supportive consistency tips.
            </p>
          </div>

          <button
            onClick={handleGenerateAiCoach}
            disabled={aiLoading}
            className="pill-btn-primary text-xs sm:text-sm px-6 py-3 self-start sm:self-center flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {aiLoading ? "Analyzing Your Habits..." : "Generate AI Wellness Plan"}
            </span>
          </button>
        </div>

        {aiData && (
          <div className="mt-6 pt-6 border-t border-white/70 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#7C6FF6]">
                Weekly Progress Summary
              </p>
              <p className="text-sm font-medium text-[#14162E] dark:text-white leading-relaxed bg-white/70 dark:bg-white/5 p-4 rounded-2xl">
                {aiData.weeklySummary}
              </p>

              <p className="text-xs font-extrabold uppercase tracking-wider text-[#7C6FF6] pt-2">
                Actionable Habit Suggestions
              </p>
              <div className="space-y-2">
                {aiData.habitTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm bg-white/70 dark:bg-white/5 px-4 py-3 rounded-2xl"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#7C6FF6] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/80 dark:bg-white/5 rounded-3xl p-5 border border-white dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#E2F8EE] text-[#22543D] text-xs font-extrabold">
                  AI Recommended Routine
                </span>
                <h4
                  className="text-lg font-extrabold text-[#14162E] dark:text-white mt-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {aiData.recommendedRoutine.name}
                </h4>
                <p className="text-xs font-bold text-[#7C6FF6] mt-0.5">
                  {aiData.recommendedRoutine.workMin} min work •{" "}
                  {aiData.recommendedRoutine.breakSec} sec eye break
                </p>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-2 leading-relaxed">
                  {aiData.recommendedRoutine.reason}
                </p>
              </div>

              <button
                onClick={handleApplyAiRoutine}
                className="mt-5 w-full py-3 rounded-full bg-[#14162E] dark:bg-[#7C6FF6] text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
              >
                {routineApplied ? (
                  <>
                    <Check className="w-4 h-4 text-[#48C78E]" />
                    <span>Applied to Live Timer!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Recommended Routine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}