"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Package2, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/warehouses", label: "Warehouses" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500">
                <Package2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">StockPilot</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-accent/15 text-accent"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:brightness-110"
            >
              Get started
            </Link>
          </div>
          <button
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-accent/15 text-accent"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground transition hover:brightness-110"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
