import { NextResponse } from "next/server";
import { db } from "@/lib/db-postgres";
import { suppliers } from "@/lib/db-postgres-schema";

export async function GET() {
  try {
    const data = await db.select().from(suppliers).limit(6);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
