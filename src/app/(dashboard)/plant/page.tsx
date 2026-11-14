// src/app/(dashboard)/plant/page.tsx
"use client";

import React, { useState } from "react";
import {
  Sprout,
  Droplets,
  Sparkles,
  Award,
  Check,
  Heart,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { useTrackerStore, PlantVariety } from "@/store/useTrackerStore";
import { playGentleChime } from "@/lib/notifications";

const VARIETIES: {
  id: PlantVariety;
  name: string;
  unlockLevel: number;
  desc: string;
  leafColor: string;
}[] = [
  {
    id: "sprout",
    name: "Luna Sprout",
    unlockLevel: 1,
    desc: "A resilient emerald glass-bowl sprout that thrives on 20-second eye breaks.",
    leafColor: "#48BB78",
  },
  {
    id: "succulent",
    name: "Cozy Pastel Echeveria",
    unlockLevel: 2,
    desc: "Soft mint-and-lavender rosette leaves that store focus energy.",
    leafColor: "#38B2AC",
  },
  {
    id: "bonsai",
    name: "Sakura Desk Bonsai",
    unlockLevel: 3,
    desc: "Delicate pink blossoms that bloom as your weekly break consistency grows.",
    leafColor: "#F687B3",
  },
  {
    id: "monstera",
    name: "Starlight Monstera",
    unlockLevel: 4,
    desc: "Iconic fenestrated leaves for master developers and study champions.",
    leafColor: "#2F855A",
  },
];

export default function VirtualPlantPage() {
  const {
    plantLevel,
    plantXp,
    plantName,
    plantVariety,
    waterDrops,
    totalWaterings,
    lastWateredAt,
    waterPlant,
    setPlantVariety,
  } = useTrackerStore();

  const [isWateringAnim, setIsWateringAnim] = useState(false);
  const [customNameInput, setCustomNameInput] = useState(plantName);
  const [nameSaved, setNameSaved] = useState(false);

  const handleWater = () => {
    if (waterDrops <= 0) return;
    setIsWateringAnim(true);
    playGentleChime("break-complete");
    waterPlant();
    setTimeout(() => setIsWateringAnim(false), 1200);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setPlantVariety(plantVariety, customNameInput);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const stageNames = [
    "Dewdrop Seed",
    "Twin-Leaf Sprout",
    "Lush Terrarium Stem",
    "Budding Sanctuary",
    "Radiant Celestial Bloom",
  ];
  const currentStageName =
    stageNames[Math.min(stageNames.length - 1, Math.max(0, plantLevel - 1))];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      <TopHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Interactive Terrarium Stage (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-[#E2F8EE] dark:bg-emerald-500/20 text-[#38A169] text-xs font-extrabold">
                Level {plantLevel} • {currentStageName}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white mt-2"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {plantName} 🌱
              </h2>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EBF4FF] dark:bg-blue-500/20 text-[#3182CE] font-extrabold text-sm">
              <Droplets className="w-4 h-4 fill-current" />
              <span>{waterDrops} Water Drops Available</span>
            </div>
          </div>

          {/* Center Animated Terrarium Bowl */}
          <div className="my-8 py-8 rounded-3xl bg-gradient-to-b from-[#E6FFFA]/80 via-[#F0FFF4]/90 to-[#C6F6D5]/70 dark:from-[#132A2E] dark:to-[#162436] border border-white dark:border-white/10 flex flex-col items-center justify-center relative">
            {/* Falling Water Droplets Animation */}
            {isWateringAnim && (
              <div className="absolute top-6 flex items-center gap-6 animate-bounce text-[#3182CE]">
                <Droplets className="w-6 h-6 fill-current" />
                <Sparkles className="w-6 h-6 text-[#48C78E]" />
                <Droplets className="w-6 h-6 fill-current" />
              </div>
            )}

            <svg viewBox="0 0 180 180" className="w-56 h-56 drop-shadow-md">
              {/* Glass Terrarium Sphere Base */}
              <ellipse
                cx="90"
                cy="145"
                rx="58"
                ry="24"
                fill="rgba(255,255,255,0.88)"
                stroke="#9AE6B4"
                strokeWidth="4"
              />
              {/* Rich Soil Layer */}
              <ellipse cx="90" cy="148" rx="48" ry="15" fill="#5A4638" />
              <ellipse cx="90" cy="144" rx="44" ry="9" fill="#68D391" opacity="0.45" />

              {/* Main Stem scales with plantLevel */}
              <path
                d={`M90 144 Q88 ${Math.max(45, 115 - plantLevel * 12)} 90 ${Math.max(
                  35,
                  105 - plantLevel * 14
                )}`}
                stroke="#2F855A"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Stage 1+ Lower Leaves */}
              <path
                d="M90 112 C55 108, 48 75, 76 84 C84 86, 88 98, 90 112 Z"
                fill={plantVariety === "bonsai" ? "#F687B3" : "#48BB78"}
              />
              <path
                d="M90 104 C125 100, 132 68, 104 76 C96 78, 92 90, 90 104 Z"
                fill={plantVariety === "bonsai" ? "#FBB6CE" : "#68D391"}
              />

              {/* Stage 2+ Mid Foliage */}
              {plantLevel >= 2 && (
                <>
                  <path
                    d="M90 86 C58 78, 55 48, 80 58 C86 60, 89 74, 90 86 Z"
                    fill={plantVariety === "bonsai" ? "#F687B3" : "#38A169"}
                  />
                  <path
                    d="M90 78 C122 70, 125 42, 100 52 C94 54, 91 66, 90 78 Z"
                    fill={plantVariety === "bonsai" ? "#FED7E2" : "#48BB78"}
                  />
                </>
              )}

              {/* Stage 3+ Crown Blossom / Radiant Flower */}
              {plantLevel >= 3 && (
                <g transform="translate(90, 46)">
                  <circle cx="0" cy="-10" r="9" fill="#F687B3" />
                  <circle cx="10" cy="0" r="9" fill="#FBB6CE" />
                  <circle cx="0" cy="10" r="9" fill="#F687B3" />
                  <circle cx="-10" cy="0" r="9" fill="#FBB6CE" />
                  <circle cx="0" cy="0" r="6" fill="#F6E05E" />
                </g>
              )}
            </svg>

            {/* XP Progress Bar */}
            <div className="w-full max-w-md px-6 mt-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#14162E] dark:text-white mb-1.5">
                <span>Growth Progress to Lv. {plantLevel + 1}</span>
                <span>{plantXp} / 100 XP</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-white dark:bg-white/10 overflow-hidden p-0.5 shadow-inner">
                <div
                  style={{ width: `${plantXp}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#48C78E] to-[#7C6FF6] transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Watering Action & Stats Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              <p className="font-bold text-[#14162E] dark:text-white">
                Total Waterings: {totalWaterings} times
              </p>
              <p>
                {lastWateredAt
                  ? `Last watered at ${lastWateredAt}`
                  : "Complete a 20-20-20 break to earn +1 Water Drop!"}
              </p>
            </div>

            <button
              onClick={handleWater}
              disabled={waterDrops <= 0}
              className={`pill-btn-primary text-xs sm:text-sm px-7 py-3.5 ${
                waterDrops <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Droplets className="w-4 h-4 fill-current" />
              <span>
                {waterDrops > 0
                  ? "Water Your Plant (+25 XP)"
                  : "Complete a Break for Water Drops"}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Plant Varieties & Customization (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rename Companion Card */}
          <form onSubmit={handleSaveName} className="glass-card rounded-[28px] p-6 space-y-3">
            <h3
              className="text-base font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <Heart className="w-4 h-4 text-[#7C6FF6]" />
              <span>Name Your Terrarium Companion</span>
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                maxLength={24}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-[#14162E] dark:bg-[#7C6FF6] text-white text-xs font-bold"
              >
                {nameSaved ? <Check className="w-4 h-4" /> : "Save"}
              </button>
            </div>
          </form>

          {/* Botanical Varieties Selector */}
          <div className="glass-card rounded-[28px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-extrabold text-[#14162E] dark:text-white flex items-center gap-2"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <Sprout className="w-4 h-4 text-[#38A169]" />
                <span>Botanical Varieties</span>
              </h3>
              <span className="text-xs font-bold text-[#7C6FF6]">
                Unlock by leveling up
              </span>
            </div>

            <div className="space-y-3">
              {VARIETIES.map((v) => {
                const unlocked = plantLevel >= v.unlockLevel;
                const active = plantVariety === v.id;
                return (
                  <button
                    key={v.id}
                    disabled={!unlocked}
                    onClick={() => setPlantVariety(v.id, v.name)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      active
                        ? "bg-[#EBE8FF]/90 dark:bg-[#7C6FF6]/30 border-[#7C6FF6]"
                        : unlocked
                        ? "bg-white/70 dark:bg-white/5 border-white dark:border-white/10 hover:bg-white"
                        : "bg-white/30 dark:bg-white/5 border-transparent opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: v.leafColor }}
                        />
                        <span className="text-sm font-extrabold text-[#14162E] dark:text-white">
                          {v.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
                        {v.desc}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white dark:bg-white/10 text-[#14162E] dark:text-white flex-shrink-0">
                      {active ? "Active" : unlocked ? "Select" : `Lv. ${v.unlockLevel}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}