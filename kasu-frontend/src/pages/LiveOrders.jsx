import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  Zap,
  RefreshCw,
  Volume2,
  VolumeX,
  Check,
  X,
  Clock,
  CheckCircle,
  CheckSquare,
  Utensils,
  Truck,
  Search,
} from "lucide-react";

const LiveOrders = () => {
  const { orders, updateOrderStatus } = useData();
  const [liveOrders, setLiveOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    timeRange: "today",
    search: "",
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    filterOrders();

    if (autoRefresh) {
      const interval = setInterval(() => {
        filterOrders();
        // Simulate new orders
        if (Math.random() > 0.7) {
          toast.info("New order received!");
          if (soundEnabled) {
            // Play notification sound
            new Audio("/notification.mp3").play().catch(() => {});
          }
        }
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [filters, autoRefresh, orders]);

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Filter by time range (simplified)
    if (filters.timeRange === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((order) => order.createdAt.startsWith(today));
    } else if (filters.timeRange === "last-hour") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) > oneHourAgo,
      );
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchLower),
          ),
      );
    }

    setLiveOrders(
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
  };

  const handleStatusUpdate = (orderId, status) => {
    updateOrderStatus(orderId, status);

    const messages = {
      accepted: "Order accepted and moved to preparation",
      preparing: "Order is now being prepared",
      ready: "Order is ready for pickup/delivery",
      completed: "Order marked as completed",
      declined: "Order has been declined",
    };

    toast.success(messages[status] || "Order status updated");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    filterOrders();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Orders refreshed");
    }, 1000);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(`Auto-refresh ${!autoRefresh ? "enabled" : "disabled"}`);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast.info(`Sound notifications ${!soundEnabled ? "enabled" : "disabled"}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { className: "badge-pending", text: "New" },
      accepted: { className: "badge-accepted", text: "Accepted" },
      preparing: { className: "badge-preparing", text: "Preparing" },
      ready: { className: "badge-ready", text: "Ready" },
      completed: { className: "badge-completed", text: "Completed" },
      declined: { className: "badge-declined", text: "Declined" },
    };

    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case "dine-in":
        return <Utensils size={14} />;
      case "delivery":
        return <Truck size={14} />;
      case "takeaway":
        return <CheckCircle size={14} />;
      default:
        return <CheckSquare size={14} />;
    }
  };

  const getOrderActions = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <>
            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={() => handleStatusUpdate(order.orderId, "declined")}
            >
              Decline
            </Button>
            <Button
              variant="success"
              size="sm"
              icon={Check}
              onClick={() => handleStatusUpdate(order.orderId, "accepted")}
            >
              Accept
            </Button>
          </>
        );
      case "accepted":
        return (
          <Button
            variant="outline"
            size="sm"
            icon={Utensils}
            onClick={() => handleStatusUpdate(order.orderId, "preparing")}
          >
            Mark Preparing
          </Button>
        );
      case "preparing":
        return (
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle}
            onClick={() => handleStatusUpdate(order.orderId, "ready")}
          >
            Mark Ready
          </Button>
        );
      case "ready":
        return (
          <Button
            variant="primary"
            size="sm"
            icon={CheckSquare}
            onClick={() => handleStatusUpdate(order.orderId, "completed")}
          >
            Mark Completed
          </Button>
        );
      default:
        return (
          <Button variant="outline" size="sm" disabled>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Button>
        );
    }
  };

  const newOrdersCount = liveOrders.filter(
    (o) => o.status === "pending",
  ).length;

  return (
    <div className="page active">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Live Orders</h1>
          {newOrdersCount > 0 && (
            <span className="badge badge-pending">{newOrdersCount} New</span>
          )}
        </div>
        <div className="page-actions">
          <Button
            variant="outline"
            icon={soundEnabled ? Volume2 : VolumeX}
            onClick={toggleSound}
          >
            Sound {soundEnabled ? "On" : "Off"}
          </Button>
          <Button
            variant="outline"
            icon={autoRefresh ? "pause" : RefreshCw}
            onClick={toggleAutoRefresh}
          >
            Auto Refresh: {autoRefresh ? "On" : "Off"}
          </Button>
          <Button
            variant="primary"
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Now"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="filters-container mb-6">
        <div className="filter-group">
          <div className="filter-label">Order Status</div>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Time Range</div>
          <select
            className="filter-select"
            value={filters.timeRange}
            onChange={(e) =>
              setFilters({ ...filters, timeRange: e.target.value })
            }
          >
            <option value="last-hour">Last Hour</option>
            <option value="today">Today</option>
            <option value="last-24">Last 24 Hours</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Search Orders</div>
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Order ID, customer, item..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>
      </div> */}

      {/* Orders Grid */}
      {liveOrders.length === 0 ? (
        <Card className="empty-state">
          <Zap size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-500">
            {filters.status !== "all"
              ? `No ${filters.status} orders match your filters`
              : "No orders received yet. New orders will appear here."}
          </p>
        </Card>
      ) : (
        <div className="orders-grid">
          {liveOrders.map((order) => (
            <Card
              key={order.orderId}
              className={`order-card ${order.status === "pending" ? "new" : ""}`}
            >
              <div className="card-header">
                <div className="order-header">
                  <div className="order-id">{order.orderId}</div>
                  <div className="order-time">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {/* {getStatusBadge(order.status)} */}
              </div>

              <div className="card-body">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="user-avatar"
                      style={{ width: 32, height: 32 }}
                    >
                      {order.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {getOrderTypeIcon(order.orderType)}
                        <span className="capitalize">
                          {order.orderType.replace("-", " ")}
                          {order.tableNumber && ` • Table ${order.tableNumber}`}
                          {order.deliveryAddress && " • Delivery"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-items mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <div className="font-medium">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div>
                    <div className="text-xs text-gray-500">Subtotal</div>
                    <div className="order-total">${order.total.toFixed(2)}</div>
                  </div>
                  <div className="order-actions flex gap-2">
                    {/* {getOrderActions(order)} */}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveOrders;
