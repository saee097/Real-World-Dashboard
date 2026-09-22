"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { ArrowRight } from "lucide-react";

interface Order {
  id: string;
  product: string;
  supplier: string;
  total: number;
  date: string;
  status: string;
  type: string;
}

export default function PublicOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/orders");
        if (res.ok) setOrders(await res.json());
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Orders</h1>
          <p className="mt-2 text-muted-foreground">Latest purchase and sales activity</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground">No orders available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{order.type}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === "Completed" ? "bg-emerald-500/10 text-emerald-300" :
                    order.status === "Pending" ? "bg-amber-500/10 text-amber-300" :
                    "bg-rose-500/10 text-rose-300"
                  }`}>{order.status}</span>
                </div>
                <h3 className="font-semibold text-white">{order.product}</h3>
                <p className="mt-1 text-sm text-slate-400">Supplier: {order.supplier}</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-2xl font-semibold text-white">${order.total}</span>
                  <span className="text-sm text-slate-400">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
