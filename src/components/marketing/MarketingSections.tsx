"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Clock,
  Eye,
  Sprout,
  ShieldCheck,
  Sparkles,
  Laptop,
  BellRing,
} from "lucide-react";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";

export function FeatureCardsStrip() {
  const cards = [
    {
      title: "Smart Reminders",
      desc: "Get gentle reminders based on the 20-20-20 rule.",
      href: "/dashboard",
      illustration: (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] flex items-center justify-center overflow-hidden flex-shrink-0">
          <MascotIllustration variant="chibi-laptop" className="w-16 h-16" />
        </div>
      ),
    },
    {
      title: "Grow Your Plant",
      desc: "Complete breaks and watch your plant grow.",
      href: "/plant",
      illustration: (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E6FFFA] to-[#C6F6D5] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <ellipse cx="32" cy="50" rx="18" ry="10" fill="rgba(255,255,255,0.85)" stroke="#9AE6B4" strokeWidth="2" />
            <ellipse cx="32" cy="52" rx="14" ry="6" fill="#68D391" opacity="0.4" />
            <path d="M32 50 L32 24" stroke="#38A169" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 34 C18 32, 16 18, 28 22 C31 23, 32 28, 32 34 Z" fill="#48BB78" />
            <path d="M32 30 C46 28, 48 14, 36 18 C33 19, 32 24, 32 30 Z" fill="#68D391" />
          </svg>
        </div>
      ),
    },
    {
      title: "Beautiful Analytics",
      desc: "Track your habits with insightful stats.",
      href: "/analytics",
      illustration: (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EBF4FF] to-[#E9D8FD] flex items-end justify-center gap-1.5 p-3 flex-shrink-0">
          <div className="w-2.5 h-6 rounded-full bg-[#68D391]" />
          <div className="w-2.5 h-9 rounded-full bg-[#B794F4]" />
          <div className="w-2.5 h-12 rounded-full bg-[#9F7AEA]" />
          <div className="w-2.5 h-14 rounded-full bg-[#7C6FF6]" />
        </div>
      ),
    },
    {
      title: "Unlock Achievements",
      desc: "Stay motivated with fun rewards.",
      href: "/achievements",
      illustration: (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FEFCBF] to-[#FBD38D] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <path d="M20 16 H44 V30 C44 38 38 44 32 44 C26 44 20 38 20 30 Z" fill="#F6AD55" />
            <path d="M26 44 H38 V50 H26 Z" fill="#DD6B20" />
            <rect x="22" y="50" width="20" height="5" rx="2.5" fill="#ED8936" />
            <polygon points="32,21 34,26 39,26 35,29 36.5,34 32,31 27.5,34 29,29 25,26 30,26" fill="#FFFBEB" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="glass-card rounded-3xl p-4 flex items-center gap-4 group hover:-translate-y-1 transition-all duration-200"
            >
              {card.illustration}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-extrabold text-[#14162E] dark:text-white group-hover:text-[#7C6FF6] transition-colors"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {card.title}
                </h3>
                <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EBE8FF] dark:bg-white/10 flex items-center justify-center text-[#14162E] dark:text-white group-hover:translate-x-0.5 transition">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Social Proof Footer Line from Reference Image 1 */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-[#5B5E7B] dark:text-[#A3A6C9]">
          <span className="hidden sm:block w-24 h-[1px] bg-[#DCD8F6] dark:bg-white/10" />
          <Heart className="w-4 h-4 text-[#7C6FF6]" />
          <span>Trusted by 100K+ students, developers and professionals</span>
          <Heart className="w-4 h-4 text-[#7C6FF6]" />
          <span className="hidden sm:block w-24 h-[1px] bg-[#DCD8F6] dark:bg-white/10" />
        </div>
      </div>
    </section>
  );
}

export function HowItWorksAndPreviewSection() {
  const steps = [
    {
      icon: Clock,
      badge: "Step 01",
      title: "20 Minutes of Focused Work",
      desc: "Start Study Mode, Coding Mode, or standard 20-20-20 tracking. Smart activity detection pauses your timer automatically if you step away.",
    },
    {
      icon: Eye,
      badge: "Step 02",
      title: "20 Seconds Looking 20 Feet Away",
      desc: "When your session finishes, your anime companion gently prompts a 20-second distant gaze or guided eye-relaxation exercise.",
    },
    {
      icon: Sprout,
      badge: "Step 03",
      title: "Grow Your Terrarium & Streaks",
      desc: "Every completed break waters your virtual plant, updates your weekly consistency chart, and unlocks new wellness milestones.",
    },
  ];

  return (
    <section id="screenshots" className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* HOW IT WORKS */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EBE8FF] dark:bg-white/10 text-[#7C6FF6]">
              The 20-20-20 Science
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#14162E] dark:text-white mt-3"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Healthy Screen Habits in 3 Effortless Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="glass-card rounded-3xl p-7 relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBE8FF] dark:bg-[#7C6FF6]/20 flex items-center justify-center text-[#7C6FF6]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-[#7C6FF6] bg-white/80 dark:bg-white/10 px-3 py-1 rounded-full">
                      {step.badge}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#14162E] dark:text-white"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE APPLICATION PREVIEW SHOWCASE (Inspired by Reference Image 2) */}
        <div id="about" className="glass-card rounded-[32px] p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C6FF6]">
                <Sparkles className="w-4 h-4" />
                <span>Inside the Workspace</span>
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white mt-1"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Designed to Feel Calm, Minimal, and Cozy
              </h2>
            </div>
            <Link href="/dashboard" className="pill-btn-primary text-sm">
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/70 dark:bg-white/5 p-5 border border-white/90 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7C6FF6] mb-2">
                <Laptop className="w-4 h-4" />
                <span>Desktop-First Modes</span>
              </div>
              <p className="text-base font-bold text-[#14162E] dark:text-white">
                Study, Coding & Pomodoro Sync
              </p>
              <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
                Switch between 20-20-20 eye breaks and 25-minute deep coding blocks without timer collisions.
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 dark:bg-white/5 p-5 border border-white/90 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38A169] mb-2">
                <BellRing className="w-4 h-4" />
                <span>Draggable Floating Widget</span>
              </div>
              <p className="text-base font-bold text-[#14162E] dark:text-white">
                Always Accessible, Never Intrusive
              </p>
              <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
                Keep your chibi companion and circular countdown visible anywhere inside the app.
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 dark:bg-white/5 p-5 border border-white/90 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5A67D8] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Privacy-First Tracking</span>
              </div>
              <p className="text-base font-bold text-[#14162E] dark:text-white">
                Smart Idle Detection
              </p>
              <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
                Automatically pauses when you step away from your desk—never logs keystrokes or personal content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is BlinkBreak?",
      a: "BlinkBreak is a desktop-first web application designed for students, software developers, and remote workers to reduce digital eye strain through smart 20-20-20 reminders, guided eye/posture breaks, a virtual terrarium plant, and habit analytics.",
    },
    {
      q: "What is the 20-20-20 rule?",
      a: "Every 20 minutes spent looking at a screen, look at an object approximately 20 feet (6 meters) away for at least 20 seconds. This allows your ciliary eye muscles to relax and helps restore natural blinking patterns.",
    },
    {
      q: "How do reminders work inside a web browser?",
      a: "BlinkBreak uses a timestamp-accurate timer engine paired with a Web Worker so background tab throttling never slows down your countdown. When a break is due, you receive both an in-app anime companion pop-up and a native desktop browser notification with a soft audio chime.",
    },
    {
      q: "Can I customize my timer and combine it with Pomodoro?",
      a: "Yes! You can customize work duration, break duration, long-break intervals, and snooze length—or activate Study Mode, Coding Mode, and Pomodoro Mode where 20-second eye breaks harmonize with 25-minute focus blocks.",
    },
    {
      q: "Is my data private?",
      a: "Absolutely. All MVP break logs and preferences are stored locally in your browser first, with optional cloud sync. Our smart activity detector only checks whether mouse/keyboard activity occurred to pause idle timers—it never records what you type.",
    },
  ];

  return (
    <section id="faq" className="py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EBE8FF] dark:bg-white/10 text-[#7C6FF6]">
            Got Questions?
          </span>
          <h2
            className="text-3xl font-extrabold text-[#14162E] dark:text-white mt-3"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-[#14162E] dark:text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7C6FF6] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#5B5E7B] dark:text-[#A3A6C9] leading-relaxed border-t border-white/60 dark:border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}