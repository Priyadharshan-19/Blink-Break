"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import { BlinkBreakLogo, MascotIllustration } from "@/components/ui/BrandPrimitives";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("blinkbreak-user", JSON.stringify({ name: name || "Alex", email }));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-[32px] max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        <div className="md:col-span-5 bg-gradient-to-b from-[#EBE8FF] to-[#E2F5EA] dark:from-[#1E203B] dark:to-[#172A2A] p-8 flex flex-col justify-between items-center text-center">
          <Link href="/" className="self-start">
            <BlinkBreakLogo size="sm" />
          </Link>
          <MascotIllustration variant="hero" className="w-52 h-52 my-4" />
          <p
            className="text-2xl font-bold text-[#3B3561] dark:text-[#D6CEFF]"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Let’s plant your first virtual sprout and protect your eyes! 🌱
          </p>
        </div>

        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Create Your BlinkBreak Account
          </h1>
          <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Start with our recommended 20-20-20 timer or customize your routine.
          </p>

          <form onSubmit={handleRegister} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5E7B] dark:text-[#A3A6C9] mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7C6FF6] absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priyadharshan"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6FF6]"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCD8F6] dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6FF6]"
                />
              </div>
            </div>

            <button type="submit" className="pill-btn-primary w-full justify-center py-3.5 mt-2">
              <span>Start Using BlinkBreak</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-5 text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#14162E] dark:text-white underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}