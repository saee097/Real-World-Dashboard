import {
  pgTable,
  serial,
  varchar,
  timestamp,
  index,
  uniqueIndex,
  integer,
  numeric,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: serial("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  })
);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    warehouse: varchar("warehouse", { length: 100 }).notNull(),
    qty: integer("qty").notNull().default(0),
    reorderLevel: integer("reorder_level").notNull().default(0),
    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
    status: varchar("status", { length: 50 }).notNull().default("In Stock"),
    supplier: varchar("supplier", { length: 255 }).notNull(),
    leadTimeDays: integer("lead_time_days").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    skuIdx: uniqueIndex("products_sku_idx").on(table.sku),
  })
);

export const categories = pgTable(
  "categories",
  {
    title: varchar("title", { length: 100 }).primaryKey(),
    description: text("description").notNull(),
    products: integer("products").notNull().default(0),
    accent: varchar("accent", { length: 255 }).notNull(),
    health: varchar("health", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    type: varchar("type", { length: 50 }).notNull(),
    product: varchar("product", { length: 255 }).notNull(),
    supplier: varchar("supplier", { length: 255 }).notNull(),
    qty: integer("qty").notNull().default(0),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    status: varchar("status", { length: 50 }).notNull().default("Pending"),
    date: varchar("date", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const suppliers = pgTable(
  "suppliers",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 100 }).notNull(),
    address: text("address").notNull(),
    products: integer("products").notNull().default(0),
    since: varchar("since", { length: 50 }).notNull(),
    tier: varchar("tier", { length: 50 }).notNull().default("Standard"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const warehouses = pgTable(
  "warehouses",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    capacity: varchar("capacity", { length: 100 }).notNull(),
    stored: integer("stored").notNull().default(0),
    utilization: integer("utilization").notNull().default(0),
    since: varchar("since", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("Healthy"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
