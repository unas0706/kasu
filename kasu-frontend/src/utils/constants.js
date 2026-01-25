// Application constants
export const APP_NAME = "KASU GEETA ARTS";
export const APP_VERSION = "1.0.0";

// Order status constants
export const ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  DECLINED: "declined",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.ACCEPTED]: "Accepted",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.READY]: "Ready",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.DECLINED]: "Declined",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.ACCEPTED]: "primary",
  [ORDER_STATUS.PREPARING]: "purple",
  [ORDER_STATUS.READY]: "success",
  [ORDER_STATUS.COMPLETED]: "success",
  [ORDER_STATUS.DECLINED]: "danger",
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: "card",
  CASH: "cash",
  MOBILE: "mobile",
  ONLINE: "online",
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CARD]: "Credit Card",
  [PAYMENT_METHODS.CASH]: "Cash",
  [PAYMENT_METHODS.MOBILE]: "Mobile Payment",
  [PAYMENT_METHODS.ONLINE]: "Online",
};

// Order types
export const ORDER_TYPES = {
  TAKEAWAY: "takeaway",
  DELIVERY: "delivery",
};

export const ORDER_TYPE_LABELS = {
  [ORDER_TYPES.DINE_IN]: "Dine In",
  [ORDER_TYPES.TAKEAWAY]: "Takeaway",
  [ORDER_TYPES.DELIVERY]: "Delivery",
};

// Routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ITEMS: "/items",
  LIVE_ORDERS: "/live-orders",
  ORDERS_HISTORY: "/orders-history",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: "#0ea5e9",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  DANGER: "#ef4444",
  PURPLE: "#8b5cf6",
  GRAY: "#9ca3af",
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "kasu_geeta_user",
  THEME: "kasu_geeta_theme",
  ORDERS: "kasu_geeta_orders",
  CATEGORIES: "kasu_geeta_categories",
  ITEMS: "kasu_geeta_items",
  BUSINESS_SETTINGS: "kasu_geeta_business_settings",
  TAX_CONFIG: "kasu_geeta_tax_config",
};
