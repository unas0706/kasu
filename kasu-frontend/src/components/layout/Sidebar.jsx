import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  Package,
  Zap,
  History,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [newOrdersCount] = useState(3);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/items", icon: Package, label: "Items & Categories" },
    {
      path: "/live-orders",
      icon: Zap,
      label: "Live Orders",
      // badge: newOrdersCount,
    },
    { path: "/orders-history", icon: History, label: "Orders History" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Tax & Settings" },
  ];

  return (
    <nav className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        {/* <div className="logo">🍿</div> */}
        <div className="logo-text">KASU GEETA ARTS</div>
      </div>

      <div className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
            end
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-3">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role capitalize">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            className="btn btn-sm btn-outline ml-2"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
