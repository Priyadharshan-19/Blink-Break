// src/app/(dashboard)/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  RefreshCw,
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
import { convertHistoryToCSV } from "@/lib/habitInsights";

export default function ProfilePage() {
  const router = useRouter();
  const tracker = useTrackerStore();

  const [name, setName] = useState(tracker.userName);
  const [role, setRole] = useState(tracker.userRole);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    setName(tracker.userName);
    setRole(tracker.userRole);
  }, [tracker.userName, tracker.userRole]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await tracker.updateProfileInMongo(name, role);
    setSyncStatus("Profile saved to MongoDB!");
    setTimeout(() => setSyncStatus(null), 2500);
  };

  const handleRefreshFromMongo = async () => {
    setSyncStatus("Refreshing from MongoDB...");
    await tracker.hydrateFromMongo();
    setSyncStatus(`Synced with MongoDB at ${new Date().toLocaleTimeString()}`);
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const handleExportJSON = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: { name: tracker.userName, email: tracker.userEmail, role: tracker.userRole },
      tracker: {
        dailyGoal: tracker.dailyGoal,
        streakDays: tracker.streakDays,
        longestStreak: tracker.longestStreak,
        plantLevel: tracker.plantLevel,
        plantXp: tracker.plantXp,
        history: tracker.history,
        sessionLogs: tracker.sessionLogs,
      },
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blinkbreak-mongodb-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvContent = convertHistoryToCSV(tracker.getLast30DaysRecords());
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blinkbreak-30d-stats-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account and all MongoDB records?"
      )
    ) {
      await fetch("/api/user/state", { method: "DELETE" });
      router.replace("/");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-card rounded-[32px] p-6 flex flex-col items-center text-center justify-between">
          <div className="w-full flex flex-col items-center">
            <MascotIllustration variant="hero" className="w-40 h-40" />
            <h2
              className="text-xl font-extrabold text-[#14162E] dark:text-white mt-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {tracker.userName}
            </h2>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              {tracker.userEmail}
            </p>
            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-xs font-bold text-[#7C6FF6]">
              {tracker.userRole}
            </span>
          </div>

          <div className="w-full space-y-3 mt-6 pt-5 border-t border-white/70 dark:border-white/10">
            <button
              onClick={handleRefreshFromMongo}
              className="pill-btn-primary w-full justify-center py-3 text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh State from MongoDB</span>
            </button>

            {syncStatus && (
              <p className="text-xs font-bold text-[#38A169] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{syncStatus}</span>
              </p>
            )}

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white inline-flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="glass-card rounded-[32px] p-6 space-y-4">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <User className="w-4 h-4 text-[#7C6FF6]" />
              <span>MongoDB Account Profile</span>
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
                  Registered Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={tracker.userEmail}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm opacity-75 cursor-not-allowed"
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
              Save Profile to MongoDB
            </button>
          </form>

          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <ShieldCheck className="w-5 h-5 text-[#38A169]" />
              <span>MongoDB Data Export & Permanent Account Deletion</span>
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] leading-relaxed">
              Export your complete MongoDB wellness history in JSON or CSV format, or permanently delete your account document from the database.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-4 py-2.5 rounded-2xl bg-[#EBE8FF] dark:bg-white/10 text-xs font-extrabold text-[#14162E] dark:text-white inline-flex items-center gap-2 hover:bg-[#DED9FF]"
              >
                <Download className="w-4 h-4 text-[#7C6FF6]" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-2xl bg-[#E2F8EE] dark:bg-emerald-500/20 text-xs font-extrabold text-[#22543D] dark:text-[#9AE6B4] inline-flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#38A169]" />
                <span>Export 30-Day CSV</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-xs font-extrabold text-rose-600 dark:text-rose-300 inline-flex items-center gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account from DB</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}