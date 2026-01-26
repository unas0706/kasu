import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "../../context/ThemeContext";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on mobile when route changes
    // if (window.innerWidth < 1200) {
    //   setIsSidebarOpen(false);
    // }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <Topbar onMenuToggle={toggleSidebar} />

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Toggle */}
      <button
        className={`mobile-menu-toggle ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "×" : "☰"}
      </button>

      {/* Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--white)",
            color: "var(--gray-900)",
            border: "1px solid var(--gray-200)",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      />
    </div>
  );
};

export default Layout;
