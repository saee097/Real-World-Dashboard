"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, Boxes, PackageOpen, ScanLine, Warehouse, Plus, Minus, RefreshCw, Search, X, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getAllProducts, getAllWarehouses, getAllOrders, addOrder, addProduct, updateProduct, type ProductRecord, type WarehouseRecord, type OrderRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const emptyAdjustment = {
  productId: "",
  qty: 0,
  reason: "",
};

const emptyTransfer = {
  productId: "",
  fromWarehouse: "",
  toWarehouse: "",
  qty: 0,
};

const emptyScan = {
  sku: "",
  name: "",
  warehouse: "",
  qty: 0,
};

export default function InventoryPage() {
  const { resolvedTheme } = useTheme();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState(emptyAdjustment);
  const [transferForm, setTransferForm] = useState(emptyTransfer);
  const [scanForm, setScanForm] = useState(emptyScan);

  useEffect(() => {
    setProducts(getAllProducts());
    setWarehouses(getAllWarehouses());
    setOrders(getAllOrders());
  }, []);

  const isDark = resolvedTheme === "dark";

  const stockHealth = useMemo(() => {
    if (products.length === 0) return 0;
    const healthy = products.filter((p) => p.status === "In Stock").length;
    return Math.round((healthy / products.length) * 100);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.status === "Low Stock" || p.status === "Critical").length;
  }, [products]);

  const warehouseCount = useMemo(() => {
    return new Set(products.map((p) => p.warehouse)).size;
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.qty * p.price, 0);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.warehouse.toLowerCase().includes(q)
    );
  }, [products, search]);

  const warehouseDistribution = useMemo(() => {
    const map = new Map<string, { stored: number; capacity: number }>();
    warehouses.forEach((w) => {
      const stored = products.filter((p) => p.warehouse === w.name).reduce((s, p) => s + p.qty, 0);
      map.set(w.name, { stored, capacity: parseFloat(w.capacity.replace(/[^0-9]/g, "")) || stored });
    });
    return warehouses.map((w) => ({
      name: w.name,
      stored: map.get(w.name)?.stored || 0,
      capacity: map.get(w.name)?.capacity || 0,
      utilization: w.utilization,
    }));
  }, [warehouses, products]);

  const transferActivity = useMemo(() => {
    return orders
      .filter((o) => o.type === "Transfer")
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [orders]);

  function refreshData() {
    setProducts(getAllProducts());
    setWarehouses(getAllWarehouses());
    setOrders(getAllOrders());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdjust() {
    setAdjustForm(emptyAdjustment);
    setAdjustModalOpen(true);
  }

  function openTransfer() {
    setTransferForm(emptyTransfer);
    setTransferModalOpen(true);
  }

  function openScan() {
    setScanForm(emptyScan);
    setScanModalOpen(true);
  }

  function handleAdjustSubmit(event: React.FormEvent) {
    event.preventDefault();
    const product = products.find((p) => p.id === adjustForm.productId);
    if (!product) return;
    const newQty = Math.max(0, product.qty + adjustForm.qty);
    updateProduct(product.id, { qty: newQty });
    refreshData();
    setAdjustModalOpen(false);
  }

  function handleTransferSubmit(event: React.FormEvent) {
    event.preventDefault();
    const product = products.find((p) => p.id === transferForm.productId);
    if (!product || transferForm.qty <= 0) return;
    const newQty = Math.max(0, product.qty - transferForm.qty);
    updateProduct(product.id, { qty: newQty, warehouse: transferForm.toWarehouse });
    addOrder({
      type: "Transfer",
      product: product.name,
      supplier: "",
      qty: transferForm.qty,
      unitPrice: product.price,
      total: product.price * transferForm.qty,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
    refreshData();
    setTransferModalOpen(false);
  }

  function handleScanSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!scanForm.sku || !scanForm.name) return;
    addProduct({
      name: scanForm.name,
      sku: scanForm.sku,
      category: "Uncategorized",
      warehouse: scanForm.warehouse || warehouses[0]?.name || "",
      qty: scanForm.qty,
      reorderLevel: 0,
      price: 0,
      status: "In Stock",
      supplier: "",
      leadTimeDays: 0,
    });
    refreshData();
    setScanModalOpen(false);
  }

  const summaryCards = [
    { label: "Stock health", value: `${stockHealth}%`, detail: stockHealth >= 80 ? "Healthy" : "Needs attention" },
    { label: "Low stock", value: `${lowStockCount}`, detail: "Items" },
    { label: "Warehouse distribution", value: `${warehouseCount}`, detail: "Sites" },
    { label: "Inventory value", value: `$${(inventoryValue / 1000000).toFixed(2)}M`, detail: "Tracked" },
  ];

  return (
    <div className="space-y-6">
      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 z-50 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
          Inventory updated
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Control tower</p>
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Inventory overview</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={openAdjust} className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-border bg-muted text-muted-foreground"}`}>Adjust quantity</button>
            <button onClick={openTransfer} className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-border bg-muted text-muted-foreground"}`}>Transfer stock</button>
            <button onClick={openScan} className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white">Scan item</button>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <motion.article key={card.label} whileHover={{ y: -4 }} className={`rounded-[22px] border p-4 ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{card.label}</p>
            <h3 className={`mt-2 text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{card.value}</h3>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-500" : "text-muted-foreground/60"}`}>{card.detail}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
          <div className="mb-4 flex items-center gap-2 text-slate-300">
            <Boxes className="h-5 w-5" />
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Stock distribution</h3>
          </div>
          <div className={`rounded-[20px] border p-4 ${isDark ? "border-white/10 bg-slate-950/40" : "border-border bg-muted"}`}>
            {warehouseDistribution.map((wh, idx) => (
              <div key={wh.name} className={`flex items-center justify-between ${idx < warehouseDistribution.length - 1 ? "border-b border-white/10 pb-3" : "pt-3"}`}>
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{wh.name}</span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{wh.utilization}%</span>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <ArrowRightLeft className="h-5 w-5" />
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Transfer activity</h3>
            </div>
            <button onClick={refreshData} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {transferActivity.map((order) => (
              <div key={order.id} className={`rounded-2xl border p-3 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-300" : "border-border bg-muted text-muted-foreground"}`}>
                <div className="flex items-center justify-between">
                  <span>{order.product}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "Completed" ? "bg-emerald-500/10 text-emerald-300" : order.status === "Pending" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{order.id}</span>
                  <span>{order.date}</span>
                </div>
              </div>
            ))}
            {transferActivity.length === 0 && (
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>No transfer activity yet.</p>
            )}
          </div>
        </motion.article>
      </section>

      <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-slate-300" />
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Inventory items</h3>
          </div>
          <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Search inventory..." />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={`text-left ${isDark ? "bg-slate-900/80 text-slate-400" : "bg-muted text-muted-foreground"}`}>
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`border-t ${isDark ? "border-white/10 text-slate-200" : "border-border text-foreground"}`}>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.sku}</td>
                  <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.warehouse}</td>
                  <td className="px-4 py-3">{product.qty}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.status === "Critical" ? "bg-rose-500/10 text-rose-300" : product.status === "Low Stock" ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.article>

      {adjustModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setAdjustModalOpen(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Adjust quantity</h3>
              <button onClick={() => setAdjustModalOpen(false)} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Product</label>
                <select value={adjustForm.productId} onChange={(e) => setAdjustForm({ ...adjustForm, productId: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Adjustment</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setAdjustForm({ ...adjustForm, qty: adjustForm.qty - 1 })} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <input type="number" value={adjustForm.qty} onChange={(e) => setAdjustForm({ ...adjustForm, qty: Number(e.target.value) })} required className={`w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                    <button type="button" onClick={() => setAdjustForm({ ...adjustForm, qty: adjustForm.qty + 1 })} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Reason</label>
                  <input type="text" value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAdjustModalOpen(false)} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">Save adjustment</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {transferModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setTransferModalOpen(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Transfer stock</h3>
              <button onClick={() => setTransferModalOpen(false)} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="mt-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Product</label>
                <select value={transferForm.productId} onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) - {p.warehouse}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>From warehouse</label>
                  <select value={transferForm.fromWarehouse} onChange={(e) => setTransferForm({ ...transferForm, fromWarehouse: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="">Select</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>To warehouse</label>
                  <select value={transferForm.toWarehouse} onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="">Select</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Quantity to transfer</label>
                <input type="number" min="1" value={transferForm.qty} onChange={(e) => setTransferForm({ ...transferForm, qty: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setTransferModalOpen(false)} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">Transfer</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {scanModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setScanModalOpen(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Scan item</h3>
              <button onClick={() => setScanModalOpen(false)} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleScanSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>SKU / Barcode</label>
                  <input type="text" value={scanForm.sku} onChange={(e) => setScanForm({ ...scanForm, sku: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Product name</label>
                  <input type="text" value={scanForm.name} onChange={(e) => setScanForm({ ...scanForm, name: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Warehouse</label>
                  <select value={scanForm.warehouse} onChange={(e) => setScanForm({ ...scanForm, warehouse: e.target.value })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Initial qty</label>
                  <input type="number" min="0" value={scanForm.qty} onChange={(e) => setScanForm({ ...scanForm, qty: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setScanModalOpen(false)} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white">Add item</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
