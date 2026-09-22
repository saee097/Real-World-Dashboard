"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { ArrowRight } from "lucide-react";

interface Category {
  title: string;
  description: string;
  products: number;
  accent: string;
  health: string;
}

export default function PublicCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/categories");
        if (res.ok) setCategories(await res.json());
      } catch (error) {
        console.error("Failed to load categories:", error);
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
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Categories</h1>
          <p className="mt-2 text-muted-foreground">Browse products by category</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">No categories available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <div key={category.title} className={`rounded-[22px] border border-white/10 bg-gradient-to-br ${category.accent} p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]`}>
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                <p className="mt-2 text-sm text-white/80">{category.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/90">{category.products} products</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/90">{category.health}</span>
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
