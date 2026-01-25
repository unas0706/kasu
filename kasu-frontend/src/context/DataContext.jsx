import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
} from "date-fns";
import {
  sampleOrders,
  sampleCategories,
  sampleItems,
  sampleBusinessSettings,
  sampleTaxConfig,
  generateOrderId,
} from "../utils/sampleData";
import { ORDER_STATUS } from "../utils/constants";
import axios from "axios";

const DataContext = createContext();

const API = "http://localhost:5000/api";

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // Load from localStorage or use sample data
  const loadData = (key, sampleData) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : sampleData;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return sampleData;
    }
  };

  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [businessSettings, setBusinessSettings] = useState([]);
  const [taxConfig, setTaxConfig] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save data to localStorage whenever it changes
  useEffect(() => saveData("kasu_geeta_orders", orders), [orders]);
  useEffect(() => saveData("kasu_geeta_categories", categories), [categories]);
  useEffect(() => saveData("kasu_geeta_items", items), [items]);
  useEffect(
    () => saveData("kasu_geeta_business_settings", businessSettings),
    [businessSettings],
  );
  useEffect(() => saveData("kasu_geeta_tax_config", taxConfig), [taxConfig]);

  useEffect(() => {
    (fetchCategories(), fetchItems(), fetchOrdersHistory());
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/manager/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);

      setCategories(res.data);
    } catch (err) {
      console.log("Failed to load categories");
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/manager/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data.items);
      // console.log(res.data);
    } catch (err) {
      console.log("Failed to load categories");
      console.error(err);
    }
  };

  // orders/history
  const fetchOrdersHistory = async () => {
    try {
      const res = await axios.get(`${API}/manager/orders/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders);
      // console.log(res.data);
    } catch (err) {
      console.log("Failed to load orders history");
      console.error(err);
    }
  };

  // Orders Management
  const createOrder = useCallback(
    (orderData) => {
      setIsLoading(true);
      try {
        const newOrder = {
          ...orderData,
          orderId: generateOrderId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: ORDER_STATUS.PENDING,
          paymentStatus: "pending",
        };

        setOrders((prev) => [newOrder, ...prev]);

        // Update item stock
        orderData.items.forEach((item) => {
          const existingItem = items.find((i) => i.id === item.itemId);
          if (existingItem) {
            updateItem(item.itemId, {
              stock: Math.max(0, existingItem.stock - item.quantity),
            });
          }
        });

        // Add notification
        const newNotification = {
          id: Date.now(),
          type: "new_order",
          title: "New Order Received",
          message: `Order ${newOrder.orderId} from ${orderData.customer.name}`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);

        toast.success(`Order ${newOrder.orderId} created successfully`);
        return newOrder;
      } catch (error) {
        toast.error("Failed to create order");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [items],
  );

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order,
      ),
    );

    const statusMessages = {
      [ORDER_STATUS.ACCEPTED]: "Order accepted and moved to preparation",
      [ORDER_STATUS.PREPARING]: "Order is now being prepared",
      [ORDER_STATUS.READY]: "Order is ready for pickup/delivery",
      [ORDER_STATUS.COMPLETED]: "Order marked as completed",
      [ORDER_STATUS.DECLINED]: "Order has been declined",
    };

    toast.success(statusMessages[status] || "Order status updated");
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    toast.success("Order deleted successfully");
  }, []);

  // Categories Management
  const addCategory = useCallback((categoryData) => {
    const newCategory = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCategories((prev) => [newCategory, ...prev]);
    toast.success(`Category "${categoryData.name}" added successfully`);
    return newCategory;
  }, []);

  const updateCategory = useCallback((categoryId, updates) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, ...updates, updatedAt: new Date().toISOString() }
          : category,
      ),
    );
    toast.success("Category updated successfully");
  }, []);

  const deleteCategory = useCallback(
    (categoryId) => {
      // Check if category has items
      const categoryItems = items.filter(
        (item) => item.categoryId === categoryId,
      );
      if (categoryItems.length > 0) {
        toast.error("Cannot delete category with existing items");
        throw new Error("Category has existing items");
      }

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId),
      );
      toast.success("Category deleted successfully");
    },
    [items],
  );

  // Items Management
  const addItem = useCallback((itemData) => {
    const newItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    toast.success(`Item "${itemData.name}" added successfully`);
    return newItem;
  }, []);

  const updateItem = useCallback(
    (itemId, updates) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item,
        ),
      );

      // Check for low stock notification
      if (
        updates.stock !== undefined &&
        updates.stock <= businessSettings.lowStockAlert
      ) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          const newNotification = {
            id: Date.now(),
            type: "low_stock",
            title: "Low Stock Alert",
            message: `${item.name} is running low (${updates.stock} left)`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          setNotifications((prev) => [newNotification, ...prev]);
        }
      }
    },
    [items, businessSettings.lowStockAlert],
  );

  const deleteItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item deleted successfully");
  }, []);

  // Settings Management
  const updateBusinessSettings = useCallback((updates) => {
    setBusinessSettings((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    toast.success("Business settings updated");
  }, []);

  const updateTaxConfig = useCallback((updates) => {
    setTaxConfig((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    toast.success("Tax configuration updated");
  }, []);

  // Notifications
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Analytics Functions
  // Replace the getDashboardStats function with this corrected version:
  const getDashboardStats = useCallback(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    const todayOrders = orders.filter(
      (order) => order.createdAt && order.createdAt.startsWith(today),
    );

    const yesterdayOrders = orders.filter(
      (order) => order.createdAt && order.createdAt.startsWith(yesterday),
    );

    const totalRevenue = todayOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );
    const yesterdayRevenue = yesterdayOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    let revenueChange = 0;
    if (yesterdayRevenue > 0) {
      revenueChange =
        ((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    } else if (totalRevenue > 0) {
      revenueChange = 100; // If no revenue yesterday but revenue today, it's 100% increase
    }

    // Get unique customers from all orders (not just today)
    const allCustomers = orders
      .map((order) => order.customer?.email)
      .filter(Boolean);
    const activeCustomers = [...new Set(allCustomers)].length;

    const avgOrderValue =
      todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0;

    const pendingOrders = orders.filter(
      (order) => order.status === ORDER_STATUS.PENDING,
    ).length;

    // Also calculate monthly stats for analytics
    const monthStart = startOfMonth(new Date());
    const thisMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= monthStart;
    });
    const monthlyRevenue = thisMonthOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    return {
      todayRevenue: totalRevenue,
      todayOrders: todayOrders.length,
      pendingOrders,
      activeCustomers,
      avgOrderValue,
      revenueChange,
      monthlyRevenue,
      totalOrders: orders.length,
      yesterdayRevenue,
    };
  }, [orders]);
  // const getTopSellingItems = useCallback(
  //   (limit = 5, period = "today") => {
  //     let filteredOrders = orders;

  //     if (period === "today") {
  //       const today = format(new Date(), "yyyy-MM-dd");
  //       filteredOrders = orders.filter((order) =>
  //         order.createdAt.startsWith(today),
  //       );
  //     } else if (period === "week") {
  //       const weekAgo = subDays(new Date(), 7);
  //       filteredOrders = orders.filter(
  //         (order) => new Date(order.createdAt) >= weekAgo,
  //       );
  //     } else if (period === "month") {
  //       const monthStart = startOfMonth(new Date());
  //       filteredOrders = orders.filter(
  //         (order) => new Date(order.createdAt) >= monthStart,
  //       );
  //     }

  //     console.log(filteredOrders);

  //     const itemSales = {};

  //     filteredOrders.forEach((order) => {
  //       order.items.forEach((orderItem) => {
  //         if (!itemSales[orderItem.itemId]) {
  //           const item = items.find((i) => i.id === orderItem.itemId);
  //           if (item) {
  //             itemSales[orderItem.itemId] = {
  //               ...item,
  //               quantity: 0,
  //               revenue: 0,
  //             };
  //           }
  //         }
  //         if (itemSales[orderItem.itemId]) {
  //           itemSales[orderItem.itemId].quantity += orderItem.quantity;
  //           itemSales[orderItem.itemId].revenue += orderItem.subtotal;
  //         }
  //       });
  //     });

  //     return Object.values(itemSales)
  //       .sort((a, b) => b.revenue - a.revenue)
  //       .slice(0, limit);
  //   },
  //   [orders, items],
  // );

  const getTopSellingItems = useCallback(
    (limit = 5, period = "today") => {
      let filteredOrders = orders;

      if (period === "today") {
        const today = format(new Date(), "yyyy-MM-dd");
        filteredOrders = orders.filter((order) =>
          order.createdAt.startsWith(today),
        );
      } else if (period === "week") {
        const weekAgo = subDays(new Date(), 7);
        filteredOrders = orders.filter(
          (order) => new Date(order.createdAt) >= weekAgo,
        );
      } else if (period === "month") {
        const monthStart = startOfMonth(new Date());
        filteredOrders = orders.filter(
          (order) => new Date(order.createdAt) >= monthStart,
        );
      }

      const salesMap = {};

      items.forEach((item) => {
        salesMap[item._id.toString()] = {
          ...item,
          quantity: 0,
          revenue: 0,
        };
      });

      filteredOrders.forEach((order) => {
        order.items.forEach((orderItem) => {
          const itemId =
            typeof orderItem.item === "object"
              ? orderItem.item._id.toString()
              : orderItem.item.toString();

          if (salesMap[itemId]) {
            salesMap[itemId].quantity += orderItem.quantity;
            salesMap[itemId].revenue += orderItem.subtotal;
          }
        });
      });

      return Object.values(salesMap)
        .filter((item) => item.quantity > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    },
    [orders, items],
  );

  const getRevenueTrend = useCallback(
    (days = 7) => {
      const dates = eachDayOfInterval({
        start: subDays(new Date(), days - 1),
        end: new Date(),
      });

      return dates.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dailyOrders = orders.filter((order) =>
          order.createdAt.startsWith(dateStr),
        );
        const revenue = dailyOrders.reduce(
          (sum, order) => sum + order.total,
          0,
        );
        const orderCount = dailyOrders.length;

        return {
          date: format(date, "MMM dd"),
          revenue,
          orders: orderCount,
          avgOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        };
      });
    },
    [orders],
  );

  const getOrderStatusDistribution = useCallback(() => {
    const statusCounts = {};

    // Initialize all status counts to 0
    Object.values(ORDER_STATUS).forEach((status) => {
      statusCounts[status] = 0;
    });

    // Count orders by status
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    // Calculate percentages
    const totalOrders = orders.length;

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
    }));
  }, [orders]);

  const getPeakHours = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((order) =>
      order.createdAt.startsWith(today),
    );

    // Group by hour
    const hourCounts = Array(24).fill(0);

    todayOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour]++;
    });

    // Return only business hours (9 AM to 10 PM)
    return hourCounts.slice(9, 22).map((count, index) => ({
      hour: index + 9,
      label: `${index + 9 <= 12 ? index + 9 : index - 3}${index + 9 < 12 ? "AM" : "PM"}`,
      orders: count,
    }));
  }, [orders]);

  const getCategoryPerformance = useCallback(() => {
    const categoryRevenue = {};
    const categoryOrders = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Find the item to get its category
        const foundItem = items.find((i) => i.id === item.itemId);
        const category = foundItem?.categoryId || "Unknown";

        if (!categoryRevenue[category]) {
          categoryRevenue[category] = 0;
          categoryOrders[category] = 0;
        }

        categoryRevenue[category] += item.subtotal;
        categoryOrders[category] += 1;
      });
    });

    return Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({
        category,
        revenue,
        orders: categoryOrders[category],
        percentage:
          Object.values(categoryRevenue).reduce((a, b) => a + b, 0) > 0
            ? (revenue /
                Object.values(categoryRevenue).reduce((a, b) => a + b, 0)) *
              100
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders, items]);

  const getMonthlyRevenue = useCallback(
    (months = 6) => {
      const monthlyData = Array.from({ length: months }, (_, i) => {
        const date = subMonths(new Date(), months - i - 1);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);

        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        });

        const revenue = monthOrders.reduce(
          (sum, order) => sum + order.total,
          0,
        );
        const orderCount = monthOrders.length;

        return {
          month: format(date, "MMM"),
          year: format(date, "yyyy"),
          revenue,
          orders: orderCount,
          avgOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        };
      });

      return monthlyData;
    },
    [orders],
  );

  const value = {
    // State
    orders,
    categories,
    items,
    businessSettings,
    taxConfig,
    notifications,
    isLoading,

    // Orders
    createOrder,
    updateOrderStatus,
    deleteOrder,

    // Categories
    addCategory,
    updateCategory,
    deleteCategory,

    // Items
    addItem,
    updateItem,
    deleteItem,

    // Settings
    updateBusinessSettings,
    updateTaxConfig,

    // Notifications
    addNotification,
    markNotificationAsRead,
    clearNotifications,

    // Analytics
    getDashboardStats,
    getTopSellingItems,
    getRevenueTrend,
    getOrderStatusDistribution,
    getPeakHours,
    getCategoryPerformance,
    getMonthlyRevenue,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
