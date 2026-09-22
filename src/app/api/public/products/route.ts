import { NextResponse } from "next/server";
import { db } from "@/lib/db-postgres";
import { products } from "@/lib/db-postgres-schema";

export async function GET() {
  try {
    const data = await db.select().from(products).limit(12);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
