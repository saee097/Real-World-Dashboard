export type RoleType = "admin" | "manager" | "viewer";

export interface UserProfile {
  name: string;
  email: string;
  role: RoleType;
  title: string;
  region: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  warehouse: string;
  qty: number;
  reorderLevel: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Critical";
  supplier: string;
  leadTimeDays: number;
}

export interface OrderRecord {
  id: string;
  type: "Purchase" | "Sale" | "Transfer";
  product: string;
  supplier: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
}

export interface WarehouseRecord {
  name: string;
  id: string;
  location: string;
  capacity: string;
  stored: number;
  utilization: number;
  since: string;
  status: "Healthy" | "Watch" | "At Risk";
}

export interface SupplierRecord {
  name: string;
  id: string;
  email: string;
  phone: string;
  address: string;
  products: number;
  since: string;
  tier: "Strategic" | "Preferred" | "Standard";
}

export interface CategoryRecord {
  title: string;
  description: string;
  products: number;
  accent: string;
  health: string;
}

export const adminUser: UserProfile = {
  name: "Ava Chen",
  email: "admin@stockpilot.io",
  role: "admin",
  title: "Director of Supply Chain",
  region: "Seattle, United States",
};

export const products: ProductRecord[] = [
  {
    id: "PRD-1001",
    name: "AeroLite Chair",
    sku: "AL-204",
    category: "Furniture",
    warehouse: "Main Hub",
    qty: 42,
    reorderLevel: 18,
    price: 189,
    status: "In Stock",
    supplier: "North Supplies",
    leadTimeDays: 4,
  },
  {
    id: "PRD-1002",
    name: "Nova Headset",
    sku: "NH-118",
    category: "Electronics",
    warehouse: "East Dock",
    qty: 7,
    reorderLevel: 12,
    price: 149,
    status: "Low Stock",
    supplier: "Blue Harbor",
    leadTimeDays: 7,
  },
  {
    id: "PRD-1003",
    name: "Lumen Lamp",
    sku: "LL-703",
    category: "Lighting",
    warehouse: "North Bay",
    qty: 3,
    reorderLevel: 8,
    price: 89,
    status: "Critical",
    supplier: "Apex Supplies",
    leadTimeDays: 3,
  },
  {
    id: "PRD-1004",
    name: "Atlas Desk",
    sku: "AD-500",
    category: "Furniture",
    warehouse: "Main Hub",
    qty: 28,
    reorderLevel: 10,
    price: 549,
    status: "In Stock",
    supplier: "North Supplies",
    leadTimeDays: 6,
  },
  {
    id: "PRD-1005",
    name: "Pixel Monitor",
    sku: "PM-812",
    category: "Electronics",
    warehouse: "West Loop",
    qty: 11,
    reorderLevel: 9,
    price: 329,
    status: "Low Stock",
    supplier: "GreenOrbit",
    leadTimeDays: 5,
  },
];

export const orders: OrderRecord[] = [
  {
    id: "ORD-1042",
    type: "Purchase",
    product: "AeroLite Chair",
    supplier: "North Supplies",
    qty: 24,
    unitPrice: 189,
    total: 4536,
    status: "Pending",
    date: "2026-07-27",
  },
  {
    id: "ORD-1043",
    type: "Sale",
    product: "Nova Headset",
    supplier: "Blue Harbor",
    qty: 12,
    unitPrice: 149,
    total: 1788,
    status: "Completed",
    date: "2026-07-26",
  },
  {
    id: "ORD-1044",
    type: "Transfer",
    product: "Lumen Lamp",
    supplier: "Hub Logistics",
    qty: 18,
    unitPrice: 89,
    total: 1602,
    status: "Cancelled",
    date: "2026-07-24",
  },
  {
    id: "ORD-1045",
    type: "Purchase",
    product: "Atlas Desk",
    supplier: "North Supplies",
    qty: 8,
    unitPrice: 549,
    total: 4392,
    status: "Completed",
    date: "2026-07-23",
  },
];

export const warehouses: WarehouseRecord[] = [
  { name: "Main Hub", id: "WH-01", location: "Seattle, WA", capacity: "50,000 units", stored: 36, utilization: 72, since: "Mar 2022", status: "Healthy" },
  { name: "East Dock", id: "WH-02", location: "Chicago, IL", capacity: "24,000 units", stored: 18, utilization: 75, since: "Jul 2023", status: "Watch" },
  { name: "North Bay", id: "WH-03", location: "Denver, CO", capacity: "18,000 units", stored: 10, utilization: 56, since: "Nov 2024", status: "Healthy" },
  { name: "West Loop", id: "WH-04", location: "Austin, TX", capacity: "16,000 units", stored: 15, utilization: 94, since: "Jan 2025", status: "At Risk" },
];

export const suppliers: SupplierRecord[] = [
  { name: "Apex Supplies", id: "SUP-001", email: "ops@apex.co", phone: "+1 415 555 0148", address: "San Francisco, CA", products: 16, since: "Jan 2023", tier: "Strategic" },
  { name: "GreenOrbit", id: "SUP-002", email: "orders@greenorbit.io", phone: "+49 30 555 7842", address: "Berlin, DE", products: 8, since: "Sep 2022", tier: "Preferred" },
  { name: "Northline Co.", id: "SUP-003", email: "sales@northline.co", phone: "+1 646 555 0129", address: "New York, NY", products: 12, since: "Apr 2024", tier: "Standard" },
];

export const categories: CategoryRecord[] = [
  { title: "Apparel", description: "Clothing, footwear, and accessories", products: 6, accent: "from-fuchsia-500 to-violet-500", health: "Steady" },
  { title: "Electronics", description: "Devices, audio, and peripherals", products: 14, accent: "from-sky-500 to-cyan-500", health: "Demand spikes" },
  { title: "Home & Kitchen", description: "Furniture, decor, and cookware", products: 9, accent: "from-emerald-500 to-lime-500", health: "Balanced" },
  { title: "Office Supplies", description: "Desks, stationery, and organizers", products: 8, accent: "from-amber-500 to-orange-500", health: "Seasonal" },
  { title: "Tools", description: "Repair, build, and maintenance gear", products: 5, accent: "from-rose-500 to-red-500", health: "Watch" },
];

export const dashboardStats = [
  { label: "Total Products", value: "2,840", change: "+12.4%", icon: "Package" },
  { label: "Stock Value", value: "$1.28M", change: "+8.1%", icon: "DollarSign" },
  { label: "Pending Orders", value: "184", change: "-3.2%", icon: "ShoppingCart" },
  { label: "Warehouse Count", value: "9", change: "+2", icon: "Warehouse" },
];

export const lowStockItems = [
  { name: "AeroLite Chair", sku: "AL-204", qty: 7, status: "Critical" },
  { name: "Nova Headset", sku: "NH-118", qty: 3, status: "Low" },
  { name: "Lumen Lamp", sku: "LL-703", qty: 5, status: "Low" },
];

export const demandSeries = [
  { month: "Jan", sales: 420, purchases: 310 },
  { month: "Feb", sales: 500, purchases: 360 },
  { month: "Mar", sales: 480, purchases: 395 },
  { month: "Apr", sales: 610, purchases: 430 },
  { month: "May", sales: 590, purchases: 470 },
  { month: "Jun", sales: 700, purchases: 510 },
];

export const categoryMix = [
  { name: "Electronics", value: 38 },
  { name: "Furniture", value: 24 },
  { name: "Office", value: 19 },
  { name: "Apparel", value: 19 },
];

export const recentOrders = [
  { id: "SO-1042", customer: "North Labs", amount: "$8,920", status: "Processing" },
  { id: "PO-2241", customer: "Apex Retail", amount: "$3,450", status: "Approved" },
  { id: "TR-018", customer: "Blue Harbor", amount: "$1,280", status: "In Transit" },
];

export const appRoutes = ["/dashboard", "/products", "/categories", "/inventory", "/orders", "/suppliers", "/warehouses", "/settings", "/profile"] as const;

export function hasRouteAccess(role: RoleType, pathname: string) {
  if (role === "admin") {
    return true;
  }

  const allowedRoutes = {
    manager: ["/dashboard", "/products", "/inventory", "/orders", "/settings", "/profile"],
    viewer: ["/dashboard", "/profile"],
  } satisfies Record<Exclude<RoleType, "admin">, string[]>;

  return allowedRoutes[role].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}


const ORDERS_STORAGE_KEY = "orders-data";

function loadOrders(): OrderRecord[] {
  if (typeof window === "undefined") return orders;
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return orders;
    }
  }
  return orders;
}

function saveOrders(data: OrderRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data));
}

export function getAllOrders(): OrderRecord[] {
  return loadOrders();
}

export function addOrder(order: Omit<OrderRecord, "id">): OrderRecord {
  const all = loadOrders();
  const maxId = all.reduce((max, o) => {
    const num = parseInt(o.id.replace("ORD-", ""), 10);
    return num > max ? num : max;
  }, 1000);
  const newOrder: OrderRecord = { ...order, id: `ORD-${maxId + 1}` };
  all.push(newOrder);
  saveOrders(all);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<Omit<OrderRecord, "id">>): OrderRecord | null {
  const all = loadOrders();
  const index = all.findIndex((o) => o.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveOrders(all);
  return all[index];
}

export function deleteOrder(id: string): boolean {
  const all = loadOrders();
  const filtered = all.filter((o) => o.id !== id);
  if (filtered.length === all.length) return false;
  saveOrders(filtered);
  return true;
}

export function getFilteredOrders(filters: { search?: string; status?: string; type?: string; supplier?: string }) {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";
  const normalizedStatus = filters.status?.trim() ?? "all";
  const normalizedType = filters.type?.trim() ?? "all";
  const normalizedSupplier = filters.supplier?.trim() ?? "all";

  const allOrders = loadOrders();

  return allOrders.filter((order) => {
    const searchMatches = !normalizedSearch || `${order.id} ${order.product} ${order.supplier}`.toLowerCase().includes(normalizedSearch);
    const statusMatches = normalizedStatus === "all" || order.status === normalizedStatus;
    const typeMatches = normalizedType === "all" || order.type === normalizedType;
    const supplierMatches = normalizedSupplier === "all" || order.supplier === normalizedSupplier;

    return searchMatches && statusMatches && typeMatches && supplierMatches;
  });
}

const PRODUCTS_STORAGE_KEY = "products-data";
const CATEGORIES_STORAGE_KEY = "categories-data";
const SUPPLIERS_STORAGE_KEY = "suppliers-data";
const WAREHOUSES_STORAGE_KEY = "warehouses-data";

function loadArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function saveArray<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getAllProducts(): ProductRecord[] {
  return loadArray(PRODUCTS_STORAGE_KEY, products);
}

export function addProduct(product: Omit<ProductRecord, "id">): ProductRecord {
  const all = loadArray(PRODUCTS_STORAGE_KEY, products);
  const maxNum = all.reduce((max, p) => {
    const num = parseInt(p.id.replace("PRD-", ""), 10);
    return num > max ? num : max;
  }, 1000);
  const newProduct: ProductRecord = { ...product, id: `PRD-${maxNum + 1}` };
  all.push(newProduct);
  saveArray(PRODUCTS_STORAGE_KEY, all);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Omit<ProductRecord, "id">>): ProductRecord | null {
  const all = loadArray(PRODUCTS_STORAGE_KEY, products);
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveArray(PRODUCTS_STORAGE_KEY, all);
  return all[index];
}

export function deleteProduct(id: string): boolean {
  const all = loadArray(PRODUCTS_STORAGE_KEY, products);
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  saveArray(PRODUCTS_STORAGE_KEY, filtered);
  return true;
}

export function getFilteredProducts(filters: { search?: string; category?: string; status?: string; warehouse?: string }) {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";
  const normalizedCategory = filters.category?.trim() ?? "all";
  const normalizedStatus = filters.status?.trim() ?? "all";
  const normalizedWarehouse = filters.warehouse?.trim() ?? "all";

  const allProducts = loadArray(PRODUCTS_STORAGE_KEY, products);

  return allProducts.filter((product) => {
    const nameMatches = !normalizedSearch || `${product.name} ${product.sku}`.toLowerCase().includes(normalizedSearch);
    const categoryMatches = normalizedCategory === "all" || product.category === normalizedCategory;
    const statusMatches = normalizedStatus === "all" || product.status === normalizedStatus;
    const warehouseMatches = normalizedWarehouse === "all" || product.warehouse === normalizedWarehouse;

    return nameMatches && categoryMatches && statusMatches && warehouseMatches;
  });
}

export function getAllCategories(): CategoryRecord[] {
  return loadArray(CATEGORIES_STORAGE_KEY, categories);
}

export function addCategory(category: Omit<CategoryRecord, "title"> & { title: string }): CategoryRecord {
  const all = loadArray(CATEGORIES_STORAGE_KEY, categories);
  const newCategory: CategoryRecord = { ...category };
  all.push(newCategory);
  saveArray(CATEGORIES_STORAGE_KEY, all);
  return newCategory;
}

export function updateCategory(title: string, updates: Partial<Omit<CategoryRecord, "title">>): CategoryRecord | null {
  const all = loadArray(CATEGORIES_STORAGE_KEY, categories);
  const index = all.findIndex((c) => c.title === title);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveArray(CATEGORIES_STORAGE_KEY, all);
  return all[index];
}

export function deleteCategory(title: string): boolean {
  const all = loadArray(CATEGORIES_STORAGE_KEY, categories);
  const filtered = all.filter((c) => c.title !== title);
  if (filtered.length === all.length) return false;
  saveArray(CATEGORIES_STORAGE_KEY, filtered);
  return true;
}

export function getAllSuppliers(): SupplierRecord[] {
  return loadArray(SUPPLIERS_STORAGE_KEY, suppliers);
}

export function addSupplier(supplier: Omit<SupplierRecord, "id">): SupplierRecord {
  const all = loadArray(SUPPLIERS_STORAGE_KEY, suppliers);
  const maxNum = all.reduce((max, s) => {
    const num = parseInt(s.id.replace("SUP-", ""), 10);
    return num > max ? num : max;
  }, 0);
  const newSupplier: SupplierRecord = { ...supplier, id: `SUP-${String(maxNum + 1).padStart(3, "0")}` };
  all.push(newSupplier);
  saveArray(SUPPLIERS_STORAGE_KEY, all);
  return newSupplier;
}

export function updateSupplier(id: string, updates: Partial<Omit<SupplierRecord, "id">>): SupplierRecord | null {
  const all = loadArray(SUPPLIERS_STORAGE_KEY, suppliers);
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveArray(SUPPLIERS_STORAGE_KEY, all);
  return all[index];
}

export function deleteSupplier(id: string): boolean {
  const all = loadArray(SUPPLIERS_STORAGE_KEY, suppliers);
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  saveArray(SUPPLIERS_STORAGE_KEY, filtered);
  return true;
}

export function getAllWarehouses(): WarehouseRecord[] {
  return loadArray(WAREHOUSES_STORAGE_KEY, warehouses);
}

export function addWarehouse(warehouse: Omit<WarehouseRecord, "id">): WarehouseRecord {
  const all = loadArray(WAREHOUSES_STORAGE_KEY, warehouses);
  const maxNum = all.reduce((max, w) => {
    const num = parseInt(w.id.replace("WH-", ""), 10);
    return num > max ? num : max;
  }, 0);
  const newWarehouse: WarehouseRecord = { ...warehouse, id: `WH-${String(maxNum + 1).padStart(2, "0")}` };
  all.push(newWarehouse);
  saveArray(WAREHOUSES_STORAGE_KEY, all);
  return newWarehouse;
}

export function updateWarehouse(id: string, updates: Partial<Omit<WarehouseRecord, "id">>): WarehouseRecord | null {
  const all = loadArray(WAREHOUSES_STORAGE_KEY, warehouses);
  const index = all.findIndex((w) => w.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveArray(WAREHOUSES_STORAGE_KEY, all);
  return all[index];
}

export function deleteWarehouse(id: string): boolean {
  const all = loadArray(WAREHOUSES_STORAGE_KEY, warehouses);
  const filtered = all.filter((w) => w.id !== id);
  if (filtered.length === all.length) return false;
  saveArray(WAREHOUSES_STORAGE_KEY, filtered);
  return true;
}
