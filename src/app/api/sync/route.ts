// src/app/api/sync/route.ts
import { NextResponse } from "next/server";

// In-memory cloud snapshot store for local dev (ready to swap with MongoDB/Supabase in production)
const cloudSnapshots = new Map<string, Record<string, unknown>>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, payload } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required for cloud sync" }, { status: 400 });
    }

    const syncedRecord = {
      email,
      payload,
      syncedAt: new Date().toISOString(),
    };
    cloudSnapshots.set(email.toLowerCase(), syncedRecord);

    return NextResponse.json({
      ok: true,
      syncedAt: syncedRecord.syncedAt,
      message: "Cloud snapshot synchronized successfully.",
    });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const snapshot = cloudSnapshots.get(email.toLowerCase()) || null;
  return NextResponse.json({ ok: true, snapshot });
}