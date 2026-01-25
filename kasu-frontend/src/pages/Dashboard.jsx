import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import RevenueChart from "../components/charts/RevenueChart";
import OrdersChart from "../components/charts/OrdersChart";
import MonthlyRevenueChart from "../components/charts/MonthlyRevenueChart";
import CategoriesChart from "../components/charts/CategoriesChart";
import PeakHoursChart from "../components/charts/PeakHoursChart";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Package,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { getDashboardStats, getTopSellingItems, orders } = useData();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [timeRange, setTimeRange] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartFilter, setChartFilter] = useState("7days");

  useEffect(() => {
    loadDashboardData();
  }, [orders, timeRange]);

  const loadDashboardData = () => {
    const dashboardStats = getDashboardStats();
    const topSellingItems = getTopSellingItems(5, timeRange);
    const recent = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setStats(dashboardStats);
    setTopItems(topSellingItems);
    setRecentOrders(recent);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadDashboardData();
      setIsRefreshing(false);
      toast.success("Dashboard data refreshed");
    }, 1000);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a report
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats,
      topItems,
      recentOrders: recentOrders.map((order) => ({
        id: order.orderId,
        customer: order.customer.name,
        total: order.total,
        status: order.status,
        items: order.items.length,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  const getTrendIcon = (value) => {
    if (value > 0) {
      return <TrendingUp size={12} className="text-success-500" />;
    } else if (value < 0) {
      return <TrendingDown size={12} className="text-danger-500" />;
    }
    return null;
  };

  if (!stats) {
    return (
      <div className="page active">
        <div className="page-header">
          <h1 className="page-title">Loading Dashboard...</h1>
        </div>
        <div className="animate-pulse">
          <div className="summary-grid mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card summary-card">
                <div className="skeleton skeleton-circle w-14 h-14"></div>
                <div className="summary-info">
                  <div className="skeleton skeleton-text w-24 h-4 mb-2"></div>
                  <div className="skeleton skeleton-text w-16 h-8 mb-2"></div>
                  <div className="skeleton skeleton-text w-32 h-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log(stats);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name}! </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="page-actions">
          {/* <select
            className="filter-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select> */}
          {/* <Button variant="outline" onClick={handleExport}>
            <Download size={16} />
            Export Report
          </Button>
          <Button
            variant="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button> */}
        </div>
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
            <div
              className={`summary-change ${stats.revenueChange >= 0 ? "positive" : "negative"}`}
            >
              {getTrendIcon(stats.revenueChange)}
              <span>
                {Math.abs(stats.revenueChange).toFixed(1)}% from yesterday
              </span>
            </div>
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
            <div className="summary-label">Total Orders</div>
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
            <div className="card-title">Revenue & Orders Trend</div>
            <div className="card-actions">
              <select
                className="filter-select"
                value={chartFilter}
                onChange={(e) => setChartFilter(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <RevenueChart days={parseInt(chartFilter.replace("days", ""))} />
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Monthly Revenue</div>
            <div className="card-actions">
              <select className="filter-select">
                <option>6 Months</option>
                <option>12 Months</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <MonthlyRevenueChart months={6} />
            </div>
          </div>
        </div>

        {/* <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Order Status Distribution</div>
            <div className="card-actions">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <OrdersChart />
            </div>
          </div>
        </div> */}
      </div>

      {/* Additional Charts */}
      {/* <div className="charts-container mb-6">
        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title">Today's Peak Hours</div>
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
      </div> */}

      {/* Recent Orders & Top Items */}
      {/* <div className="charts-container">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Orders</div>
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
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="font-semibold">{order.orderId}</td>
                      <td>{order.customer.name}</td>
                      <td>{order.items.length} items</td>
                      <td className="font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge badge-${order.status}`}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Selling Items</div>
            <div className="card-actions">
              <select
                className="filter-select"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
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
                    <th>Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.name}</td>
                      <td>
                        <span className="text-gray-600">{item.categoryId}</span>
                      </td>
                      <td>{item.quantity || 0}</td>
                      <td className="font-semibold">
                        ${(item.revenue || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
