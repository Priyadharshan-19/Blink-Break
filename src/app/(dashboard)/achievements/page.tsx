// src/app/(dashboard)/achievements/page.tsx
"use client";

import React, { useState } from "react";
import {
  Trophy,
  Flame,
  Sparkles,
  Sprout,
  Code2,
  ShieldCheck,
  Share2,
  Check,
  Lock,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTrackerStore } from "@/store/useTrackerStore";
import { evaluateAchievements, AchievementBadge } from "@/lib/habitInsights";

export default function AchievementsPage() {
  const {
    dailyGoal,
    streakDays,
    plantLevel,
    totalWaterings,
    getCurrentWeekRecords,
  } = useTrackerStore();

  const [filter, setFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const week = getCurrentWeekRecords();
  const badges = evaluateAchievements(
    week,
    streakDays,
    plantLevel,
    totalWaterings,
    dailyGoal
  );

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalPoints = badges
    .filter((b) => b.unlocked)
    .reduce((acc, b) => acc + b.points, 0);

  const categories = ["All", "Streaks", "Breaks", "Focus", "Botany"];
  const filteredBadges =
    filter === "All" ? badges : badges.filter((b) => b.category === filter);

  const renderBadgeIcon = (iconName: AchievementBadge["iconName"]) => {
    switch (iconName) {
      case "flame":
        return <Flame className="w-6 h-6 text-[#FF8A4C] fill-current" />;
      case "trophy":
        return <Trophy className="w-6 h-6 text-[#F59E0B]" />;
      case "sprout":
        return <Sprout className="w-6 h-6 text-[#38A169]" />;
      case "code":
        return <Code2 className="w-6 h-6 text-[#5472F6]" />;
      case "shield":
        return <ShieldCheck className="w-6 h-6 text-[#7C6FF6]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#7C6FF6]" />;
    }
  };

  const handleShareBadge = (badge: AchievementBadge) => {
    const shareText = `I just unlocked the "${badge.title}" badge (${badge.points} pts) on BlinkBreak while maintaining a ${streakDays}-day 20-20-20 eye-care streak! 👀🌱`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(badge.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      {/* Hero Trophy Banner */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#FFF9DB]/80 via-[#EBE8FF]/90 to-[#E6FFFA]/80 dark:from-[#242038] dark:to-[#192830]">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <MascotIllustration variant="hero" className="w-36 h-36 flex-shrink-0" />
          <div>
            <span className="px-3.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-xs font-extrabold text-[#D97706]">
              🏆 BlinkBreak Trophy Room
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white mt-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {unlockedCount} of {badges.length} Achievements Unlocked
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1 max-w-lg">
              Every 20-second distant gaze, Coding Mode session, and virtual plant watering earns points toward your wellness mastery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card rounded-3xl px-6 py-4 text-center">
            <p className="text-xs font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
              Wellness Score
            </p>
            <p
              className="text-3xl font-extrabold text-[#7C6FF6] mt-0.5"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {totalPoints} pts
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filter === cat
                ? "bg-[#14162E] dark:bg-[#7C6FF6] text-white shadow-sm"
                : "glass-card text-[#5B5E7B] dark:text-[#A3A6C9] hover:bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredBadges.map((badge) => {
          const pct = Math.min(
            100,
            Math.round((badge.currentValue / badge.targetValue) * 100)
          );

          return (
            <div
              key={badge.id}
              className={`glass-card rounded-[28px] p-5 flex flex-col justify-between transition-all ${
                badge.unlocked
                  ? "border-2 border-[#7C6FF6]/40"
                  : "opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center">
                    {renderBadgeIcon(badge.iconName)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                      badge.unlocked
                        ? "bg-[#E2F8EE] text-[#22543D] dark:bg-emerald-500/20 dark:text-[#9AE6B4]"
                        : "bg-[#EBE8FF] text-[#5B5E7B] dark:bg-white/10 dark:text-[#A3A6C9]"
                    }`}
                  >
                    {badge.unlocked ? `+${badge.points} PTS` : "Locked"}
                  </span>
                </div>

                <h3
                  className="text-base font-extrabold text-[#14162E] dark:text-white"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {badge.title}
                </h3>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/60 dark:border-white/10">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span className="text-[#5B5E7B] dark:text-[#A3A6C9]">
                    Progress ({badge.currentValue}/{badge.targetValue})
                  </span>
                  <span className="text-[#14162E] dark:text-white">{pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#E6E4FA] dark:bg-white/10 overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked
                        ? "bg-gradient-to-r from-[#48C78E] to-[#7C6FF6]"
                        : "bg-[#9F7AEA]"
                    }`}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#7C6FF6]">
                    {badge.category}
                  </span>
                  {badge.unlocked ? (
                    <button
                      onClick={() => handleShareBadge(badge)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#14162E] dark:text-white hover:text-[#7C6FF6]"
                    >
                      {copiedId === badge.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#38A169]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#5B5E7B]">
                      <Lock className="w-3 h-3" />
                      <span>Keep going</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}