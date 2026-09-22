"use client";

import { motion } from "framer-motion";
import { Download, Filter, Plus, RefreshCw, Search, X, Pencil, Trash2, Grid2X2, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getFilteredProducts, categories as allCategories, warehouses as allWarehouses, addProduct, updateProduct, deleteProduct, type ProductRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const statusOptions = ["all", "In Stock", "Low Stock", "Critical"] as const;

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  warehouse: "",
  qty: 0,
  reorderLevel: 0,
  price: 0,
  status: "In Stock" as const,
  supplier: "",
  leadTimeDays: 0,
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const warehouse = searchParams.get("warehouse") ?? "all";
  const { resolvedTheme } = useTheme();

  const [filteredProducts, setFilteredProducts] = useState<ProductRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");

  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const categories = allCategories;
  const warehouses = allWarehouses;

  useEffect(() => {
    setFilteredProducts(getFilteredProducts({ search, category, status, warehouse }));
  }, [search, category, status, warehouse]);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/products${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function resetFilters() {
    router.replace("/products", { scroll: false });
  }

  function exportToCsv() {
    const products = getFilteredProducts({ search, category, status, warehouse });
    if (products.length === 0) return;

    const headers = ["Product", "SKU", "Category", "Warehouse", "Qty", "Reorder Level", "Price", "Status", "Supplier", "Lead Time (days)"];
    const rows = products.map((p) => [
      p.name,
      p.sku,
      p.category,
      p.warehouse,
      p.qty,
      p.reorderLevel,
      p.price.toFixed(2),
      p.status,
      p.supplier,
      p.leadTimeDays,
    ]);

    const escape = (val: string | number) => String(val).includes(",") || String(val).includes('"') || String(val).includes("\n") ? `"${String(val).replace(/"/g, '""')}"` : String(val);
    const csv = [headers.join(","), ...rows.map((row) => row.map(escape).join(","))].join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function refreshProducts() {
    setFilteredProducts(getFilteredProducts({ search, category, status, warehouse }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdd() {
    setEditingProduct(null);
    setForm(emptyProduct);
    setModalOpen(true);
  }

  function openEdit(product: ProductRecord) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      warehouse: product.warehouse,
      qty: product.qty,
      reorderLevel: product.reorderLevel,
      price: product.price,
      status: product.status,
      supplier: product.supplier,
      leadTimeDays: product.leadTimeDays,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyProduct);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setFilteredProducts(getFilteredProducts({ search, category, status, warehouse }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    closeModal();
  }

  function handleDelete() {
    if (deleteId) {
      deleteProduct(deleteId);
      setFilteredProducts(getFilteredProducts({ search, category, status, warehouse }));
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
          Product saved
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Operations hub</p>
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Product inventory</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Search, filter, and prioritize stock with operationally relevant controls.</p>
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
        
            <button onClick={exportToCsv} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-medium text-white">
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_auto]">
          <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <input value={search} onChange={(event) => updateParams({ search: event.target.value })} className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Search products or SKU" />
          </label>
          <select value={category} onChange={(event) => updateParams({ category: event.target.value })} className={`rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.title} value={item.title}>
                {item.title}
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
          <select value={warehouse} onChange={(event) => updateParams({ warehouse: event.target.value })} className={`rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
            <option value="all">All warehouses</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button onClick={resetFilters} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <X className="h-4 w-4" /> Reset
          </button>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`overflow-hidden rounded-[24px] border shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#1A2233]/90" : "border-border bg-card"}`}>
        <div className={`flex items-center justify-between border-b px-4 py-3 text-sm ${isDark ? "border-white/10 text-slate-400" : "border-border text-muted-foreground"}`}>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{filteredProducts.length} products matched</span>
          </div>
          <span className={isDark ? "text-slate-500" : "text-muted-foreground/60"}>Real-time inventory view</span>
         </div>
        {view === "table" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`text-left ${isDark ? "bg-slate-900/80 text-slate-400" : "bg-muted text-muted-foreground"}`}>
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`border-t ${isDark ? "border-white/10 text-slate-200" : "border-border text-foreground"}`}>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.sku}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.category}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.warehouse}</td>
                    <td className="px-4 py-3">{product.qty}</td>
                    <td className="px-4 py-3">{currency.format(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.status === "Critical" ? "bg-rose-500/10 text-rose-300" : product.status === "Low Stock" ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={8} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {view === "grid" && (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className={`rounded-[20px] border p-4 ${isDark ? "border-white/10 bg-slate-950/40" : "border-border bg-muted"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{product.name}</h4>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{product.sku}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.status === "Critical" ? "bg-rose-500/10 text-rose-300" : product.status === "Low Stock" ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                    {product.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{product.category}</p>
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{product.warehouse}</p>
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{product.supplier}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-500">
                  <span>Qty: {product.qty} · {currency.format(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(product)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(product.id)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className={`col-span-full px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                No products found.
              </div>
            )}
          </div>
        )}
      </motion.section>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={closeModal} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    {categories.map((cat) => (
                      <option key={cat.title} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Warehouse</label>
                  <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Qty</label>
                  <input type="number" min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Price</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Reorder Level</label>
                  <input type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductRecord["status"] })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Supplier</label>
                  <input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Lead Time (days)</label>
                <input type="number" min="0" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">{editingProduct ? "Update" : "Create"} Product</button>
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
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Delete product?</h3>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>This action cannot be undone. The product will be permanently removed.</p>
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
