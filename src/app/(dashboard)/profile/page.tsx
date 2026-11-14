// src/app/(dashboard)/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CloudUpload,
  Download,
  FileSpreadsheet,
  Trash2,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { convertHistoryToCSV } from "@/lib/habitInsights";

export default function ProfilePage() {
  const router = useRouter();
  const tracker = useTrackerStore();
  const settings = useSettingsStore();

  const [name, setName] = useState("Priyadharshan");
  const [email, setEmail] = useState("priyadharshan@blinkbreak.app");
  const [role, setRole] = useState("Software Developer & CSE Student");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blinkbreak-user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("blinkbreak-user", JSON.stringify({ name, email, role }));
    setSyncStatus("Profile updated locally!");
    setTimeout(() => setSyncStatus(null), 2500);
  };

  const handleCloudSync = async () => {
    setSyncStatus("Syncing with cloud...");
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          payload: {
            streakDays: tracker.streakDays,
            plantLevel: tracker.plantLevel,
            plantXp: tracker.plantXp,
            history: tracker.history,
            settings: {
              workDurationMinutes: settings.workDurationMinutes,
              breakDurationSeconds: settings.breakDurationSeconds,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSyncStatus(`Synced to Cloud at ${new Date(data.syncedAt).toLocaleTimeString()}`);
      }
    } catch {
      setSyncStatus("Saved locally (Offline Mode)");
    }
  };

  const handleExportJSON = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: { name, email, role },
      tracker: {
        dailyGoal: tracker.dailyGoal,
        streakDays: tracker.streakDays,
        plantLevel: tracker.plantLevel,
        plantXp: tracker.plantXp,
        history: tracker.getCurrentWeekRecords(),
      },
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blinkbreak-wellness-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvContent = convertHistoryToCSV(tracker.getCurrentWeekRecords());
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blinkbreak-weekly-stats-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all local BlinkBreak logs, routines, and account data?"
      )
    ) {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Card (5 Cols) */}
        <div className="lg:col-span-5 glass-card rounded-[32px] p-6 flex flex-col items-center text-center justify-between">
          <div className="w-full flex flex-col items-center">
            <MascotIllustration variant="hero" className="w-40 h-40" />
            <h2
              className="text-xl font-extrabold text-[#14162E] dark:text-white mt-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {name}
            </h2>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">{email}</p>
            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-xs font-bold text-[#7C6FF6]">
              {role}
            </span>
          </div>

          <div className="w-full space-y-3 mt-6 pt-5 border-t border-white/70 dark:border-white/10">
            <button
              onClick={handleCloudSync}
              className="pill-btn-primary w-full justify-center py-3 text-xs sm:text-sm"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Sync Account & Progress to Cloud</span>
            </button>

            {syncStatus && (
              <p className="text-xs font-bold text-[#38A169] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{syncStatus}</span>
              </p>
            )}

            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white inline-flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Edit Profile & Data Privacy / Export Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="glass-card rounded-[32px] p-6 space-y-4">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <User className="w-4 h-4 text-[#7C6FF6]" />
              <span>Profile Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9] mb-1">
                Daily Screen Focus Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#14162E] dark:bg-[#7C6FF6] text-white text-xs font-extrabold"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Data Export & Privacy Guarantee */}
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <ShieldCheck className="w-5 h-5 text-[#38A169]" />
              <span>Data Portability & Privacy Controls</span>
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] leading-relaxed">
              Your break history and settings belong to you. Export your wellness records anytime in JSON or CSV format, or wipe all local and synced data permanently.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-4 py-2.5 rounded-2xl bg-[#EBE8FF] dark:bg-white/10 text-xs font-extrabold text-[#14162E] dark:text-white inline-flex items-center gap-2 hover:bg-[#DED9FF]"
              >
                <Download className="w-4 h-4 text-[#7C6FF6]" />
                <span>Export JSON Backup</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-2xl bg-[#E2F8EE] dark:bg-emerald-500/20 text-xs font-extrabold text-[#22543D] dark:text-[#9AE6B4] inline-flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#38A169]" />
                <span>Export CSV Spreadsheet</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteAllData}
                className="px-4 py-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-xs font-extrabold text-rose-600 dark:text-rose-300 inline-flex items-center gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account & Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}