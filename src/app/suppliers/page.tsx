"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { ArrowRight, Truck } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: number;
  since: string;
  tier: string;
}

export default function PublicSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/suppliers");
        if (res.ok) setSuppliers(await res.json());
      } catch (error) {
        console.error("Failed to load suppliers:", error);
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
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Suppliers</h1>
          <p className="mt-2 text-muted-foreground">Our trusted vendor network</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-muted-foreground">No suppliers available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{supplier.name}</h3>
                    <p className="text-xs text-slate-400">{supplier.tier}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-400">
                  <p>{supplier.email}</p>
                  <p>{supplier.phone}</p>
                  <p>{supplier.address}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-400">{supplier.products} products</span>
                  <span className="text-slate-500">Since {supplier.since}</span>
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
