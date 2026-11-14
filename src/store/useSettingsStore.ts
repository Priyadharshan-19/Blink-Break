// src/store/useSettingsStore.ts
"use client";

import { create } from "zustand";

export type ReminderIntensity = "gentle" | "standard" | "persistent";

export interface SettingsState {
  theme: "light" | "dark";
  reducedMotion: boolean;
  workDurationMinutes: number;
  breakDurationSeconds: number;
  longBreakDurationMinutes: number;
  snoozeDurationMinutes: number;
  soundEnabled: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  reminderIntensity: ReminderIntensity;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  idleDetectionEnabled: boolean;
  idleThresholdSeconds: number;

  hydrateSettingsFromMongo: (settings: Partial<SettingsState>) => void;
  toggleTheme: () => void;
  setReducedMotion: (val: boolean) => void;
  updateIntervals: (workMin: number, breakSec: number, longBreakMin?: number) => void;
  updateSmartSettings: (partial: Partial<SettingsState>) => void;
}

async function persistSettingsToMongo(settingsPayload: Record<string, unknown>) {
  try {
    await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_SETTINGS",
        payload: { settings: settingsPayload },
      }),
    });
  } catch {
    // ignore if unauthenticated on public landing page
  }
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
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

  hydrateSettingsFromMongo: (s) => {
    if (typeof document !== "undefined" && s.theme) {
      document.documentElement.classList.toggle("dark", s.theme === "dark");
    }
    set((state) => ({ ...state, ...s }));
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    set({ theme: next });
    persistSettingsToMongo({ ...get(), theme: next });
  },

  setReducedMotion: (val) => set({ reducedMotion: val }),

  updateIntervals: (workMin, breakSec, longBreakMin) => {
    set((state) => ({
      workDurationMinutes: workMin,
      breakDurationSeconds: breakSec,
      longBreakDurationMinutes:
        longBreakMin !== undefined ? longBreakMin : state.longBreakDurationMinutes,
    }));
    persistSettingsToMongo(get() as unknown as Record<string, unknown>);
  },

  updateSmartSettings: (partial) => {
    set((state) => ({ ...state, ...partial }));
    persistSettingsToMongo(get() as unknown as Record<string, unknown>);
  },
}));