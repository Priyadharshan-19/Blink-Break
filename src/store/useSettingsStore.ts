// src/store/useSettingsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReminderIntensity = "gentle" | "standard" | "persistent";

interface SettingsState {
  theme: "light" | "dark";
  reducedMotion: boolean;
  workDurationMinutes: number;
  breakDurationSeconds: number;
  longBreakDurationMinutes: number;
  snoozeDurationMinutes: number;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 100
  notificationsEnabled: boolean;
  reminderIntensity: ReminderIntensity;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "07:00"
  idleDetectionEnabled: boolean;
  idleThresholdSeconds: number; // Default 120s (2 mins)

  toggleTheme: () => void;
  setReducedMotion: (val: boolean) => void;
  updateIntervals: (workMin: number, breakSec: number, longBreakMin?: number) => void;
  updateSmartSettings: (partial: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "light",
      reducedMotion: false,
      workDurationMinutes: 20,
      breakDurationSeconds: 20,
      longBreakDurationMinutes: 15,
      snoozeDurationMinutes: 5,
      soundEnabled: true,
      soundVolume: 70,
      notificationsEnabled: true,
      reminderIntensity: "standard",
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      idleDetectionEnabled: true,
      idleThresholdSeconds: 120,

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        set({ theme: next });
      },

      setReducedMotion: (val) => set({ reducedMotion: val }),

      updateIntervals: (workMin, breakSec, longBreakMin) =>
        set((state) => ({
          workDurationMinutes: workMin,
          breakDurationSeconds: breakSec,
          longBreakDurationMinutes:
            longBreakMin !== undefined ? longBreakMin : state.longBreakDurationMinutes,
        })),

      updateSmartSettings: (partial) => set((state) => ({ ...state, ...partial })),
    }),
    {
      name: "blinkbreak-settings",
    }
  )
);