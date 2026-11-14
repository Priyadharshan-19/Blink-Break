// src/components/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  HeartHandshake,
  Sprout,
  BarChart3,
  Trophy,
  Settings,
  Trees,
  Users,
  Sliders,
} from "lucide-react";
import { BlinkBreakLogo, MascotIllustration } from "@/components/ui/BrandPrimitives";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Timer", href: "/timer", icon: Clock },
  { label: "Break Activities", href: "/break-activities", icon: HeartHandshake },
  { label: "Nature Break", href: "/nature-break", icon: Trees },
  { label: "Plant", href: "/plant", icon: Sprout },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Routines", href: "/routines", icon: Sliders },
  { label: "Friends", href: "/friends", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col justify-between glass-card m-4 mr-0 rounded-[32px] p-5 select-none">
      {/* Top Logo & Navigation Links */}
      <div>
        <div className="px-3 pt-2 pb-6 flex items-center justify-center">
          <Link href="/dashboard">
            <BlinkBreakLogo size="md" />
          </Link>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#DED9FF] dark:bg-[#7C6FF6]/30 text-[#14162E] dark:text-white shadow-sm"
                    : "text-[#5B5E7B] dark:text-[#A3A6C9] hover:bg-white/60 dark:hover:bg-white/5 hover:text-[#14162E] dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#5A52D5] dark:text-[#BEB4FF]" : ""
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sleeping Cat Companion Footer (Matches Reference Image 2) */}
      <div className="pt-4 mt-4 border-t border-white/70 dark:border-white/10 flex flex-col items-center text-center">
        <MascotIllustration variant="sleeping-cat" className="w-28 h-20" />
        <p className="text-xs font-semibold text-[#4A4E6D] dark:text-[#B8BBE0] mt-1">
          Take a break...
        </p>
        <p className="text-[11px] text-[#5B5E7B] dark:text-[#A3A6C9]">
          Your eyes will thank you! ♡
        </p>
        <span className="mt-3 px-3.5 py-1 rounded-full bg-[#EBE8FF] dark:bg-white/10 text-[11px] font-bold text-[#5B5E7B] dark:text-[#A3A6C9]">
          v1.0.0
        </span>
      </div>
    </aside>
  );
}