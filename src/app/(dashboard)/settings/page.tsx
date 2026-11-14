// src/app/(dashboard)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { Save, Bell, Volume2, Moon, Check, ShieldCheck, Clock } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useSettingsStore, ReminderIntensity } from "@/store/useSettingsStore";
import { useTimerStore } from "@/store/useTimerStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import {
  requestNotificationPermission,
  sendBrowserNotification,
  playGentleChime,
} from "@/lib/notifications";

export default function SettingsPage() {
  const settings = useSettingsStore();
  const syncWithSettings = useTimerStore((s) => s.syncWithSettings);
  const { dailyGoal, setDailyGoal } = useTrackerStore();

  const [workMin, setWorkMin] = useState(settings.workDurationMinutes);
  const [breakSec, setBreakSec] = useState(settings.breakDurationSeconds);
  const [snoozeMin, setSnoozeMin] = useState(settings.snoozeDurationMinutes);
  const [goal, setGoal] = useState(dailyGoal);
  const [volume, setVolume] = useState(settings.soundVolume);
  const [idleEnabled, setIdleEnabled] = useState(settings.idleDetectionEnabled);
  const [idleThreshold, setIdleThreshold] = useState(settings.idleThresholdSeconds);
  const [quietEnabled, setQuietEnabled] = useState(settings.quietHoursEnabled);
  const [quietStart, setQuietStart] = useState(settings.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(settings.quietHoursEnd);
  const [intensity, setIntensity] = useState<ReminderIntensity>(settings.reminderIntensity);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    settings.updateIntervals(workMin, breakSec);
    settings.updateSmartSettings({
      snoozeDurationMinutes: snoozeMin,
      soundVolume: volume,
      idleDetectionEnabled: idleEnabled,
      idleThresholdSeconds: idleThreshold,
      quietHoursEnabled: quietEnabled,
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
      reminderIntensity: intensity,
    });
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
        "BlinkBreak Smart Alert ✨",
        "Your custom notification sound, volume, and desktop alerts are active!"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <form onSubmit={handleSave} className="glass-card rounded-[32px] p-6 sm:p-8 space-y-8">
        <div>
          <h2
            className="text-xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Smart Timer, Activity Detection & Custom Notification Settings
          </h2>
          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Configure your 20-20-20 intervals, privacy-first idle detection, quiet hours, and chime volume.
          </p>
        </div>

        {/* Interval Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Work Interval (Min)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={workMin}
              onChange={(e) => setWorkMin(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold"
            />
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Eye Break (Sec)
            </label>
            <input
              type="number"
              min={5}
              max={300}
              value={breakSec}
              onChange={(e) => setBreakSec(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold"
            />
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white dark:border-white/10">
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-2">
              Snooze Duration (Min)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={snoozeMin}
              onChange={(e) => setSnoozeMin(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold"
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
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 font-bold"
            />
          </div>
        </div>

        {/* Privacy-First Activity Detection Section */}
        <div className="bg-white/70 dark:bg-white/5 p-5 rounded-2xl border border-white dark:border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#38A169] mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                  Privacy-First Smart Activity & Idle Detection
                </p>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Automatically pauses your work timer when no mouse/keyboard presence is detected. Never records typed content.
                </p>
              </div>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={idleEnabled}
                onChange={(e) => setIdleEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#7C6FF6]"
              />
              <span className="text-xs font-bold">Auto-Pause on Idle</span>
            </label>
          </div>

          {idleEnabled && (
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                Idle Auto-Pause Threshold:
              </span>
              <select
                value={idleThreshold}
                onChange={(e) => setIdleThreshold(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 text-xs font-bold"
              >
                <option value={30}>30 seconds (Quick Test)</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes (Recommended)</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
          )}
        </div>

        {/* Custom Notifications, Volume & Quiet Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 dark:bg-white/5 p-5 rounded-2xl border border-white dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-[#7C6FF6]" />
                <span className="text-sm font-extrabold text-[#14162E] dark:text-white">
                  Chime Volume & Intensity
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestNotification}
                className="px-3 py-1.5 rounded-xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 text-xs font-bold text-[#14162E] dark:text-white"
              >
                Test Alert
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-[#5B5E7B]" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 accent-[#7C6FF6]"
              />
              <span className="text-xs font-bold w-9 text-right">{volume}%</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                Reminder Style:
              </span>
              <div className="flex gap-1.5">
                {(["gentle", "standard", "persistent"] as ReminderIntensity[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setIntensity(lvl)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      intensity === lvl
                        ? "bg-[#14162E] dark:bg-[#7C6FF6] text-white"
                        : "bg-white dark:bg-white/10 text-[#5B5E7B]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-white/5 p-5 rounded-2xl border border-white dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#7C6FF6]" />
                <span className="text-sm font-extrabold text-[#14162E] dark:text-white">
                  Quiet Hours & Theme
                </span>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={quietEnabled}
                  onChange={(e) => setQuietEnabled(e.target.checked)}
                  className="accent-[#7C6FF6]"
                />
                <span>Mute During Quiet Hours</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 text-xs font-bold"
              />
              <span className="text-xs font-bold">to</span>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-[#7C6FF6]" />
                <span>Theme: {settings.theme === "dark" ? "Cozy Dark" : "Pastel Light"}</span>
              </span>
              <button
                type="button"
                onClick={settings.toggleTheme}
                className="px-3.5 py-1.5 rounded-xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 text-xs font-bold text-[#14162E] dark:text-white"
              >
                Toggle Theme
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/70 dark:border-white/10">
          {savedToast ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38A169]">
              <Check className="w-4 h-4" />
              <span>All Smart Experience (V2) preferences saved!</span>
            </span>
          ) : (
            <span className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              Changes apply immediately across the floating widget and active sessions.
            </span>
          )}

          <button type="submit" className="pill-btn-primary text-xs sm:text-sm px-6 py-3">
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}