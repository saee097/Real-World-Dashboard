import { promises as fs } from "fs";
import path from "path";

export interface ProfileRecord {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  title: string;
  region: string;
  phone: string;
  location: string;
  timezone: string;
  bio: string;
  avatarColorIndex: number;
  avatarSvg: string | null;
  createdAt: string;
  updatedAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_PROFILE: ProfileRecord = {
  id: "1",
  name: "Admin User",
  email: "admin@stockpilot.io",
  role: "admin",
  title: "Inventory Administrator",
  region: "Seattle, United States",
  phone: "+1 415 555 0198",
  location: "Seattle, United States",
  timezone: "UTC-8",
  bio: "Leading inventory operations with a focus on speed, accuracy, and forecasting.",
  avatarColorIndex: 0,
  avatarSvg: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function readDb(): Promise<{ profile: ProfileRecord }> {
  try {
    const file = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(file);
  } catch {
    const initial = { profile: DEFAULT_PROFILE };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export async function writeDb(data: { profile: ProfileRecord }): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProfile(): Promise<ProfileRecord> {
  const db = await readDb();
  return db.profile;
}

export async function updateProfile(updates: Partial<ProfileRecord>): Promise<ProfileRecord> {
  const db = await readDb();
  const now = new Date().toISOString();
  db.profile = { ...db.profile, ...updates, updatedAt: now };
  await writeDb(db);
  return db.profile;
}
