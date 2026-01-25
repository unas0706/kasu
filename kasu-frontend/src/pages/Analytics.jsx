import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import CategoriesChart from "../components/charts/CategoriesChart";
import MonthlyRevenueChart from "../components/charts/MonthlyRevenueChart";
import PeakHoursChart from "../components/charts/PeakHoursChart";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  BarChart3,
  Package,
  Clock,
} from "lucide-react";

const Analytics = () => {
  const {
    orders,
    items,
    getTopSellingItems,
    getDashboardStats,
    getRevenueTrend,
  } = useData();
  const [timeRange, setTimeRange] = useState("month");
  const [topItems, setTopItems] = useState([]);
  const [customerInsights, setCustomerInsights] = useState([]);
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, orders]);

  const loadAnalyticsData = () => {
    const dashboardStats = getDashboardStats();
    const topSelling = getTopSellingItems(5, timeRange);
    const trend = getRevenueTrend(30);

    setStats(dashboardStats);
    setTopItems(topSelling);
    setRevenueTrend(trend);

    // Generate customer insights from orders
    const customerMap = new Map();

    orders.forEach((order) => {
      const email = order.customer.email;
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          name: order.customer.name,
          email: email,
          orders: 0,
          totalSpent: 0,
          lastOrder: order.createdAt,
        });
      }

      const customer = customerMap.get(email);
      customer.orders += 1;
      customer.totalSpent += order.total;
      if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.createdAt;
      }
    });

    const insights = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map((customer) => ({
        ...customer,
        status:
          customer.orders > 10
            ? "regular"
            : customer.orders > 5
              ? "occasional"
              : "new",
      }));

    setCustomerInsights(insights);
  };

  //   const handleExportReport = () => {
  //     const reportData = {
  //       generatedAt: new Date().toISOString(),
  //       timeRange,
  //       stats,
  //       topItems: topItems.map((item) => ({
  //         name: item.name,
  //         category: item.categoryId,
  //         quantity: item.quantity,
  //         revenue: item.revenue,
  //       })),
  //       customerInsights,
  //       revenueTrend,
  //     };

  //     const blob = new Blob([JSON.stringify(reportData, null, 2)], {
  //       type: "application/json",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`;
  //     a.click();
  //     URL.revokeObjectURL(url);

  //     alert("Analytics report exported!");
  //   };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!stats) {
    return (
      <div className="page active">
        <div className="page-header">
          <h1 className="page-title">Loading Analytics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="page-header">
        <h1 className="page-title">Analytics & Insights</h1>
        {/* <div className="page-actions">
          <select
            className="filter-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button
            variant="primary"
            icon={Download}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="card summary-card">
          <div className="summary-icon revenue">
            <DollarSign />
          </div>
          <div className="summary-info">
            <div className="summary-label">Today's Revenue</div>
            <div className="summary-value">
              ${stats.todayRevenue.toFixed(2)}
            </div>
            {/* <div
              className={`summary-change ${stats.revenueChange >= 0 ? "positive" : "negative"}`}
            >
              {getTrendIcon(stats.revenueChange)}
              <span>
                {Math.abs(stats.revenueChange).toFixed(1)}% from yesterday
              </span>
            </div> */}
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-icon orders">
            <ShoppingBag />
          </div>
          <div className="summary-info">
            <div className="summary-label">Today's Orders</div>
            <div className="summary-value">{stats.todayOrders}</div>
            <div className="summary-change positive"></div>
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-icon customers">
            <Users />
          </div>
          <div className="summary-info">
            <div className="summary-label">Monthly Revenue</div>
            <div className="summary-value">{stats.activeCustomers}</div>
            <div className="summary-change positive"></div>
          </div>
        </div>

        {/* <div className="card summary-card">
          <div className="summary-icon average">
            <Package />
          </div>
          <div className="summary-info">
            <div className="summary-label">Avg. Order Value</div>
            <div className="summary-value">
              ${stats.avgOrderValue.toFixed(2)}
            </div>
            <div className="summary-change positive">
              <TrendingUp size={12} />
              <span>2.1% from last week</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Charts */}
      <div className="charts-container mb-6">
        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Revenue Trend (Last 30 Days)</div>
            <div className="card-actions">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <MonthlyRevenueChart months={6} />
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Top Selling Categories</div>
            <div className="card-actions">
              <select className="filter-select">
                <option>By Revenue</option>
                <option>By Quantity</option>
                <option>By Orders</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <CategoriesChart />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      {/* <div className="charts-container">
        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Peak Hours Analysis</div>
            <div className="card-actions">
              <Clock size={18} className="text-gray-500" />
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <PeakHoursChart />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Customer Insights</div>
            <div className="card-actions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerInsights.map((customer) => (
                    <tr key={customer.email}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="user-avatar"
                            style={{ width: 32, height: 32 }}
                          >
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{customer.orders}</td>
                      <td className="font-semibold">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td>
                        <div className="font-medium">
                          {formatDate(customer.lastOrder)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(customer.lastOrder).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            customer.status === "regular"
                              ? "badge-active"
                              : customer.status === "occasional"
                                ? "badge-preparing"
                                : "badge-pending"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}

      {/* Top Items Table */}
      <div className="mt-6">
        <Card>
          <div className="card-header">
            <div className="card-title">Top Selling Items ({timeRange})</div>
            <div className="card-actions">
              <select className="filter-select">
                <option value="revenue">By Revenue</option>
                <option value="quantity">By Quantity</option>
                <option value="popularity">By Popularity</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.name}</td>
                      <td>
                        <span className="text-gray-600">
                          {item.category.name}
                        </span>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity || 0}</td>
                      <td className="font-semibold">
                        {formatCurrency(item.revenue || 0)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.stock > 20
                              ? "badge-active"
                              : item.stock > 5
                                ? "badge-preparing"
                                : "badge-danger"
                          }`}
                        >
                          {item.stock > 20
                            ? "In Stock"
                            : item.stock > 5
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
