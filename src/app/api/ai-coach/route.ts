// src/app/api/ai-coach/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      totalCompleted = 35,
      totalMissed = 8,
      streakDays = 12,
      focusMinutes = 950,
      preferredMode = "coding",
      dailyGoal = 8,
    } = body;

    const completionRate =
      totalCompleted + totalMissed > 0
        ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100)
        : 100;

    const systemPrompt = `You are BlinkBreak's friendly anime wellness & productivity coach.
Provide supportive, non-medical screen-break habit advice based on the 20-20-20 rule.
Never diagnose medical conditions. Return strictly valid JSON with keys:
"weeklySummary" (string),
"recommendedRoutine" (object with "name", "workMin", "breakSec", "reason"),
"habitTips" (array of 3 concise strings).`;

    const userPrompt = `User weekly stats:
- Completed 20-20-20 breaks: ${totalCompleted}
- Missed/Skipped breaks: ${totalMissed} (${completionRate}% completion rate)
- Current streak: ${streakDays} days
- Total focus time: ${Math.round(focusMinutes / 60)} hours
- Daily goal: ${dailyGoal} breaks/day
- Primary mode: ${preferredMode}`;

    // 1. Optional Live Gemini API call if GEMINI_API_KEY is configured in .env.local
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return NextResponse.json({
            source: "gemini-ai",
            ...JSON.parse(rawText),
          });
        }
      }
    }

    // 2. Built-in Intelligent Heuristic Fallback (works immediately with zero config)
    const fallbackResponse = {
      source: "blinkbreak-smart-engine",
      weeklySummary: `You completed ${totalCompleted} eye breaks across ${Math.round(
        focusMinutes / 60
      )} hours of screen focus (${completionRate}% consistency) and maintained a ${streakDays}-day streak! Your morning sessions show the highest completion rate.`,
      recommendedRoutine:
        completionRate < 75
          ? {
              name: "Gentle Developer Flow",
              workMin: 20,
              breakSec: 20,
              reason:
                "Shorter 20-minute sprints with 20-second distant gazes will help reduce afternoon break skipping.",
            }
          : {
              name: "Deep Code + Eye Sanctuary",
              workMin: 25,
              breakSec: 25,
              reason:
                "Your consistency is strong! A 25-minute block paired with 25-second Figure-8 eye relaxation maximizes both flow and comfort.",
            },
      habitTips: [
        "Pair every git commit or build compile with a quick 20-foot distant gaze out your window.",
        "Switch to the Cozy Rainy Window or Bamboo Forest scene during your 4th break of the day to reset mental fatigue.",
        `You are only ${Math.max(
          1,
          dailyGoal * 7 - totalCompleted
        )} breaks away from a 100% weekly goal badge—use a 5-minute snooze instead of skipping during intense debugging.`,
      ],
    };

    return NextResponse.json(fallbackResponse);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate wellness suggestions" },
      { status: 500 }
    );
  }
}