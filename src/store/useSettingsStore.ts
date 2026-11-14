"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  reducedMotion: boolean;
  workDurationMinutes: number;
  breakDurationSeconds: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  toggleTheme: () => void;
  setReducedMotion: (val: boolean) => void;
  updateIntervals: (workMin: number, breakSec: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "light",
      reducedMotion: false,
      workDurationMinutes: 20,
      breakDurationSeconds: 20,
      soundEnabled: true,
      notificationsEnabled: true,
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        set({ theme: next });
      },
      setReducedMotion: (val) => set({ reducedMotion: val }),
      updateIntervals: (workMin, breakSec) =>
        set({ workDurationMinutes: workMin, breakDurationSeconds: breakSec }),
    }),
    {
      name: "blinkbreak-settings",
    }
  )
);