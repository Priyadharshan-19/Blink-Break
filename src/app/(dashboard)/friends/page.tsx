// src/app/(dashboard)/friends/page.tsx
"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Flame,
  Trophy,
  Shield,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useTrackerStore } from "@/store/useTrackerStore";

interface FriendMember {
  id: string;
  name: string;
  role: string;
  streakDays: number;
  todayBreaks: number;
  dailyGoal: number;
  plantLevel: number;
}

const INITIAL_FRIENDS: FriendMember[] = [
  {
    id: "f1",
    name: "Aarav (Full-Stack Dev)",
    role: "Coding Mode",
    streakDays: 14,
    todayBreaks: 7,
    dailyGoal: 8,
    plantLevel: 3,
  },
  {
    id: "f2",
    name: "Meera (UI/UX Designer)",
    role: "Pomodoro Sync",
    streakDays: 11,
    todayBreaks: 6,
    dailyGoal: 8,
    plantLevel: 2,
  },
  {
    id: "f3",
    name: "Karthik (CSE Final Year)",
    role: "Study Mode",
    streakDays: 8,
    todayBreaks: 5,
    dailyGoal: 8,
    plantLevel: 2,
  },
];

export default function FriendsPage() {
  const { streakDays, dailyGoal, plantLevel, getTodayRecord } = useTrackerStore();
  const today = getTodayRecord();

  const [friends, setFriends] = useState<FriendMember[]>(INITIAL_FRIENDS);
  const [pendingRequests, setPendingRequests] = useState([
    { id: "req-1", name: "Divya (Frontend Engineer)", mutualStreak: 6 },
  ]);
  const [inviteInput, setInviteInput] = useState("");
  const [challengeJoined, setChallengeJoined] = useState(true);
  const [shareMyStreak, setShareMyStreak] = useState(true);
  const [sharePlantLevel, setSharePlantLevel] = useState(true);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    const newFriend: FriendMember = {
      id: `f-${Date.now()}`,
      name: inviteInput.trim(),
      role: "20-20-20 Companion",
      streakDays: 1,
      todayBreaks: 2,
      dailyGoal: 8,
      plantLevel: 1,
    };
    setFriends([newFriend, ...friends]);
    setInviteInput("");
  };

  const handleAcceptRequest = (req: { id: string; name: string; mutualStreak: number }) => {
    setFriends([
      ...friends,
      {
        id: req.id,
        name: req.name,
        role: "Study Mode",
        streakDays: req.mutualStreak,
        todayBreaks: 4,
        dailyGoal: 8,
        plantLevel: 2,
      },
    ]);
    setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Shared Streaks Leaderboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2
                  className="text-xl font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  <Users className="w-5 h-5 text-[#7C6FF6]" />
                  <span>Friends & Shared Streaks</span>
                </h2>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
                  Stay accountable with study buddies and developer teammates.
                </p>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-[#FFF0E5] text-[#FF8A4C] text-xs font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Your Streak: {streakDays}d
              </span>
            </div>

            {/* Add Friend Form */}
            <form onSubmit={handleAddFriend} className="flex items-center gap-2.5">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                placeholder="Add friend by name or @username..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm"
              />
              <button type="submit" className="pill-btn-primary text-xs px-5 py-2.5">
                <UserPlus className="w-4 h-4" />
                <span>Add Friend</span>
              </button>
            </form>

            {/* Current User Row + Friends Rows */}
            <div className="space-y-3">
              {/* You */}
              <div className="p-4 rounded-2xl bg-[#EBE8FF]/80 dark:bg-[#7C6FF6]/25 border border-[#7C6FF6]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7C6FF6] text-white font-extrabold text-sm flex items-center justify-center">
                    YOU
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                      You (Priyadharshan)
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

              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#63B3ED] to-[#7C6FF6] text-white font-bold text-sm flex items-center justify-center">
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#14162E] dark:text-white">
                        {friend.name}
                      </p>
                      <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
                        {friend.role} • Plant Lv. {friend.plantLevel} • Today: {friend.todayBreaks}/{friend.dailyGoal}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#FFF0E5] dark:bg-orange-500/20 text-xs font-extrabold text-[#FF8A4C] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {friend.streakDays} days
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Group Challenge, Friend Requests & Privacy Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weekly Group Challenge Card */}
          <div className="glass-card rounded-[28px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#E2F8EE] text-[#22543D] text-xs font-extrabold inline-flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Group Challenge
              </span>
              <span className="text-xs font-bold text-[#7C6FF6]">4 Participants</span>
            </div>

            <h3
              className="text-lg font-extrabold text-[#14162E] dark:text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              100 Team Eye Breaks This Week
            </h3>
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              Every completed 20-second break by you and your friends adds to the group milestone!
            </p>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Team Progress</span>
                <span>78 / 100 Breaks</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E6E4FA] dark:bg-white/10 overflow-hidden">
                <div className="w-[78%] h-full rounded-full bg-gradient-to-r from-[#48C78E] to-[#7C6FF6]" />
              </div>
            </div>

            <button
              onClick={() => setChallengeJoined(!challengeJoined)}
              className="w-full py-2.5 rounded-full bg-[#EBE8FF] dark:bg-[#7C6FF6]/30 text-xs font-extrabold text-[#14162E] dark:text-white flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C6FF6]" />
              <span>{challengeJoined ? "Joined Group Challenge ✓" : "Join Weekly Challenge"}</span>
            </button>
          </div>

          {/* Pending Friend Requests */}
          {pendingRequests.length > 0 && (
            <div className="glass-card rounded-[28px] p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-[#14162E] dark:text-white">
                Pending Friend Requests ({pendingRequests.length})
              </h3>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-extrabold text-[#14162E] dark:text-white">
                      {req.name}
                    </p>
                    <p className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
                      {req.mutualStreak}-day active streak
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="w-8 h-8 rounded-full bg-[#48C78E] text-white flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setPendingRequests(pendingRequests.filter((r) => r.id !== req.id))
                      }
                      className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Privacy Controls */}
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