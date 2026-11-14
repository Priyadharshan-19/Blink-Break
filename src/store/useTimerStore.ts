// src/store/useTimerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSettingsStore } from "./useSettingsStore";
import { useTrackerStore } from "./useTrackerStore";
import { playGentleChime, sendBrowserNotification } from "@/lib/notifications";

export type TimerPhase = "work" | "break-due" | "break-active" | "pomodoro-rest";
export type ActiveMode = "standard" | "study" | "coding" | "pomodoro" | "relax";

interface TimerState {
  phase: TimerPhase;
  mode: ActiveMode;
  isRunning: boolean;
  isIdlePaused: boolean;
  remainingSeconds: number;
  totalPhaseSeconds: number;
  targetEndTime: number | null;

  // Dual-Timer Queue for Pomodoro / Study / Coding + 20-20-20 harmonization
  pomodoroCycleCount: number;
  eyeBreakSubTimerSeconds: number;
  pausedWorkRemainingSeconds: number | null;

  widgetExpanded: boolean;
  widgetMinimized: boolean;

  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setIdlePaused: (idle: boolean) => void;
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
      isIdlePaused: false,
      remainingSeconds: 14 * 60 + 32,
      totalPhaseSeconds: 20 * 60,
      targetEndTime: Date.now() + (14 * 60 + 32) * 1000,
      pomodoroCycleCount: 1,
      eyeBreakSubTimerSeconds: 20 * 60,
      pausedWorkRemainingSeconds: null,
      widgetExpanded: true,
      widgetMinimized: false,

      startTimer: () => {
        const { remainingSeconds } = get();
        set({
          isRunning: true,
          isIdlePaused: false,
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
          isIdlePaused: false,
          remainingSeconds: computedRemaining,
          targetEndTime: null,
        });
      },

      resumeTimer: () => {
        const { remainingSeconds } = get();
        set({
          isRunning: true,
          isIdlePaused: false,
          targetEndTime: Date.now() + remainingSeconds * 1000,
        });
      },

      setIdlePaused: (idle) => {
        const { isRunning, isIdlePaused, phase } = get();
        if (phase !== "work") return;

        if (idle && isRunning && !isIdlePaused) {
          const { targetEndTime, remainingSeconds } = get();
          const computed = targetEndTime
            ? Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000))
            : remainingSeconds;
          set({
            isRunning: false,
            isIdlePaused: true,
            remainingSeconds: computed,
            targetEndTime: null,
          });
        } else if (!idle && isIdlePaused) {
          const { remainingSeconds } = get();
          set({
            isRunning: true,
            isIdlePaused: false,
            targetEndTime: Date.now() + remainingSeconds * 1000,
          });
        }
      },

      resetTimer: () => {
        const { mode } = get();
        const { workDurationMinutes } = useSettingsStore.getState();
        const modeMap: Record<ActiveMode, number> = {
          standard: workDurationMinutes,
          study: 25,
          coding: 30,
          pomodoro: 25,
          relax: 15,
        };
        const totalSec = modeMap[mode] * 60;
        set({
          phase: "work",
          isRunning: false,
          isIdlePaused: false,
          remainingSeconds: totalSec,
          totalPhaseSeconds: totalSec,
          eyeBreakSubTimerSeconds: 20 * 60,
          pausedWorkRemainingSeconds: null,
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
          isIdlePaused: false,
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
          isIdlePaused: false,
          remainingSeconds: breakDurationSeconds,
          totalPhaseSeconds: breakDurationSeconds,
          targetEndTime: Date.now() + breakDurationSeconds * 1000,
        });
      },

      snoozeBreak: (minutes) => {
        const snoozeMins =
          minutes ?? useSettingsStore.getState().snoozeDurationMinutes ?? 5;
        const snoozeSec = snoozeMins * 60;
        useTrackerStore.getState().recordBreakSnoozed();
        set({
          phase: "work",
          isRunning: true,
          isIdlePaused: false,
          remainingSeconds: snoozeSec,
          totalPhaseSeconds: snoozeSec,
          targetEndTime: Date.now() + snoozeSec * 1000,
        });
      },

      skipBreak: () => {
        const { pausedWorkRemainingSeconds, mode } = get();
        const { workDurationMinutes } = useSettingsStore.getState();
        const resumeSec =
          pausedWorkRemainingSeconds && pausedWorkRemainingSeconds > 60
            ? pausedWorkRemainingSeconds
            : (mode === "standard" ? workDurationMinutes : 25) * 60;

        useTrackerStore.getState().recordBreakSkipped();
        set({
          phase: "work",
          isRunning: true,
          isIdlePaused: false,
          remainingSeconds: resumeSec,
          totalPhaseSeconds: resumeSec,
          pausedWorkRemainingSeconds: null,
          eyeBreakSubTimerSeconds: 20 * 60,
          targetEndTime: Date.now() + resumeSec * 1000,
        });
      },

      completeBreak: () => {
        const { mode, pausedWorkRemainingSeconds, pomodoroCycleCount } = get();
        const {
          workDurationMinutes,
          breakDurationSeconds,
          soundEnabled,
          notificationsEnabled,
        } = useSettingsStore.getState();

        useTrackerStore
          .getState()
          .recordBreakCompleted(breakDurationSeconds, workDurationMinutes, mode);

        if (soundEnabled) playGentleChime("break-complete");
        if (notificationsEnabled) {
          sendBrowserNotification(
            "Break Completed! +20 Plant XP & +1 Water Drop 💧",
            "Your eyes are refreshed! Resuming your focus flow."
          );
        }

        // If this was a 20s micro-break inside a longer Coding/Pomodoro block, resume the block cleanly
        if (pausedWorkRemainingSeconds && pausedWorkRemainingSeconds > 60) {
          set({
            phase: "work",
            isRunning: true,
            isIdlePaused: false,
            remainingSeconds: pausedWorkRemainingSeconds,
            totalPhaseSeconds: mode === "coding" ? 30 * 60 : 25 * 60,
            pausedWorkRemainingSeconds: null,
            eyeBreakSubTimerSeconds: 20 * 60,
            targetEndTime: Date.now() + pausedWorkRemainingSeconds * 1000,
          });
          return;
        }

        const modeMap: Record<ActiveMode, number> = {
          standard: workDurationMinutes,
          study: 25,
          coding: 30,
          pomodoro: 25,
          relax: 15,
        };
        const nextSec = modeMap[mode] * 60;

        set({
          phase: "work",
          isRunning: true,
          isIdlePaused: false,
          pomodoroCycleCount:
            mode === "pomodoro" ? (pomodoroCycleCount % 4) + 1 : pomodoroCycleCount,
          remainingSeconds: nextSec,
          totalPhaseSeconds: nextSec,
          eyeBreakSubTimerSeconds: 20 * 60,
          pausedWorkRemainingSeconds: null,
          targetEndTime: Date.now() + nextSec * 1000,
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
          isIdlePaused: false,
          remainingSeconds: totalSec,
          totalPhaseSeconds: totalSec,
          eyeBreakSubTimerSeconds: 20 * 60,
          pausedWorkRemainingSeconds: null,
          targetEndTime: Date.now() + totalSec * 1000,
        });
      },

      syncWithSettings: (workMin, breakSec) => {
        const { phase, mode } = get();
        if (phase === "work" && mode === "standard") {
          const totalSec = workMin * 60;
          set({
            remainingSeconds: totalSec,
            totalPhaseSeconds: totalSec,
            targetEndTime: get().isRunning ? Date.now() + totalSec * 1000 : null,
          });
        } else if (phase !== "work") {
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
        const {
          isRunning,
          targetEndTime,
          phase,
          mode,
          remainingSeconds,
          totalPhaseSeconds,
        } = get();
        if (!isRunning || !targetEndTime) return;

        const diffSec = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
        const elapsedInBlock = totalPhaseSeconds - diffSec;

        // Dual-Timer Priority Check: In 25m/30m Study, Coding, or Pomodoro modes, trigger a 20s eye break at the 20m mark if >90s remain in the block
        if (
          phase === "work" &&
          (mode === "pomodoro" || mode === "coding" || mode === "study") &&
          elapsedInBlock === 20 * 60 &&
          diffSec > 90 &&
          remainingSeconds !== diffSec
        ) {
          set({ pausedWorkRemainingSeconds: diffSec });
          get().triggerBreakNow();
          return;
        }

        if (diffSec > 0) {
          set({
            remainingSeconds: diffSec,
            eyeBreakSubTimerSeconds: Math.max(0, 20 * 60 - (elapsedInBlock % (20 * 60))),
          });
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
        pomodoroCycleCount: state.pomodoroCycleCount,
      }),
    }
  )
);