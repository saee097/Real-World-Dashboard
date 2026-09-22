"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package2, ShoppingCart, Warehouse, TrendingUp, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";

interface Stats {
  totalProducts: number;
  stockValue: string;
  pendingOrders: number;
  categories: number;
  lowStock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  qty: number;
  status: string;
}

interface Category {
  title: string;
  description: string;
  products: number;
  accent: string;
  health: string;
}

interface Order {
  id: string;
  product: string;
  supplier: string;
  total: number;
  date: string;
  status: string;
  type: string;
}

const heroSlides = [
  {
    title: "Supply Chain Visibility",
    description: "Monitor stock movement, reconcile demand, and keep high-priority orders flowing without friction.",
    accent: "from-sky-500 to-indigo-500",
  },
  {
    title: "Smart Inventory Control",
    description: "Track real-time stock levels, automate reordering, and reduce carrying costs across all warehouses.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Order Fulfillment Excellence",
    description: "Process purchase orders, manage suppliers, and deliver exceptional customer experiences.",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch("/api/public/stats"),
          fetch("/api/public/products"),
          fetch("/api/public/categories"),
          fetch("/api/public/orders"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <section className="relative overflow-hidden rounded-b-[32px] border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                <SparklesIcon className="h-4 w-4" />
                Production operations overview
              </div>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                Your supply chain is operating with strong visibility and control.
              </h1>
              <p className="text-lg leading-8 text-slate-400">
                Monitor stock movement, reconcile demand, and keep high-priority orders flowing without friction.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-110"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/15"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {heroSlides.map((slide) => (
                  <div
                    key={slide.title}
                    className={`rounded-3xl border border-white/10 bg-gradient-to-br ${slide.accent} p-6 text-white shadow-[0_20px_70px_rgba(2,6,23,0.45)] transition hover:scale-[1.02]`}
                  >
                    <h3 className="text-lg font-semibold">{slide.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{slide.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          {stats && (
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-semibold text-foreground">Real-time insights</h2>
                <p className="mt-2 text-muted-foreground">Live metrics from your inventory command center</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Products" value={stats.totalProducts.toLocaleString()} change="Live" icon={Package2} accent="from-sky-500 to-indigo-500" />
                <StatCard label="Stock Value" value={`$${Number(stats.stockValue).toLocaleString()}`} change="Live" icon={TrendingUp} accent="from-emerald-500 to-teal-500" />
                <StatCard label="Pending Orders" value={stats.pendingOrders.toLocaleString()} change="Live" icon={ShoppingCart} accent="from-amber-500 to-orange-500" />
                <StatCard label="Categories" value={stats.categories.toLocaleString()} change={`${stats.lowStock} low stock`} icon={Warehouse} accent="from-violet-500 to-fuchsia-500" />
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">Featured Products</h2>
                  <p className="mt-2 text-muted-foreground">Top inventory items across your warehouses</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.25)] transition hover:translate-y-[-4px] hover:scale-[1.01]"
                  >
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
                  </article>
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">Categories</h2>
                  <p className="mt-2 text-muted-foreground">Browse products by category</p>
                </div>
                <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {categories.map((category) => (
                  <article
                    key={category.title}
                    className={`rounded-[22px] border border-white/10 bg-gradient-to-br ${category.accent} p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] transition hover:translate-y-[-4px] hover:scale-[1.01]`}
                  >
                    <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{category.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/90">{category.products} products</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/90">{category.health}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {orders.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">Recent Orders</h2>
                  <p className="mt-2 text-muted-foreground">Latest purchase and sales activity</p>
                </div>
                <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] transition hover:translate-y-[-4px] hover:scale-[1.01]"
                  >
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
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-[0_20px_70px_rgba(2,6,23,0.45)] sm:p-12">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ready to optimize your inventory?</h2>
                  <p className="text-lg text-slate-400">
                    Join teams worldwide who trust StockPilot to manage their supply chain with precision and confidence.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-110"
                    >
                      Start free trial <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/15"
                    >
                      Sign in to dashboard
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                    <Truck className="mb-3 h-8 w-8 text-accent" />
                    <h3 className="font-semibold text-white">Supply Chain</h3>
                    <p className="mt-1 text-sm text-slate-400">End-to-end visibility</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                    <ShieldCheck className="mb-3 h-8 w-8 text-accent" />
                    <h3 className="font-semibold text-white">Secure Access</h3>
                    <p className="mt-1 text-sm text-slate-400">Role-based permissions</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                    <Package2 className="mb-3 h-8 w-8 text-accent" />
                    <h3 className="font-semibold text-white">Inventory</h3>
                    <p className="mt-1 text-sm text-slate-400">Real-time tracking</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                    <TrendingUp className="mb-3 h-8 w-8 text-accent" />
                    <h3 className="font-semibold text-white">Analytics</h3>
                    <p className="mt-1 text-sm text-slate-400">Demand forecasting</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <PublicFooter />
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function StatCard({ label, value, change, icon: Icon, accent }: { label: string; value: string; change: string; icon: any; accent: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.25)] transition hover:translate-y-[-4px] hover:scale-[1.01]">
      <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-2 text-white`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        <span className="text-sm font-medium text-emerald-400">{change}</span>
      </div>
    </div>
  );
}
