"use client";

import React, { useState } from "react";

export function BlinkBreakLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSizes = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-11 h-11" }[size];
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }[size];

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      <div className={`relative ${iconSizes} flex items-center justify-center`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          {/* Outer Eye Shape */}
          <path
            d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24C44 24 36 38 24 38C12 38 4 24 4 24Z"
            stroke="url(#eyeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(124, 111, 246, 0.12)"
          />
          {/* Iris */}
          <circle cx="24" cy="24" r="8" fill="url(#irisGrad)" />
          {/* Pupil & Anime Eye Highlight */}
          <circle cx="24" cy="24" r="3.8" fill="#14162E" />
          <circle cx="21.5" cy="21.5" r="2.2" fill="#FFFFFF" />
          <circle cx="26.5" cy="26.5" r="1.1" fill="#FFFFFF" />
          {/* Sparkles */}
          <path
            d="M39 7L40.2 10.3L43.5 11.5L40.2 12.7L39 16L37.8 12.7L34.5 11.5L37.8 10.3L39 7Z"
            fill="#7C6FF6"
          />
          <path
            d="M9 34L9.8 36.2L12 37L9.8 37.8L9 40L8.2 37.8L6 37L8.2 36.2L9 34Z"
            fill="#68D391"
          />
          <defs>
            <linearGradient id="eyeGrad" x1="4" y1="10" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5A67D8" />
              <stop offset="1" stopColor="#805AD5" />
            </linearGradient>
            <linearGradient id="irisGrad" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#63B3ED" />
              <stop offset="1" stopColor="#7C6FF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span
        className={`font-extrabold tracking-tight text-[#14162E] dark:text-white ${textSizes}`}
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        BlinkBreak
      </span>
    </div>
  );
}

export function CircularCountdownRing({
  progress = 0.72,
  timeLabel = "14:32",
  subLabel = "Until next break",
  size = 148,
}: {
  progress?: number;
  timeLabel?: string;
  subLabel?: string;
  size?: number;
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#E6E4FA] dark:text-[#2A2D4A]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#mintRingGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="mintRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#56D89A" />
            <stop offset="100%" stopColor="#7C6FF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span
          className="text-3xl font-extrabold tracking-tight text-[#14162E] dark:text-white"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {timeLabel}
        </span>
        {subLabel && (
          <span className="text-[11px] font-medium text-[#5B5E7B] dark:text-[#A3A6C9] mt-0.5">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export function MascotIllustration({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "chibi-break" | "chibi-laptop" | "chibi-peek" | "sleeping-cat";
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const srcMap = {
    hero: "/assets/mascot/hero-main.webp",
    "chibi-break": "/assets/mascot/chibi-break.svg",
    "chibi-laptop": "/assets/mascot/chibi-peek.svg",
    "chibi-peek": "/assets/mascot/chibi-peek.svg",
    "sleeping-cat": "/assets/mascot/cat-sleeping.svg",
  };

  if (!imgError) {
    return (
      <img
        src={srcMap[variant]}
        alt={`BlinkBreak Mascot - ${variant}`}
        onError={() => setImgError(true)}
        className={`object-contain select-none ${className}`}
      />
    );
  }

  // Rich SVG Anime Mascot & Cat Companion Fallback (matches Reference Images 1 & 2 out of the box)
  if (variant === "sleeping-cat") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 140 90" className="w-28 h-20 drop-shadow-sm">
          <ellipse cx="70" cy="74" rx="52" ry="10" fill="rgba(124,111,246,0.12)" />
          {/* Sleeping Grey & White Cat */}
          <path d="M35 65 C30 42, 105 42, 108 65 Z" fill="#8C8FA6" />
          <path d="M44 65 C45 50, 92 50, 96 65 Z" fill="#FFFFFF" />
          {/* Cat Ears */}
          <polygon points="38,52 32,34 50,44" fill="#8C8FA6" />
          <polygon points="36,48 34,38 46,44" fill="#FBB6CE" />
          <polygon points="82,44 96,34 92,52" fill="#8C8FA6" />
          <polygon points="84,44 93,38 90,48" fill="#FBB6CE" />
          {/* Sleeping Eyes & Whiskers */}
          <path d="M52 56 Q57 60 62 56" stroke="#2D3748" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M72 56 Q77 60 82 56" stroke="#2D3748" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="48" cy="59" rx="3.5" ry="2" fill="#FBB6CE" opacity="0.7" />
          <ellipse cx="86" cy="59" rx="3.5" ry="2" fill="#FBB6CE" opacity="0.7" />
          <path d="M65 59 Q67 62 69 59" stroke="#F687B3" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Paws */}
          <ellipse cx="48" cy="66" rx="7" ry="4.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="86" cy="66" rx="7" ry="4.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 420 400" className="w-full h-full max-h-[420px] drop-shadow-md">
        <defs>
          <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E9E4FF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#DCE6FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D6CEFF" />
            <stop offset="100%" stopColor="#B8A9F8" />
          </linearGradient>
        </defs>
        {/* Soft Sunlit Window & Aura Backdrop */}
        <circle cx="210" cy="200" r="185" fill="url(#auraGrad)" />
        {/* Anime Girl Long Brown Hair Back */}
        <path
          d="M115 160 C85 220, 75 300, 105 345 C140 365, 290 365, 315 340 C340 290, 325 210, 295 155 Z"
          fill="#43334C"
        />
        {/* Pastel Lavender Hoodie */}
        <path
          d="M115 265 C125 230, 295 230, 305 265 L325 355 C260 370, 160 370, 95 355 Z"
          fill="url(#hoodieGrad)"
        />
        {/* White Cat-Ear Headphones Band */}
        <path
          d="M122 175 C120 88, 300 88, 298 175"
          stroke="#F8FAFC"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        {/* Face */}
        <ellipse cx="210" cy="190" rx="68" ry="64" fill="#FFF2EC" />
        {/* Front Bangs */}
        <path
          d="M140 165 C155 110, 265 110, 280 165 C265 140, 245 175, 210 150 C180 175, 160 140, 140 165 Z"
          fill="#4A3954"
        />
        {/* Happy Closed Anime Eyes & Blush */}
        <path d="M168 188 Q182 174 196 188" stroke="#3B2B42" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M224 188 Q238 174 252 188" stroke="#3B2B42" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="168" cy="202" rx="12" ry="6" fill="#FF9EB5" opacity="0.55" />
        <ellipse cx="252" cy="202" rx="12" ry="6" fill="#FF9EB5" opacity="0.55" />
        {/* Warm Smile */}
        <path d="M196 206 Q210 224 224 206 Z" fill="#FF85A1" />
        {/* Left & Right Headphone Cups with Cat Icon */}
        <ellipse cx="122" cy="192" rx="22" ry="30" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
        <ellipse cx="298" cy="192" rx="22" ry="30" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="298" cy="192" r="10" fill="#E9D8FD" />
        {/* Sleeping Grey & White Companion Cat in Foreground */}
        <g transform="translate(135, 285)">
          <path d="M15 65 C10 25, 135 25, 140 65 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M25 45 C40 25, 110 25, 125 45 C100 38, 55 38, 25 45 Z" fill="#8C8FA6" />
          <polygon points="32,38 24,14 48,28" fill="#8C8FA6" />
          <polygon points="108,28 132,14 124,38" fill="#8C8FA6" />
          <path d="M52 50 Q60 56 68 50" stroke="#2D3748" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M88 50 Q96 56 104 50" stroke="#2D3748" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="45" cy="54" rx="5" ry="3" fill="#FBB6CE" opacity="0.75" />
          <ellipse cx="111" cy="54" rx="5" ry="3" fill="#FBB6CE" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}