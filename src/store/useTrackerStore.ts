// src/store/useTrackerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  completed: number;
  missed: number;
  skipped: number;
  snoozed: number;
  focusMinutes: number;
  breakSeconds: number;
}

interface TrackerState {
  dailyGoal: number;
  streakDays: number;
  plantLevel: number;
  plantXp: number;
  plantName: string;
  history: Record<string, DayRecord>;
  recordBreakCompleted: (durationSec: number, focusMinutesAdded: number) => void;
  recordBreakSkipped: () => void;
  recordBreakMissed: () => void;
  recordBreakSnoozed: () => void;
  addFocusMinutes: (mins: number) => void;
  setDailyGoal: (goal: number) => void;
  getTodayRecord: () => DayRecord;
  getCurrentWeekRecords: () => DayRecord[];
}

function getDateKey(date = new Date()): string {
  return date.toISOString().split("T")[0];
}

function getDayLabel(date = new Date()): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function createInitialWeekHistory(): Record<string, DayRecord> {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const presetCompleted = [5, 4, 8, 5, 4, 5, 4];
  const presetMissed = [2, 3, 2, 2, 3, 2, 2];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const records: Record<string, DayRecord> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + mondayOffset + i);
    const key = getDateKey(d);
    const isToday = key === getDateKey(now);

    records[key] = {
      date: key,
      dayLabel: labels[i],
      completed: isToday ? 6 : presetCompleted[i],
      missed: isToday ? 1 : presetMissed[i],
      skipped: 0,
      snoozed: 0,
      focusMinutes: isToday ? 200 : presetCompleted[i] * 25,
      breakSeconds: isToday ? 120 : presetCompleted[i] * 20,
    };
  }
  return records;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      dailyGoal: 8,
      streakDays: 12,
      plantLevel: 2,
      plantXp: 60,
      plantName: "Luna Sprout",
      history: createInitialWeekHistory(),

      getTodayRecord: () => {
        const key = getDateKey();
        const existing = get().history[key];
        if (existing) return existing;
        return {
          date: key,
          dayLabel: getDayLabel(),
          completed: 0,
          missed: 0,
          skipped: 0,
          snoozed: 0,
          focusMinutes: 0,
          breakSeconds: 0,
        };
      },

      getCurrentWeekRecords: () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const week: DayRecord[] = [];

        for (let i = 0; i < 7; i++) {
          const d = new Date(now);
          d.setDate(now.getDate() + mondayOffset + i);
          const key = getDateKey(d);
          const record = get().history[key] || {
            date: key,
            dayLabel: labels[i],
            completed: 0,
            missed: 0,
            skipped: 0,
            snoozed: 0,
            focusMinutes: 0,
            breakSeconds: 0,
          };
          week.push({ ...record, dayLabel: labels[i] });
        }
        return week;
      },

      recordBreakCompleted: (durationSec, focusMinutesAdded) => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        const nextXpTotal = get().plantXp + 20;
        const leveledUp = nextXpTotal >= 100;

        set((state) => ({
          plantLevel: leveledUp ? state.plantLevel + 1 : state.plantLevel,
          plantXp: leveledUp ? nextXpTotal - 100 : nextXpTotal,
          history: {
            ...state.history,
            [key]: {
              ...current,
              completed: current.completed + 1,
              breakSeconds: current.breakSeconds + durationSec,
              focusMinutes: current.focusMinutes + focusMinutesAdded,
            },
          },
        }));
      },

      recordBreakSkipped: () => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        set((state) => ({
          history: {
            ...state.history,
            [key]: {
              ...current,
              skipped: current.skipped + 1,
              missed: current.missed + 1,
            },
          },
        }));
      },

      recordBreakMissed: () => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        set((state) => ({
          history: {
            ...state.history,
            [key]: {
              ...current,
              missed: current.missed + 1,
            },
          },
        }));
      },

      recordBreakSnoozed: () => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        set((state) => ({
          history: {
            ...state.history,
            [key]: {
              ...current,
              snoozed: current.snoozed + 1,
            },
          },
        }));
      },

      addFocusMinutes: (mins) => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        set((state) => ({
          history: {
            ...state.history,
            [key]: {
              ...current,
              focusMinutes: current.focusMinutes + mins,
            },
          },
        }));
      },

      setDailyGoal: (goal) => set({ dailyGoal: Math.max(1, goal) }),
    }),
    {
      name: "blinkbreak-tracker-v1",
    }
  )
);