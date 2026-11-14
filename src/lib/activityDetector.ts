// src/lib/activityDetector.ts
"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTimerStore } from "@/store/useTimerStore";

export function usePrivacyActivityDetector() {
  const { idleDetectionEnabled, idleThresholdSeconds } = useSettingsStore();
  const { setIdlePaused, isIdlePaused } = useTimerStore();
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (!idleDetectionEnabled || typeof window === "undefined") {
      setIdlePaused(false);
      return;
    }

    let lastActiveTime = Date.now();

    // Privacy-first: We NEVER read event.key or input values—only the timestamp of interaction
    const markActivity = () => {
      lastActiveTime = Date.now();
      setIdleSeconds(0);
      if (useTimerStore.getState().isIdlePaused) {
        setIdlePaused(false);
      }
    };

    const handleVisibility = () => {
      const visible = document.visibilityState === "visible";
      setTabVisible(visible);
      if (visible) markActivity();
    };

    window.addEventListener("mousemove", markActivity, { passive: true });
    window.addEventListener("mousedown", markActivity, { passive: true });
    window.addEventListener("keydown", markActivity, { passive: true });
    window.addEventListener("scroll", markActivity, { passive: true });
    window.addEventListener("touchstart", markActivity, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    const checkInterval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActiveTime) / 1000);
      setIdleSeconds(elapsedSec);

      if (elapsedSec >= idleThresholdSeconds) {
        setIdlePaused(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", markActivity);
      window.removeEventListener("mousedown", markActivity);
      window.removeEventListener("keydown", markActivity);
      window.removeEventListener("scroll", markActivity);
      window.removeEventListener("touchstart", markActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(checkInterval);
    };
  }, [idleDetectionEnabled, idleThresholdSeconds, setIdlePaused]);

  return { idleSeconds, isIdlePaused, tabVisible, idleDetectionEnabled };
}