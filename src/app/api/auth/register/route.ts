// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Name, valid email, and a password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in!" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json({
      ok: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: unknown) {
    console.error("Register error:", err);
    const rawMsg = err instanceof Error ? err.message : "Unknown database error";

    let friendlyError = `Database error: ${rawMsg}`;
    if (rawMsg.includes("bad auth") || rawMsg.includes("Authentication failed")) {
      friendlyError =
        "MongoDB Atlas password mismatch: Go to Atlas -> Database Access -> Edit priyadharshan802_db_user and set password to 2006.";
    } else if (
      rawMsg.includes("Could not connect to any servers") ||
      rawMsg.includes("ServerSelectionError")
    ) {
      friendlyError =
        "MongoDB Atlas IP blocked: Go to Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0).";
    }

    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}