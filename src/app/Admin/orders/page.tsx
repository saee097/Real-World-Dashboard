"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, DollarSign, Grid2X2, List, Plus, RefreshCw, Search, X, Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getFilteredOrders, suppliers, addOrder, updateOrder, deleteOrder, type OrderRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const typeOptions = ["all", "Purchase", "Sale", "Transfer"] as const;
const statusOptions = ["all", "Pending", "Completed", "Cancelled"] as const;

const emptyOrder = {
  type: "Purchase" as const,
  product: "",
  supplier: "",
  qty: 1,
  unitPrice: 0,
  total: 0,
  status: "Pending" as const,
  date: new Date().toISOString().split("T")[0],
};

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const supplier = searchParams.get("supplier") ?? "all";
  const { resolvedTheme } = useTheme();

  const [filteredOrders, setFilteredOrders] = useState<OrderRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [form, setForm] = useState<Omit<OrderRecord, "id">>(emptyOrder);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");

  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  useEffect(() => {
    setFilteredOrders(getFilteredOrders({ search, status, type, supplier }));
  }, [search, status, type, supplier]);

  const purchaseTotal = filteredOrders.filter((order) => order.type === "Purchase").reduce((sum, order) => sum + order.total, 0);
  const saleTotal = filteredOrders.filter((order) => order.type === "Sale").reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = filteredOrders.filter((order) => order.status === "Pending").length;

  const summaryCards = [
    { title: "Purchase Total", value: currency.format(purchaseTotal), trend: "Operational", icon: ArrowDownLeft, tone: "text-rose-300 bg-rose-500/10" },
    { title: "Sale Total", value: currency.format(saleTotal), trend: "+12.8%", icon: ArrowUpRight, tone: "text-emerald-300 bg-emerald-500/10" },
    { title: "Pending Orders", value: `${pendingOrders}`, trend: "Live", icon: DollarSign, tone: "text-amber-300 bg-amber-500/10" },
  ];

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/orders${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function resetFilters() {
    router.replace("/orders", { scroll: false });
  }

  function refreshOrders() {
    setFilteredOrders(getFilteredOrders({ search, status, type, supplier }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdd() {
    setEditingOrder(null);
    setForm(emptyOrder);
    setModalOpen(true);
  }

  function openEdit(order: OrderRecord) {
    setEditingOrder(order);
    setForm({
      type: order.type,
      product: order.product,
      supplier: order.supplier,
      qty: order.qty,
      unitPrice: order.unitPrice,
      total: order.total,
      status: order.status,
      date: order.date,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingOrder(null);
    setForm(emptyOrder);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingOrder) {
      updateOrder(editingOrder.id, form);
    } else {
      addOrder(form);
    }
    setFilteredOrders(getFilteredOrders({ search, status, type, supplier }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    closeModal();
  }

  function handleDelete() {
    if (deleteId) {
      deleteOrder(deleteId);
      setFilteredOrders(getFilteredOrders({ search, status, type, supplier }));
      setDeleteId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="space-y-6">
      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 z-50 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
          Order saved
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
           <div>
             <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Operations</p>
             <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Orders</h2>
             <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Track purchases, sales, and stock transfers with auditable workflow controls.</p>
           </div>
           <div className="flex flex-wrap items-center gap-2">
             <div className="flex items-center rounded-2xl border border-white/10 bg-slate-950/40 p-1">
               <button onClick={() => setView("grid")} className={`rounded-xl p-2 ${view === "grid" ? "bg-sky-500/20 text-sky-200" : "text-slate-400"}`}>
                 <Grid2X2 className="h-4 w-4" />
               </button>
               <button onClick={() => setView("table")} className={`rounded-xl p-2 ${view === "table" ? "bg-sky-500/20 text-sky-200" : "text-slate-400"}`}>
                 <List className="h-4 w-4" />
               </button>
             </div>
           
             <button onClick={openAdd} className="flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-medium text-white">
               <Plus className="h-4 w-4" /> New order
             </button>
           </div>
         </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`rounded-[20px] border p-4 ${isDark ? "border-white/10 bg-slate-950/40" : "border-border bg-muted"}`}>
                <div className={`inline-flex rounded-2xl p-2 ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{card.title}</p>
                <div className="mt-2 flex items-end justify-between">
                  <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{card.value}</h3>
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{card.trend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`overflow-hidden rounded-[24px] border shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
        <div className="grid gap-3 border-b border-white/10 p-4 lg:grid-cols-[1.25fr_0.7fr_0.7fr_0.7fr_auto]">
          <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <input value={search} onChange={(event) => updateParams({ search: event.target.value })} className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Search order, product, supplier" />
          </label>
          <select value={type} onChange={(event) => updateParams({ type: event.target.value })} className={`rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All types" : option}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => updateParams({ status: event.target.value })} className={`rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All status" : option}
              </option>
            ))}
          </select>
          <select value={supplier} onChange={(event) => updateParams({ supplier: event.target.value })} className={`rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
            <option value="all">All suppliers</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button onClick={resetFilters} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <X className="h-4 w-4" /> Reset
          </button>
        </div>
        {view === "table" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`text-left ${isDark ? "bg-slate-900/80 text-slate-400" : "bg-muted text-muted-foreground"}`}>
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`border-t ${isDark ? "border-white/10 text-slate-200" : "border-border text-foreground"}`}>
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">{order.type}</span>
                    </td>
                    <td className="px-4 py-3">{order.product}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{order.supplier}</td>
                    <td className="px-4 py-3">{order.qty}</td>
                    <td className="px-4 py-3">{currency.format(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "Completed" ? "bg-emerald-500/10 text-emerald-300" : order.status === "Pending" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{order.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(order)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(order.id)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {view === "grid" && (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`rounded-[20px] border p-4 ${isDark ? "border-white/10 bg-slate-950/40" : "border-border bg-muted"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{order.id}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "Completed" ? "bg-emerald-500/10 text-emerald-300" : order.status === "Pending" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{order.product}</h4>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{order.supplier}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className={`flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300`}>{order.type}</div>
                  <span className={isDark ? "text-slate-300" : "text-muted-foreground"}>Qty: {order.qty}</span>
                  <span className={`font-medium ${isDark ? "text-white" : "text-foreground"}`}>{currency.format(order.total)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-500">
                  <span>{order.date}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(order)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(order.id)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className={`col-span-full px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                No orders found.
              </div>
            )}
          </div>
        )}
      </motion.section>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{editingOrder ? "Edit Order" : "New Order"}</h3>
              <button onClick={closeModal} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as OrderRecord["type"] })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="Purchase">Purchase</option>
                    <option value="Sale">Sale</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderRecord["status"] })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Product</label>
                <input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Supplier</label>
                <input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Qty</label>
                  <input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Unit Price</label>
                  <input type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value), total: Number(e.target.value) * form.qty })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Total</label>
                  <input type="number" min="0" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">{editingOrder ? "Update" : "Create"} Order</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {deleteId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteId(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-sm rounded-[24px] border p-6 text-center ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
              <Trash2 className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Delete order?</h3>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>This action cannot be undone. The order will be permanently removed.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
              <button onClick={handleDelete} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
