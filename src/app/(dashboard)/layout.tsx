// src/app/(dashboard)/layout.tsx
"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import FloatingTimerWidget from "@/components/timer/FloatingTimerWidget";
import BreakPopupModal from "@/components/timer/BreakPopupModal";
import { useTimerStore } from "@/store/useTimerStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tick = useTimerStore((s) => s.tick);

  useEffect(() => {
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
  }, [tick]);

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        {children}
      </div>

      {/* Persistent Draggable Floating Timer Widget */}
      <FloatingTimerWidget />

      {/* Global Break Reminder Modal */}
      <BreakPopupModal />
    </div>
  );
}