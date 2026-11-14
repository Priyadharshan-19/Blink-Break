// src/app/(dashboard)/nature-break/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trees,
  Mountain,
  Waves,
  CloudRain,
  Flower2,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
} from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import { MascotIllustration } from "@/components/ui/BrandPrimitives";
import { useTimerStore } from "@/store/useTimerStore";

interface NatureScene {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  soundProfile: "rain" | "ocean" | "forest";
  quote: string;
}

const SCENES: NatureScene[] = [
  {
    id: "rainy-window",
    name: "Cozy Rainy Window",
    subtitle: "Soft raindrops on glass & warm lo-fi calm",
    icon: CloudRain,
    gradient: "from-[#2C3E50] via-[#4CA1AF] to-[#C4E0E5]",
    accentColor: "#63B3ED",
    soundProfile: "rain",
    quote: "Let your gaze drift past the raindrops into the distant skyline.",
  },
  {
    id: "forest",
    name: "Sunlit Bamboo Forest",
    subtitle: "Dappled emerald canopy & gentle breeze",
    icon: Trees,
    gradient: "from-[#134E5E] via-[#48B1BF] to-[#A8E063]",
    accentColor: "#48C78E",
    soundProfile: "forest",
    quote: "Natural green wavelengths are the most restful spectrum for tired eyes.",
  },
  {
    id: "mountains",
    name: "Lavender Alpine Mist",
    subtitle: "High-altitude horizon 20+ feet & beyond",
    icon: Mountain,
    gradient: "from-[#3B3561] via-[#7C6FF6] to-[#E2D9FF]",
    accentColor: "#9F7AEA",
    soundProfile: "forest",
    quote: "Trace the distant mountain ridges slowly from left to right.",
  },
  {
    id: "ocean",
    name: "Pastel Sunset Cove",
    subtitle: "Rhythmic shoreline waves & open horizon",
    icon: Waves,
    gradient: "from-[#2B5876] via-[#4E4376] to-[#FBD3E9]",
    accentColor: "#F687B3",
    soundProfile: "ocean",
    quote: "Match your breathing to the slow rise and fall of the tide.",
  },
  {
    id: "garden",
    name: "Spring Sakura Courtyard",
    subtitle: "Floating cherry blossoms & tranquil pond",
    icon: Flower2,
    gradient: "from-[#654EA3] via-[#EAAFC8] to-[#FFEEEE]",
    accentColor: "#F687B3",
    soundProfile: "forest",
    quote: "Softly watch the petals drift without locking your focus on any single point.",
  },
  {
    id: "meadow",
    name: "Starlight Evening Meadow",
    subtitle: "Low-glare twilight sanctuary for late coding",
    icon: Sparkles,
    gradient: "from-[#0F2027] via-[#203A43] to-[#2C5364]",
    accentColor: "#81E6D9",
    soundProfile: "rain",
    quote: "Give your retinas a break from bright white IDE and browser backgrounds.",
  },
];

export default function NatureBreakPage() {
  const [scene, setScene] = useState<NatureScene>(SCENES[0]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(45);
  const [fullscreen, setFullscreen] = useState(false);

  const { remainingSeconds, isRunning, triggerBreakNow } = useTimerStore();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopAmbientAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    }
    setAudioPlaying(false);
  };

  const startAmbientAudio = (profile: "rain" | "ocean" | "forest") => {
    stopAmbientAudio();
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate soothing filtered pink/brown noise for rain/ocean/breeze
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.25;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value =
        profile === "rain" ? 950 : profile === "ocean" ? 420 : 680;

      const masterGain = ctx.createGain();
      masterGain.gain.value = (volume / 100) * 0.35;
      gainNodeRef.current = masterGain;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      whiteNoise.start(0);
      setAudioPlaying(true);
    } catch {
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = (volume / 100) * 0.35;
    }
  }, [volume]);

  useEffect(() => {
    if (audioPlaying) {
      startAmbientAudio(scene.soundProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    return () => stopAmbientAudio();
  }, []);

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
      {!fullscreen && <TopHeader />}

      {/* Main Immersive Nature Stage */}
      <div
        className={`relative rounded-[36px] overflow-hidden shadow-2xl border-2 border-white/80 dark:border-white/15 transition-all duration-700 bg-gradient-to-br ${
          scene.gradient
        } ${fullscreen ? "fixed inset-4 z-50 flex flex-col justify-between p-8" : "min-h-[470px] p-6 sm:p-10 flex flex-col justify-between"}`}
      >
        {/* Subtle Animated SVG Scenery Overlay */}
        <svg
          viewBox="0 0 1200 500"
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
          preserveAspectRatio="none"
        >
          <circle cx="980" cy="110" r="65" fill="#FFFBEB" opacity="0.7" />
          <path
            d="M0 380 Q300 260 600 360 T1200 310 L1200 500 L0 500 Z"
            fill="rgba(255,255,255,0.22)"
          />
          <path
            d="M0 420 Q420 330 820 410 T1200 380 L1200 500 L0 500 Z"
            fill="rgba(20,22,46,0.28)"
          />
        </svg>

        {/* Top Stage Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E] animate-pulse" />
            <span className="text-xs font-extrabold text-[#14162E] dark:text-white">
              {scene.name}
            </span>
            <span className="text-xs text-[#5B5E7B] dark:text-[#A3A6C9] hidden sm:inline">
              • {scene.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Ambient Sound Mixer Pill */}
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-3">
              <button
                onClick={() =>
                  audioPlaying
                    ? stopAmbientAudio()
                    : startAmbientAudio(scene.soundProfile)
                }
                className="flex items-center gap-1.5 text-xs font-bold text-[#14162E] dark:text-white"
              >
                {audioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#48C78E]" />
                    <span>Ambient Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-[#5B5E7B]" />
                    <span>Play Ambient Audio</span>
                  </>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-[#7C6FF6] cursor-pointer"
              />
            </div>

            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#14162E] dark:text-white hover:scale-105 transition"
              title="Toggle Fullscreen Sanctuary"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Mascot & Mindful Distant Gaze Prompt */}
        <div className="relative z-10 my-8 flex flex-col items-center text-center max-w-xl mx-auto">
          <MascotIllustration variant="hero" className="w-44 h-44 drop-shadow-xl" />
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md mt-2"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {scene.quote}
          </h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="glass-card rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold text-[#14162E] dark:text-white">
              {isRunning
                ? `Next eye break in ${formatMMSS(remainingSeconds)}`
                : "Timer paused — enjoy the calm"}
            </div>
            <button
              onClick={triggerBreakNow}
              className="pill-btn-primary text-xs sm:text-sm px-5 py-2.5"
            >
              <Eye className="w-4 h-4" />
              <span>Start 20s Guided Gaze</span>
            </button>
          </div>
        </div>

        {/* Bottom Scene Switcher Dock */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SCENES.map((item) => {
            const Icon = item.icon;
            const active = scene.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScene(item)}
                className={`rounded-2xl p-3 text-left transition-all flex items-center gap-2.5 ${
                  active
                    ? "bg-white text-[#14162E] shadow-lg scale-[1.03]"
                    : "glass-card text-[#14162E] dark:text-white hover:bg-white/90"
                }`}
              >
                <Icon className="w-4 h-4 text-[#7C6FF6] flex-shrink-0" />
                <span className="text-xs font-bold truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}