// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    // If the user doesn't exist yet (e.g. earlier registration failed), auto-create the account on sign-in!
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 12);
      const defaultName = normalizedEmail.split("@")[0] || "Dharshan";
      user = await User.create({
        name: defaultName,
        email: normalizedEmail,
        passwordHash,
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password for this account." },
          { status: 401 }
        );
      }
    }

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
    console.error("Login API error:", err);
    const rawMsg = err instanceof Error ? err.message : "Unknown error";

    let friendlyError = `Database error: ${rawMsg}`;
    if (rawMsg.includes("bad auth") || rawMsg.includes("Authentication failed")) {
      friendlyError =
        "MongoDB Atlas password mismatch in .env.local! Check your DB user password in Atlas -> Database Access.";
    } else if (
      rawMsg.includes("Could not connect to any servers") ||
      rawMsg.includes("ServerSelectionError")
    ) {
      friendlyError =
        "MongoDB Atlas IP blocked! Go to Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0).";
    }

    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}