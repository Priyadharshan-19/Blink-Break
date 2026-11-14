// src/components/layout/TopHeader.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import { requestNotificationPermission } from "@/lib/notifications";

export default function TopHeader() {
  const { theme, toggleTheme } = useSettingsStore();
  const userName = useTrackerStore((s) => s.userName) || "User";
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifGranted(Notification.permission === "granted");
    }
  }, []);

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifGranted(res === "granted");
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return `Good Morning, ${userName.split(" ")[0]}!`;
    if (hr < 17) return `Good Afternoon, ${userName.split(" ")[0]}!`;
    return `Good Evening, ${userName.split(" ")[0]}!`;
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-6 pr-0 xl:pr-72">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF3C4] dark:bg-amber-500/20 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-8 h-8">
            <circle cx="20" cy="20" r="9" fill="#FBBF24" />
            <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
              <line x1="20" y1="4" x2="20" y2="8" />
              <line x1="20" y1="32" x2="20" y2="36" />
              <line x1="4" y1="20" x2="8" y2="20" />
              <line x1="32" y1="20" x2="36" y2="20" />
              <line x1="8.5" y1="8.5" x2="11.5" y2="11.5" />
              <line x1="28.5" y1="28.5" x2="31.5" y2="31.5" />
              <line x1="31.5" y1="8.5" x2="28.5" y2="11.5" />
              <line x1="11.5" y1="28.5" x2="8.5" y2="31.5" />
            </g>
          </svg>
        </div>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white tracking-tight"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {getGreeting()}
          </h1>
          <p className="text-sm font-medium text-[#5B5E7B] dark:text-[#A3A6C9] flex items-center gap-1.5">
            <span>Let&apos;s take care of your eyes today.</span>
            <span className="text-base">💙</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={handleEnableNotifications}
          title={notifGranted ? "Browser Notifications Active" : "Click to enable browser notifications"}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#14162E] dark:text-white relative hover:scale-105 transition"
        >
          <Bell className="w-4 h-4" />
          <span
            className={`w-2 h-2 rounded-full absolute top-2.5 right-2.5 ${
              notifGranted ? "bg-[#48C78E]" : "bg-[#FF8A4C]"
            }`}
          />
        </button>

        <button
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#14162E] dark:text-white hover:scale-105 transition"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link
          href="/profile"
          className="glass-card rounded-full pl-1.5 pr-3.5 py-1.5 flex items-center gap-2.5 hover:bg-white/90 dark:hover:bg-white/10 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C6FF6] to-[#63B3ED] text-white font-bold text-xs flex items-center justify-center">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[#14162E] dark:text-white hidden sm:inline">
            {userName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#5B5E7B]" />
        </Link>
      </div>
    </header>
  );
}