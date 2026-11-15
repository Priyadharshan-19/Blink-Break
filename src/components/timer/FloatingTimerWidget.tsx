// src/components/timer/FloatingTimerWidget.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pause,
  Play,
  Settings,
  GripHorizontal,
  Minimize2,
  Maximize2,
  Clock,
  Sparkles,
  ExternalLink,
  PictureInPicture2,
  Flame,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";

// TypeScript declaration for Document Picture-in-Picture API
declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow: (options?: {
        width?: number;
        height?: number;
        disallowReturnToOpener?: boolean;
      }) => Promise<Window>;
      window: Window | null;
    };
  }
}

export default function FloatingTimerWidget() {
  const {
    phase,
    mode,
    isRunning,
    remainingSeconds,
    totalPhaseSeconds,
    widgetMinimized,
    pauseTimer,
    resumeTimer,
    snoozeBreak,
    triggerBreakNow,
    startActiveBreak,
    completeBreak,
    setWidgetMinimized,
  } = useTimerStore();

  const { dailyGoal, streakDays, plantLevel, getTodayRecord } = useTrackerStore();
  const today = getTodayRecord();

  // Desktop Always-On-Top Window State (Document PiP)
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  // Fallback Video Canvas PiP State
  const [videoPipActive, setVideoPipActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress =
    totalPhaseSeconds > 0
      ? Math.min(1, Math.max(0, remainingSeconds / totalPhaseSeconds))
      : 0;

  // Keep Fallback Canvas updated every tick when Video PiP is active
  const drawCanvasHud = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Rectangular 360x140 Desktop HUD
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lavender Glass Gradient Background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#191B32");
    grad.addColorStop(1, "#252246");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
    ctx.fill();

    // Subtle Border
    ctx.strokeStyle = "rgba(124, 111, 246, 0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Progress Ring on Left
    const cx = 58;
    const cy = 70;
    const r = 38;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      r,
      -Math.PI / 2,
      -Math.PI / 2 + progress * Math.PI * 2
    );
    ctx.strokeStyle = phase === "work" ? "#48C78E" : "#F6AD55";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    // Status Dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = isRunning ? "#48C78E" : "#FF8A4C";
    ctx.fill();

    // Main Countdown Digits
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 38px sans-serif";
    ctx.fillText(formatTime(remainingSeconds), 118, 62);

    // Phase & Mode Subtitle
    ctx.fillStyle = "#BEB4FF";
    ctx.font = "700 13px sans-serif";
    const statusText =
      phase === "work"
        ? `${mode.toUpperCase()} • ${isRunning ? "FOCUSING" : "PAUSED"}`
        : "👀 LOOK 20FT AWAY (20S)";
    ctx.fillText(statusText, 120, 86);

    // Bottom Stats Strip (Breaks, Streak, Plant Lv)
    ctx.fillStyle = "#A3A6C9";
    ctx.font = "600 13px sans-serif";
    ctx.fillText(
      `✓ ${today.completed}/${dailyGoal} Breaks   🔥 ${streakDays}d   🌱 Lv.${plantLevel}`,
      120,
      114
    );
  }, [
    dailyGoal,
    isRunning,
    mode,
    phase,
    plantLevel,
    progress,
    remainingSeconds,
    streakDays,
    today.completed,
  ]);

  useEffect(() => {
    if (videoPipActive) {
      drawCanvasHud();
    }
  }, [videoPipActive, drawCanvasHud, remainingSeconds, isRunning, phase]);

  // Launch Always-On-Top Desktop Rectangular Widget
  const toggleDesktopPopout = async () => {
    // 1. If already open, close it
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setVideoPipActive(false);
      return;
    }

    // 2. Primary Method: Interactive Document Picture-in-Picture (Compact Rectangular Desktop Bar)
    if (typeof window !== "undefined" && "documentPictureInPicture" in window && window.documentPictureInPicture) {
      try {
        const win = await window.documentPictureInPicture.requestWindow({
          width: 340,
          height: 148,
        });

        // Copy Tailwind & Global Stylesheets into the OS Floating Window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules]
              .map((rule) => rule.cssText)
              .join("");
            const style = win.document.createElement("style");
            style.textContent = cssRules;
            win.document.head.appendChild(style);
          } catch {
            if (styleSheet.href) {
              const link = win.document.createElement("link");
              link.rel = "stylesheet";
              link.href = styleSheet.href;
              win.document.head.appendChild(link);
            }
          }
        });

        win.document.title = "BlinkBreak Desktop Companion";
        win.document.body.style.margin = "0";
        win.document.body.style.overflow = "hidden";
        win.document.body.style.background = "#14162E";

        win.addEventListener("pagehide", () => {
          setPipWindow(null);
        });

        setPipWindow(win);
        return;
      } catch (err) {
        console.warn("Document PiP fallback to Video PiP:", err);
      }
    }

    // 3. Universal Fallback: Canvas Stream -> Native Video Picture-in-Picture
    try {
      drawCanvasHud();
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const stream = canvas.captureStream(15);
      video.srcObject = stream;
      await video.play();
      await video.requestPictureInPicture();
      setVideoPipActive(true);

      video.onleavepictureinpicture = () => {
        setVideoPipActive(false);
      };
    } catch (err) {
      console.error("Failed to open desktop floating widget:", err);
    }
  };

  const size = 72;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  // Rectangular Desktop Widget Content (Rendered inside the OS Always-on-Top Window via Portal)
  const desktopRectangularHud = (
    <div className="w-screen h-screen bg-gradient-to-r from-[#16182E] via-[#1F2140] to-[#26224C] text-white px-4 py-3 flex items-center justify-between gap-3.5 select-none overflow-hidden border border-[#7C6FF6]/40">
      {/* Left: Circular Ring + Mode Pill */}
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 64, height: 64 }}>
        <svg width={64} height={64} className="-rotate-90 transform">
          <circle
            cx={32}
            cy={32}
            r={26}
            fill="transparent"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={6}
          />
          <circle
            cx={32}
            cy={32}
            r={26}
            fill="transparent"
            stroke={phase === "work" ? "#48C78E" : "#F6AD55"}
            strokeWidth={6}
            strokeDasharray={2 * Math.PI * 26}
            strokeDashoffset={2 * Math.PI * 26 * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`w-2.5 h-2.5 rounded-full absolute ${
            isRunning ? "bg-[#48C78E] animate-pulse" : "bg-[#FF8A4C]"
          }`}
        />
      </div>

      {/* Center: Rectangular Info Stack (Countdown, Phase, Today's Breaks, Streak, Plant Lv) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight tabular-nums leading-none">
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7C6FF6]/30 text-[#DED9FF] truncate">
            {phase === "work" ? `${mode} mode` : "20s Eye Break!"}
          </span>
        </div>

        <p className="text-[11px] text-[#BEB4FF] truncate mt-1">
          {phase === "work"
            ? "Next 20-20-20 eye break countdown"
            : "Look 20 feet away & blink slowly 👀"}
        </p>

        {/* Required Live Info Badges */}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-[#D5D7F2]">
          <span className="inline-flex items-center gap-1 text-[#48C78E]">
            <CheckCircle2 className="w-3 h-3" />
            {today.completed}/{dailyGoal}
          </span>
          <span className="inline-flex items-center gap-1 text-[#FF8A4C]">
            <Flame className="w-3 h-3 fill-current" />
            {streakDays}d
          </span>
          <span className="inline-flex items-center gap-1 text-[#9AE6B4]">
            <Sprout className="w-3 h-3" />
            Lv.{plantLevel}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Buttons inside the Desktop Widget */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        {phase === "work" ? (
          <>
            <button
              onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
              title={isRunning ? "Pause" : "Resume"}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              onClick={triggerBreakNow}
              title="Start 20s Break Now"
              className="w-8 h-8 rounded-xl bg-[#7C6FF6] hover:bg-[#6B5CE7] flex items-center justify-center text-white transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => snoozeBreak(5)}
              title="Snooze +5m"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#D5D7F2] transition"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={phase === "break-due" ? startActiveBreak : completeBreak}
            className="px-3 py-2 rounded-xl bg-[#48C78E] text-[#14162E] font-extrabold text-xs"
          >
            {phase === "break-due" ? "Start 20s" : "Done ✓"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden Canvas & Video for Universal OS Picture-in-Picture Fallback */}
      <canvas
        ref={canvasRef}
        width={360}
        height={140}
        className="hidden pointer-events-none"
      />
      <video
        ref={videoRef}
        muted
        playsInline
        className="hidden pointer-events-none"
      />

      {/* Render Rectangular Always-On-Top Desktop Window when Pop-Out is Active */}
      {pipWindow && createPortal(desktopRectangularHud, pipWindow.document.body)}

      {/* In-App Floating Widget (Sleek Rectangular Mode or Standard Mode) */}
      {widgetMinimized ? (
        <motion.div
          drag
          dragMomentum={false}
          className="fixed bottom-6 right-6 z-40 glass-card rounded-2xl px-4 py-2.5 flex items-center gap-3.5 cursor-grab active:cursor-grabbing shadow-xl border-2 border-white/90 dark:border-white/15"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? "bg-[#48C78E] animate-pulse" : "bg-[#FF8A4C]"
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-extrabold text-base text-[#14162E] dark:text-white tabular-nums"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {formatTime(remainingSeconds)}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-[#7C6FF6]">
                {today.completed}/{dailyGoal}
              </span>
            </div>
          </div>

          <button
            onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
            className="w-7 h-7 rounded-full bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#14162E] dark:text-white"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            onClick={toggleDesktopPopout}
            title="Float Outside Browser on Desktop (Always-on-Top)"
            className="w-7 h-7 rounded-full bg-[#14162E] dark:bg-[#7C6FF6] text-white flex items-center justify-center"
          >
            <PictureInPicture2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setWidgetMinimized(false)}
            title="Expand Widget"
            className="text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9] dark:hover:text-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          drag
          dragMomentum={false}
          className="fixed top-20 right-6 z-40 w-[305px] select-none cursor-grab active:cursor-grabbing"
        >
          {/* Peeking Chibi Mascot */}
          <div className="relative flex justify-end pr-5 -mb-3 z-10 pointer-events-none">
            <div className="relative w-20 h-14 flex items-end justify-center">
              <span className="absolute -left-3 top-2 text-xs font-extrabold text-[#14162E] dark:text-white -rotate-12">
                !
              </span>
              <MascotIllustration
                variant="chibi-peek"
                className="w-16 h-14 object-cover object-top"
              />
            </div>
          </div>

          {/* Main Rectangular Floating Card */}
          <div className="glass-card rounded-[26px] p-4 border-2 border-white/90 dark:border-white/15 shadow-[0_18px_40px_-8px_rgba(100,90,195,0.25)]">
            {/* Top Bar: Drag Grip + Pop Out to Desktop Button */}
            <div className="flex items-center justify-between mb-2">
              <div
                className="flex items-center gap-1.5 text-[#8C8FA6]"
                title="Drag widget"
              >
                <GripHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C6FF6]">
                  {mode === "standard" ? "20-20-20" : `${mode} mode`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleDesktopPopout}
                  title="Pop Out Rectangular Widget to Desktop (Floats outside browser over VS Code & other apps)"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition ${
                    pipWindow || videoPipActive
                      ? "bg-[#48C78E] text-white"
                      : "bg-[#14162E] dark:bg-[#7C6FF6] text-white hover:scale-105"
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{pipWindow || videoPipActive ? "On Desktop" : "Pop Out"}</span>
                </button>

                <button
                  onClick={() => setWidgetMinimized(true)}
                  title="Compact Rectangular Bar"
                  className="p-1 text-[#8C8FA6] hover:text-[#14162E] dark:hover:text-white transition"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Center Rectangular Info Layout */}
            <div className="flex items-center justify-between gap-3 my-1.5">
              <div
                className="relative flex items-center justify-center flex-shrink-0"
                style={{ width: size, height: size }}
              >
                <svg width={size} height={size} className="-rotate-90 transform">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-[#E2E0F8] dark:text-[#2A2D4A]"
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="url(#widgetRingGrad)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="widgetRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#48C78E" />
                      <stop offset="100%" stopColor="#68D391" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex-1 text-right">
                <span className="text-[11px] font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                  {phase === "work" ? "Next Break In" : "Break Active"}
                </span>
                <div
                  className="text-3xl font-extrabold tracking-tight text-[#14162E] dark:text-white leading-none tabular-nums mt-0.5"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {formatTime(remainingSeconds)}
                </div>

                {/* Live Mini Metrics Strip */}
                <div className="flex items-center justify-end gap-2.5 mt-2 text-[11px] font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                  <span className="text-[#38A169]">✓ {today.completed}/{dailyGoal}</span>
                  <span className="text-[#FF8A4C]">🔥 {streakDays}d</span>
                  <span className="text-[#7C6FF6]">🌱 Lv.{plantLevel}</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-2.5 pt-2.5 mt-2 border-t border-[#E6E4FA] dark:border-white/10">
              <button
                onClick={() => (isRunning ? pauseTimer() : resumeTimer())}
                title={isRunning ? "Pause timer" : "Resume timer"}
                className="w-9 h-9 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#14162E] dark:text-white transition"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => snoozeBreak(5)}
                title="Snooze +5m"
                className="w-9 h-9 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
              >
                <Clock className="w-4 h-4" />
              </button>

              <button
                onClick={triggerBreakNow}
                title="Take 20s Break Now"
                className="w-9 h-9 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 shadow-sm hover:scale-105 flex items-center justify-center text-[#7C6FF6] dark:text-white transition"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <Link
                href="/settings"
                title="Timer Settings"
                className="w-9 h-9 rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}