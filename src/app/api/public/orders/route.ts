import { NextResponse } from "next/server";
import { db } from "@/lib/db-postgres";
import { orders } from "@/lib/db-postgres-schema";

export async function GET() {
  try {
    const data = await db.select().from(orders).limit(8);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
