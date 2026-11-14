// src/app/(dashboard)/friends/page.tsx
"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Flame,
  Trophy,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function FriendsPage() {
  const {
    userName,
    streakDays,
    dailyGoal,
    plantLevel,
    friends,
    getTodayRecord,
    addFriendByQuery,
  } = useTrackerStore();
  const today = getTodayRecord();

  const [inviteInput, setInviteInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [shareMyStreak, setShareMyStreak] = useState(true);
  const [sharePlantLevel, setSharePlantLevel] = useState(true);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    setFeedback(null);

    const res = await addFriendByQuery(inviteInput);
    if (!res.ok) {
      setFeedback({ type: "err", text: res.error || "User not found in MongoDB." });
    } else {
      setFeedback({ type: "ok", text: "Friend linked from MongoDB!" });
      setInviteInput("");
    }
  };

  // Real team breaks sum (You + all linked MongoDB friends)
  const teamTotalToday =
    today.completed + friends.reduce((acc, f) => acc + (f.todayBreaks || 0), 0);
  const teamTarget = Math.max(10, (friends.length + 1) * dailyGoal);
  const teamPct = Math.min(100, Math.round((teamTotalToday / teamTarget) * 100));

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2
                  className="text-xl font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  <Users className="w-5 h-5 text-[#7C6FF6]" />
                  <span>Friends & Real-Time MongoDB Leaderboard</span>
                </h2>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
                  Connect with registered BlinkBreak users by email or display name.
                </p>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-[#FFF0E5] text-[#FF8A4C] text-xs font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Your Streak: {streakDays}d
              </span>
            </div>

            <form onSubmit={handleAddFriend} className="flex items-center gap-2.5">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                placeholder="Enter registered friend's email or exact name..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm"
              />
              <button type="submit" className="pill-btn-primary text-xs px-5 py-2.5">
                <UserPlus className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </form>

            {feedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  feedback.type === "ok"
                    ? "bg-[#E2F8EE] text-[#22543D]"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {feedback.type === "ok" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="space-y-3">
              {/* Authenticated User Row */}
              <div className="p-4 rounded-2xl bg-[#EBE8FF]/80 dark:bg-[#7C6FF6]/25 border border-[#7C6FF6]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7C6FF6] text-white font-extrabold text-sm flex items-center justify-center">
                    YOU
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                      {userName || "You"}
                    </p>
                    <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                      Plant Lv. {plantLevel} • Today: {today.completed}/{dailyGoal} breaks
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-white/10 text-xs font-extrabold text-[#FF8A4C] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {streakDays} days
                </span>
              </div>

              {friends.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 text-center text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                  No friends connected yet. Register a second account or enter a teammate&apos;s BlinkBreak email above to compare real-time streaks!
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#63B3ED] to-[#7C6FF6] text-white font-bold text-sm flex items-center justify-center">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                          {friend.name}
                        </p>
                        <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                          {friend.role} • Plant Lv. {friend.plantLevel} • Today:{" "}
                          {friend.todayBreaks}/{friend.dailyGoal}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#FFF0E5] dark:bg-orange-500/20 text-xs font-extrabold text-[#FF8A4C] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {friend.streakDays} days
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[28px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#E2F8EE] text-[#22543D] text-xs font-extrabold inline-flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Daily Circle Goal
              </span>
              <span className="text-xs font-bold text-[#7C6FF6]">
                {friends.length + 1} {friends.length === 0 ? "Member" : "Members"}
              </span>
            </div>

            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Combined Daily Eye Breaks
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              Live sum of today&apos;s completed 20-20-20 breaks across your connected MongoDB circle.
            </p>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1 tabular-nums">
                <span>Circle Progress Today</span>
                <span>
                  {teamTotalToday} / {teamTarget} Breaks ({teamPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E6E4FA] dark:bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${teamPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#48C78E] to-[#7C6FF6] transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-[#14162E] dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#7C6FF6]" />
              <span>Social Privacy Controls</span>
            </h3>

            <label className="flex items-center justify-between text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9] cursor-pointer">
              <span>Share my daily streak with friends</span>
              <input
                type="checkbox"
                checked={shareMyStreak}
                onChange={(e) => setShareMyStreak(e.target.checked)}
                className="accent-[#7C6FF6]"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9] cursor-pointer">
              <span>Display my Virtual Plant level on leaderboard</span>
              <input
                type="checkbox"
                checked={sharePlantLevel}
                onChange={(e) => setSharePlantLevel(e.target.checked)}
                className="accent-[#7C6FF6]"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}