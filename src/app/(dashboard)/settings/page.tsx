// src/app/(dashboard)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { Save, Bell, Volume2, Moon, Check } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTimerStore } from "@/store/useTimerStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import {
  requestNotificationPermission,
  sendBrowserNotification,
  playGentleChime,
} from "@/lib/notifications";

export default function SettingsPage() {
  const {
    theme,
    workDurationMinutes,
    breakDurationSeconds,
    toggleTheme,
    updateIntervals,
  } = useSettingsStore();

  const syncWithSettings = useTimerStore((s) => s.syncWithSettings);
  const { dailyGoal, setDailyGoal } = useTrackerStore();

  const [workMin, setWorkMin] = useState(workDurationMinutes);
  const [breakSec, setBreakSec] = useState(breakDurationSeconds);
  const [goal, setGoal] = useState(dailyGoal);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntervals(workMin, breakSec);
    syncWithSettings(workMin, breakSec);
    setDailyGoal(goal);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleTestNotification = async () => {
    const perm = await requestNotificationPermission();
    playGentleChime("break-due");
    if (perm === "granted") {
      sendBrowserNotification(
        "BlinkBreak Test Notification ✨",
        "Your 20-20-20 browser notifications and gentle audio chimes are working!"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <form onSubmit={handleSave} className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6">
        <div>
          <h2
            className="text-xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            20-20-20 Timer & Wellness Preferences
          </h2>
          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Customize your focus intervals, break durations, daily goals, and desktop notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Work Interval (Minutes)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={workMin}
              onChange={(e) => setWorkMin(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold text-base"
            />
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Eye Break Duration (Seconds)
            </label>
            <input
              type="number"
              min={5}
              max={300}
              value={breakSec}
              onChange={(e) => setBreakSec(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold text-base"
            />
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Daily Break Goal
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold text-base"
            />
          </div>
        </div>

        {/* Notifications & Theme Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#7C6FF6]" />
              <div>
                <p className="text-sm font-bold text-[#14162E] dark:text-white">
                  Browser & Chime Alerts
                </p>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Test native desktop notification + Web Audio chime
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestNotification}
              className="px-3.5 py-2 rounded-xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 text-xs font-bold text-[#14162E] dark:text-white hover:bg-[#DED9FF]"
            >
              Test Alert
            </button>
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#7C6FF6]" />
              <div>
                <p className="text-sm font-bold text-[#14162E] dark:text-white">
                  Appearance Theme
                </p>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Current: {theme === "dark" ? "Cozy Midnight Dark" : "Pastel Lavender Light"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-2 rounded-xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 text-xs font-bold text-[#14162E] dark:text-white"
            >
              Switch Theme
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/70 dark:border-white/10">
          {savedToast ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38A169]">
              <Check className="w-4 h-4" />
              <span>Preferences saved and synced with live timer!</span>
            </span>
          ) : (
            <span className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#7C6FF6]" />
              <span>Timer persists across page refreshes and background tabs.</span>
            </span>
          )}

          <button type="submit" className="pill-btn-primary text-xs sm:text-sm px-6 py-3">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}