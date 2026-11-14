// src/app/(marketing)/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { BlinkBreakLogo, MascotIllustration } from "@/components/ui/BrandPrimitives";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-[32px] max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        <div className="md:col-span-5 bg-gradient-to-b from-[#EBE8FF] to-[#DCE6FF] dark:from-[#1E203B] dark:to-[#171930] p-8 flex flex-col justify-between items-center text-center">
          <Link href="/" className="self-start">
            <BlinkBreakLogo size="sm" />
          </Link>
          <MascotIllustration variant="hero" className="w-52 h-52 my-4" />
          <p
            className="text-2xl font-bold text-[#3B3561] dark:text-[#D6CEFF]"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Welcome back! Ready for a cozy focus session? ♡
          </p>
        </div>

        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#14162E] dark:text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Sign in to BlinkBreak
          </h1>
          <p className="text-sm text-[#5B5E7B] dark:text-[#A3A6C9] mt-1">
            Access your real-time MongoDB 20-20-20 streaks, virtual plant, and routines.
          </p>

          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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

            <button
              type="submit"
              disabled={loading}
              className="pill-btn-primary w-full justify-center py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] mt-6 text-center">
            New here?{" "}
            <Link
              href="/register"
              className="font-bold text-[#14162E] dark:text-white underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}