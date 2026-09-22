import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db-postgres";
import { users, sessions } from "@/lib/db-postgres-schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "stockpilot-secret-key-2026");

async function createSessionToken(user: { id: number; email: string; name: string; role: string }) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  return token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({ id: token, userId: user.id, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
