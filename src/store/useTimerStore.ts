// src/store/useTimerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSettingsStore } from "./useSettingsStore";
import { useTrackerStore } from "./useTrackerStore";
import { playGentleChime, sendBrowserNotification } from "@/lib/notifications";

export type TimerPhase = "work" | "break-due" | "break-active";
export type ActiveMode = "standard" | "study" | "coding" | "pomodoro" | "relax";

interface TimerState {
  phase: TimerPhase;
  mode: ActiveMode;
  isRunning: boolean;
  remainingSeconds: number;
  totalPhaseSeconds: number;
  targetEndTime: number | null;
  widgetExpanded: boolean;
  widgetMinimized: boolean;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  triggerBreakNow: () => void;
  startActiveBreak: () => void;
  snoozeBreak: (minutes?: number) => void;
  skipBreak: () => void;
  completeBreak: () => void;
  setMode: (mode: ActiveMode) => void;
  syncWithSettings: (workMin: number, breakSec: number) => void;
  toggleWidgetExpanded: () => void;
  setWidgetMinimized: (minimized: boolean) => void;
  tick: (now: number) => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: "work",
      mode: "standard",
      isRunning: true,
      remainingSeconds: 14 * 60 + 32, // Starts at 14:32 on first load to match Reference Image 2
      totalPhaseSeconds: 20 * 60,
      targetEndTime: Date.now() + (14 * 60 + 32) * 1000,
      widgetExpanded: true,
      widgetMinimized: false,

      startTimer: () => {
        const { remainingSeconds } = get();
        set({
          isRunning: true,
          targetEndTime: Date.now() + remainingSeconds * 1000,
        });
      },

      pauseTimer: () => {
        const { targetEndTime, remainingSeconds } = get();
        const computedRemaining = targetEndTime
          ? Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000))
          : remainingSeconds;
        set({
          isRunning: false,
          remainingSeconds: computedRemaining,
          targetEndTime: null,
        });
      },

      resumeTimer: () => {
        const { remainingSeconds } = get();
        set({
          isRunning: true,
          targetEndTime: Date.now() + remainingSeconds * 1000,
        });
      },

      resetTimer: () => {
        const { workDurationMinutes } = useSettingsStore.getState();
        const totalSec = workDurationMinutes * 60;
        set({
          phase: "work",
          isRunning: false,
          remainingSeconds: totalSec,
          totalPhaseSeconds: totalSec,
          targetEndTime: null,
        });
      },

      triggerBreakNow: () => {
        const { breakDurationSeconds, soundEnabled, notificationsEnabled } =
          useSettingsStore.getState();
        if (soundEnabled) playGentleChime("break-due");
        if (notificationsEnabled) {
          sendBrowserNotification(
            "Time for a 20-20-20 Break! 👀",
            "Look at something 20 feet away for 20 seconds."
          );
        }
        set({
          phase: "break-due",
          isRunning: false,
          remainingSeconds: breakDurationSeconds,
          totalPhaseSeconds: breakDurationSeconds,
          targetEndTime: null,
        });
      },

      startActiveBreak: () => {
        const { breakDurationSeconds } = useSettingsStore.getState();
        set({
          phase: "break-active",
          isRunning: true,
          remainingSeconds: breakDurationSeconds,
          totalPhaseSeconds: breakDurationSeconds,
          targetEndTime: Date.now() + breakDurationSeconds * 1000,
        });
      },

      snoozeBreak: (minutes = 5) => {
        const snoozeSec = minutes * 60;
        useTrackerStore.getState().recordBreakSnoozed();
        set({
          phase: "work",
          isRunning: true,
          remainingSeconds: snoozeSec,
          totalPhaseSeconds: snoozeSec,
          targetEndTime: Date.now() + snoozeSec * 1000,
        });
      },

      skipBreak: () => {
        const { workDurationMinutes } = useSettingsStore.getState();
        const totalSec = workDurationMinutes * 60;
        useTrackerStore.getState().recordBreakSkipped();
        set({
          phase: "work",
          isRunning: true,
          remainingSeconds: totalSec,
          totalPhaseSeconds: totalSec,
          targetEndTime: Date.now() + totalSec * 1000,
        });
      },

      completeBreak: () => {
        const { workDurationMinutes, breakDurationSeconds, soundEnabled, notificationsEnabled } =
          useSettingsStore.getState();
        const workSec = workDurationMinutes * 60;

        useTrackerStore
          .getState()
          .recordBreakCompleted(breakDurationSeconds, workDurationMinutes);

        if (soundEnabled) playGentleChime("break-complete");
        if (notificationsEnabled) {
          sendBrowserNotification(
            "Break Completed! +20 Plant XP 🌱",
            `Great job! Starting your next ${workDurationMinutes}-minute focus session.`
          );
        }

        set({
          phase: "work",
          isRunning: true,
          remainingSeconds: workSec,
          totalPhaseSeconds: workSec,
          targetEndTime: Date.now() + workSec * 1000,
        });
      },

      setMode: (mode) => {
        const modeWorkMinutes: Record<ActiveMode, number> = {
          standard: useSettingsStore.getState().workDurationMinutes,
          study: 25,
          coding: 30,
          pomodoro: 25,
          relax: 15,
        };
        const mins = modeWorkMinutes[mode];
        const totalSec = mins * 60;
        set({
          mode,
          phase: "work",
          isRunning: true,
          remainingSeconds: totalSec,
          totalPhaseSeconds: totalSec,
          targetEndTime: Date.now() + totalSec * 1000,
        });
      },

      syncWithSettings: (workMin, breakSec) => {
        const { phase } = get();
        if (phase === "work") {
          const totalSec = workMin * 60;
          set({
            remainingSeconds: totalSec,
            totalPhaseSeconds: totalSec,
            targetEndTime: get().isRunning ? Date.now() + totalSec * 1000 : null,
          });
        } else {
          set({
            remainingSeconds: breakSec,
            totalPhaseSeconds: breakSec,
          });
        }
      },

      toggleWidgetExpanded: () =>
        set((s) => ({ widgetExpanded: !s.widgetExpanded })),

      setWidgetMinimized: (minimized) => set({ widgetMinimized: minimized }),

      tick: (now) => {
        const { isRunning, targetEndTime, phase } = get();
        if (!isRunning || !targetEndTime) return;

        const diffSec = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
        if (diffSec > 0) {
          set({ remainingSeconds: diffSec });
        } else {
          if (phase === "work") {
            get().triggerBreakNow();
          } else if (phase === "break-active") {
            get().completeBreak();
          }
        }
      },
    }),
    {
      name: "blinkbreak-timer-v1",
      partialize: (state) => ({
        phase: state.phase,
        mode: state.mode,
        isRunning: state.isRunning,
        remainingSeconds: state.remainingSeconds,
        totalPhaseSeconds: state.totalPhaseSeconds,
        targetEndTime: state.targetEndTime,
      }),
    }
  )
);