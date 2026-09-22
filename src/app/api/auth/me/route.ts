import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db-postgres";
import { sessions, users } from "@/lib/db-postgres-schema";
import { eq, and, gt } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "stockpilot-secret-key-2026");

interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
  exp: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    let payload: JwtPayload;
    try {
      const result = await jwtVerify<JwtPayload>(sessionCookie, SECRET);
      payload = result.payload;
    } catch {
      cookieStore.delete("session", { path: "/" });
      return NextResponse.json({ user: null });
    }

    const sessionResult = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionCookie), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (sessionResult.length === 0) {
      cookieStore.delete("session", { path: "/" });
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null });
  }
}
