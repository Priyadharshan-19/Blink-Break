// src/app/(dashboard)/routines/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Play,
  Copy,
  Trash2,
  Edit3,
  Check,
  Clock,
  Eye,
  Bell,
  Calendar,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTimerStore } from "@/store/useTimerStore";

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

const DEFAULT_ROUTINES: BreakRoutine[] = [
  {
    id: "dev-routine",
    name: "Developer Routine",
    tag: "Coding & Debugging",
    workMinutes: 20,
    breakSeconds: 20,
    activity: "20-Foot Distant Gaze + Shoulder Roll",
    schedule: "Mon–Fri • 09:00 – 18:00",
    soundAlert: true,
  },
  {
    id: "student-routine",
    name: "Student Routine",
    tag: "Lectures & Notes",
    workMinutes: 25,
    breakSeconds: 25,
    activity: "Gentle Blinking Reset + Box Breathing",
    schedule: "Daily • 08:00 – 21:00",
    soundAlert: true,
  },
  {
    id: "deep-work",
    name: "Deep Work Routine",
    tag: "Architecture & Writing",
    workMinutes: 30,
    breakSeconds: 30,
    activity: "Figure-8 Eye Relaxation",
    schedule: "Morning Blocks • 08:30 – 13:00",
    soundAlert: true,
  },
  {
    id: "exam-prep",
    name: "Exam Preparation Routine",
    tag: "High-Intensity Revision",
    workMinutes: 25,
    breakSeconds: 20,
    activity: "Warm Eye Palming Sanctuary",
    schedule: "Evenings • 18:00 – 23:00",
    soundAlert: true,
  },
  {
    id: "relax-routine",
    name: "Evening Relaxation Routine",
    tag: "Low-Glare Browsing",
    workMinutes: 15,
    breakSeconds: 30,
    activity: "Nature Break Rainy Window",
    schedule: "Night • After 20:00",
    soundAlert: false,
  },
];

export default function CustomRoutinesPage() {
  const [routines, setRoutines] = useState<BreakRoutine[]>(DEFAULT_ROUTINES);
  const [activeRoutineId, setActiveRoutineId] = useState<string>("dev-routine");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [tag, setTag] = useState("Custom Workflow");
  const [workMinutes, setWorkMinutes] = useState(20);
  const [breakSeconds, setBreakSeconds] = useState(20);
  const [activity, setActivity] = useState("20-Foot Distant Gaze");
  const [schedule, setSchedule] = useState("Mon–Fri • All Day");
  const [soundAlert, setSoundAlert] = useState(true);

  const updateIntervals = useSettingsStore((s) => s.updateIntervals);
  const updateSmartSettings = useSettingsStore((s) => s.updateSmartSettings);
  const syncWithSettings = useTimerStore((s) => s.syncWithSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blinkbreak-routines-v1");
      if (saved) setRoutines(JSON.parse(saved));
    } catch {
      // ignore storage errors
    }
  }, []);

  const persistRoutines = (next: BreakRoutine[]) => {
    setRoutines(next);
    try {
      localStorage.setItem("blinkbreak-routines-v1", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleActivate = (r: BreakRoutine) => {
    setActiveRoutineId(r.id);
    updateIntervals(r.workMinutes, r.breakSeconds);
    updateSmartSettings({ soundEnabled: r.soundAlert });
    syncWithSettings(r.workMinutes, r.breakSeconds);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = routines.map((r) =>
        r.id === editingId
          ? { ...r, name, tag, workMinutes, breakSeconds, activity, schedule, soundAlert }
          : r
      );
      persistRoutines(updated);
      setEditingId(null);
    } else {
      const created: BreakRoutine = {
        id: `routine-${Date.now()}`,
        name,
        tag,
        workMinutes,
        breakSeconds,
        activity,
        schedule,
        soundAlert,
      };
      persistRoutines([created, ...routines]);
    }

    setName("");
    setTag("Custom Workflow");
    setWorkMinutes(20);
    setBreakSeconds(20);
  };

  const handleEdit = (r: BreakRoutine) => {
    setEditingId(r.id);
    setName(r.name);
    setTag(r.tag);
    setWorkMinutes(r.workMinutes);
    setBreakSeconds(r.breakSeconds);
    setActivity(r.activity);
    setSchedule(r.schedule);
    setSoundAlert(r.soundAlert);
  };

  const handleDuplicate = (r: BreakRoutine) => {
    const copy: BreakRoutine = {
      ...r,
      id: `routine-${Date.now()}`,
      name: `${r.name} (Copy)`,
    };
    persistRoutines([copy, ...routines]);
  };

  const handleDelete = (id: string) => {
    persistRoutines(routines.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Create / Edit Routine Form (4 Cols) */}
        <form
          onSubmit={handleSaveForm}
          className="lg:col-span-4 glass-card rounded-[32px] p-6 space-y-4 h-fit"
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {editingId ? "Edit Routine" : "Create Custom Routine"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                }}
                className="text-xs font-bold text-[#7C6FF6]"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
              Routine Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Hackathon"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
              Category Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
                Work (Mins)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
                Break (Secs)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={breakSeconds}
                onChange={(e) => setBreakSeconds(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
              Preferred Break Activity
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-[#181A30] border border-[#DCD8F6] dark:border-white/10 text-sm font-semibold"
            >
              <option>20-Foot Distant Gaze</option>
              <option>Gentle Blinking Reset</option>
              <option>Figure-8 Eye Relaxation</option>
              <option>Cozy Box Breathing (4-4-4)</option>
              <option>Shoulder Roll Release</option>
              <option>Warm Eye Palming Sanctuary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
              Schedule Label
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={soundAlert}
              onChange={(e) => setSoundAlert(e.target.checked)}
              className="accent-[#7C6FF6]"
            />
            <span>Play gentle chime when break starts</span>
          </label>

          <button type="submit" className="pill-btn-primary w-full justify-center py-3 text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span>{editingId ? "Update Routine" : "Save New Routine"}</span>
          </button>
        </form>

        {/* RIGHT COLUMN: Routines List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {routines.map((r) => {
            const isActive = activeRoutineId === r.id;
            return (
              <div
                key={r.id}
                className={`glass-card rounded-[28px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isActive ? "ring-2 ring-[#7C6FF6]" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/25 text-[11px] font-extrabold text-[#7C6FF6]">
                      {r.tag}
                    </span>
                    {isActive && (
                      <span className="px-3 py-0.5 rounded-full bg-[#E2F8EE] text-[#22543D] text-[11px] font-extrabold inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active in Timer
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-extrabold text-[#14162E] dark:text-white"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {r.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C6FF6]" />
                      {r.workMinutes}m work / {r.breakSeconds}s break
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#38A169]" />
                      {r.activity}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5472F6]" />
                      {r.schedule}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {r.soundAlert ? "Chime On" : "Silent"}
                    </span>
                  </div>
                </div>

                {/* CRUD & Activate Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => handleActivate(r)}
                    className={`px-4 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
                      isActive
                        ? "bg-[#48C78E] text-white"
                        : "bg-[#14162E] dark:bg-[#7C6FF6] text-white hover:opacity-95"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isActive ? "Active" : "Activate"}</span>
                  </button>

                  <button
                    onClick={() => handleEdit(r)}
                    title="Edit Routine"
                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#5B5E7B] hover:text-[#14162E] dark:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(r)}
                    title="Duplicate Routine"
                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-[#5B5E7B] hover:text-[#14162E] dark:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    title="Delete Routine"
                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}