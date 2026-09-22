"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, Camera, Lock, Mail, MapPin, Phone, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { label: "Products Managed", value: "18", detail: "Active SKU" },
  { label: "Orders Processed", value: "42", detail: "This month" },
  { label: "Member Since", value: "Mar 12, 2024", detail: "Onboarded" },
  { label: "Last Login", value: "06:42 UTC", detail: "Today" },
];

const colors = ["from-sky-500 to-cyan-500", "from-fuchsia-500 to-violet-500", "from-emerald-500 to-lime-500", "from-amber-500 to-orange-500"];

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  timezone: string;
  bio: string;
  avatarColorIndex: number;
  avatarSvg: string | null;
}

const emptyForm: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  role: "",
  location: "",
  timezone: "",
  bio: "",
  avatarColorIndex: 0,
  avatarSvg: null,
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState(0);
  const [avatarSvgPreview, setAvatarSvgPreview] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.title || "",
          location: data.location || "",
          timezone: data.timezone || "",
          bio: data.bio || "",
          avatarColorIndex: data.avatarColorIndex ?? 0,
          avatarSvg: data.avatarSvg ?? null,
        });
        setActiveColor(data.avatarColorIndex ?? 0);
        setAvatarSvgPreview(data.avatarSvg ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: form.role,
        }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const updated = await res.json();
      setForm({
        name: updated.name || form.name,
        email: updated.email || form.email,
        phone: updated.phone || form.phone,
        role: updated.title || form.role,
        location: updated.location || form.location,
        timezone: updated.timezone || form.timezone,
        bio: updated.bio || form.bio,
        avatarColorIndex: updated.avatarColorIndex ?? form.avatarColorIndex,
        avatarSvg: updated.avatarSvg ?? form.avatarSvg,
      });
      setActiveColor(updated.avatarColorIndex ?? activeColor);
      setAvatarSvgPreview(updated.avatarSvg ?? avatarSvgPreview);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "Admin User",
      email: "admin@stockpilot.io",
      phone: "+1 415 555 0198",
      role: "Inventory Administrator",
      location: "Seattle, United States",
      timezone: "UTC-8",
      bio: "Leading inventory operations with a focus on speed, accuracy, and forecasting.",
      avatarColorIndex: 0,
      avatarSvg: null,
    });
    setActiveColor(0);
    setAvatarSvgPreview(null);
    setSuccess(null);
    setError(null);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("Password updated successfully");
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/svg+xml") {
      setError("Please upload a valid SVG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setAvatarSvgPreview(text);
      setForm({ ...form, avatarSvg: text });
    };
    reader.readAsText(file);
  };

  const handleRemoveSvg = () => {
    setAvatarSvgPreview(null);
    setForm({ ...form, avatarSvg: null });
  };

  const initials = form.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Account</p>
            <h2 className="text-2xl font-semibold text-white">Profile</h2>
            <p className="mt-2 text-sm text-slate-400">Manage your personal information, avatar, and security settings.</p>
          </div>
          <button onClick={handleReset} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[20px] border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{stat.value}</h3>
              <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-3xl overflow-hidden ${avatarSvgPreview || form.avatarSvg ? "bg-transparent" : `bg-gradient-to-br ${colors[activeColor]}`}`}>
              {avatarSvgPreview || form.avatarSvg ? (
                <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: avatarSvgPreview || form.avatarSvg || "" }} />
              ) : (
                <span className="text-xl font-semibold text-white">{initials}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{form.name}</h3>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-300">
                <ShieldCheck className="h-4 w-4" /> {form.role || "Inventory Administrator"}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"><Phone className="h-4 w-4 text-slate-500" /> {form.phone}</div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"><Mail className="h-4 w-4 text-slate-500" /> {form.email}</div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"><MapPin className="h-4 w-4 text-slate-500" /> {form.location}</div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"><ArrowLeftRight className="h-4 w-4 text-slate-500" /> {form.timezone}</div>
          </div>
        </motion.article>

        <div className="space-y-6">
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-400">
                Full Name
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm text-slate-400">
                Email
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm text-slate-400">
                Phone
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-400">
                Role
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-400">
                Location
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </label>
              <label className="text-sm text-slate-400">
                Timezone
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                />
              </label>
            </form>
            <label className="mt-4 block text-sm text-slate-400">
              Bio
              <textarea
                className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </label>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={handleSubmit} disabled={saving} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save changes"}
              </button>
              {success && <span className="text-sm text-emerald-400">{success}</span>}
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5">
            <h3 className="text-lg font-semibold text-white">Avatar</h3>
            <p className="mt-1 text-sm text-slate-400">Upload an SVG image for your profile avatar.</p>
            <div className="mt-4 flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20">
                <Camera className="h-4 w-4" />
                <span>{avatarSvgPreview || form.avatarSvg ? "Replace SVG" : "Upload SVG"}</span>
                <input type="file" accept=".svg,image/svg+xml" onChange={handleSvgUpload} className="hidden" />
              </label>
              {(avatarSvgPreview || form.avatarSvg) && (
                <button type="button" onClick={handleRemoveSvg} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/30 hover:text-red-400">
                  Remove
                </button>
              )}
            </div>
            {avatarSvgPreview || form.avatarSvg ? (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
                  <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: avatarSvgPreview || form.avatarSvg || "" }} />
                </div>
                <p className="text-xs text-slate-400">SVG avatar active</p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">No SVG uploaded. Using initials with selected color.</p>
            )}
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5">
            <h3 className="text-lg font-semibold text-white">Avatar Color</h3>
            <div className="mt-4 flex gap-3">
              {colors.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setActiveColor(index);
                    setForm({ ...form, avatarColorIndex: index });
                  }}
                  className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} ${activeColor === index ? "ring-2 ring-white/60" : ""}`}
                />
              ))}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-[#161b22]/90 p-5">
            <h3 className="text-lg font-semibold text-white">Security</h3>
            <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-3">
              <label className="block text-sm text-slate-400">
                Current Password
                <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none" required />
              </label>
              <label className="block text-sm text-slate-400">
                New Password
                <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none" required />
              </label>
              <label className="block text-sm text-slate-400">
                Confirm Password
                <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none" required />
              </label>
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white">
                  Update password
                </button>
                {passwordMsg && <span className="text-sm text-emerald-400">{passwordMsg}</span>}
              </div>
            </form>
          </motion.article>
        </div>
      </section>
    </div>
  );
}
