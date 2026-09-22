"use client";

import { motion } from "framer-motion";
import { Grid2X2, List, Plus, Search, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllCategories, addCategory, updateCategory, deleteCategory, type CategoryRecord } from "@/lib/app-data";
import { useTheme } from "@/components/theme-provider";

const accentOptions = [
  "from-fuchsia-500 to-violet-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-lime-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-blue-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-emerald-500",
];

const emptyCategory = {
  title: "",
  description: "",
  products: 0,
  accent: "from-sky-500 to-cyan-500",
  health: "Balanced",
};

export default function CategoriesPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { resolvedTheme } = useTheme();
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [deleteTitle, setDeleteTitle] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCategories(getAllCategories());
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  function refreshCategories() {
    setCategories(getAllCategories());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function openAdd() {
    setEditingCategory(null);
    setForm(emptyCategory);
    setModalOpen(true);
  }

  function openEdit(category: CategoryRecord) {
    setEditingCategory(category);
    setForm({
      title: category.title,
      description: category.description,
      products: category.products,
      accent: category.accent,
      health: category.health,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyCategory);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.title, form);
    } else {
      addCategory(form);
    }
    refreshCategories();
    closeModal();
  }

  function handleDelete() {
    if (deleteTitle) {
      deleteCategory(deleteTitle);
      refreshCategories();
      setDeleteTitle(null);
    }
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="space-y-6">
      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 z-50 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
          Category saved
        </motion.div>
      )}

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Catalog management</p>
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Categories</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Organize your products into categories for easier discovery.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center rounded-2xl border border-white/10 bg-slate-950/40 p-1">
              <button onClick={() => setView("grid")} className={`rounded-xl p-2 ${view === "grid" ? "bg-sky-500/20 text-sky-200" : "text-slate-400"}`}>
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button onClick={() => setView("table")} className={`rounded-xl p-2 ${view === "table" ? "bg-sky-500/20 text-sky-200" : "text-slate-400"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
         
            <button onClick={openAdd} className="flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-medium text-white">
              <Plus className="h-4 w-4" /> Add category
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <label className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-slate-950/40 text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Search categories" />
          </label>
        </div>
      </motion.section>

      <section className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
        {filteredCategories.map((category, index) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`rounded-[22px] border p-4 shadow-[0_8px_30px_rgba(2,6,23,0.25)] ${view === "table" ? "flex items-center justify-between" : ""} ${isDark ? "border-white/10 bg-[#161b22]/90" : "border-border bg-card"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent}`}>
                <span className="text-sm font-semibold text-white">{category.title.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{category.title}</h3>
                <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{category.description}</p>
                {view === "grid" ? <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm ${isDark ? "bg-slate-800/70 text-slate-300" : "bg-muted text-muted-foreground"}`}>{category.products} products</div> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {view === "table" ? <div className={`rounded-full px-3 py-1 text-sm ${isDark ? "bg-slate-800/70 text-slate-300" : "bg-muted text-muted-foreground"}`}>{category.products} products</div> : null}
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(category)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200" : "border-border text-muted-foreground hover:border-accent/30 hover:text-accent"}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTitle(category.title)} className={`rounded-xl border p-2 transition ${isDark ? "border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-200" : "border-border text-muted-foreground hover:border-rose-400/30 hover:text-rose-500"}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
        {filteredCategories.length === 0 && (
          <div className={`col-span-full rounded-[24px] border p-8 text-center text-sm ${isDark ? "border-white/10 bg-[#161b22]/90 text-slate-400" : "border-border bg-card text-muted-foreground"}`}>
            No categories found.
          </div>
        )}
      </section>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-lg rounded-[24px] border p-6 ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button onClick={closeModal} className={`rounded-xl border p-2 ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Accent gradient</label>
                  <select value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`}>
                    {accentOptions.map((accent) => (
                      <option key={accent} value={accent}>{accent}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-foreground"}`}>Health</label>
                  <input type="text" value={form.health} onChange={(e) => setForm({ ...form, health: e.target.value })} required className={`mt-1 w-full rounded-2xl border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-slate-950/40 text-slate-200" : "border-border bg-muted text-foreground"}`} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">{editingCategory ? "Update" : "Create"} Category</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {deleteTitle && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteTitle(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full max-w-sm rounded-[24px] border p-6 text-center ${isDark ? "border-white/10 bg-[#161b22]" : "border-border bg-card"}`} onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
              <Trash2 className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>Delete category?</h3>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>This action cannot be undone.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setDeleteTitle(null)} className={`rounded-2xl border px-4 py-2 text-sm ${isDark ? "border-white/10 text-slate-300" : "border-border text-muted-foreground"}`}>Cancel</button>
              <button onClick={handleDelete} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
