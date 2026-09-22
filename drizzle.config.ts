import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db-postgres.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5000/stockpilot",
  },
});
