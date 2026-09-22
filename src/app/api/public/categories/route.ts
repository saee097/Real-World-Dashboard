import { NextResponse } from "next/server";
import { db } from "@/lib/db-postgres";
import { categories } from "@/lib/db-postgres-schema";

export async function GET() {
  try {
    const data = await db.select().from(categories);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
