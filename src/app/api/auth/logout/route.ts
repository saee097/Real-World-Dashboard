import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db-postgres";
import { sessions } from "@/lib/db-postgres-schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }

    cookieStore.delete("session", { path: "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
