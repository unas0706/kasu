const Category = require("../models/category.model");
const Item = require("../models/item.model");
const Order = require("../models/order.model");
const Settings = require("../models/settings.model");
const Tax = require("../models/tax.model");
const { calculateOrderSummary } = require("../utils/helpers");
const { format, subDays, startOfDay, endOfDay } = require("date-fns");

// Dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const yesterday = subDays(today, 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    // Today's revenue
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      status: { $nin: ["declined", "cancelled"] },
    });

    const yesterdayOrders = await Order.find({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
      status: { $nin: ["declined", "cancelled"] },
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const yesterdayRevenue = yesterdayOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const revenueChange =
      yesterdayRevenue > 0
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
        : 0;

    // Orders count
    const todayOrdersCount = todayOrders.length;
    const yesterdayOrdersCount = yesterdayOrders.length;
    const ordersChange =
      yesterdayOrdersCount > 0
        ? ((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) *
          100
        : 0;

    // Active customers (unique customers who placed orders today)
    const todayCustomers = new Set(
      todayOrders.map((order) => order.customer.phone),
    );
    const activeCustomers = todayCustomers.size;

    // Average order value
    const avgOrderValue =
      todayOrdersCount > 0 ? todayRevenue / todayOrdersCount : 0;

    // Get orders for the last 7 days for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = endOfDay(date);

      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
        status: { $nin: ["declined", "cancelled"] },
      });

      const revenue = orders.reduce((sum, order) => sum + order.total, 0);

      last7Days.push({
        date: format(date, "EEE"),
        revenue,
        orders: orders.length,
      });
    }

    // Order status distribution
    const orderStatuses = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top selling items
    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("items.item", "name");

    res.json({
      summary: {
        revenue: {
          today: todayRevenue,
          change: revenueChange,
        },
        orders: {
          today: todayOrdersCount,
          change: ordersChange,
        },
        customers: activeCustomers,
        averageOrderValue: avgOrderValue,
      },
      charts: {
        revenueTrend: last7Days,
        orderStatus: orderStatuses,
      },
      topItems,
      recentOrders: recentOrders.map((order) => ({
        orderId: order.orderId,
        customer: order.customer.name,
        items: order.items.length,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get dashboard stats", error: error.message });
  }
};

// Categories management
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      createdBy: req.user._id,
    });

    await category.save();

    // Populate createdBy field
    await category.populate("createdBy", "name email");

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    // Check if category has items
    const itemsCount = await Item.countDocuments({ category: req.params.id });
    if (itemsCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with existing items. Please delete or reassign items first.",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};

// Items management
const getItems = async (req, res) => {
  try {
    const { category, availability, stock, search } = req.query;

    let filter = {};

    if (category && category !== "all") {
      const categoryDoc = await Category.findOne({
        name: new RegExp(category, "i"),
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (availability === "active") {
      filter.isAvailable = true;
    } else if (availability === "inactive") {
      filter.isAvailable = false;
    }

    if (stock === "low") {
      const settings = await Settings.findOne();
      filter.stock = { $lt: settings?.lowStockAlert || 10 };
    } else if (stock === "out") {
      filter.stock = 0;
    } else if (stock === "in-stock") {
      filter.stock = { $gt: 0 };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const items = await Item.find(filter)
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    // Group by category for frontend display
    const itemsByCategory = {};
    items.forEach((item) => {
      const categoryName = item.category?.name || "Uncategorized";
      if (!itemsByCategory[categoryName]) {
        itemsByCategory[categoryName] = [];
      }
      itemsByCategory[categoryName].push(item);
    });

    res.json({
      items,
      groupedByCategory: itemsByCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get items", error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = new Item({
      ...req.body,
      createdBy: req.user._id,
    });

    await item.save();

    // Populate related fields
    await item.populate("category", "name");
    await item.populate("createdBy", "name email");

    res.status(201).json({
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create item", error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update item", error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete item", error: error.message });
  }
};

// Live orders
const getLiveOrders = async (req, res) => {
  try {
    const { status, timeRange } = req.query;

    let filter = {
      status: { $in: ["pending", "accepted", "preparing", "ready"] },
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    // Filter by time range
    if (timeRange === "last-hour") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      filter.createdAt = { $gte: oneHourAgo };
    } else if (timeRange === "last-24") {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: yesterday };
    } else if (timeRange === "today") {
      const today = startOfDay(new Date());
      filter.createdAt = { $gte: today };
    }

    const orders = await Order.find(filter)
      .populate("items.item", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get live orders", error: error.message });
  }
};

// Orders history
const getOrdersHistory = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
      paymentMethod,
      search,
      page = 1,
      limit,
    } = req.query;

    let filter = {};

    // Date range filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== "all") {
      filter.paymentMethod = paymentMethod;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("items.item", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: filter },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalOrders: total,
        totalRevenue,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get orders history", error: error.message });
  }
};

// Analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = "last-7-days" } = req.query;

    let startDate,
      endDate = new Date();

    switch (period) {
      case "last-7-days":
        startDate = subDays(endDate, 7);
        break;
      case "last-30-days":
        startDate = subDays(endDate, 30);
        break;
      case "this-month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "last-month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      default:
        startDate = subDays(endDate, 7);
    }

    // Revenue trend
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ["declined", "cancelled"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Top categories by revenue
    const topCategories = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "items",
          localField: "items.item",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "itemDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Peak hours
    const peakHours = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Customer insights
    const customerInsights = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$customer.phone",
          name: { $first: "$customer.name" },
          email: { $first: "$customer.email" },
          orders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]);

    // Summary statistics
    const summary = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    // New customers (first-time orders)
    const newCustomers = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$customer.phone",
          firstOrder: { $min: "$createdAt" },
        },
      },
      {
        $match: {
          $expr: {
            $gte: ["$firstOrder", startDate],
          },
        },
      },
      { $count: "count" },
    ]);

    res.json({
      summary: summary[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
      },
      newCustomers: newCustomers[0]?.count || 0,
      revenueTrend,
      topCategories,
      peakHours,
      customerInsights,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get analytics", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getLiveOrders,
  getOrdersHistory,
  getAnalytics,
};
