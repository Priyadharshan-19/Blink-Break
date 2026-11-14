// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDayRecord {
  date: string; // YYYY-MM-DD
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

export interface ISessionEventLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: "completed" | "skipped" | "missed" | "snoozed" | "watered";
  mode: string;
  durationSeconds: number;
  xpEarned: number;
}

export interface IBreakRoutine {
  id: string;
  name: string;
  tag: string;
  workMinutes: number;
  breakSeconds: number;
  activity: string;
  schedule: string;
  soundAlert: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  dailyGoal: number;
  streakDays: number;
  longestStreak: number;
  plantLevel: number;
  plantXp: number;
  plantName: string;
  plantVariety: "sprout" | "bonsai" | "monstera" | "succulent";
  waterDrops: number;
  totalWaterings: number;
  lastWateredAt: string | null;
  settings: {
    theme: "light" | "dark";
    workDurationMinutes: number;
    breakDurationSeconds: number;
    longBreakDurationMinutes: number;
    snoozeDurationMinutes: number;
    soundEnabled: boolean;
    soundVolume: number;
    notificationsEnabled: boolean;
    reminderIntensity: "gentle" | "standard" | "persistent";
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    idleDetectionEnabled: boolean;
    idleThresholdSeconds: number;
    shareMyStreak: boolean;
    sharePlantLevel: boolean;
  };
  history: Map<string, IDayRecord>;
  sessionLogs: ISessionEventLog[];
  routines: IBreakRoutine[];
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
}

const DayRecordSchema = new Schema<IDayRecord>(
  {
    date: { type: String, required: true },
    dayLabel: { type: String, required: true },
    completed: { type: Number, default: 0 },
    missed: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    snoozed: { type: Number, default: 0 },
    focusSeconds: { type: Number, default: 0 },
    focusMinutes: { type: Number, default: 0 },
    breakSeconds: { type: Number, default: 0 },
    studySessions: { type: Number, default: 0 },
    codingSessions: { type: Number, default: 0 },
    pomodoroCycles: { type: Number, default: 0 },
  },
  { _id: false }
);

const SessionEventLogSchema = new Schema<ISessionEventLog>(
  {
    id: { type: String, required: true },
    timestamp: { type: String, required: true },
    timeFormatted: { type: String, required: true },
    type: {
      type: String,
      enum: ["completed", "skipped", "missed", "snoozed", "watered"],
      required: true,
    },
    mode: { type: String, default: "standard" },
    durationSeconds: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
  },
  { _id: false }
);

const BreakRoutineSchema = new Schema<IBreakRoutine>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    tag: { type: String, default: "Custom Workflow" },
    workMinutes: { type: Number, default: 20 },
    breakSeconds: { type: Number, default: 20 },
    activity: { type: String, default: "20-Foot Distant Gaze" },
    schedule: { type: String, default: "Mon–Fri • All Day" },
    soundAlert: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "Software Developer" },
    dailyGoal: { type: Number, default: 8 },
    streakDays: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    plantLevel: { type: Number, default: 1 },
    plantXp: { type: Number, default: 0 },
    plantName: { type: String, default: "Luna Sprout" },
    plantVariety: {
      type: String,
      enum: ["sprout", "bonsai", "monstera", "succulent"],
      default: "sprout",
    },
    waterDrops: { type: Number, default: 0 },
    totalWaterings: { type: Number, default: 0 },
    lastWateredAt: { type: String, default: null },
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      workDurationMinutes: { type: Number, default: 20 },
      breakDurationSeconds: { type: Number, default: 20 },
      longBreakDurationMinutes: { type: Number, default: 15 },
      snoozeDurationMinutes: { type: Number, default: 5 },
      soundEnabled: { type: Boolean, default: true },
      soundVolume: { type: Number, default: 70 },
      notificationsEnabled: { type: Boolean, default: true },
      reminderIntensity: {
        type: String,
        enum: ["gentle", "standard", "persistent"],
        default: "standard",
      },
      quietHoursEnabled: { type: Boolean, default: false },
      quietHoursStart: { type: String, default: "22:00" },
      quietHoursEnd: { type: String, default: "07:00" },
      idleDetectionEnabled: { type: Boolean, default: true },
      idleThresholdSeconds: { type: Number, default: 120 },
      shareMyStreak: { type: Boolean, default: true },
      sharePlantLevel: { type: Boolean, default: true },
    },
    history: {
      type: Map,
      of: DayRecordSchema,
      default: {},
    },
    sessionLogs: {
      type: [SessionEventLogSchema],
      default: [],
    },
    routines: {
      type: [BreakRoutineSchema],
      default: [
        {
          id: "dev-routine",
          name: "Developer 20-20-20 Flow",
          tag: "Coding & Debugging",
          workMinutes: 20,
          breakSeconds: 20,
          activity: "20-Foot Distant Gaze",
          schedule: "Mon–Fri • 09:00 – 18:00",
          soundAlert: true,
        },
      ],
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);