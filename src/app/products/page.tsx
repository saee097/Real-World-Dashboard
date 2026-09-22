"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { Package2, ArrowRight, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  qty: number;
  status: string;
}

export default function PublicProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/products");
        if (res.ok) setProducts(await res.json());
      } catch (error) {
        console.error("Failed to load products:", error);
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
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Products</h1>
          <p className="mt-2 text-muted-foreground">Browse our product catalog</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{product.category}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    product.status === "In Stock" ? "bg-emerald-500/10 text-emerald-300" :
                    product.status === "Low Stock" ? "bg-amber-500/10 text-amber-300" :
                    "bg-rose-500/10 text-rose-300"
                  }`}>{product.status}</span>
                </div>
                <h3 className="font-semibold text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-400">SKU: {product.sku}</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-2xl font-semibold text-white">${product.price}</span>
                  <span className="text-sm text-slate-400">{product.qty} units</span>
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
