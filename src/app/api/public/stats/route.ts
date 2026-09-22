import { NextResponse } from "next/server";
import { db } from "@/lib/db-postgres";
import { products, orders, categories } from "@/lib/db-postgres-schema";
import { count, sql } from "drizzle-orm";

export async function GET() {
  try {
    const [productCount] = await db.select({ count: count() }).from(products);
    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [categoryCount] = await db.select({ count: count() }).from(categories);

    const stockValue = await db.select({
      total: sql<number>`COALESCE(SUM(${products.price} * ${products.qty}), 0)`,
    }).from(products);

    const lowStock = await db.select({ count: count() }).from(products).where(sql`${products.qty} <= ${products.reorderLevel}`);

    return NextResponse.json({
      totalProducts: productCount.count,
      stockValue: stockValue[0].total,
      pendingOrders: orderCount.count,
      categories: categoryCount.count,
      lowStock: lowStock.count,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
