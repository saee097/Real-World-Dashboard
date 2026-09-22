"use client";

import { motion } from "framer-motion";
import { Plus, RefreshCw, Search, Pencil, Trash2, X, Grid2X2, List } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, type SupplierRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const emptySupplier = {
  name: "",
  email: "",
  phone: "",
  address: "",
  products: 0,
  since: "",
  tier: "Standard" as const,
};

export default function SuppliersPage() {
  const { resolvedTheme } = useTheme();
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierRecord | null>(null);
  const [form, setForm] = useState(emptySupplier);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    setSuppliers(getAllSuppliers());
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  function refreshSuppliers() {
    setSuppliers(getAllSuppliers());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdd() {
    setEditingSupplier(null);
    setForm(emptySupplier);
    setModalOpen(true);
  }

  function openEdit(supplier: SupplierRecord) {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      products: supplier.products,
      since: supplier.since,
      tier: supplier.tier,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingSupplier(null);
    setForm(emptySupplier);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, form);
    } else {
      addSupplier(form);
    }
    refreshSuppliers();
    closeModal();
  }

  function handleDelete() {
    if (deleteId) {
      deleteSupplier(deleteId);
      refreshSuppliers();
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
          Supplier saved
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Vendor network</p>
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Suppliers</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Manage vendor relationships and contact information.</p>
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
              <Plus className="h-4 w-4" /> Add supplier
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <label className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Search by name or email" />
          </label>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`overflow-hidden rounded-[24px] border shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
        {view === "table" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`text-left ${isDark ? "bg-slate-900/80 text-slate-400" : "bg-muted text-muted-foreground"}`}>
                <tr>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Since</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className={`border-t ${isDark ? "border-white/10 text-slate-200" : "border-border text-foreground"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                          {supplier.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.email}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.phone}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.address}</td>
                    <td className="px-4 py-3">{supplier.products}</td>
                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.since}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(supplier)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(supplier.id)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {view === "grid" && (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className={`rounded-[20px] border p-4 ${isDark ? "border-white/10 bg-slate-950/40" : "border-border bg-muted"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{supplier.id}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${supplier.tier === "Strategic" ? "bg-sky-500/10 text-sky-300" : supplier.tier === "Preferred" ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
                    {supplier.tier}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{supplier.email}</p>
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{supplier.phone}</p>
                  <p className={isDark ? "text-slate-400" : "text-muted-foreground"}>{supplier.address}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-500">
                  <span>Since {supplier.since} · {supplier.products} products</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(supplier)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(supplier.id)} className={`rounded-lg border p-1.5 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredSuppliers.length === 0 && (
              <div className={`col-span-full px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                No suppliers found.
              </div>
            )}
          </div>
        )}
      </motion.section>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h3>
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
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Phone</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Tier</label>
                  <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as SupplierRecord["tier"] })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="Strategic">Strategic</option>
                    <option value="Preferred">Preferred</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Products count</label>
                  <input type="number" min="0" value={form.products} onChange={(e) => setForm({ ...form, products: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Since</label>
                  <input type="text" value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">{editingSupplier ? "Update" : "Create"} Supplier</button>
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
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Delete supplier?</h3>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>This action cannot be undone.</p>
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
