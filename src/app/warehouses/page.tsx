"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { ArrowRight, Warehouse } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: string;
  stored: number;
  utilization: number;
  since: string;
  status: string;
}

export default function PublicWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/warehouses");
        if (res.ok) setWarehouses(await res.json());
      } catch (error) {
        console.error("Failed to load warehouses:", error);
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
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Warehouses</h1>
          <p className="mt-2 text-muted-foreground">Our storage locations</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : warehouses.length === 0 ? (
          <p className="text-muted-foreground">No warehouses available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                    <Warehouse className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{warehouse.name}</h3>
                    <p className="text-xs text-slate-400">{warehouse.location}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-400">
                  <p>Capacity: {warehouse.capacity}</p>
                  <p>Stored: {warehouse.stored} units</p>
                  <p>Utilization: {warehouse.utilization}%</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    warehouse.status === "Healthy" ? "bg-emerald-500/10 text-emerald-300" :
                    warehouse.status === "Watch" ? "bg-amber-500/10 text-amber-300" :
                    "bg-rose-500/10 text-rose-300"
                  }`}>{warehouse.status}</span>
                  <span className="text-xs text-slate-500">Since {warehouse.since}</span>
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
