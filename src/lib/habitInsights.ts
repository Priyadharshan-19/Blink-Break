// src/lib/habitInsights.ts
import { DayRecord } from "@/store/useTrackerStore";

export interface HabitInsight {
  id: string;
  type: "positive" | "suggestion" | "milestone";
  title: string;
  detail: string;
  metricBadge: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: "Streaks" | "Breaks" | "Focus" | "Botany";
  points: number;
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
  iconName: "sparkles" | "flame" | "trophy" | "sprout" | "code" | "shield";
}

export function generatePersonalizedInsights(
  week: DayRecord[],
  dailyGoal: number,
  streakDays: number,
  plantLevel: number
): HabitInsight[] {
  const totalCompleted = week.reduce((acc, d) => acc + d.completed, 0);
  const totalMissed = week.reduce((acc, d) => acc + d.missed, 0);
  const totalSkipped = week.reduce((acc, d) => acc + d.skipped, 0);
  const totalFocusMins = week.reduce((acc, d) => acc + d.focusMinutes, 0);
  const completionRate =
    totalCompleted + totalMissed > 0
      ? Math.round((totalCompleted / (totalCompleted + totalMissed)) * 100)
      : 100;

  const bestDay = [...week].sort((a, b) => b.completed - a.completed)[0];
  const insights: HabitInsight[] = [];

  if (completionRate >= 75) {
    insights.push({
      id: "high-consistency",
      type: "positive",
      title: "Strong Weekly Eye-Care Rhythm",
      detail: `You completed ${completionRate}% of your scheduled 20-20-20 breaks this week, with ${
        bestDay?.dayLabel || "Wednesday"
      } as your most consistent day (${bestDay?.completed || 6} breaks).`,
      metricBadge: `${completionRate}% Rate`,
    });
  } else {
    insights.push({
      id: "improve-consistency",
      type: "suggestion",
      title: "Try Shorter Focus Blocks",
      detail: `You missed or skipped ${totalMissed} breaks during longer sessions. Switching to 20-minute standard intervals or enabling Gentle Chimes can boost consistency.`,
      metricBadge: `${totalMissed} Missed`,
    });
  }

  if (streakDays >= 5) {
    insights.push({
      id: "streak-momentum",
      type: "milestone",
      title: `${streakDays}-Day Screen Wellness Streak!`,
      detail: `Your daily consistency has grown your virtual companion to Level ${plantLevel}. Keep completing at least ${Math.ceil(
        dailyGoal / 2
      )} breaks a day to protect your streak.`,
      metricBadge: `${streakDays}d Streak`,
    });
  }

  if (totalSkipped > 2) {
    insights.push({
      id: "skip-pattern",
      type: "suggestion",
      title: "Snooze Instead of Skipping",
      detail: `You skipped ${totalSkipped} breaks recently. When deep in code, hit the 5-minute Snooze button so your eyes still get a rest right after your commit.`,
      metricBadge: "Habit Tip",
    });
  } else {
    insights.push({
      id: "deep-work-balance",
      type: "positive",
      title: "Balanced Deep Work & Recovery",
      detail: `Across ${Math.round(
        totalFocusMins / 60
      )} hours of screen focus this week, you gave your eyes ${Math.round(
        (totalCompleted * 20) / 60
      )} minutes of distant-gaze recovery.`,
      metricBadge: `${totalCompleted} Breaks`,
    });
  }

  return insights;
}

export function evaluateAchievements(
  week: DayRecord[],
  streakDays: number,
  plantLevel: number,
  totalWaterings: number,
  dailyGoal: number
): AchievementBadge[] {
  const totalCompleted = week.reduce((acc, d) => acc + d.completed, 0);
  const totalCoding = week.reduce((acc, d) => acc + (d.codingSessions || 0), 0);
  const todayCompleted = week[week.length - 1]?.completed || 0;
  const daysMetGoal = week.filter((d) => d.completed >= dailyGoal).length;

  return [
    {
      id: "first-break",
      title: "First Blink",
      description: "Complete your very first 20-second 20-20-20 eye break.",
      category: "Breaks",
      points: 50,
      currentValue: Math.min(1, totalCompleted),
      targetValue: 1,
      unlocked: totalCompleted >= 1,
      iconName: "sparkles",
    },
    {
      id: "break-beginner",
      title: "Break Beginner",
      description: "Complete 10 total eye breaks to establish your baseline habit.",
      category: "Breaks",
      points: 100,
      currentValue: Math.min(10, totalCompleted),
      targetValue: 10,
      unlocked: totalCompleted >= 10,
      iconName: "shield",
    },
    {
      id: "five-day-streak",
      title: "Five-Day Streak",
      description: "Maintain an active BlinkBreak wellness streak for 5 consecutive days.",
      category: "Streaks",
      points: 150,
      currentValue: Math.min(5, streakDays),
      targetValue: 5,
      unlocked: streakDays >= 5,
      iconName: "flame",
    },
    {
      id: "consistency-champion",
      title: "Consistency Champion",
      description: "Maintain a 10+ day eye-care streak without missing a day.",
      category: "Streaks",
      points: 300,
      currentValue: Math.min(10, streakDays),
      targetValue: 10,
      unlocked: streakDays >= 10,
      iconName: "trophy",
    },
    {
      id: "weekly-wellness-goal",
      title: "Weekly Wellness Goal",
      description: "Complete at least 30 breaks across a single 7-day week.",
      category: "Breaks",
      points: 250,
      currentValue: Math.min(30, totalCompleted),
      targetValue: 30,
      unlocked: totalCompleted >= 30,
      iconName: "trophy",
    },
    {
      id: "focus-master",
      title: "Focus Master",
      description: "Complete 5 protected Coding Mode sessions with 20-20-20 reminders.",
      category: "Focus",
      points: 200,
      currentValue: Math.min(5, totalCoding),
      targetValue: 5,
      unlocked: totalCoding >= 5,
      iconName: "code",
    },
    {
      id: "botanical-caretaker",
      title: "Botanical Caretaker",
      description: "Grow your virtual terrarium plant to Level 3 and water it 10 times.",
      category: "Botany",
      points: 250,
      currentValue: Math.min(10, totalWaterings),
      targetValue: 10,
      unlocked: plantLevel >= 3 && totalWaterings >= 10,
      iconName: "sprout",
    },
    {
      id: "daily-goal-crusher",
      title: "Daily Goal Crusher",
      description: `Hit your full daily break goal (${dailyGoal} breaks) on 3 days of the week.`,
      category: "Breaks",
      points: 200,
      currentValue: Math.min(3, Math.max(daysMetGoal, todayCompleted >= dailyGoal ? 1 : 0)),
      targetValue: 3,
      unlocked: daysMetGoal >= 3,
      iconName: "sparkles",
    },
  ];
}

export function convertHistoryToCSV(records: DayRecord[]): string {
  const headers = [
    "Date",
    "Day",
    "CompletedBreaks",
    "MissedBreaks",
    "SkippedBreaks",
    "SnoozedBreaks",
    "FocusMinutes",
    "BreakSeconds",
    "StudySessions",
    "CodingSessions",
    "PomodoroCycles",
  ];
  const rows = records.map((r) =>
    [
      r.date,
      r.dayLabel,
      r.completed,
      r.missed,
      r.skipped,
      r.snoozed,
      r.focusMinutes,
      r.breakSeconds,
      r.studySessions || 0,
      r.codingSessions || 0,
      r.pomodoroCycles || 0,
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}