"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CircleUserRound,
  LayoutGrid,
  Loader,
  Menu,
  MoonStar,
  Package,
  PackagePlus,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import { useState, useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { clsx } from "clsx";
import { adminUser } from "@/lib/app-data";
import { useRouter } from "next/navigation";

const menuSections = [
  {
    title: "Overview",
    items: [{ href: "/Admin/dashboard", label: "Dashboard", icon: LayoutGrid }],
  },
  {
    title: "Catalog",
    items: [
      { href: "/Admin/products", label: "Products", icon: Package },
      { href: "/Admin/categories", label: "Categories", icon: Boxes },
      { href: "/Admin/inventory", label: "Inventory", icon: Warehouse },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/Admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/Admin/suppliers", label: "Suppliers", icon: Truck },
      { href: "/Admin/warehouses", label: "Warehouses", icon: Warehouse },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/Admin/settings", label: "Settings", icon: Settings },
      { href: "/Admin/profile", label: "Profile", icon: ShieldCheck },
    ],
  },
];

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/Admin/products")) return { title: "Products", subtitle: "Catalog inventory" };
  if (pathname.startsWith("/Admin/categories")) return { title: "Categories", subtitle: "Product organization" };
  if (pathname.startsWith("/Admin/inventory")) return { title: "Inventory", subtitle: "Stock control" };
  if (pathname.startsWith("/Admin/orders")) return { title: "Orders", subtitle: "Operations" };
  if (pathname.startsWith("/Admin/suppliers")) return { title: "Suppliers", subtitle: "Vendor network" };
  if (pathname.startsWith("/Admin/warehouses")) return { title: "Warehouses", subtitle: "Storage locations" };
  if (pathname.startsWith("/Admin/settings")) return { title: "Settings", subtitle: "Preferences" };
  if (pathname.startsWith("/Admin/profile")) return { title: "Profile", subtitle: "Account details" };
  if (pathname.startsWith("/Admin/dashboard")) return { title: "Dashboard", subtitle: "Operations overview" };
  return { title: "Dashboard", subtitle: "Operations overview" };
}

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: ComponentType<{ className?: string }>; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-300",
        active
          ? "border-accent/40 bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
          : "border-border text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={clsx("h-4.5 w-4.5 transition-transform duration-300", active ? "text-accent" : "text-muted-foreground group-hover:scale-110")} />
      <span>{label}</span>
    </Link>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileName, setProfileName] = useState(adminUser.name);
  const [profileEmail, setProfileEmail] = useState(adminUser.email);
  const [avatarSvg, setAvatarSvg] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [quickOpen, setQuickOpen] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);
  const pageMeta = getPageMeta(pathname);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileName(data.name || adminUser.name);
          setProfileEmail(data.email || adminUser.email);
          setAvatarSvg(data.avatarSvg || null);
        }
      } catch {
        // keep fallback to adminUser
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickRef.current && !quickRef.current.contains(event.target as Node)) {
        setQuickOpen(false);
      }
    }
    if (quickOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [quickOpen]);

  function handleSync() {
    if (syncStatus !== "idle") return;
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
      setTimeout(() => setSyncStatus("idle"), 2000);
    }, 1500);
  }

  function handleQuickAction(href: string) {
    setQuickOpen(false);
    router.push(href);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-3 lg:px-4 lg:py-4">
        <div className="flex flex-1 overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_20px_70px_rgba(3,7,18,0.55)] backdrop-blur-xl">
          <aside className="hidden w-72 flex-col border-r border-border bg-sidebar p-4 lg:flex">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-muted p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/20">
                <PackagePlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">StockPilot</p>
                <p className="text-xs text-slate-400">Inventory</p>
              </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{section.title}</p>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return <NavItem key={item.href} {...item} active={active} icon={Icon} />;
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-border bg-muted p-3">
              <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden ${avatarSvg ? "bg-transparent" : "bg-gradient-to-br from-emerald-500 to-sky-500"}`}>
                {avatarSvg ? (
                  <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: avatarSvg }} />
                ) : (
                  <span className="text-sm font-semibold text-white">AU</span>
                )}
              </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{profileName}</p>
                  <p className="truncate text-xs text-muted-foreground">{profileEmail}</p>
                </div>
                <button className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-accent/30 hover:text-accent">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-border bg-card/70 px-4 py-3 backdrop-blur lg:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 lg:hidden"
                    onClick={() => setMobileOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>StockPilot</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-foreground/80">{pageMeta.title}</span>
                    </div>
                    <h1 className="text-lg font-semibold text-foreground">{pageMeta.subtitle}</h1>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-accent">Admin workspace · {adminUser.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <input className="w-36 bg-transparent outline-none placeholder:text-muted-foreground/60 sm:w-48" placeholder="Search products, orders..." />
                  </label>
                  <button onClick={handleSync} disabled={syncStatus !== "idle"} className="flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/20 disabled:opacity-70">
                    {syncStatus === "syncing" && <Loader className="h-4 w-4 animate-spin" />}
                    {syncStatus === "idle" && "Live ERP sync"}
                    {syncStatus === "synced" && "Synced"}
                  </button>
                  <button className="rounded-2xl border border-border bg-muted p-2 text-muted-foreground transition hover:border-accent/30 hover:text-accent">
                    <Bell className="h-4 w-4" />
                  </button>
                  <button className="rounded-2xl border border-border bg-muted p-2 text-muted-foreground transition hover:border-accent/30 hover:text-accent">
                    <MoonStar className="h-4 w-4" />
                  </button>
                  <div className="relative" ref={quickRef}>
                    <button onClick={() => setQuickOpen((prev) => !prev)} className="flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/20">
                      <Plus className="h-4 w-4" />
                      <span>Quick action</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${quickOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {quickOpen && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                          <button onClick={() => handleQuickAction("/Admin/products")} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left text-foreground transition hover:bg-muted">Add Product</button>
                          <button onClick={() => handleQuickAction("/Admin/orders")} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left text-foreground transition hover:bg-muted"></button>
                          <button onClick={() => handleQuickAction("/Admin/suppliers")} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left text-foreground transition hover:bg-muted">Add Supplier</button>
                          <button onClick={() => handleQuickAction("/Admin/warehouses")} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left text-foreground transition hover:bg-muted">Add Warehouse</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="h-full w-80 max-w-[82vw] border-r border-border bg-sidebar p-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500">
                    <PackagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">StockPilot</p>
                    <p className="text-xs text-muted-foreground">Inventory</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-xl border border-border p-2 text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-6">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{section.title}</p>
                    <div className="space-y-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return <NavItem key={item.href} {...item} active={active} icon={Icon} />;
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
