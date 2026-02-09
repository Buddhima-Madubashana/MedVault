import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Helper to safely check token validity
  const checkTokenExpiration = (token) => {
    // 1. Safety Check: Must be a string
    if (!token || typeof token !== "string") return null;

    try {
      // 2. Decode
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) return null;

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        console.warn("Token expired, logging out.");
        logout();
      } else {
        // Token valid, set auto-logout timer
        const timeLeft = (decoded.exp - currentTime) * 1000;

        // Cap max timeout to avoid integer overflow (approx 24 days)
        const safeTimeLeft = Math.min(timeLeft, 2147483647);

        console.log(
          `Session valid. Expires in ${(safeTimeLeft / 1000 / 60).toFixed(1)} mins`,
        );

        const timer = setTimeout(() => {
          alert("Session expired. Please log in again.");
          logout();
        }, safeTimeLeft);

        return timer;
      }
    } catch (err) {
      // 3. Catch invalid token errors (garbage data)
      console.error("Invalid Token Data:", err.message);
      logout(); // Clear bad data immediately
    }
    return null;
  };

  useEffect(() => {
    let timer;
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role);
        }
        // Initialize Timer
        timer = checkTokenExpiration(token);
      } catch (e) {
        console.error("Error restoring session:", e);
        logout();
      }
    }
    setLoading(false);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token]);

  const login = (userData, authToken) => {
    if (!authToken || typeof authToken !== "string") {
      console.error("Login failed: Invalid token received", authToken);
      return;
    }
    setUser(userData);
    setRole(userData.role);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
