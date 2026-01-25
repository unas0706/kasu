import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sampleUsers } from "../utils/sampleData";
import axios from "axios";
// import { backendApi } from "../API/bakendApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
  localStorage.getItem("token") || null
);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("kasu_geeta_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("kasu_geeta_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

localStorage.setItem("token", response.data.token);
      setToken(response.data.token)
      
      setUser(response.data.user);
      localStorage.setItem(
        "kasu_geeta_user",
        JSON.stringify(response.data.user),
      );

      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate("/dashboard");

      return response.data.user;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kasu_geeta_user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("kasu_geeta_user", JSON.stringify(updated));
      toast.success("Profile updated successfully");
      return updated;
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isManager: user?.role === "manager",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
