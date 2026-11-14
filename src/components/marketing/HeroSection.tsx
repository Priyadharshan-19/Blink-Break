"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Moon,
  Settings,
  Eye,
  BarChart3,
  Sprout,
  Star,
  ArrowRight,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";
import {
  BlinkBreakLogo,
  CircularCountdownRing,
  MascotIllustration,
} from "@/components/ui/BrandPrimitives";

export default function HeroSection() {
  // Interactive floating preview timer so visitors can test the pause/break preview right on the hero
  const [previewSeconds, setPreviewSeconds] = useState(14 * 60 + 32);
  const [isPreviewRunning, setIsPreviewRunning] = useState(true);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoBreakSeconds, setDemoBreakSeconds] = useState(20);

  useEffect(() => {
    if (!isPreviewRunning) return;
    const interval = setInterval(() => {
      setPreviewSeconds((prev) => (prev > 0 ? prev - 1 : 20 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPreviewRunning]);

  useEffect(() => {
    if (!demoModalOpen) {
      setDemoBreakSeconds(20);
      return;
    }
    const timer = setInterval(() => {
      setDemoBreakSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [demoModalOpen]);

  const formatMMSS = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* LEFT HERO CONTENT (5 Cols) */}
          <div className="lg:col-span-5 z-10 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E2F5EA] via-[#EBE8FF] to-[#E5DEFF] dark:from-[#1F2E2B] dark:to-[#2A2648] border border-white/80 dark:border-white/10 shadow-sm">
              <span className="text-base">🌱</span>
              <span className="text-xs sm:text-sm font-semibold text-[#232645] dark:text-[#E2E4FF]">
                Your Eye-Care Companion
              </span>
            </div>

            {/* Display Headline with Hand-Drawn Lavender Underlines */}
            <div className="relative">
              <h1
                className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#14162E] dark:text-white leading-[1.08]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <span className="relative inline-block">
                  Take Breaks.
                  <svg
                    viewBox="0 0 280 14"
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-[#CFC7FF] dark:text-[#6358D4] -z-10"
                     preserveAspectRatio="none"
                  >
                    <path
                      d="M4 9 Q140 3 276 9"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                {/* Sparkle burst rays on right of headline */}
                <span className="inline-block ml-2 text-[#7C6FF6] align-top text-3xl">
                  ✦
                </span>
                <br />
                <span className="relative inline-block mt-1">
                  Take Care.
                  <svg
                    viewBox="0 0 240 14"
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-[#CFC7FF] dark:text-[#6358D4] -z-10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M4 9 Q120 4 236 8"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtitle with soft lavender keyword underlines */}
            <p className="text-base sm:text-lg text-[#4A4E6D] dark:text-[#B8BBE0] leading-relaxed max-w-xl">
              <span className="font-semibold text-[#14162E] dark:text-white underline decoration-[#BEB4FF] decoration-2 underline-offset-4">
                BlinkBreak
              </span>{" "}
              is a smart eye-care companion{" "}
              <span className="underline decoration-[#BEB4FF] decoration-2 underline-offset-4">
                that reminds you to take regular breaks
              </span>
              , follow the 20-20-20 rule, and build healthier screen habits.
            </p>

            {/* 4 Mini Feature Icons Row with Vertical Dividers */}
            <div className="grid grid-cols-4 divide-x divide-[#DCD8F6] dark:divide-white/10 pt-2 max-w-md">
              <div className="pr-3 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#6C5CE7] mb-1.5">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#14162E] dark:text-white leading-tight">
                  20-20-20
                </span>
                <span className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Reminder
                </span>
              </div>

              <div className="px-3 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#7C6FF6] mb-1.5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#14162E] dark:text-white leading-tight">
                  Track Your
                </span>
                <span className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Progress
                </span>
              </div>

              <div className="px-3 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-[#E3F8EE] dark:bg-white/10 flex items-center justify-center text-[#38A169] mb-1.5">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#14162E] dark:text-white leading-tight">
                  Grow Your
                </span>
                <span className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Virtual Plant
                </span>
              </div>

              <div className="pl-3 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-[#FFF5D6] dark:bg-white/10 flex items-center justify-center text-[#D69E2E] mb-1.5">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-bold text-[#14162E] dark:text-white leading-tight">
                  Earn
                </span>
                <span className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
                  Achievements
                </span>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="pill-btn-primary shadow-[0_12px_28px_-6px_rgba(20,22,46,0.35)] text-sm sm:text-base px-7 py-3.5"
              >
                <span>Download for Web</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass-card hover:bg-white/90 dark:hover:bg-white/10 transition-all text-sm sm:text-base font-semibold text-[#14162E] dark:text-white"
              >
                <span className="w-8 h-8 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 flex items-center justify-center text-[#14162E] dark:text-white">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Handwritten Footer Note */}
            <div className="pt-1 pl-2">
              <p
                className="text-xl text-[#4A4E6D] dark:text-[#B8BBE0] tracking-wide"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                A healthier you,{" "}
                <span className="underline decoration-[#B8A9F8] decoration-2">
                  one break
                </span>{" "}
                at a time ♡
              </p>
            </div>
          </div>

          {/* RIGHT HERO ILLUSTRATION & FLOATING GLASS CARDS (7 Cols) */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[430px] sm:min-h-[480px]">
            {/* Handwritten "Your eyes matter! ♡" annotation */}
            <div
              className="hidden sm:block absolute top-6 left-6 lg:left-10 z-20 -rotate-12 select-none"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              <p className="text-2xl lg:text-3xl font-bold text-[#3B3561] dark:text-[#D6CEFF] leading-none">
                Your eyes
                <br />
                matter! ♡
              </p>
              <svg
                viewBox="0 0 60 40"
                className="w-12 h-8 text-[#7C6FF6] ml-6 mt-1"
                fill="none"
              >
                <path
                  d="M5 5 Q25 32 52 22"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Center Anime Mascot with Headphones & Sleeping Cat */}
            <div className="relative z-10 w-full max-w-[440px] lg:mr-28">
              <MascotIllustration variant="hero" className="w-full h-auto" />
            </div>

            {/* TOP-RIGHT FLOATING TIMER PREVIEW WIDGET */}
            <div className="animate-float-slow glass-card rounded-3xl p-5 w-[240px] sm:w-[265px] absolute top-2 right-0 sm:right-2 z-20">
              <div className="flex items-center justify-between mb-3">
                <BlinkBreakLogo size="sm" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E] animate-pulse" />
                </div>
              </div>

              <div className="flex justify-center my-2">
                <CircularCountdownRing
                  progress={previewSeconds / (20 * 60)}
                  timeLabel={formatMMSS(previewSeconds)}
                  subLabel="Until next break"
                  size={136}
                />
              </div>

              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={() => setIsPreviewRunning(!isPreviewRunning)}
                  title={isPreviewRunning ? "Pause preview" : "Resume preview"}
                  className="w-9 h-9 rounded-full bg-[#EBE8FF] dark:bg-white/10 hover:bg-[#DED9FF] flex items-center justify-center text-[#14162E] dark:text-white transition"
                >
                  {isPreviewRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => setPreviewSeconds((s) => s + 300)}
                  title="Snooze +5m"
                  className="w-9 h-9 rounded-full bg-[#EBE8FF] dark:bg-white/10 hover:bg-[#DED9FF] flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
                >
                  <Moon className="w-4 h-4" />
                </button>
                <Link
                  href="/dashboard"
                  title="Open App Settings"
                  className="w-9 h-9 rounded-full bg-[#EBE8FF] dark:bg-white/10 hover:bg-[#DED9FF] flex items-center justify-center text-[#5B5E7B] dark:text-white transition"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* BOTTOM-RIGHT FLOATING "TIME FOR A BREAK!" POPUP PREVIEW */}
            <div className="animate-float-delayed glass-card rounded-3xl p-4 sm:p-5 w-[300px] sm:w-[340px] absolute -bottom-4 right-0 sm:right-2 z-20 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#EBE8FF]/70 dark:bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center border border-white">
                <MascotIllustration variant="chibi-break" className="w-16 h-16" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-extrabold text-[#14162E] dark:text-white"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Time for a break!
                </h3>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5 leading-snug">
                  Look at something 20 feet away for 20 seconds.
                </p>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="mt-3 w-full py-2 px-4 rounded-full bg-[#14162E] dark:bg-[#7C6FF6] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-95 transition"
                >
                  <span>Start Break</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE "WATCH DEMO" / 20-SECOND BREAK SIMULATOR MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14162E]/50 backdrop-blur-md p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#14162E] dark:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C6FF6] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive 20-20-20 Live Demo</span>
            </div>

            <h3
              className="text-2xl font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {demoBreakSeconds > 0
                ? "Look 20 Feet Away right now!"
                : "Break Completed! +20 Plant XP 🌱"}
            </h3>
            <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
              {demoBreakSeconds > 0
                ? "Relax your shoulders, blink gently, and focus on a distant object across the room or out your window."
                : "Great job! Your eyes are refreshed and your virtual terrarium sprout grew stronger."}
            </p>

            <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6 bg-white/60 dark:bg-white/5 rounded-2xl p-5 border border-white/80 dark:border-white/10">
              <MascotIllustration variant="hero" className="w-36 h-36" />
              <CircularCountdownRing
                progress={demoBreakSeconds / 20}
                timeLabel={`00:${String(demoBreakSeconds).padStart(2, "0")}`}
                subLabel="20s Eye Rest"
                size={140}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setDemoBreakSeconds(20)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B5E7B] hover:text-[#14162E] dark:text-[#A3A6C9] dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart 20s Demo</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="pill-btn-primary text-xs sm:text-sm px-5 py-2.5"
                >
                  <span>Launch Full App Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}