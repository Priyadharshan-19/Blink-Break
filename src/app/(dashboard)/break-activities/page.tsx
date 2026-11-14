// src/app/(dashboard)/break-activities/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Sparkles,
  Wind,
  Activity,
  Smile,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  HeartHandshake,
  Info,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { CircularCountdownRing, MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTrackerStore } from "@/store/useTrackerStore";
import { playGentleChime } from "@/lib/notifications";

interface GuidedActivity {
  id: string;
  title: string;
  category: "Eye Care" | "Breathing" | "Posture" | "Mindfulness";
  durationSeconds: number;
  xpReward: number;
  icon: React.ElementType;
  color: string;
  description: string;
  steps: string[];
  visualMode: "gaze" | "blink" | "figure8" | "breathe" | "posture";
}

const ACTIVITIES: GuidedActivity[] = [
  {
    id: "distant-gaze",
    title: "20-Foot Distant Gaze",
    category: "Eye Care",
    durationSeconds: 20,
    xpReward: 20,
    icon: Eye,
    color: "bg-[#EBE8FF] text-[#7C6FF6]",
    description:
      "The core 20-20-20 practice. Soften your focus on a faraway object across the room or outside your window.",
    steps: [
      "Look away from your monitor toward an object at least 20 feet (6 meters) away.",
      "Let your jaw and forehead muscles relax completely.",
      "Blink naturally 3 to 4 times while maintaining a soft distant gaze.",
    ],
    visualMode: "gaze",
  },
  {
    id: "gentle-blinking",
    title: "Gentle Blinking Reset",
    category: "Eye Care",
    durationSeconds: 30,
    xpReward: 20,
    icon: Sparkles,
    color: "bg-[#E2F8EE] text-[#38A169]",
    description:
      "Screen concentration cuts natural blinking rates by over 50%. Restore tear film moisture with slow, deliberate blinks.",
    steps: [
      "Close both eyes gently—do not squeeze your eyelids shut.",
      "Keep them closed for 2 full seconds to spread natural moisture.",
      "Open softly and repeat along with the pulsing guide ring.",
    ],
    visualMode: "blink",
  },
  {
    id: "figure-eight",
    title: "Figure-8 Eye Relaxation",
    category: "Eye Care",
    durationSeconds: 30,
    xpReward: 25,
    icon: Eye,
    color: "bg-[#E5EEFF] text-[#5472F6]",
    description:
      "Follow the smoothly gliding orb in a horizontal infinity loop without moving your head.",
    steps: [
      "Keep your head still and relaxed facing forward.",
      "Follow the glowing lavender orb with your eyes as it traces a smooth figure-8.",
      "Breathe steadily while allowing your eye muscles to glide effortlessly.",
    ],
    visualMode: "figure8",
  },
  {
    id: "box-breathing",
    title: "Cozy Box Breathing (4-4-4)",
    category: "Breathing",
    durationSeconds: 45,
    xpReward: 25,
    icon: Wind,
    color: "bg-[#E6FFFA] text-[#319795]",
    description:
      "Calm coding or exam stress while resting your eyes. Inhale as the circle expands, hold, and exhale slowly.",
    steps: [
      "Close or lower your eyes while listening to your breath.",
      "Inhale gently through your nose for 4 seconds as the circle expands.",
      "Hold softly for 4 seconds, then exhale slowly for 4 seconds.",
    ],
    visualMode: "breathe",
  },
  {
    id: "shoulder-relax",
    title: "Shoulder Roll Release",
    category: "Posture",
    durationSeconds: 30,
    xpReward: 20,
    icon: Activity,
    color: "bg-[#FFF0E5] text-[#FF8A4C]",
    description:
      "Release keyboard hunch and upper-trapezius tension accumulated during long coding or study blocks.",
    steps: [
      "Sit tall and let your arms hang loosely by your sides.",
      "Inhale as you lift both shoulders slowly up toward your ears.",
      "Exhale as you roll them back and down in a smooth circle.",
    ],
    visualMode: "posture",
  },
  {
    id: "neck-stretch",
    title: "Gentle Neck Tilt & Unwind",
    category: "Posture",
    durationSeconds: 30,
    xpReward: 20,
    icon: HeartHandshake,
    color: "bg-[#FCE7F3] text-[#DB2777]",
    description:
      "Ease forward-head posture from laptop screens with slow lateral neck stretches.",
    steps: [
      "Lower your right ear gently toward your right shoulder without lifting the shoulder.",
      "Hold for 10 seconds while breathing deeply.",
      "Return to center and repeat gently on the left side.",
    ],
    visualMode: "posture",
  },
  {
    id: "mindful-palming",
    title: "Warm Eye Palming Sanctuary",
    category: "Mindfulness",
    durationSeconds: 40,
    xpReward: 30,
    icon: Smile,
    color: "bg-[#FEF3C7] text-[#D97706]",
    description:
      "Rest your eyes in soothing darkness by rubbing your palms together and cupping them lightly over closed eyes.",
    steps: [
      "Rub your clean palms together briskly for 5 seconds until warm.",
      "Close your eyes and cup your palms lightly over them without pressing on your eyeballs.",
      "Enjoy the complete darkness and warmth for 30 seconds.",
    ],
    visualMode: "blink",
  },
];

export default function BreakActivitiesPage() {
  const [selected, setSelected] = useState<GuidedActivity>(ACTIVITIES[0]);
  const [remaining, setRemaining] = useState<number>(ACTIVITIES[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedBanner, setCompletedBanner] = useState(false);

  const recordBreakCompleted = useTrackerStore((s) => s.recordBreakCompleted);

  useEffect(() => {
    setRemaining(selected.durationSeconds);
    setIsRunning(false);
    setCompletedBanner(false);
  }, [selected]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setCompletedBanner(true);
          playGentleChime("break-complete");
          recordBreakCompleted(selected.durationSeconds, 5, "standard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, selected, recordBreakCompleted]);

  const progress =
    selected.durationSeconds > 0 ? remaining / selected.durationSeconds : 0;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      {/* Top Header & Wellness Disclaimer */}
      <div className="glass-card rounded-[28px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Guided Break Activities & Eye Exercises
          </h2>
          <p className="text-xs sm:text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
            Interactive visual guides to relax your eyes, ease neck tension, and earn +1 Water Drop per completed session.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-white/5 text-[11px] font-medium text-[#5B5E7B] dark:text-[#A3A6C9] border border-white/80 dark:border-white/10">
          <Info className="w-4 h-4 text-[#7C6FF6] flex-shrink-0" />
          <span>General wellness guidance — not medical diagnosis or treatment.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 7 Activity Selector Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {ACTIVITIES.map((act) => {
            const Icon = act.icon;
            const isSelected = selected.id === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setSelected(act)}
                className={`w-full text-left glass-card rounded-3xl p-4 flex items-center justify-between gap-4 transition-all ${
                  isSelected
                    ? "ring-2 ring-[#7C6FF6] bg-white/95 dark:bg-white/15 scale-[1.01]"
                    : "hover:bg-white/80 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-[#7C6FF6]">
                        {act.category}
                      </span>
                      <span className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
                        {act.durationSeconds}s
                      </span>
                    </div>
                    <h3
                      className="text-sm sm:text-base font-extrabold text-[#14162E] dark:text-white truncate mt-0.5"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {act.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-[#38A169] flex-shrink-0">
                  +{act.xpReward} XP
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive Animated Guided Player (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="px-3.5 py-1 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/25 text-xs font-bold text-[#7C6FF6]">
                {selected.category} • {selected.durationSeconds} Seconds
              </span>
              <span className="text-xs font-bold text-[#38A169]">
                Reward: +{selected.xpReward} Plant XP & +1 Water Drop 💧
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {selected.title}
            </h2>
            <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
              {selected.description}
            </p>
          </div>

          {/* Interactive Visual Simulation Stage */}
          <div className="my-6 rounded-3xl bg-gradient-to-br from-[#F2F0FF] via-[#E8F0FF] to-[#E6FFFA] dark:from-[#191B32] dark:to-[#14242B] p-6 border border-white dark:border-white/10 flex flex-col sm:flex-row items-center justify-around gap-6 min-h-[230px] relative overflow-hidden">
            {/* Mode-Specific Visual Coaching Aid */}
            {selected.visualMode === "figure8" && isRunning ? (
              <div className="flex flex-col items-center justify-center w-52 h-36 relative">
                <p className="text-xs font-bold text-[#7C6FF6] mb-2">
                  Follow the glowing orb with your eyes
                </p>
                <svg viewBox="0 0 200 100" className="w-48 h-24">
                  <path
                    d="M 50 50 C 20 15, 20 85, 50 50 C 80 15, 120 85, 150 50 C 180 15, 180 85, 150 50 C 120 15, 80 85, 50 50 Z"
                    fill="none"
                    stroke="rgba(124,111,246,0.28)"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />
                  <circle r="9" fill="#7C6FF6">
                    <animateMotion
                      dur="5s"
                      repeatCount="indefinite"
                      path="M 50 50 C 20 15, 20 85, 50 50 C 80 15, 120 85, 150 50 C 180 15, 180 85, 150 50 C 120 15, 80 85, 50 50 Z"
                    />
                  </circle>
                </svg>
              </div>
            ) : selected.visualMode === "breathe" && isRunning ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#48C78E]/25 border-2 border-[#48C78E] flex items-center justify-center animate-ping [animation-duration:4s]">
                  <span className="text-xs font-extrabold text-[#14162E] dark:text-white">
                    Breathe...
                  </span>
                </div>
                <span className="text-xs font-bold text-[#319795] mt-3">
                  Inhale 4s • Hold 4s • Exhale 4s
                </span>
              </div>
            ) : (
              <MascotIllustration variant="hero" className="w-40 h-40" />
            )}

            <CircularCountdownRing
              progress={progress}
              timeLabel={`00:${String(remaining).padStart(2, "0")}`}
              subLabel={isRunning ? "Guided Session Active" : "Ready to Begin"}
              size={150}
            />
          </div>

          {/* Step-by-step instructions */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5B5E7B] dark:text-[#A3A6C9]">
              How to perform this break:
            </p>
            {selected.steps.map((step, i) => (
              <div
                key={step}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-[#14162E] dark:text-[#E2E4FF] bg-white/60 dark:bg-white/5 px-4 py-2.5 rounded-2xl"
              >
                <span className="w-5 h-5 rounded-full bg-[#DED9FF] dark:bg-[#7C6FF6]/40 text-[#14162E] dark:text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Completion Banner */}
          {completedBanner && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-[#E2F8EE] dark:bg-emerald-950/60 border border-[#68D391] flex items-center justify-between text-xs sm:text-sm font-bold text-[#22543D] dark:text-[#9AE6B4]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38A169]" />
                <span>
                  Activity complete! Earned +{selected.xpReward} Plant XP and +1 Water Drop 💧
                </span>
              </div>
            </div>
          )}

          {/* Player Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/70 dark:border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (remaining === 0) setRemaining(selected.durationSeconds);
                  setCompletedBanner(false);
                  setIsRunning(!isRunning);
                }}
                className="pill-btn-primary text-xs sm:text-sm px-7 py-3"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Activity</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{remaining === 0 ? "Practice Again" : "Start Guided Activity"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setRemaining(selected.durationSeconds);
                  setCompletedBanner(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/80 dark:bg-white/10 text-xs font-bold text-[#5B5E7B] dark:text-white hover:bg-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}