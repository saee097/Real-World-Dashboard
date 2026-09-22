"use client";

import { motion } from "framer-motion";
import { MapPin, Plus, RefreshCw, Pencil, Trash2, X, Grid2X2, List } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllWarehouses, addWarehouse, updateWarehouse, deleteWarehouse, type WarehouseRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const emptyWarehouse = {
  name: "",
  location: "",
  capacity: "",
  stored: 0,
  utilization: 0,
  since: "",
  status: "Healthy" as const,
};

export default function WarehousesPage() {
  const { resolvedTheme } = useTheme();
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseRecord | null>(null);
  const [form, setForm] = useState(emptyWarehouse);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    setWarehouses(getAllWarehouses());
  }, []);

  function refreshWarehouses() {
    setWarehouses(getAllWarehouses());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdd() {
    setEditingWarehouse(null);
    setForm(emptyWarehouse);
    setModalOpen(true);
  }

  function openEdit(warehouse: WarehouseRecord) {
    setEditingWarehouse(warehouse);
    setForm({
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity,
      stored: warehouse.stored,
      utilization: warehouse.utilization,
      since: warehouse.since,
      status: warehouse.status,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingWarehouse(null);
    setForm(emptyWarehouse);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, form);
    } else {
      addWarehouse(form);
    }
    refreshWarehouses();
    closeModal();
  }

  function handleDelete() {
    if (deleteId) {
      deleteWarehouse(deleteId);
      refreshWarehouses();
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
          Warehouse saved
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Storage operations</p>
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Warehouses</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Manage your storage locations and track utilization.</p>
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
              <Plus className="h-4 w-4" /> Add warehouse
            </button>
          </div>
        </div>
      </motion.section>

      {view === "grid" && (
        <section className="grid gap-4 xl:grid-cols-3">
          {warehouses.map((warehouse, index) => (
            <motion.article key={warehouse.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} className={`rounded-[22px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{warehouse.name}</h3>
                  <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{warehouse.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300`}>{warehouse.utilization}%</div>
                  <button onClick={() => openEdit(warehouse)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(warehouse.id)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className={`mt-4 flex items-center gap-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                <MapPin className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-muted-foreground/60"}`} /> {warehouse.location}
              </div>
              <div className="mt-4 space-y-3">
                <div className={`flex items-center justify-between text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                  <span>Capacity</span>
                  <span className={`font-medium ${isDark ? "text-white" : "text-foreground"}`}>{warehouse.capacity}</span>
                </div>
                <div className={`flex items-center justify-between text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                  <span>Products stored</span>
                  <span className={`font-medium ${isDark ? "text-white" : "text-foreground"}`}>{warehouse.stored}</span>
                </div>
                <div className={`mt-3 h-2 rounded-full ${isDark ? "bg-slate-800" : "bg-muted"}`}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500" style={{ width: `${warehouse.utilization}%` }} />
                </div>
                <p className={`pt-2 text-sm ${isDark ? "text-slate-500" : "text-muted-foreground/60"}`}>Since {warehouse.since}</p>
              </div>
            </motion.article>
          ))}
          {warehouses.length === 0 && (
            <div className={`col-span-full rounded-[24px] border p-8 text-center text-sm ${isDark ? "border-white/10 bg-[#161b22]/90 text-slate-400" : "border-border bg-card text-muted-foreground"}`}>
              No warehouses found.
            </div>
          )}
        </section>
      )}
      {view === "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={`text-left ${isDark ? "bg-slate-900/80 text-slate-400" : "bg-muted text-muted-foreground"}`}>
              <tr>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Stored</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Since</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id} className={`border-t ${isDark ? "border-white/10 text-slate-200" : "border-border text-foreground"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                        {warehouse.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{warehouse.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{warehouse.location}</td>
                  <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{warehouse.capacity}</td>
                  <td className="px-4 py-3">{warehouse.stored}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${warehouse.utilization > 90 ? "bg-rose-500/10 text-rose-300" : warehouse.utilization > 70 ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                      {warehouse.utilization}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${warehouse.status === "Healthy" ? "bg-emerald-500/10 text-emerald-300" : warehouse.status === "Watch" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
                      {warehouse.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{warehouse.since}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(warehouse)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(warehouse.id)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {warehouses.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                    No warehouses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}</h3>
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
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Capacity</label>
                  <input type="text" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as WarehouseRecord["status"] })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    <option value="Healthy">Healthy</option>
                    <option value="Watch">Watch</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Stored</label>
                  <input type="number" min="0" value={form.stored} onChange={(e) => setForm({ ...form, stored: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Utilization %</label>
                  <input type="number" min="0" max="100" value={form.utilization} onChange={(e) => setForm({ ...form, utilization: Number(e.target.value) })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Since</label>
                <input type="text" value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">{editingWarehouse ? "Update" : "Create"} Warehouse</button>
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
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Delete warehouse?</h3>
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
