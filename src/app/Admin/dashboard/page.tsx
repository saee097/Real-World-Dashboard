"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, Package2, ShoppingCart, Sparkles, TrendingUp, Warehouse } from "lucide-react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { categoryMix, dashboardStats, demandSeries, lowStockItems, recentOrders } from "@/lib/app-data";

const iconMap = {
  Package,
  DollarSign,
  ShoppingCart,
  Warehouse,
} as const;

const stats = dashboardStats.map((item) => ({
  ...item,
  icon: iconMap[item.icon as keyof typeof iconMap],
  accent: item.label === "Total Products" ? "from-sky-500 to-indigo-500" : item.label === "Stock Value" ? "from-emerald-500 to-teal-500" : item.label === "Pending Orders" ? "from-amber-500 to-orange-500" : "from-violet-500 to-fuchsia-500",
}));

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              <Sparkles className="h-4 w-4" />
              Production operations overview
            </div>
            <h2 className="text-3xl font-semibold text-white">Your supply chain is operating with strong visibility and control.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Monitor stock movement, reconcile demand, and keep high-priority orders flowing without friction.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/15">
            <Package2 className="h-4 w-4" />
            Review inventory health
          </button>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4, scale: 1.01 }} className="rounded-[22px] border border-white/10 bg-[#1A2233]/90 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${item.accent} p-2 text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-400">{item.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <h3 className="text-2xl font-semibold text-white">{item.value}</h3>
                <span className="text-sm font-medium text-emerald-400">{item.change}</span>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Sales vs purchases</p>
              <h3 className="text-lg font-semibold text-white">Demand balance</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              +9.8% momentum
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandSeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Inventory mix</p>
              <h3 className="text-lg font-semibold text-white">Category distribution</h3>
            </div>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Balanced</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryMix} innerRadius={70} outerRadius={95} dataKey="value" paddingAngle={2}>
                  {categoryMix.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Critical stock</p>
              <h3 className="text-lg font-semibold text-white">Low stock alerts</h3>
            </div>
            <button className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">View all</button>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">{item.qty} units</span>
                  <span className="rounded-full bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-300">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#1A2233]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live activity</p>
              <h3 className="text-lg font-semibold text-white">Recent orders</h3>
            </div>
            <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-300">12 updates</div>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                <div>
                  <p className="font-medium text-white">{order.id}</p>
                  <p className="text-sm text-slate-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{order.amount}</p>
                  <p className="text-sm text-slate-400">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.article>
      </section>
    </div>
  );
}
