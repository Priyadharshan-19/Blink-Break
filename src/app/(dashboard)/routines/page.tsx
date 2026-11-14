// src/app/(dashboard)/routines/page.tsx
"use client";

import React, { useState } from "react";
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
import { useTrackerStore, BreakRoutine } from "@/store/useTrackerStore";

export default function CustomRoutinesPage() {
  const { routines, saveRoutinesToMongo } = useTrackerStore();
  const [activeRoutineId, setActiveRoutineId] = useState<string>(
    routines[0]?.id || "dev-routine"
  );
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleActivate = (r: BreakRoutine) => {
    setActiveRoutineId(r.id);
    updateIntervals(r.workMinutes, r.breakSeconds);
    updateSmartSettings({ soundEnabled: r.soundAlert });
    syncWithSettings(r.workMinutes, r.breakSeconds);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = routines.map((r) =>
        r.id === editingId
          ? { ...r, name, tag, workMinutes, breakSeconds, activity, schedule, soundAlert }
          : r
      );
      await saveRoutinesToMongo(updated);
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
      await saveRoutinesToMongo([created, ...routines]);
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

  const handleDuplicate = async (r: BreakRoutine) => {
    const copy: BreakRoutine = {
      ...r,
      id: `routine-${Date.now()}`,
      name: `${r.name} (Copy)`,
    };
    await saveRoutinesToMongo([copy, ...routines]);
  };

  const handleDelete = async (id: string) => {
    await saveRoutinesToMongo(routines.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            <span>{editingId ? "Update Routine in MongoDB" : "Save Routine to MongoDB"}</span>
          </button>
        </form>

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