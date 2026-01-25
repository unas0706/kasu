import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  FileText,
  FileSpreadsheet,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const OrdersHistory = () => {
  const { orders } = useData();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
    paymentMethod: "all",
    search: "",
  });

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Filter by payment method
    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentMethod === filters.paymentMethod,
      );
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.customer.email?.toLowerCase().includes(searchLower) ||
          order.customer.phone?.toLowerCase().includes(searchLower),
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    toast.success("CSV export started");
    // Implement CSV export logic
  };

  const handleExportPDF = () => {
    toast.success("PDF export started");
    // Implement PDF export logic
  };

  const handleFilterApply = () => {
    applyFilters();
    toast.success("Filters applied");
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "all",
      paymentMethod: "all",
      search: "",
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-pending",
      accepted: "badge-accepted",
      preparing: "badge-preparing",
      ready: "badge-ready",
      completed: "badge-completed",
      declined: "badge-declined",
    };

    return (
      <span className={`badge ${badges[status] || "badge-pending"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (method) => {
    const methods = {
      card: { className: "badge-accepted", text: "Card" },
      cash: { className: "badge-ready", text: "Cash" },
      mobile: { className: "badge-preparing", text: "Mobile" },
      online: { className: "badge-completed", text: "Online" },
    };

    const badge = methods[method] || methods.card;
    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  return (
    <div className="page active">
      <div className="page-header">
        <h1 className="page-title">Orders History</h1>
        <div className="page-actions">
          <Button
            variant="outline"
            icon={FileSpreadsheet}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button variant="outline" icon={FileText} onClick={handleExportPDF}>
            Export PDF
          </Button>
          <Button variant="primary" icon={Filter} onClick={handleFilterApply}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container mb-6">
        <div className="filter-group">
          <div className="filter-label">Date Range</div>
          <div className="flex gap-2">
            <input
              type="date"
              className="date-picker"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              className="date-picker"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">Order Status</div>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Payment Method</div>
          <select
            className="filter-select"
            value={filters.paymentMethod}
            onChange={(e) =>
              setFilters({ ...filters, paymentMethod: e.target.value })
            }
          >
            <option value="all">All Methods</option>
            <option value="card">Credit Card</option>
            <option value="cash">Cash</option>
            <option value="mobile">Mobile Payment</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Search</div>
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

        <div className="filter-group">
          <div className="filter-label">&nbsp;</div>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="card-header">
          <div className="card-title">
            {filteredOrders.length} Orders • Total Revenue: $
            {totalRevenue.toFixed(2)}
          </div>
          {/* <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="pagination-info">...</span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div> */}
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
                  <th>Tax</th>
                  <th>Payment</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="font-semibold">{order.orderId}</td>
                    <td>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.customer.email ||
                          order.customer.phone ||
                          "No contact"}
                      </div>
                    </td>
                    <td>
                      <div>{order.items.length} items</div>
                      <div className="text-xs text-gray-500">
                        {order.items[0]?.name || "No items"}
                      </div>
                    </td>
                    <td className="font-semibold">${order.total.toFixed(2)}</td>
                    <td className="text-gray-600">
                      ${order.taxAmount.toFixed(2)}
                    </td>
                    <td>{getPaymentBadge(order.paymentMethod)}</td>
                    <td>
                      <div className="font-medium">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer">
          <div className="text-gray-600 text-sm">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </div>
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrdersHistory;
