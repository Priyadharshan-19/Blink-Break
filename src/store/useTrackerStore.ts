// src/store/useTrackerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DayRecord {
  date: string;
  dayLabel: string;
  completed: number;
  missed: number;
  skipped: number;
  snoozed: number;
  focusMinutes: number;
  breakSeconds: number;
  studySessions: number;
  codingSessions: number;
  pomodoroCycles: number;
}

export type PlantVariety = "sprout" | "bonsai" | "monstera" | "succulent";

interface TrackerState {
  dailyGoal: number;
  streakDays: number;
  plantLevel: number;
  plantXp: number;
  plantName: string;
  plantVariety: PlantVariety;
  waterDrops: number;
  totalWaterings: number;
  lastWateredAt: string | null;
  history: Record<string, DayRecord>;

  recordBreakCompleted: (
    durationSec: number,
    focusMinutesAdded: number,
    mode?: string
  ) => void;
  recordBreakSkipped: () => void;
  recordBreakMissed: () => void;
  recordBreakSnoozed: () => void;
  addFocusMinutes: (mins: number) => void;
  waterPlant: () => boolean;
  setPlantVariety: (variety: PlantVariety, customName?: string) => void;
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
  const dayOfWeek = now.getDay();
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
      studySessions: isToday ? 2 : 1,
      codingSessions: isToday ? 3 : 2,
      pomodoroCycles: isToday ? 2 : 1,
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
      plantVariety: "sprout",
      waterDrops: 3,
      totalWaterings: 8,
      lastWateredAt: null,
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
          studySessions: 0,
          codingSessions: 0,
          pomodoroCycles: 0,
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
            studySessions: 0,
            codingSessions: 0,
            pomodoroCycles: 0,
          };
          week.push({ ...record, dayLabel: labels[i] });
        }
        return week;
      },

      recordBreakCompleted: (durationSec, focusMinutesAdded, mode = "standard") => {
        const key = getDateKey();
        const current = get().getTodayRecord();
        const nextXpTotal = get().plantXp + 20;
        const leveledUp = nextXpTotal >= 100;

        set((state) => ({
          plantLevel: leveledUp ? state.plantLevel + 1 : state.plantLevel,
          plantXp: leveledUp ? nextXpTotal - 100 : nextXpTotal,
          waterDrops: state.waterDrops + 1, // Earn +1 Water Drop per completed break
          history: {
            ...state.history,
            [key]: {
              ...current,
              completed: current.completed + 1,
              breakSeconds: current.breakSeconds + durationSec,
              focusMinutes: current.focusMinutes + focusMinutesAdded,
              studySessions:
                mode === "study" ? (current.studySessions || 0) + 1 : current.studySessions || 0,
              codingSessions:
                mode === "coding" ? (current.codingSessions || 0) + 1 : current.codingSessions || 0,
              pomodoroCycles:
                mode === "pomodoro" ? (current.pomodoroCycles || 0) + 1 : current.pomodoroCycles || 0,
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

      waterPlant: () => {
        const { waterDrops, plantXp, plantLevel, totalWaterings } = get();
        if (waterDrops <= 0) return false;
        const nextXp = plantXp + 25;
        const leveledUp = nextXp >= 100;
        set({
          waterDrops: waterDrops - 1,
          plantLevel: leveledUp ? plantLevel + 1 : plantLevel,
          plantXp: leveledUp ? nextXp - 100 : nextXp,
          totalWaterings: totalWaterings + 1,
          lastWateredAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        return true;
      },

      setPlantVariety: (variety, customName) =>
        set((state) => ({
          plantVariety: variety,
          plantName: customName || state.plantName,
        })),

      setDailyGoal: (goal) => set({ dailyGoal: Math.max(1, goal) }),
    }),
    {
      name: "blinkbreak-tracker-v1",
    }
  )
);