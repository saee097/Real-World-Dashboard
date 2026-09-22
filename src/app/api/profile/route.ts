import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const allowed = ["name", "email", "phone", "role", "title", "region", "location", "timezone", "bio", "avatarColorIndex", "avatarSvg"] as const;
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    const updated = await updateProfile(updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
