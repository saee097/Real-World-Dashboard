"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Package2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to login");
        return;
      }

      login(data.user);
      if (data.user.role === "admin") {
        router.push("/Admin/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-card/90 p-8 shadow-[0_20px_70px_rgba(2,6,23,0.45)]"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
            <Package2 className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">StockPilot</h1>
          <p className="text-sm text-muted-foreground">Sign in to your inventory command center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-transparent px-10 py-2.5 text-sm text-foreground outline-none ring-0 transition focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-transparent px-10 py-2.5 text-sm text-foreground outline-none ring-0 transition focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
