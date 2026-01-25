import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Bell, Home } from "lucide-react";

const Topbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(2);

  // Page titles mapping
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/items": "Items & Categories",
    "/live-orders": "Live Orders",
    "/orders-history": "Orders History",
    "/analytics": "Analytics",
    "/settings": "Tax & Settings",
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const title = pageTitles[path] || "Dashboard";

    return (
      <div className="breadcrumb">
        <span className="breadcrumb-item">
          <Home size={16} className="text-gray-500" />
          <span>Manager Dashboard</span>
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">{title}</span>
      </div>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search functionality here
    }
  };

  const handleNotifications = () => {
    setNotifications(0);
    // Implement notifications view
  };

  return (
    <header className="topbar">
      <div className="flex items-center gap-4">{getBreadcrumb()}</div>

      <div className="topbar-actions">
        {/* <form onSubmit={handleSearch} className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search orders, items, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form> */}

        {/* <button
          className="notification-btn"
          onClick={handleNotifications}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {notifications > 0 && <span className="notification-badge"></span>}
        </button> */}

        <div className="user-profile hidden md:flex">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div className="user-info hidden lg:block">
            <div className="user-name">{user?.name}</div>
            <div className="user-role capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
