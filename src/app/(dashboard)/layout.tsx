// src/app/(dashboard)/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Play, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import FloatingTimerWidget from "@/components/timer/FloatingTimerWidget";
import BreakPopupModal from "@/components/timer/BreakPopupModal";
import { useTimerStore } from "@/store/useTimerStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePrivacyActivityDetector } from "@/lib/activityDetector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const hydrateFromMongo = useTrackerStore((s) => s.hydrateFromMongo);
  const tick = useTimerStore((s) => s.tick);
  const resumeTimer = useTimerStore((s) => s.resumeTimer);
  const syncWithSettings = useTimerStore((s) => s.syncWithSettings);
  const { isIdlePaused, idleSeconds } = usePrivacyActivityDetector();

  useEffect(() => {
    let mounted = true;
    hydrateFromMongo().then((authenticated) => {
      if (!mounted) return;
      if (!authenticated) {
        router.replace("/login");
      } else {
        const { workDurationMinutes, breakDurationSeconds } =
          useSettingsStore.getState();
        syncWithSettings(workDurationMinutes, breakDurationSeconds);
        setCheckingAuth(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [hydrateFromMongo, router, syncWithSettings]);

  useEffect(() => {
    if (checkingAuth) return;
    let worker: Worker | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    try {
      worker = new Worker("/workers/timer.worker.js");
      worker.onmessage = (e) => {
        if (e.data?.type === "TICK") {
          tick(e.data.now);
        }
      };
      worker.postMessage({ command: "START" });
    } catch {
      fallbackInterval = setInterval(() => {
        tick(Date.now());
      }, 500);
    }

    return () => {
      if (worker) {
        worker.postMessage({ command: "STOP" });
        worker.terminate();
      }
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [checkingAuth, tick]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#7C6FF6] animate-spin" />
        <p className="text-sm font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
          Loading your workspace from MongoDB...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        {isIdlePaused && (
          <div className="mb-4 glass-card rounded-2xl px-4 py-3 border border-[#7C6FF6]/40 bg-[#EBE8FF]/90 dark:bg-[#252246] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#14162E] dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#7C6FF6]" />
              <span>
                Smart Activity Detection paused your timer after {idleSeconds}s of inactivity so idle time isn&apos;t counted as screen work.
              </span>
            </div>
            <button
              onClick={resumeTimer}
              className="px-3.5 py-1.5 rounded-full bg-[#14162E] dark:bg-[#7C6FF6] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Play className="w-3 h-3" />
              <span>Resume Now</span>
            </button>
          </div>
        )}

        {children}
      </div>

      <FloatingTimerWidget />
      <BreakPopupModal />
    </div>
  );
}