"use client";

import { motion } from "framer-motion";
import { Check, MoonStar, Monitor, SunMedium, Bell, BellOff, Mail, MessageSquare, Package, Warehouse, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme, type Theme } from "@/components/theme-provider";

const tabs = ["Appearance", "Notifications", "Inventory", "Account"] as const;
const themes = [
  { name: "Light", icon: SunMedium },
  { name: "Dark", icon: MoonStar },
  { name: "System", icon: Monitor },
];

type Settings = {
  compactDensity: boolean;
  sidebarOpen: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlerts: boolean;
  autoReorder: boolean;
  defaultWarehouse: string;
  stockThreshold: number;
  profileVisibility: string;
  twoFactorAuth: boolean;
  showOnlineStatus: boolean;
};

const defaultSettings: Settings = {
  compactDensity: false,
  sidebarOpen: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  lowStockAlerts: true,
  autoReorder: false,
  defaultWarehouse: "main-warehouse",
  stockThreshold: 10,
  profileVisibility: "team",
  twoFactorAuth: false,
  showOnlineStatus: true,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Appearance");
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        // keep defaults
      }
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("app-settings", JSON.stringify(next));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-card p-5 shadow-[0_8px_30px_rgba(2,6,23,0.25)]">
        <div>
          <p className="text-sm text-muted-foreground">Preferences</p>
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">Configure appearance, notifications, and inventory defaults.</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-border bg-muted p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm transition ${activeTab === tab ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>
      </motion.section>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 z-50 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
          Settings saved
        </motion.div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.article key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-card p-5">
          {activeTab === "Appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Theme</h3>
                <p className="mt-1 text-sm text-muted-foreground">Choose how the app looks.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {themes.map((item) => {
                  const Icon = item.icon;
                  const selected = theme === item.name.toLowerCase();
                  return (
                    <button key={item.name} onClick={() => setTheme(item.name.toLowerCase() as Theme)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${selected ? "border-accent/40 bg-accent/10 text-accent" : "border-border bg-muted text-muted-foreground"}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      {selected ? <Check className="h-4 w-4" /> : null}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[20px] border border-border bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Compact density</p>
                    <p className="text-sm text-muted-foreground">Tighter spacing for more rows per screen.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.compactDensity} onChange={(e) => updateSetting("compactDensity", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Sidebar open by default</p>
                    <p className="text-sm text-muted-foreground">Keep navigation visible when you open the app.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.sidebarOpen} onChange={(e) => updateSetting("sidebarOpen", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                <p className="mt-1 text-sm text-muted-foreground">Manage how you receive alerts.</p>
              </div>
              <div className="rounded-[20px] border border-border bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.emailNotifications} onChange={(e) => updateSetting("emailNotifications", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <Bell className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Push notifications</p>
                      <p className="text-sm text-muted-foreground">Browser push alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.pushNotifications} onChange={(e) => updateSetting("pushNotifications", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <MessageSquare className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">SMS notifications</p>
                      <p className="text-sm text-muted-foreground">Text message alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.smsNotifications} onChange={(e) => updateSetting("smsNotifications", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Inventory" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Inventory</h3>
                <p className="mt-1 text-sm text-muted-foreground">Default inventory behavior and alerts.</p>
              </div>
              <div className="rounded-[20px] border border-border bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <Package className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Low stock alerts</p>
                      <p className="text-sm text-muted-foreground">Notify when items drop below threshold</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.lowStockAlerts} onChange={(e) => updateSetting("lowStockAlerts", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <Warehouse className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Auto-reorder enabled</p>
                      <p className="text-sm text-muted-foreground">Automatically create purchase orders</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.autoReorder} onChange={(e) => updateSetting("autoReorder", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Default warehouse</label>
                  <select value={settings.defaultWarehouse} onChange={(e) => updateSetting("defaultWarehouse", e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-accent">
                    <option value="main-warehouse">Main Warehouse</option>
                    <option value="east-wing">East Wing</option>
                    <option value="cold-storage">Cold Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Stock threshold</label>
                  <input type="number" value={settings.stockThreshold} onChange={(e) => updateSetting("stockThreshold", Number(e.target.value))} className="mt-1 w-40 rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
                  <p className="mt-1 text-xs text-muted-foreground">Alert when stock falls below this number.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account</h3>
                <p className="mt-1 text-sm text-muted-foreground">Security and privacy preferences.</p>
              </div>
              <div className="rounded-[20px] border border-border bg-muted p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Profile visibility</label>
                  <select value={settings.profileVisibility} onChange={(e) => updateSetting("profileVisibility", e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-accent">
                    <option value="private">Private</option>
                    <option value="team">Team only</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Two-factor authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.twoFactorAuth} onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Show online status</p>
                      <p className="text-sm text-muted-foreground">Let others see when you are active</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" checked={settings.showOnlineStatus} onChange={(e) => updateSetting("showOnlineStatus", e.target.checked)} />
                    <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-accent" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-foreground">Current preferences</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border bg-muted p-3">Active tab: {activeTab}</div>
            <div className="rounded-2xl border border-border bg-muted p-3">Theme selection: {theme}</div>
            <div className="rounded-2xl border border-border bg-muted p-3">Preferences stored locally via localStorage</div>
          </div>
        </motion.article>
      </section>
    </div>
  );
}
