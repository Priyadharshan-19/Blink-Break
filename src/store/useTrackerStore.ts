// src/store/useTrackerStore.ts
"use client";

import { create } from "zustand";
import { useSettingsStore } from "./useSettingsStore";

export interface DayRecord {
  date: string;
  dayLabel: string;
  completed: number;
  missed: number;
  skipped: number;
  snoozed: number;
  focusSeconds: number;
  focusMinutes: number;
  breakSeconds: number;
  studySessions: number;
  codingSessions: number;
  pomodoroCycles: number;
}

export interface SessionEventLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: "completed" | "skipped" | "missed" | "snoozed" | "watered";
  mode: string;
  durationSeconds: number;
  xpEarned: number;
}

export interface BreakRoutine {
  id: string;
  name: string;
  tag: string;
  workMinutes: number;
  breakSeconds: number;
  activity: string;
  schedule: string;
  soundAlert: boolean;
}

export interface FriendMember {
  id: string;
  name: string;
  email: string;
  role: string;
  streakDays: number;
  todayBreaks: number;
  dailyGoal: number;
  plantLevel: number;
}

export type PlantVariety = "sprout" | "bonsai" | "monstera" | "succulent";

export interface TrackerState {
  isHydrated: boolean;
  userId: string | null;
  userName: string;
  userEmail: string;
  userRole: string;
  dailyGoal: number;
  streakDays: number;
  longestStreak: number;
  plantLevel: number;
  plantXp: number;
  plantName: string;
  plantVariety: PlantVariety;
  waterDrops: number;
  totalWaterings: number;
  lastWateredAt: string | null;
  history: Record<string, DayRecord>;
  sessionLogs: SessionEventLog[];
  routines: BreakRoutine[];
  friends: FriendMember[];

  // MongoDB Hydration & Actions
  hydrateFromMongo: () => Promise<boolean>;
  recordFocusSecondTick: (secondsDelta?: number) => void;
  recordBreakCompleted: (
    durationSec: number,
    focusMinutesAddedOrMode?: number | string,
    optionalMode?: string
  ) => Promise<void>;
  recordBreakSkipped: (mode?: string) => Promise<void>;
  recordBreakMissed: (mode?: string) => Promise<void>;
  recordBreakSnoozed: (mode?: string) => Promise<void>;
  addFocusMinutes: (mins: number) => void;
  waterPlant: () => Promise<boolean>;
  setPlantVariety: (variety: PlantVariety, customName?: string) => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  saveRoutinesToMongo: (routines: BreakRoutine[]) => Promise<void>;
  updateProfileInMongo: (name: string, role: string) => Promise<void>;
  addFriendByQuery: (query: string) => Promise<{ ok: boolean; error?: string }>;
  recalculateStreaks: () => void;

  // Selectors
  getTodayRecord: () => DayRecord;
  getYesterdayRecord: () => DayRecord;
  getCurrentWeekRecords: () => DayRecord[];
  getLast30DaysRecords: () => DayRecord[];
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDayLabel(date = new Date()): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function createEmptyDayRecord(date = new Date()): DayRecord {
  return {
    date: getLocalDateKey(date),
    dayLabel: getDayLabel(date),
    completed: 0,
    missed: 0,
    skipped: 0,
    snoozed: 0,
    focusSeconds: 0,
    focusMinutes: 0,
    breakSeconds: 0,
    studySessions: 0,
    codingSessions: 0,
    pomodoroCycles: 0,
  };
}

let pendingFocusSecondsBuffer = 0;
let lastMongoFlushTime = Date.now();

export const useTrackerStore = create<TrackerState>()((set, get) => ({
  isHydrated: false,
  userId: null,
  userName: "Priyadharshan",
  userEmail: "",
  userRole: "Software Developer",
  dailyGoal: 8,
  streakDays: 0,
  longestStreak: 0,
  plantLevel: 1,
  plantXp: 0,
  plantName: "Luna Sprout",
  plantVariety: "sprout",
  waterDrops: 0,
  totalWaterings: 0,
  lastWateredAt: null,
  history: {},
  sessionLogs: [],
  routines: [],
  friends: [],

  hydrateFromMongo: async () => {
    try {
      const res = await fetch("/api/user/state", { cache: "no-store" });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data.ok || !data.user) return false;

      const u = data.user;
      set({
        isHydrated: true,
        userId: u.id,
        userName: u.name || "Priyadharshan",
        userEmail: u.email || "",
        userRole: u.role || "Software Developer",
        dailyGoal: u.dailyGoal ?? 8,
        streakDays: u.streakDays ?? 0,
        longestStreak: u.longestStreak ?? 0,
        plantLevel: u.plantLevel ?? 1,
        plantXp: u.plantXp ?? 0,
        plantName: u.plantName || "Luna Sprout",
        plantVariety: u.plantVariety || "sprout",
        waterDrops: u.waterDrops ?? 0,
        totalWaterings: u.totalWaterings ?? 0,
        lastWateredAt: u.lastWateredAt || null,
        history: u.history || {},
        sessionLogs: u.sessionLogs || [],
        routines: u.routines || [],
        friends: u.friends || [],
      });

      if (u.settings) {
        useSettingsStore.getState().hydrateSettingsFromMongo(u.settings);
      }

      return true;
    } catch {
      return false;
    }
  },

  getTodayRecord: () => {
    const now = new Date();
    const key = getLocalDateKey(now);
    return get().history[key] || createEmptyDayRecord(now);
  },

  getYesterdayRecord: () => {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const key = getLocalDateKey(yest);
    return get().history[key] || createEmptyDayRecord(yest);
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
      const key = getLocalDateKey(d);
      const existing = get().history[key];
      week.push(
        existing
          ? { ...existing, dayLabel: labels[i] }
          : { ...createEmptyDayRecord(d), dayLabel: labels[i] }
      );
    }
    return week;
  },

  getLast30DaysRecords: () => {
    const now = new Date();
    const days: DayRecord[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = getLocalDateKey(d);
      days.push(get().history[key] || createEmptyDayRecord(d));
    }
    return days;
  },

  recalculateStreaks: () => {
    // Handled on MongoDB state sync
  },

  recordFocusSecondTick: (secondsDelta = 1) => {
    if (secondsDelta <= 0) return;
    const now = new Date();
    const key = getLocalDateKey(now);
    const current = get().getTodayRecord();
    const nextFocusSeconds = (current.focusSeconds || 0) + secondsDelta;

    set((state) => ({
      history: {
        ...state.history,
        [key]: {
          ...current,
          focusSeconds: nextFocusSeconds,
          focusMinutes: Math.floor(nextFocusSeconds / 60),
        },
      },
    }));

    pendingFocusSecondsBuffer += secondsDelta;
    if (Date.now() - lastMongoFlushTime >= 10000 && pendingFocusSecondsBuffer > 0) {
      const toFlush = pendingFocusSecondsBuffer;
      pendingFocusSecondsBuffer = 0;
      lastMongoFlushTime = Date.now();

      fetch("/api/user/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "FOCUS_TICK",
          payload: {
            dateKey: key,
            dayLabel: getDayLabel(now),
            secondsDelta: toFlush,
          },
        }),
      }).catch(() => {});
    }
  },

  addFocusMinutes: (mins) => {
    get().recordFocusSecondTick(mins * 60);
  },

  recordBreakCompleted: async (
    durationSec,
    focusMinutesAddedOrMode = "standard",
    optionalMode
  ) => {
    const resolvedMode =
      typeof focusMinutesAddedOrMode === "string"
        ? focusMinutesAddedOrMode
        : optionalMode || "standard";

    const now = new Date();
    const res = await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "BREAK_COMPLETED",
        payload: {
          dateKey: getLocalDateKey(now),
          dayLabel: getDayLabel(now),
          durationSec,
          mode: resolvedMode,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      set({
        streakDays: data.streakDays,
        longestStreak: data.longestStreak,
        plantLevel: data.plantLevel,
        plantXp: data.plantXp,
        waterDrops: data.waterDrops,
        history: data.history,
        sessionLogs: data.sessionLogs,
      });
    }
  },

  recordBreakSkipped: async (mode = "standard") => {
    const now = new Date();
    const res = await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "BREAK_SKIPPED",
        payload: {
          dateKey: getLocalDateKey(now),
          dayLabel: getDayLabel(now),
          mode,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      set({ history: data.history, sessionLogs: data.sessionLogs });
    }
  },

  recordBreakMissed: async (mode = "standard") => {
    await get().recordBreakSkipped(mode);
  },

  recordBreakSnoozed: async (mode = "standard") => {
    const now = new Date();
    const res = await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "BREAK_SNOOZED",
        payload: {
          dateKey: getLocalDateKey(now),
          dayLabel: getDayLabel(now),
          mode,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      set({ history: data.history, sessionLogs: data.sessionLogs });
    }
  },

  waterPlant: async () => {
    if (get().waterDrops <= 0) return false;
    const res = await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "WATER_PLANT", payload: {} }),
    });
    if (res.ok) {
      const data = await res.json();
      set({
        plantLevel: data.plantLevel,
        plantXp: data.plantXp,
        waterDrops: data.waterDrops,
        totalWaterings: data.totalWaterings,
        lastWateredAt: data.lastWateredAt,
        sessionLogs: data.sessionLogs,
      });
      return true;
    }
    return false;
  },

  setPlantVariety: async (variety, customName) => {
    const nextName = customName || get().plantName;
    set({ plantVariety: variety, plantName: nextName });
    await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_PLANT_META",
        payload: { plantVariety: variety, plantName: nextName },
      }),
    });
  },

  setDailyGoal: async (goal) => {
    const validGoal = Math.max(1, goal);
    set({ dailyGoal: validGoal });
    await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_SETTINGS",
        payload: { dailyGoal: validGoal },
      }),
    });
  },

  saveRoutinesToMongo: async (routines) => {
    set({ routines });
    await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_ROUTINES",
        payload: { routines },
      }),
    });
  },

  updateProfileInMongo: async (name, role) => {
    set({ userName: name, userRole: role });
    await fetch("/api/user/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_PROFILE",
        payload: { name, role },
      }),
    });
  },

  addFriendByQuery: async (query) => {
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "Could not add friend" };
    }
    set((state) => ({
      friends: [
        data.friend,
        ...state.friends.filter((f) => f.id !== data.friend.id),
      ],
    }));
    return { ok: true };
  },
}));