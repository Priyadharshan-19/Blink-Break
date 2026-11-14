"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { BlinkBreakLogo, MascotIllustration } from "@/components/ui/BrandPrimitives";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "blinkbreak-user",
      JSON.stringify({ name: email.split("@")[0] || "Alex", email })
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-[32px] max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Mascot Welcome Panel */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#EBE8FF] to-[#DCE6FF] dark:from-[#1E203B] dark:to-[#171930] p-8 flex flex-col justify-between items-center text-center">
          <Link href="/" className="self-start">
            <BlinkBreakLogo size="sm" />
          </Link>
          <MascotIllustration variant="hero" className="w-52 h-52 my-4" />
          <div>
            <p
              className="text-2xl font-bold text-[#3B3561] dark:text-[#D6CEFF]"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              Welcome back! Ready for a cozy focus session? ♡
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Sign in to BlinkBreak
          </h1>
          <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Sync your 20-20-20 streaks, virtual plant, and custom routines.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5E7B] dark:text-[#A3A6C9] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C6FF6] absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6FF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5E7B] dark:text-[#A3A6C9] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C6FF6] absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6FF6]"
                />
              </div>
            </div>

            <button type="submit" className="pill-btn-primary w-full justify-center py-3.5 mt-2">
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#DCD8F6]/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C6FF6] hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue in Instant Guest Mode</span>
            </Link>

            <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9]">
              New here?{" "}
              <Link href="/register" className="font-bold text-[#14162E] dark:text-white underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}