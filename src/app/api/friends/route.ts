// src/app/api/friends/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { query } = await request.json();
    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Enter a friend's email or display name." },
        { status: 400 }
      );
    }

    const search = query.trim();
    const targetUser = await User.findOne({
      $or: [
        { email: search.toLowerCase() },
        { name: { $regex: new RegExp(`^${search}$`, "i") } },
      ],
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: `No registered BlinkBreak user found matching "${search}".` },
        { status: 404 }
      );
    }

    if (targetUser._id.toString() === userId) {
      return NextResponse.json(
        { error: "You cannot add yourself as a friend." },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyFriends = currentUser.friends.some(
      (id) => id.toString() === targetUser._id.toString()
    );

    if (!alreadyFriends) {
      currentUser.friends.push(targetUser._id);
      await currentUser.save();
    }

    // Also link reciprocally so both friends see each other on the leaderboard
    const reciprocal = targetUser.friends.some(
      (id) => id.toString() === currentUser._id.toString()
    );
    if (!reciprocal) {
      targetUser.friends.push(currentUser._id);
      await targetUser.save();
    }

    return NextResponse.json({
      ok: true,
      friend: {
        id: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        streakDays: targetUser.streakDays,
        plantLevel: targetUser.plantLevel,
        dailyGoal: targetUser.dailyGoal,
        todayBreaks: 0,
      },
    });
  } catch (err) {
    console.error("POST /api/friends error:", err);
    return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
  }
}