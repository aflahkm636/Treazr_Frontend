import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, refreshToken, revokeToken } from "../../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000; 
    } catch {
      return true;
    }
  };

  const handleTokenRefresh = useCallback(async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        const decodedUser = jwtDecode(result.newAccessToken);
        setUser(decodedUser);
        setIsAuthenticated(true);
        return true;
      } else {
        console.warn("Token refresh failed");
        logout();
        return false;
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      logout();
      return false;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        console.log("Access token expired. Attempting refresh...");
        handleTokenRefresh().finally(() => setLoading(false));
      } else {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        setIsAuthenticated(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [handleTokenRefresh]);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { accessToken, refreshToken: refresh } = response;

      if (!accessToken) {
        toast.error(response.error || "Login failed");
        return { success: false };
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refresh);

      const decodedUser = jwtDecode(accessToken);

      if (decodedUser.isBlock) {
        toast.error("Your account has been blocked.");
        return { success: false };
      }

      setUser(decodedUser);
      setIsAuthenticated(true);

      return { success: true, role: decodedUser.role };
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      return { success: true, data: response };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = useCallback(async () => {
    try {
      const res = await revokeToken();
      if (res.success) {
        console.log("Token revoked successfully");
      }
    } catch (err) {
      console.error("Token revoke failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        setUser,
        refreshToken: handleTokenRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
