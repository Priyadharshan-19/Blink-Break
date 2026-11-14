// src/app/api/user/state/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, IDayRecord } from "@/models/User";
import { getAuthenticatedUserId, AUTH_COOKIE_NAME } from "@/lib/auth";

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLabel(date = new Date()): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function computeStreaks(
  historyMap: Map<string, IDayRecord>,
  prevLongest: number
) {
  let currentStreak = 0;
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const todayRec = historyMap.get(todayKey);

  const checkDate = new Date(today);
  if (!todayRec || todayRec.completed === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = getLocalDateKey(checkDate);
    const rec = historyMap.get(key);
    if (rec && rec.completed > 0) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(prevLongest, currentStreak),
  };
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(userId)
      .populate("friends", "name email role streakDays plantLevel dailyGoal history settings")
      .populate("friendRequests", "name email streakDays");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { currentStreak, longestStreak } = computeStreaks(
      user.history,
      user.longestStreak
    );
    if (currentStreak !== user.streakDays || longestStreak !== user.longestStreak) {
      user.streakDays = currentStreak;
      user.longestStreak = longestStreak;
      await user.save();
    }

    const todayKey = getLocalDateKey();
    const populatedFriends = (user.friends as unknown as Array<{
      _id: { toString: () => string };
      name: string;
      email: string;
      role: string;
      streakDays: number;
      plantLevel: number;
      dailyGoal: number;
      history?: Map<string, IDayRecord>;
    }>).map((f) => ({
      id: f._id.toString(),
      name: f.name,
      email: f.email,
      role: f.role || "20-20-20 Companion",
      streakDays: f.streakDays || 0,
      plantLevel: f.plantLevel || 1,
      dailyGoal: f.dailyGoal || 8,
      todayBreaks: f.history?.get(todayKey)?.completed || 0,
    }));

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        dailyGoal: user.dailyGoal,
        streakDays: user.streakDays,
        longestStreak: user.longestStreak,
        plantLevel: user.plantLevel,
        plantXp: user.plantXp,
        plantName: user.plantName,
        plantVariety: user.plantVariety,
        waterDrops: user.waterDrops,
        totalWaterings: user.totalWaterings,
        lastWateredAt: user.lastWateredAt,
        settings: user.settings,
        history: Object.fromEntries(user.history),
        sessionLogs: user.sessionLogs,
        routines: user.routines,
        friends: populatedFriends,
      },
    });
  } catch (err) {
    console.error("GET /api/user/state error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { action, payload } = body;

    const now = new Date();
    const dateKey = payload?.dateKey || getLocalDateKey(now);
    const dayLabel = payload?.dayLabel || getDayLabel(now);

    const ensureDayRecord = (): IDayRecord => {
      const existing = user.history.get(dateKey);
      if (existing) return existing;
      const fresh: IDayRecord = {
        date: dateKey,
        dayLabel,
        completed: 0,
        missed: 0,
        skipped: 0,
        snoozed: 0,
        focusSeconds: 0,
        focusMinutes: 0,
        breakSeconds: 0,
        studySessions: 0,
        codingSessions: 0,
        pomodoroCycles: 0,
      };
      user.history.set(dateKey, fresh);
      return fresh;
    };

    if (action === "FOCUS_TICK") {
      const rec = ensureDayRecord();
      const delta = Number(payload.secondsDelta) || 0;
      rec.focusSeconds += delta;
      rec.focusMinutes = Math.floor(rec.focusSeconds / 60);
      user.history.set(dateKey, rec);
    } else if (action === "BREAK_COMPLETED") {
      const rec = ensureDayRecord();
      const durationSec = Number(payload.durationSec) || 20;
      const mode = payload.mode || "standard";

      rec.completed += 1;
      rec.breakSeconds += durationSec;
      if (mode === "study") rec.studySessions += 1;
      if (mode === "coding") rec.codingSessions += 1;
      if (mode === "pomodoro") rec.pomodoroCycles += 1;
      user.history.set(dateKey, rec);

      const nextXp = user.plantXp + 20;
      if (nextXp >= 100) {
        user.plantLevel += 1;
        user.plantXp = nextXp - 100;
      } else {
        user.plantXp = nextXp;
      }
      user.waterDrops += 1;

      const { currentStreak, longestStreak } = computeStreaks(
        user.history,
        user.longestStreak
      );
      user.streakDays = currentStreak;
      user.longestStreak = longestStreak;

      user.sessionLogs.unshift({
        id: `evt-${Date.now()}`,
        timestamp: now.toISOString(),
        timeFormatted: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type: "completed",
        mode,
        durationSeconds: durationSec,
        xpEarned: 20,
      });
      user.sessionLogs = user.sessionLogs.slice(0, 60);
    } else if (action === "BREAK_SKIPPED") {
      const rec = ensureDayRecord();
      rec.skipped += 1;
      rec.missed += 1;
      user.history.set(dateKey, rec);

      user.sessionLogs.unshift({
        id: `evt-${Date.now()}`,
        timestamp: now.toISOString(),
        timeFormatted: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type: "skipped",
        mode: payload?.mode || "standard",
        durationSeconds: 0,
        xpEarned: 0,
      });
    } else if (action === "BREAK_SNOOZED") {
      const rec = ensureDayRecord();
      rec.snoozed += 1;
      user.history.set(dateKey, rec);

      user.sessionLogs.unshift({
        id: `evt-${Date.now()}`,
        timestamp: now.toISOString(),
        timeFormatted: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type: "snoozed",
        mode: payload?.mode || "standard",
        durationSeconds: 0,
        xpEarned: 0,
      });
    } else if (action === "WATER_PLANT") {
      if (user.waterDrops > 0) {
        user.waterDrops -= 1;
        user.totalWaterings += 1;
        const nextXp = user.plantXp + 25;
        if (nextXp >= 100) {
          user.plantLevel += 1;
          user.plantXp = nextXp - 100;
        } else {
          user.plantXp = nextXp;
        }
        user.lastWateredAt = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        user.sessionLogs.unshift({
          id: `evt-${Date.now()}`,
          timestamp: now.toISOString(),
          timeFormatted: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          type: "watered",
          mode: "terrarium",
          durationSeconds: 0,
          xpEarned: 25,
        });
      }
    } else if (action === "UPDATE_PLANT_META") {
      if (payload.plantVariety) user.plantVariety = payload.plantVariety;
      if (payload.plantName) user.plantName = payload.plantName;
    } else if (action === "UPDATE_SETTINGS") {
      if (payload.dailyGoal !== undefined) user.dailyGoal = Number(payload.dailyGoal);
      if (payload.settings) {
        user.settings = { ...user.settings, ...payload.settings };
      }
    } else if (action === "UPDATE_ROUTINES") {
      if (Array.isArray(payload.routines)) {
        user.routines = payload.routines;
      }
    } else if (action === "UPDATE_PROFILE") {
      if (payload.name) user.name = payload.name;
      if (payload.role) user.role = payload.role;
    }

    user.markModified("history");
    user.markModified("settings");
    user.markModified("routines");
    user.markModified("sessionLogs");
    await user.save();

    return NextResponse.json({
      ok: true,
      streakDays: user.streakDays,
      longestStreak: user.longestStreak,
      plantLevel: user.plantLevel,
      plantXp: user.plantXp,
      waterDrops: user.waterDrops,
      totalWaterings: user.totalWaterings,
      lastWateredAt: user.lastWateredAt,
      history: Object.fromEntries(user.history),
      sessionLogs: user.sessionLogs,
      routines: user.routines,
    });
  } catch (err) {
    console.error("POST /api/user/state error:", err);
    return NextResponse.json({ error: "Failed to persist to MongoDB" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    await User.findByIdAndDelete(userId);
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}