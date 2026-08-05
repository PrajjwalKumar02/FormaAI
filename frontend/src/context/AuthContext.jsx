import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login Failed";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // REGISTER
  // ======================
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration Failed";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setError(null);
  };

  // ======================
  // CLEAR ERROR
  // ======================
  const clearError = () => {
    setError(null);
  };

  // ======================
  // RESET PASSWORD
  // (Placeholder)
  // ======================
  const resetPassword = async () => {
    return {
      success: false,
      error: "Reset password not implemented yet",
    };
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;