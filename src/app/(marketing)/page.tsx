"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { BlinkBreakLogo } from "@/components/ui/BrandPrimitives";
import HeroSection from "@/components/marketing/HeroSection";
import {
  FeatureCardsStrip,
  HowItWorksAndPreviewSection,
  FaqSection,
} from "@/components/marketing/MarketingSections";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function MarketingLandingPage() {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* PUBLIC NAVBAR (Follows Reference Image 1) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F6F5FF]/75 dark:bg-[#111222]/80 border-b border-white/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/">
            <BlinkBreakLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-[#2B2E4A] dark:text-[#D5D7F2]">
            <a href="#features" className="hover:text-[#7C6FF6] transition-colors">
              Features
            </a>
            <a href="#screenshots" className="hover:text-[#7C6FF6] transition-colors">
              Screenshots
            </a>
            <a href="#about" className="hover:text-[#7C6FF6] transition-colors">
              About
            </a>
            <a href="#faq" className="hover:text-[#7C6FF6] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#14162E] dark:text-white hover:scale-105 transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-[#2B2E4A] dark:text-[#D5D7F2] hover:text-[#7C6FF6] px-3 py-2"
            >
              Sign In
            </Link>

            <Link href="/register" className="pill-btn-primary text-sm px-5 py-2.5">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN MARKETING CONTENT */}
      <main className="flex-1">
        <HeroSection />
        <FeatureCardsStrip />
        <HowItWorksAndPreviewSection />
        <FaqSection />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/80 dark:border-white/10 bg-white/40 dark:bg-[#0D0E1B]/60 backdrop-blur-md py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <BlinkBreakLogo size="sm" />
            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              Friendly 20-20-20 eye-care companion for students & developers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#5B5E7B] dark:text-[#A3A6C9]">
            <a href="#features" className="hover:text-[#7C6FF6]">Features</a>
            <a href="#about" className="hover:text-[#7C6FF6]">About</a>
            <a href="#faq" className="hover:text-[#7C6FF6]">FAQ</a>
            <Link href="/dashboard" className="hover:text-[#7C6FF6]">Guest Mode</Link>
            <a href="#privacy" className="hover:text-[#7C6FF6]">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#7C6FF6]">Terms</a>
          </div>

          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
            © {new Date().getFullYear()} BlinkBreak. Take Breaks. Take Care.
          </p>
        </div>
      </footer>
    </div>
  );
}