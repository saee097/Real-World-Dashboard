"use client";

import Link from "next/link";
import { Package2, Truck, ShieldCheck, TrendingUp } from "lucide-react";

const footerLinks = [
  { title: "Product", links: [{ href: "/products", label: "Products" }, { href: "/categories", label: "Categories" }, { href: "/orders", label: "Orders" }] },
  { title: "Company", links: [{ href: "/suppliers", label: "Suppliers" }, { href: "/warehouses", label: "Warehouses" }, { href: "/", label: "About" }] },
  { title: "Account", links: [{ href: "/login", label: "Sign in" }, { href: "/register", label: "Create account" }, { href: "/Admin/settings", label: "Settings" }] },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500">
                  <Package2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">StockPilot</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-slate-400">
                Professional inventory management for modern teams. Track stock, manage orders, and optimize your supply chain.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <Truck className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs text-slate-400">Supply Chain</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <ShieldCheck className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs text-slate-400">Secure Access</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <Package2 className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs text-slate-400">Inventory</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <TrendingUp className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs text-slate-400">Analytics</p>
                </div>
              </div>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 transition hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-sm text-slate-400"> StockPilot. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-slate-400 transition hover:text-accent">Sign in</Link>
            <Link href="/register" className="text-sm text-slate-400 transition hover:text-accent">Create account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
